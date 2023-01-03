from django.contrib import admin
from .models import *
import nested_admin


@admin.register(Invitation)
class InvitationAdmin(admin.ModelAdmin):
    list_display = ("shop", "email", "invitation_key")
    fields = ("shop", "email", "invitation_key", "is_used", "is_expired")
    readonly_fields = ["invitation_key"]


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ("street", "city", "province", "country", "postal_code")


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("name", "shop")


@admin.register(ServicePart)
class ServicePartAdmin(admin.ModelAdmin):
    list_display = ("service", "part", "quantity")


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ("customer", "shop", "status", "start_time", "end_time")


@admin.register(AppointmentSlot)
class AppointmentSlotAdmin(admin.ModelAdmin):
    list_display = (
        "shop",
        "num_slots",
        "booked_slots",
    )
    fields = (
        "shop",
        "appointment",
        "start_time",
        "end_time",
        "num_slots",
        "booked_slots",
    )
    readonly_fields = ["booked_slots"]


class ShopAvailabilitySlotInline(nested_admin.NestedStackedInline):
    model = ShopAvailabilitySlot
    extra = 0


@admin.register(ShopAvailability)
class ShopAvailabilityAdmin(nested_admin.NestedModelAdmin):
    list_display = (
        "shop",
        "date",
    )
    fields = (
        "shop",
        "date",
    )

    inlines = [ShopAvailabilitySlotInline]


class ShopAvailabilityInline(nested_admin.NestedStackedInline):
    model = ShopAvailability
    extra = 0
    inlines = [ShopAvailabilitySlotInline]


@admin.register(Shop)
class ShopAdmin(nested_admin.NestedModelAdmin):
    list_display = ("name", "shop_owner")
    inlines = [ShopAvailabilityInline]


@admin.register(WorkOrder)
class WorkOrderAdmin(admin.ModelAdmin):
    list_display = ("shop", "appointment", "employee", "grand_total")
