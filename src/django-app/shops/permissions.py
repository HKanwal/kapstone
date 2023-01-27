from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework import serializers
from .serializers import InvitationSerializer
from .models import Shop


# TODO: Fix this. Has Permission should have checks for ADMIN and get list should only be visible to shop owners themselves
class InvitationPermissions(BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_permission(self, request, view):
        if (
            request.data.get("shop", None) is not None
            and Shop.objects.get(id=request.data["shop"]).shop_owner != request.user
        ):
            return False

        return request.user.is_authenticated and request.user.type == "shop_owner"

    def has_object_permission(self, request, view, obj):
        return obj.shop.shop_owner == request.user


class ServicePostPermissions(BasePermission):
    def has_permission(self, request, view):
        if view.action in ("create",):
            shop = Shop.objects.get(id=request.data["shop"])
            return shop.shop_owner == request.user or request.user.id in shop.employees
        return super().has_permission()
