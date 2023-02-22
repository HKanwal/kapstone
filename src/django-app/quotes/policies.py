from rest_access_policy import AccessPolicy
from accounts.models import EmployeeData
from shops.models import Shop
from .models import QuoteRequest


class QuoteAccessPolicy(AccessPolicy):
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
            "condition": ["has_quote_create_permission"],
        },
        {
            "action": ["partial_update"],
            "principal": "authenticated",
            "effect": "allow",
            "condition_expression": [
                "(is_shop_related or (is_owner and is_editing_status))"
            ],
        },
        {
            "action": ["destroy"],
            "principal": "authenticated",
            "effect": "allow",
            "condition": ["is_shop_related"],
        },
        {
            "action": ["update"],
            "principal": "*",
            "effect": "deny",
        },
        # {
        #     "action": ["status"],
        #     "principal": "authenticated",
        #     "effect": "allow",
        #     "condition_expression": ["(is_shop_related or is_owner)"],
        # },
    ]

    @classmethod
    def scope_queryset(cls, request, qs):
        if request.user.type == "customer":
            return qs.filter(quote_request__user=request.user)
        elif request.user.type == "shop_owner":
            return qs.filter(shop__shop_owner=request.user)
        elif request.user.type == "employee":
            employee_shop = EmployeeData.objects.get(user=request.user).shop
            return qs.filter(shop=employee_shop)
        return qs

    @classmethod
    def scope_fields(cls, request, fields: dict, instance=None):
        # TODO: This breaks the docs! Will leave this out.
        if (
            instance
            and instance.shop.shop_owner != request.user
            and request.user.id not in instance.shop.employees
        ):
            fields["price"].read_only = True
            fields["estimated_time"].read_only = True
            fields["expiry_date"].read_only = True
            # other fields should be readonly by default accept status
        return fields

    def is_shop_related(self, request, view, action):
        quote = view.get_object()
        return (
            quote.shop.shop_owner == request.user
            or request.user.id in quote.shop.employees
        )

    def is_editing_status(self, request, view, action):
        status = request.data.pop("status", None)
        if status is not None and not request.data:
            return True
        return False

    def is_owner(self, request, view, action):
        quote = view.get_object()
        return quote.quote_request.user == request.user

    def has_quote_create_permission(self, request, view, action):
        quote_request_id = request.data.get("quote_request", None)
        if quote_request_id is None:
            return False
        quote_request = QuoteRequest.objects.get(id=quote_request_id)
        shop = quote_request.shop
        return (
            request.user.type == "shop_owner" and shop.shop_owner == request.user
        ) or (request.user.type == "employee" and request.user.id in shop.employees)


class QuoteRequestAccessPolicy(AccessPolicy):
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
            "condition_expression": ["(is_shop_related or is_owner)"],
        },
        {
            "action": ["create", "bulk_create"],
            "principal": "authenticated",
            "effect": "allow",
            "condition": ["is_customer"],
        },
        {
            "action": ["partial_update"],
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
        if request.user.type == "customer":
            return qs.filter(user=request.user)
        elif request.user.type == "shop_owner":
            return qs.filter(shop__shop_owner=request.user)
        elif request.user.type == "employee":
            employee_shop = EmployeeData.objects.get(user=request.user).shop
            return qs.filter(shop=employee_shop)
        return qs

    def is_shop_related(self, request, view, action):
        quote_request = view.get_object()
        return (
            quote_request.shop.shop_owner == request.user
            or quote_request.shop.has_employee(request.user.id)
        )

    def is_owner(self, request, view, action):
        quote_request = view.get_object()
        return quote_request.user == request.user

    def is_customer(self, request, view, action):
        return request.user.type == "customer"
