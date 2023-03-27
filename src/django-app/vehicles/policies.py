from rest_access_policy import AccessPolicy
from quotes.models import QuoteRequest
from accounts.models import EmployeeData


class VehicleAccessPolicy(AccessPolicy):
    statements = [
        {
            "action": ["list"],
            "principal": "authenticated",
            "effect": "allow",
        },
        {
            "action": ["retrieve"],
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
            "condition": ["is_customer", "is_owner"],
        },
        {
            "action": ["update"],
            "principal": "*",
            "effect": "deny",
        },
    ]

    @classmethod
    def scope_queryset(cls, request, qs):
        """
        Customers should only see their vehicles.
        Employees and Shop Owners should see vehicles in the QuoteRequests that
        have been sent to them, as well as vehicles that they have created.
        """
        if request.user.type == "customer":
            return qs.filter(customer=request.user)
        else:
            if request.user.type == "shop_owner":
                quote_requests = QuoteRequest.objects.filter(
                    shop__shop_owner=request.user
                )
            elif request.user.type == "employee":
                employee_shop = EmployeeData.objects.get(user=request.user).shop
                quote_requests = QuoteRequest.objects.filter(shop=employee_shop)
            return qs.filter(pk__in=quote_requests.values_list("vehicle", flat=True)) | qs.filter(customer=None)

    def is_owner(self, request, view, action):
        vehicle = view.get_object()
        return vehicle.customer == request.user

    def is_customer(self, request, view, action):
        return request.user.type == "customer"


class PartAccessPolicy(AccessPolicy):
    statements = [
        {
            "action": ["list"],
            "principal": "authenticated",
            "effect": "allow",
        },
        {
            "action": ["retrieve"],
            "principal": "authenticated",
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
            "principal": "*",
            "effect": "deny",
        },
        {
            "action": ["update"],
            "principal": "*",
            "effect": "deny",
        },
    ]

    @classmethod
    def scope_queryset(cls, request, qs):
        return qs.filter()

    def user_type_is_shop_owner(self, request, view, action):
        return request.user.type == "shop_owner"

    def user_type_is_employee(self, request, view, action):
        return request.user.type == "employee"
