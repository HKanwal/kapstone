from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils.translation import gettext as _

from phonenumber_field.modelfields import PhoneNumberField


class User(AbstractUser):
    """
    Custom User Model with types for shop owners, employees and customers.

    Required fields: username, password, type
    Optional fields: first_name, last_name, email, phone_number
    """

    class Types(models.TextChoices):
        SHOP_OWNER = "shop_owner", "Shop Owner"
        EMPLOYEE = "employee", "Employee"
        CUSTOMER = "customer", "Customer"

    email = models.EmailField(
        _("email address"), max_length=255, null=True
    )
    first_name = models.CharField(_("first name"), max_length=255, blank=True)
    last_name = models.CharField(_("last name"), max_length=255, blank=True)
    phone_number = PhoneNumberField(blank=True)

    base_type = Types.CUSTOMER
    type = models.CharField(
        _("Type"), max_length=40, choices=Types.choices, default=base_type
    )

    def save(self, *args, **kwargs):
        if not self.pk:
            self.type = self.base_type
        return super().save(*args, **kwargs)

    def __str__(self):
        return self.username


class ShopOwnerManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def get_queryset(self, *args, **kwargs):
        return super().get_queryset(*args, **kwargs).filter(type=User.Types.SHOP_OWNER)


class ShopOwnerData(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Shop Owner Data"
        verbose_name_plural = "Shop Owner Data"

    def __str__(self):
        return self.user.username + "'s Data"


class ShopOwner(User):
    """
    A proxy model for the shop owners inherited from
    the custom User model.
    """

    base_type = User.Types.SHOP_OWNER
    objects = ShopOwnerManager()

    class Meta:
        proxy = True
        verbose_name = "Shop Owner"
        verbose_name_plural = "Shop Owners"

    @property
    def data(self):
        return self.shopownerdata


class EmployeeManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def get_queryset(self, *args, **kwargs):
        return super().get_queryset(*args, **kwargs).filter(type=User.Types.EMPLOYEE)


class EmployeeData(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    salary = models.DecimalField(decimal_places=2, max_digits=15, null=True)

    class Meta:
        verbose_name = "Employee Data"
        verbose_name_plural = "Employee Data"


class Employee(User):
    """
    A proxy model for the employees inherited from
    the custom User model.
    """

    base_type = User.Types.EMPLOYEE
    objects = EmployeeManager()

    class Meta:
        proxy = True
        verbose_name = "Employee"
        verbose_name_plural = "Employees"

    @property
    def data(self):
        return self.employeedata


class CustomerManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def get_queryset(self, *args, **kwargs):
        return super().get_queryset(*args, **kwargs).filter(type=User.Types.CUSTOMER)


class CustomerData(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Customer Data"
        verbose_name_plural = "Customer Data"

    def __str__(self):
        return self.user.username + "'s Data"


class Customer(User):
    """
    A proxy model for the customer inherited from
    the custom User model.
    """

    base_type = User.Types.CUSTOMER
    objects = CustomerManager()

    class Meta:
        proxy = True
        verbose_name = "Customer"
        verbose_name_plural = "Customers"

    @property
    def data(self):
        return self.customerdata
