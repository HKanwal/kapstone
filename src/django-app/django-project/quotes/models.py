from django.db import models
from django.utils.translation import gettext as _
from shops.models import Shop

class Quote(models.Model):
    quote_request = models.OneToOneField("QuoteRequest", on_delete=models.CASCADE)
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE)
    new_quote = 'NEW_QUOTE'
    accepted = 'ACCEPTED'
    in_progress = 'IN_PROGRESS'
    done = 'DONE'
    rework = 'REWORK'
    status_choices = [
        (new_quote, 'New Quote'),
        (accepted, 'Accepted'),
        (in_progress, 'In Progress'),
        (done, 'Done'),
        (rework, 'Rework')
    ]
    status = models.CharField(_("status"), max_length=12, choices=status_choices, default=new_quote)
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
