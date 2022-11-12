from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Invitation


@receiver(post_save, sender=Invitation)
def send_email_invitation(sender, instance, created, *args, **kwargs):
    if created:
        instance.send_invitation()
