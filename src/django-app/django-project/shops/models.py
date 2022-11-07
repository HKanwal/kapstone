from django.db import models
    
from django.utils.translation import gettext as _

class Shop(models.Model):
    shop_owner = models.ForeignKey("accounts.ShopOwner", on_delete=models.CASCADE)
    address = models.OneToOneField("Address", on_delete=models.PROTECT)
    name = models.CharField(_("shop name"), max_length=255)
    num_employees = models.IntegerField(_("number of employees"), default=0, null=True, blank=True)
    num_bays = models.IntegerField(_("number of service bays"), default=1, null=True, blank=True)
    availability = models.CharField(_("available hours"), max_length=255, null=True, blank=True)
    shop_hours = models.CharField(_("shop hours"), max_length=255, null=True, blank=True)

    class Meta:
        verbose_name = "Shop"
        verbose_name_plural = "Shops"

class Address(models.Model):
    postal_code = models.CharField(_("postal code"), max_length=6)
    street = models.CharField(_("street"), max_length=255)
    city = models.CharField(_("city"), max_length=255)
    country = models.CharField(_("country"), max_length=255)
    province = models.CharField(_("province"), max_length=2)

    class Meta:
        verbose_name = "Address"
        verbose_name_plural = "Addresses"

    def __str__(self):
        return self.street + ", " + self.city + ", " + self.province + ", " + self.country + ", " + self.postal_code

