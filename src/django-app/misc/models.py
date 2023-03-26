from django.db import models
from django.utils.translation import gettext as _
from quotes.models import QuoteRequest
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()


def upload_to(instance, filename):
    return "quote_images/{filename}".format(filename=filename)


class ImageQuote(models.Model):
    photo = models.ImageField(_("Image"), upload_to=upload_to)
    quote_request = models.ForeignKey(QuoteRequest, on_delete=models.CASCADE, null=True)


class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(_("title"), max_length=100, blank=False)
    message = models.TextField(_("message"), blank=False)
    read = models.BooleanField(default=False)
    read_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.message

    class Meta:
        ordering = ["-created_at"]
        verbose_name = _("Notification")
        verbose_name_plural = _("Notifications")

    def read_notification(self):
        self.read = True
        self.read_at = timezone.now()
        self.save()
