import uuid
from django.db import models

from django.utils.translation import gettext as _
from django.apps import apps
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string


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
        unique_together = ('shop', 'email')
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
