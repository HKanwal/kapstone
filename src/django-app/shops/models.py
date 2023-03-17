import uuid
from django import dispatch
from django.db import models, transaction
from datetime import datetime
import pytz

from django.utils.translation import gettext as _
from django.apps import apps
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.contrib.postgres.fields import ArrayField
from django.db.models import CheckConstraint, UniqueConstraint, Q, F
from datetime import timedelta
from django.db.models.lookups import IntegerLessThan
from django.core.exceptions import ValidationError


from phonenumber_field.modelfields import PhoneNumberField

from vehicles.models import Vehicle, Part
from .validators import validate_nonzero

appointment_creation_signal = dispatch.Signal("instance")


class Shop(models.Model):
    shop_owner = models.OneToOneField("accounts.ShopOwner", on_delete=models.CASCADE)
    shop_email = models.EmailField(
        _("shop's email address"), max_length=255, blank=True, null=True
    )
    shop_phone_number = PhoneNumberField(blank=True, null=True)
    address = models.OneToOneField("Address", on_delete=models.PROTECT)
    name = models.CharField(_("shop name"), max_length=255, unique=True)
    num_bays = models.IntegerField(
        _("number of service bays"), default=1, null=True, blank=True
    )
    availability = models.CharField(
        _("available hours"), max_length=255, null=True, blank=True
    )
    shop_hours = models.CharField(
        _("shop hours"), max_length=255, null=True, blank=True
    )

    def has_employee(self, employee_id):
        EmployeeData = apps.get_model("accounts", "EmployeeData")
        employee = EmployeeData.objects.filter(user__id=employee_id).first()
        if employee is None:
            return False
        return self == employee.shop

    def get_employees(self):
        EmployeeData = apps.get_model("accounts", "EmployeeData")
        return EmployeeData.objects.filter(shop__pk=self.pk)

    @property
    def employees(self):
        EmployeeData = apps.get_model("accounts", "EmployeeData")
        return EmployeeData.objects.filter(shop__pk=self.pk).values_list(
            "user", flat=True
        )

    @property
    def num_employees(self):
        EmployeeData = apps.get_model("accounts", "EmployeeData")
        return EmployeeData.objects.filter(shop__pk=self.pk).count()

    def get_hours_for_day(self, day):
        try:
            return ShopHours.objects.get(shop=self, day=day)
        except ShopHours.DoesNotExist:
            return None

    def get_available_employee_ids(self, from_time, to_time):
        workorders = WorkOrder.objects.filter(shop=self).exclude(employee__isnull=True)

        appointment_ids = workorders.values_list("appointment", flat=True)
        appointments = self.appointment_set.filter(id__in=appointment_ids)

        employee_ids = set(self.employees)
        for appointment in appointments:
            if any(
                i == None
                for i in [
                    appointment.start_time,
                    appointment.end_time,
                    from_time,
                    to_time,
                ]
            ):
                continue
            elif (
                appointment.start_time <= to_time and from_time <= appointment.end_time
            ):  # overlap
                employee_ids.remove(workorders.get(appointment=appointment).employee.id)

        return employee_ids

    def get_number_of_available_employees(self, from_time, to_time):
        return len(self.get_available_employee_ids(from_time, to_time))

    def get_next_available_employee(self, from_time, to_time):
        employee_ids = self.get_available_employee_ids(from_time, to_time)
        if len(employee_ids) == 0:
            return None

        Employee = apps.get_model("accounts", "Employee")
        employee = Employee.objects.get(id=employee_ids.pop())
        return employee

    class Meta:
        verbose_name = "Shop"
        verbose_name_plural = "Shops"

    def __str__(self):
        return f"{self.name}"


class Address(models.Model):
    postal_code = models.CharField(_("postal code"), max_length=6)
    street = models.CharField(_("street"), max_length=255)
    city = models.CharField(_("city"), max_length=255)
    country = models.CharField(_("country"), max_length=255)
    province = models.CharField(_("province"), max_length=10)

    class Meta:
        verbose_name = "Address"
        verbose_name_plural = "Addresses"

    def __str__(self):
        return f"{self.street}, {self.city}, {self.province}, {self.country}, {self.postal_code}"


