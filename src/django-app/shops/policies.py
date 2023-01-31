from rest_access_policy import AccessPolicy
from accounts.models import EmployeeData
from .models import Shop


class ShopAccessPolicy(AccessPolicy):
    statements = [
        {
            "action": ["list", "retrieve"],
            "principal": "*",
            "effect": "allow",
        },
        {
            "action": ["create"],
            "principal": "authenticated",
            "effect": "allow",
            "condition": ["user_type_is_shop_owner"],
        },
        {
            "action": ["partial_update", "destroy"],
            "principal": "authenticated",
            "effect": "allow",
            "condition": ["is_owner"],
        },
        {
            "action": ["update"],
            "principal": "*",
            "effect": "deny",
        },
    ]

    @classmethod
    def scope_queryset(cls, request, qs):
        if request.user.is_authenticated:
            if request.user.type == "shop_owner":
                return qs.filter(shop_owner=request.user)
            elif request.user.type == "employee":
                employee_shop = EmployeeData.objects.get(user=request.user).shop
                return qs.filter(id=employee_shop.id)
        return qs

    def user_type_is_shop_owner(self, request, view, action):
        return request.user.type == "shop_owner"

    def is_owner(self, request, view, action):
        return request.user == Shop.objects.get(id=view.kwargs.get("pk")).shop_owner
