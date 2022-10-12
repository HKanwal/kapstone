from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import (
    ShopOwner,
    Employee,
    Customer,
    ShopOwnerData,
    EmployeeData,
    CustomerData,
)


@receiver(post_save, sender=ShopOwner)
@receiver(post_save, sender=Employee)
@receiver(post_save, sender=Customer)
def create_user_data_instance(sender, instance, created, **kwargs):
    if created:
        if instance.type == "shop_owner":
            ShopOwnerData.objects.create(user=instance)
        elif instance.type == "employee":
            EmployeeData.objects.create(user=instance)
        elif instance.type == "customer":
            CustomerData.objects.create(user=instance)
