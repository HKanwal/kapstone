from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from .models import (
    Invitation,
    ShopAvailabilitySlot,
    ShopAvailability,
    AppointmentSlot,
    Appointment,
    WorkOrder,
)
from datetime import timedelta, datetime
from .models import appointment_creation_signal


@receiver(post_save, sender=Invitation)
def send_email_invitation(sender, instance, created, *args, **kwargs):
    if created:
        instance.send_invitation()


@receiver(pre_delete, sender=AppointmentSlot)
def cancel_appointments(sender, instance, *args, **kwargs):
    appointments = instance.appointments.all()
    for appointment in appointments:
        if appointment.status == Appointment.Status.PENDING:
            appointment.cancel()

            # get other AppointmentSlots with same appointment
            other_appointment_slots = AppointmentSlot.objects.filter(
                appointments__id=appointment.id,
            )
            for other_appointment_slot in other_appointment_slots:
                # remove appointment from list
                other_appointment_slot.appointments.remove(appointment)


@receiver(pre_delete, sender=ShopAvailability)
def delete_appointment_slots(sender, instance, *args, **kwargs):
    slots = AppointmentSlot.objects.filter(
        shop=instance.shop,
        start_time__year=instance.date.year,
        start_time__month=instance.date.month,
        start_time__day=instance.date.day,
    ).delete()


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


@receiver(appointment_creation_signal)
def create_workorder(sender, instance, **kwargs):
    start_time = instance.start_time
    end_time = instance.end_time
    WorkOrder.objects.create(
        appointment=instance,
        quote=instance.quote,
        shop=instance.shop,
        employee=instance.shop.get_next_available_employee(start_time, end_time),
    )
