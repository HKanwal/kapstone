from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsShopOwner(BasePermission):
    """
    Custom permission to only allow only the shop owner and employees
    of a shop to edit it.
    """

    message = "You do not have permission to perform this action."

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.shop_owner == request.user


class IsShopOwnerOrEmployee(BasePermission):
    """
    Custom permission to only allow only the shop owner and employees
    of a shop to edit it.
    """

    message = "You do not have permission to perform this action."

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return (
            obj.shop.shop_owner == request.user or request.user.id in obj.shop.employees
        )


class IsOwner(BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        return obj.user == request.user
