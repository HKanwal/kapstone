from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import QuoteRequest, Quote, QuoteComment
from misc.models import Notification


@receiver(post_save, sender=QuoteRequest)
def quote_request_notification(sender, instance, created, *args, **kwargs):
    if created:
        # Send notification to Shop Owner
        url = f"/new-quote-requests/{instance.id}"
        title = "New Quote Request"
        message = f"You have received a new quote request from @{instance.user}."
        Notification.objects.create(
            user=instance.shop.shop_owner, title=title, message=message, link=url
        )


@receiver(post_save, sender=Quote)
def quote_notification(sender, instance, created, *args, **kwargs):
    if created:
        # Send notification to Customer
        url = f"/quote?id={instance.id}"
        title = f"New Quote Received from {instance.shop.name}"
        message = f"You have received a new quote from {instance.shop.name}."
        Notification.objects.create(
            user=instance.quote_request.user, title=title, message=message, link=url
        )


@receiver(post_save, sender=QuoteComment)
def quote_comment_notification(sender, instance, created, *args, **kwargs):
    if created:
        if instance.user.type == "customer":
            # Send notification to Shop Owner
            url = f"/quote?id={instance.quote.id}"
            title = f"New comment received from @{instance.user.username}"
            message = f"You have received a new quote comment from @{instance.user.username} on Quote #{instance.quote.id}."
            Notification.objects.create(
                user=instance.quote.shop.shop_owner,
                title=title,
                message=message,
                link=url,
            )
        elif instance.user.type in ["shop_owner", "employee"]:
            # Send notification to Customer
            url = f"/quote?id={instance.quote.id}"
            title = f"New comment received from {instance.quote.shop.name}"
            message = f"You have received a new quote comment from {instance.quote.shop.name} on Quote #{instance.quote.id}."
            Notification.objects.create(
                user=instance.quote.quote_request.user,
                title=title,
                message=message,
                link=url,
            )
