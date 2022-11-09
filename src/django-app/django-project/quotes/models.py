from django.db import models
from django.utils.translation import gettext as _
from shops.models import Shop

class Status(models.TextChoices):
    NEW_QUOTE = "new_quote", "New Quote"
    ACCEPTED = "accepted", "Accepted"
    IN_PROGRESS = "in_progress", "In Progress"
    DONE = "done", "Done"
    REWORK = "rework", "Rework"


class Quote(models.Model):
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
    preferred_date = models.DateField(_("preferred date"), blank=True)
    preferred_time = models.TimeField(_("preferred time"), blank=True)
    description = models.CharField(_("description"), max_length = 1000)

    class Meta:
        verbose_name = "Quote Request"
        verbose_name_plural = "Quote Requests"
