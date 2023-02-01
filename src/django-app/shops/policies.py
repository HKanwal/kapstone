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


class AddressAccessPolicy(AccessPolicy):
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
        },
        {
            "action": ["partial_update", "destroy"],
            "principal": "authenticated",
            "effect": "allow",
            # TODO: add condition to allow only the creators of an address
            # This requires adding field to address for the user
        },
        {
            "action": ["update"],
            "principal": "*",
            "effect": "deny",
        },
    ]


class ServiceAccessPolicy(AccessPolicy):
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
            "condition_expression": [
                "(user_type_is_shop_owner or user_type_is_employee)"
            ],
        },
        {
            "action": ["partial_update", "destroy"],
            "principal": "authenticated",
            "effect": "allow",
            "condition": ["is_shop_related"],
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
                return qs.filter(shop__shop_owner=request.user)
            elif request.user.type == "employee":
                employee_shop = EmployeeData.objects.get(user=request.user).shop
                return qs.filter(shop=employee_shop)
        return qs

    def user_type_is_shop_owner(self, request, view, action):
        return request.user.type == "shop_owner"

    def user_type_is_employee(self, request, view, action):
        return request.user.type == "employee"

    def is_shop_related(self, request, view, action):
        service = view.get_object()
        return service.shop.shop_owner == request.user or service.shop.has_employee(
            request.user.id
        )


class AppointmentAccessPolicy(AccessPolicy):
    statements = [
        {
            "action": ["list", "retrieve"],
            "principal": "authenticated",
            "effect": "allow",
        },
        {
            "action": ["create"],
            "principal": "authenticated",
            "effect": "allow",
        },
        {
            "action": ["partial_update", "destroy"],
            "principal": "authenticated",
            "effect": "allow",
            "condition_expression": ["(is_owner or is_shop_related)"],
        },
        {
            "action": ["update"],
            "principal": "*",
            "effect": "deny",
        },
    ]

    @classmethod
    def scope_queryset(cls, request, qs):
        if request.user.type == "shop_owner":
            return qs.filter(shop__shop_owner=request.user)
        elif request.user.type == "employee":
            employee_shop = EmployeeData.objects.get(user=request.user).shop
            return qs.filter(shop=employee_shop)
        elif request.user.type == "customer":
            return qs.filter(customer=request.user)
        return qs

    def is_shop_related(self, request, view, action):
        appointment = view.get_object()
        return (
            appointment.shop.shop_owner == request.user
            or appointment.shop.has_employee(request.user.id)
        )

    def is_owner(self, request, view, action):
        appointment = view.get_object()
        return request.user == appointment.customer


class AppointmentSlotAccessPolicy(AccessPolicy):
    statements = [
        {
            "action": ["list", "retrieve"],
            "principal": "*",
            "effect": "allow",
        },
        {
            "action": ["create", "destroy"],
            "principal": "authenticated",
            "effect": "allow",
            "condition": ["is_shop_related"],
        },
        {
            "action": ["partial_update"],
            "principal": "authenticated",
            "effect": "allow",
            "condition": ["is_shop_related"],
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
                return qs.filter(shop__shop_owner=request.user)
            elif request.user.type == "employee":
                employee_shop = EmployeeData.objects.get(user=request.user).shop
                return qs.filter(shop=employee_shop)
        return qs

    def is_shop_related(self, request, view, action):
        if action == "create":
            shop = Shop.objects.get(id=request.data.get("shop"))
        else:
            appointment_slot = view.get_object()
            shop = appointment_slot.shop
        return shop.shop_owner == request.user or shop.has_employee(request.user.id)


class WorkOrderAccessPolicy(AccessPolicy):
    statements = [
        {
            "action": ["list", "retrieve"],
            "principal": "authenticated",
            "effect": "allow",
            "condition_expression": [
                "(user_type_is_shop_owner or user_type_is_employee)"
            ],
        },
        {
            "action": ["create", "destroy"],
            "principal": "authenticated",
            "effect": "allow",
            "condition": ["is_shop_related"],
        },
        {
            "action": ["partial_update"],
            "principal": "authenticated",
            "effect": "allow",
            "condition": ["is_shop_related"],
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
                return qs.filter(shop__shop_owner=request.user)
            elif request.user.type == "employee":
                employee_shop = EmployeeData.objects.get(user=request.user).shop
                return qs.filter(shop=employee_shop)
        return qs

    def is_shop_related(self, request, view, action):
        if action == "create":
            shop = Shop.objects.get(id=request.data.get("shop"))
        else:
            work_order = view.get_object()
            shop = work_order.shop
        return shop.shop_owner == request.user or shop.has_employee(request.user.id)

    def user_type_is_shop_owner(self, request, view, action):
        return request.user.type == "shop_owner"

    def user_type_is_employee(self, request, view, action):
        return request.user.type == "employee"
