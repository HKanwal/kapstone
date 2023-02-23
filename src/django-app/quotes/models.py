from django.db import models
from django.utils.translation import gettext as _
from shops.models import Shop
from accounts.models import Customer
from vehicles.models import Vehicle

from phonenumber_field.modelfields import PhoneNumberField


class Quote(models.Model):
    class Status(models.TextChoices):
        NEW_QUOTE = "new_quote", "New Quote"
        ACCEPTED = "accepted", "Accepted"
        REJECTED = "rejected", "Rejected"
        IN_PROGRESS = "in_progress", "In Progress"
        DONE = "done", "Done"
        REWORK = "rework", "Rework"

    quote_request = models.OneToOneField("QuoteRequest", on_delete=models.CASCADE)
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE)
    status = models.CharField(
        _("status"), max_length=12, choices=Status.choices, default=Status.NEW_QUOTE
    )
    price = models.DecimalField(_("price"), max_digits=19, decimal_places=2)
    estimated_time = models.CharField(_("estimated time"), max_length=255)
    expiry_date = models.DateField(_("expiry date"))
    created_at = models.DateTimeField(_("created at"), auto_now_add=True)

    class Meta:
        verbose_name = "Quote"
        verbose_name_plural = "Quotes"

    def __str__(self):
        user_name = (
            self.quote_request.user.username if self.quote_request.user else "Null User"
        )
        return f'Shop "{self.shop.name}" to User "{user_name}": ${self.price}'


class QuoteRequest(models.Model):
    # These are allowed to be null, as right now there are no shops or users in the system to assign them to.
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, null=True)
    user = models.ForeignKey(Customer, on_delete=models.CASCADE, null=True)
    preferred_date = models.DateField(_("preferred date"), blank=True, null=True)
    preferred_time = models.TimeField(_("preferred time"), blank=True, null=True)
    preferred_phone_number = PhoneNumberField(blank=True, null=True)
    preferred_email = models.EmailField(
        _("email address"), max_length=255, blank=True, null=True
    )
    description = models.CharField(_("description"), max_length=1000)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(_("created at"), auto_now_add=True)

    @property
    def status(self):
        try:
            quote = Quote.objects.get(quote_request__id=self.id)
            return quote.status
        except:
            return "Not Accepted"

    class Meta:
        verbose_name = "Quote Request"
        verbose_name_plural = "Quote Requests"

    def __str__(self):
        user_name = self.user.username if self.user else "Null User"
        shop_name = self.shop.name if self.shop else "Null Shop"
        return f'User "{user_name}" to Shop "{shop_name}": "{self.description}"'
