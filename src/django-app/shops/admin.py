from django.contrib import admin
from .models import *


class InvitationAdmin(admin.ModelAdmin):
    list_display = ("shop", "email", "invitation_key")
    fields = ("shop", "email", "invitation_key", "is_used", "is_expired")
    readonly_fields = ["invitation_key"]


admin.site.register(Shop)
admin.site.register(Address)
admin.site.register(Invitation, InvitationAdmin)
