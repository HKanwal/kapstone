from django.db import models

from django.utils.translation import gettext as _


class Vehicle(models.Model):
    manufacturer = models.CharField(_("manufacturer"), max_length=255, blank=True)
    model = models.CharField(_("model"), max_length=255, blank=True)
    color = models.CharField(_("color"), max_length=255, blank=True)
    vin = models.CharField(_("vin"), max_length=17, primary_key=True)
    user = models.ForeignKey("accounts.Customer", on_delete=models.CASCADE)

    class Meta:
        verbose_name = _("vehicle")
        verbose_name_plural = _("vehicles")

    def __str__(self):
        return f"{self.vin}"


class Part(models.Model):
    class Condition(models.TextChoices):
        NEW = "new", "New"
        USED = "used", "Used"

    class Type(models.TextChoices):
        OEM = "oem", "OEM"
        AFTERMARKET = "aftermarket", "Aftermarket"

    name = models.CharField(_("Name"), max_length=32, null=False, blank=False)
    condition = models.CharField(
        _("Condition"), max_length=4, choices=Condition.choices, null=False, blank=False
    )
    type = models.CharField(
        _("Type"), max_length=11, choices=Type.choices, null=False, blank=False
    )
    price = models.DecimalField(
        _("Price (in CAD)"), max_digits=10, decimal_places=2, null=False
    )

    class Meta:
        verbose_name = _("Part")
        verbose_name_plural = _("Parts")

    def __str__(self):
        return f"{self.name}, {self.condition}, {self.type}, ${self.price}"
