from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import (
    User,
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
@receiver(post_save, sender=User)
def create_user_data_instance(sender, instance, created, **kwargs):
    if created:
        if instance.type == User.Types.SHOP_OWNER:
            ShopOwnerData.objects.create(user=instance)
        elif instance.type == User.Types.EMPLOYEE:
            EmployeeData.objects.create(user=instance)
        elif instance.type == User.Types.CUSTOMER:
            CustomerData.objects.create(user=instance)