class Invitation(models.Model):
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE)
    email = models.EmailField(_("email address"), max_length=255, unique=False)
    invitation_key = models.UUIDField(
        _("UUID"), primary_key=True, default=uuid.uuid4, editable=False
    )
    is_expired = models.BooleanField(default=False)
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("shop", "email")
        verbose_name = "Invitation"
        verbose_name_plural = "Invitations"

    def send_invitation(self):
        subject = f"Invitation to join {self.shop.name}"
        context = {
            "shop_name": self.shop.name,
            "invitation_url": self.get_invitation_url(),
        }
        text_invitation_email_template = "invitations/email/employee_invitation.txt"
        html_invitation_email_template = "invitations/email/employee_invitation.html"
        text_body = render_to_string(text_invitation_email_template, context)
        html_body = render_to_string(html_invitation_email_template, context)

        message = EmailMultiAlternatives(
            subject=subject,
            body=text_body,
            from_email=settings.EMAIL_HOST_USER,
            to=[self.email],
        )
        message.attach_alternative(html_body, "text/html")
        message.send(fail_silently=False)

    def get_invitation_url(self):
        return f"{settings.APP_URL}/{settings.APP_REGISTRATION_ROUTE}/?type=employee&invitation_key={self.invitation_key}"

    def __str__(self):
        return f'Invitation for {self.email} from "{self.shop.name}".'


class Appointment(models.Model):
    class Status(models.TextChoices):
        COMPLETED = "completed", "Completed"
        NO_SHOW = "no show", "No Show"
        IN_PROGRESS = "in_progress", "In Progress"
        DONE = "done", "Done"
        REWORK = "rework", "Rework"
        PENDING = "pending", "Pending"
        CANCELLED = "cancelled", "Cancelled"

    status = models.CharField(
        _("status"), max_length=12, choices=Status.choices, default=Status.PENDING
    )
    quote = models.ForeignKey(
        "quotes.Quote", on_delete=models.SET_NULL, null=True, default=None
    )
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE)
    customer = models.ForeignKey(
        "accounts.Customer", on_delete=models.CASCADE, null=True
    )
    vehicle = models.ForeignKey(
        Vehicle, on_delete=models.CASCADE, null=True, default=None
    )
    duration = models.DurationField(_("Duration"), default=timedelta(minutes=30))
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def start_time(self):
        first_slot = (
            Appointment.objects.get(id=self.id)
            .appointmentslot_set.order_by("start_time")
            .first()
        )
        if first_slot is not None:
            return first_slot.start_time
        return None

    @property
    def end_time(self):
        last_slot = (
            Appointment.objects.get(id=self.id)
            .appointmentslot_set.order_by("end_time")
            .last()
        )
        if last_slot is not None:
            return last_slot.end_time
        return None

    def send_cancellation_email(self):
        if self.customer.email is None:
            return

        subject = f"Cancellation of Appointment with {self.shop.name}"
        context = {
            "shop_name": self.shop.name,
        }
        text_email_template = "appointments/email/appointment_cancellation.txt"
        html_email_template = "appointments/email/appointment_cancellation.html"
        text_body = render_to_string(text_email_template, context)
        html_body = render_to_string(html_email_template, context)

        message = EmailMultiAlternatives(
            subject=subject,
            body=text_body,
            from_email=settings.EMAIL_HOST_USER,
            to=[self.customer.email],
        )
        message.attach_alternative(html_body, "text/html")
        message.send(fail_silently=False)

    def cancel(self):
        self.status = Appointment.Status.CANCELLED
        self.save()
        self.send_cancellation_email()

    class Meta:
        verbose_name = "Appointment"
        verbose_name_plural = "Appointments"

    def __str__(self):
        return f"{self.shop} - {self.customer} - {self.start_time} - {self.end_time}"


class AppointmentSlot(models.Model):
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE)
    appointments = models.ManyToManyField(Appointment, blank=True)
    start_time = models.DateTimeField(null=False)
    end_time = models.DateTimeField(null=False)

    @property
    def duration(self):
        return self.end_time - self.start_time

    @property
    def booked_slots(self):
        return self.appointments.count()

    @property
    def num_slots(self):
        return min(self.shop.num_bays, self.shop.num_employees)

    @property
    def is_available(self):
        return self.num_slots > self.booked_slots

    @property
    def num_available_slots(self):
        return self.num_slots - self.booked_slots

    def get_current_plus_duration(self, duration):
        utc = pytz.UTC

        mod = ((duration.total_seconds() % 3600) // 60) % 15
        extra = duration if mod == 0 else duration + timedelta(minutes=15 - mod)

        min_end_time = min(
            utc.localize(datetime.combine(self.end_time.date(), datetime.max.time())),
            self.start_time + extra,
        )
        slots = AppointmentSlot.objects.filter(
            shop=self.shop, start_time__gte=self.start_time, end_time__lte=min_end_time
        ).order_by("start_time")
        slot_list = [slot for slot in slots if slot.is_available]

        if (
            slots.count() > 0
            and len(slot_list) == slots.count()
            and slots.last().end_time - slots.first().start_time >= duration
        ):
            return slots
        else:
            return None

    class Meta:
        verbose_name = "Appointment Slot"
        verbose_name_plural = "Appointment Slots"
        constraints = [
            CheckConstraint(
                check=Q(end_time__gt=F("start_time")),
                name="check_start_and_end_time",
            ),
            UniqueConstraint(
                name="unique_appointment_slot",
                fields=["shop", "start_time", "end_time"],
            ),
        ]

    def __str__(self):
        return f"Slot from {self.start_time} to {self.end_time}"


class ShopHours(models.Model):
    class Day(models.TextChoices):
        MONDAY = "monday", "Monday"
        TUESDAY = "tuesday", "Tuesday"
        WEDNESDAY = "wednesday", "Wednesday"
        THURSDAY = "thursday", "Thursday"
        FRIDAY = "friday", "Friday"
        SUNDAY = "sunday", "Sunday"

    shop = models.ForeignKey(Shop, on_delete=models.CASCADE)
    day = models.CharField(max_length=10, choices=Day.choices, null=False)
    from_time = models.TimeField(null=False)
    to_time = models.TimeField(null=False)

    class Meta:
        verbose_name = "Shop Hours"
        verbose_name_plural = "Shop Hours"
        constraints = [
            UniqueConstraint(fields=["shop", "day"], name="shop_day_unique_combination")
        ]

    def __str__(self):
        return f"{self.shop} - {self.day}"


class ShopAvailability(models.Model):
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE)
    date = models.DateField(null=False)

    class Meta:
        verbose_name = "Shop Availability"
        verbose_name_plural = "Shop Availability"
        constraints = [
            UniqueConstraint(
                fields=["shop", "date"], name="shop_date_unique_combination"
            )
        ]

    def __str__(self):
        return f"{self.shop} - {self.date}"


