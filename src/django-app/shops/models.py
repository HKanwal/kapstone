import uuid
from django.db import models, transaction

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


class Shop(models.Model):
    shop_owner = models.ForeignKey("accounts.ShopOwner", on_delete=models.CASCADE)
    # shop_email = models.EmailField(_("shop's email address"), max_length=255, null=True)
    # shop_phone_numbers = ArrayField(PhoneNumberField(blank=True), blank=True)
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

    @property
    def num_employees(self):
        EmployeeData = apps.get_model("accounts", "EmployeeData")
        return EmployeeData.objects.filter(shop__pk=self.pk).count()

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

    status = models.CharField(
        _("status"), max_length=12, choices=Status.choices, default=Status.PENDING
    )
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE)
    customer = models.ForeignKey(
        "accounts.Customer", on_delete=models.CASCADE, null=True
    )
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
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

    class Meta:
        verbose_name = "Appointment"
        verbose_name_plural = "Appointments"

    def __str__(self):
        return f"{self.shop} - {self.customer} - {self.start_time} - {self.end_time}"


class AppointmentSlot(models.Model):
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE)
    appointment = models.ManyToManyField(Appointment, blank=True)
    start_time = models.DateTimeField(null=False)
    end_time = models.DateTimeField(null=False)
    num_slots = models.PositiveIntegerField()

    @property
    def duration(self):
        return self.end_time - self.start_time

    @property
    def booked_slots(self):
        return self.appointment.count()

    @property
    def is_available(self):
        return self.num_slots > self.booked_slots

    @property
    def num_available_slots(self):
        return self.num_slots - self.booked_slots

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
        return f"Slot from {self.start_time} to {self.end_time} - {self.booked_slots}"


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
    employee = models.ForeignKey("accounts.Employee", on_delete=models.CASCADE)
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
        _("grand total amount"), max_digits=10, decimal_places=2
    )

    class Meta:
        verbose_name = "Work Order"
        verbose_name_plural = "Work Orders"
