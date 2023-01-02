from django.db import models
from django.utils.translation import gettext as _
from shops.models import Shop
from accounts.models import Customer
from misc.models import Image

from phonenumber_field.modelfields import PhoneNumberField

class Quote(models.Model):
    class Status(models.TextChoices):
        NEW_QUOTE = "new_quote", "New Quote"
        ACCEPTED = "accepted", "Accepted"
        IN_PROGRESS = "in_progress", "In Progress"
        DONE = "done", "Done"
        REWORK = "rework", "Rework"

    quote_request = models.OneToOneField("QuoteRequest", on_delete=models.CASCADE)
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE)
    status = models.CharField(_("status"), max_length=12, choices=Status.choices, default=Status.NEW_QUOTE)
    price = models.DecimalField(_("price"), max_digits=19, decimal_places=2)
    estimated_time= models.CharField(_("estimated time"), max_length=255)
    expiry_date= models.DateField(_("expiry date"))

    class Meta:
        verbose_name = "Quote"
        verbose_name_plural = "Quotes"

class QuoteRequest(models.Model):
    #These are allowed to be null, as right now there are no shops or users in the system to assign them to.
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, null=True)
    user = models.ForeignKey(Customer, on_delete=models.CASCADE, null=True)
    images = models.ForeignKey(Image, on_delete=models.SET_NULL, null=True)
    preferred_phone_number = PhoneNumberField(blank=True)
    preferred_email = models.EmailField(_("email address"), max_length=255, blank=True, null=True)
    description = models.CharField(_("description"), max_length = 1000)

    class Meta:
        verbose_name = "Quote Request"
        verbose_name_plural = "Quote Requests"