class ShopAvailabilitySlot(models.Model):
    """
    This will store the time slots that a shop is available on a given day.
    For example: 9am - 3pm, 4pm - 6pm.
    """

    start_time = models.TimeField(null=False)
    end_time = models.TimeField(null=False)
    shop_availability = models.ForeignKey(ShopAvailability, on_delete=models.CASCADE)

    @property
    def date(self):
        return self.shop_availability.date

    class Meta:
        verbose_name = "Availability Slot"
        verbose_name_plural = "Availability Slots"
        constraints = [
            CheckConstraint(
                check=Q(end_time__gt=F("start_time")),
                name="ensure_start_is_before_end",
            )
        ]

    def __str__(self):
        return f"Available slot: {self.start_time} - {self.end_time}"


class Service(models.Model):
    shop = models.ForeignKey(
        Shop, on_delete=models.CASCADE, related_name="shop_services"
    )
    name = models.CharField(_("service name"), max_length=30, null=False, blank=False)
    description = models.TextField(_("service description"), null=True, blank=True)
    price = models.DecimalField(
        _("service price"), max_digits=10, decimal_places=2, null=False
    )
    parts = models.ManyToManyField(Part, through="ServicePart")
    active = models.BooleanField(default=True)

    class Meta:
        unique_together = ("shop", "name")
        verbose_name = "Service"
        verbose_name_plural = "Services"

    def __str__(self):
        return f"{self.name}"


class ServicePart(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    part = models.ForeignKey(Part, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(
        _("number of parts"), default=1, null=False, validators=[validate_nonzero]
    )

    class Meta:
        verbose_name = "ServicePart"
        verbose_name_plural = "ServiceParts"


class WorkOrder(models.Model):
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE)
    quote = models.ForeignKey("quotes.Quote", on_delete=models.CASCADE, null=False)
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE)
    employee = models.ForeignKey(
        "accounts.Employee", on_delete=models.CASCADE, null=True
    )
    odometer_reading_before = models.PositiveIntegerField(
        _("odometer reading before"), null=True
    )
    odometer_reading_after = models.PositiveIntegerField(
        _("odometer reading after"), null=True
    )
    discount = models.DecimalField(
        _("discount percentage"), max_digits=5, decimal_places=2, default=0
    )
    notes = models.TextField(_("notes"), blank=True)
    grand_total = models.DecimalField(
        _("grand total amount"), max_digits=10, decimal_places=2, null=True
    )
    is_visible_to_customer = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Work Order"
        verbose_name_plural = "Work Orders"

    def get_workorder_url(self):
        return f"{settings.APP_URL}/work-orders/{self.pk}"

    def send_to_customer(self):
        self.is_visible_to_customer = True
        self.save()
        customer = self.appointment.customer

        subject = f"WorkOrder Information from {self.shop.name}"
        context = {
            "shop_name": self.shop.name,
            "workorder_url": self.get_workorder_url(),
        }
        text_invitation_email_template = "workorders/email/workorder_email.txt"
        html_invitation_email_template = "workorders/email/workorder_email.html"
        text_body = render_to_string(text_invitation_email_template, context)
        html_body = render_to_string(html_invitation_email_template, context)

        message = EmailMultiAlternatives(
            subject=subject,
            body=text_body,
            from_email=settings.EMAIL_HOST_USER,
            to=[customer.email],
        )
        message.attach_alternative(html_body, "text/html")
        message.send(fail_silently=False)
