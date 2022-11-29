from django.contrib import admin
from .models import *


@admin.register(Shop)
class ShopAdmin(admin.ModelAdmin):
    list_display = ("name", "shop_owner")


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
    list_display = ("shop", "customer", "date", "time", "duration")

@admin.register(WorkOrder)
class WorkOrderAdmin(admin.ModelAdmin):
    list_display = ("shop", "appointment", "employee", "grand_total")


