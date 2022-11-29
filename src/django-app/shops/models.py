import uuid
from django.db import models

from django.utils.translation import gettext as _
from django.apps import apps
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

from vehicles.models import Vehicle, Part
from .validators import validate_nonzero


class Shop(models.Model):
    shop_owner = models.ForeignKey("accounts.ShopOwner", on_delete=models.CASCADE)
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
    # class Status(models.TextChoices):
    #     COMPLETED = "completed", "Completed"
    #     NO_SHOW = "no show", "No Show"
    #     IN_PROGRESS = "in_progress", "In Progress"
    #     DONE = "done", "Done"
    #     REWORK = "rework", "Rework"
    # status = models.CharField(
    #     _("status"), max_length=12, choices=Status.choices, default=Status.NEW_QUOTE
    # )
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE)
    customer = models.ForeignKey(
        "accounts.Customer", on_delete=models.CASCADE, null=True
    )
    # TODO: add customer details when customer doesn't book appointment/shows up to the store
    # customer_email = models.EmailField(_("email address"), max_length=255, null=True)
    # customer_first_name = models.CharField(_("first name"), max_length=255, blank=True)
    # customer_last_name = models.CharField(_("last name"), max_length=255, blank=True)
    # customer_phone_number = PhoneNumberField(blank=True)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    date = models.DateField(_("date"), blank=True)
    time = models.TimeField(_("time"), blank=True)
    duration = models.PositiveIntegerField(_("appointment duration in hours"), null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Appointment"
        verbose_name_plural = "Appointments"
        # constraints = [
        #     models.CheckConstraint(
        #         name="%(app_label)s_%(class)s_customer_details_or_customer_id",
        #         check=(
        #             models.Q(customer__isnull=True, customer_first_name__exact='', customer_first_name__exact='', customer_first_name__exact='')
        #             | models.Q(thing1__isnull=False, thing2__isnull=True)
        #         ),
        #     )
        # ]

    def __str__(self):
        return f"{self.shop} - {self.customer} - {self.date} - {self.time}"


class Service(models.Model):
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE)
    name = models.CharField(_("service name"), max_length=30, null=False, blank=False)
    description = models.TextField(_("service description"), null=True, blank=True)
    price = models.DecimalField(
        _("service price"), max_digits=10, decimal_places=2, null=False
    )
    parts = models.ManyToManyField(Part, through="ServicePart")

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
