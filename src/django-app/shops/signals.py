from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Invitation, ShopAvailabilitySlot, ShopAvailability, AppointmentSlot
from datetime import timedelta, datetime


@receiver(post_save, sender=Invitation)
def send_email_invitation(sender, instance, created, *args, **kwargs):
    if created:
        instance.send_invitation()


@receiver(post_save, sender=ShopAvailabilitySlot)
def create_availability_slots(sender, instance, created, *args, **kwargs):
    appointment_slot_duration = timedelta(minutes=15)
    availability_slot_start = datetime.combine(
        instance.shop_availability.date, instance.start_time
    )
    availability_slot_end = datetime.combine(
        instance.shop_availability.date, instance.end_time
    )
    availability_slot_duration = availability_slot_end - availability_slot_start
    appointment_slots_to_create = int(
        availability_slot_duration / appointment_slot_duration
    )
    for i in range(appointment_slots_to_create):
        slot_start_date_time = (
            datetime.combine(instance.shop_availability.date, instance.start_time)
            + i * appointment_slot_duration
        )
        slot_end_date_time = slot_start_date_time + appointment_slot_duration
        AppointmentSlot.objects.get_or_create(
            shop=instance.shop_availability.shop,
            start_time=slot_start_date_time,
            end_time=slot_end_date_time,
        )
