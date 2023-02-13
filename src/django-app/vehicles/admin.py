from django.contrib import admin
from .models import Vehicle, Part

@admin.register(Part)
class PartAdmin(admin.ModelAdmin):
    list_display = ("name", "condition", "type", "price")


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ("get_main_display", "manufacturer", "model", "year", "color", "vin", "customer")

    def get_main_display(self, obj):
        return f"{obj.manufacturer} {obj.model} {obj.year}"

    get_main_display.short_description = "Vehicle"
