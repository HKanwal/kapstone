from rest_framework.permissions import BasePermission
from shops.models import Shop


class CanEditUser(BasePermission):
    """
    Allows access only to authenticated users.
    """

    def has_permission(self, request, view):
        if bool(request.user and request.user.is_authenticated):
            if request.user == view.get_object():  # user can edit their own profile
                return True
            elif (
                request.user.type == "shop_owner"
                and view.get_object().type == "employee"
            ):  # user can edit their own employees
                shop = Shop.objects.get(shop_owner=request.user)
                if shop is not None:
                    return shop.has_employee(view.get_object().id)

        return False
