from django.db import models
from django.utils.translation import gettext as _
from quotes.models import QuoteRequest
from django.db.models import Q


def upload_to(instance, filename):
    return "quote_images/{filename}".format(filename=filename)


class ImageQuote(models.Model):
    photo = models.ImageField(_("Image"), upload_to=upload_to)
    quote_request = models.ForeignKey(QuoteRequest, on_delete=models.CASCADE, null=True)
    quote_request_batch_id = models.UUIDField(default=None, null=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=Q(
                    quote_request_batch_id__isnull=True, quote_request__isnull=False
                )
                | Q(quote_request_batch_id__isnull=False, quote_request__isnull=True),
                name="Either provide a quote request or a quote request batch id",
            )
        ]
