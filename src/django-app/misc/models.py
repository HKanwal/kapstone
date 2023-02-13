from django.db import models
from django.utils.translation import gettext as _
from quotes.models import QuoteRequest

def upload_to(instance, filename):
    return 'quote_images/{filename}'.format(filename=filename)

class ImageQuote(models.Model):
    photo = models.ImageField(_("Image"), upload_to=upload_to)
    quote_request = models.ForeignKey(QuoteRequest, on_delete=models.CASCADE, null=True)
