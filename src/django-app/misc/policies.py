from rest_access_policy import AccessPolicy


class NotificationAccessPolicy(AccessPolicy):
    statements = [
        {
            "action": ["list", "count"],
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
            "principal": "*",
            "effect": "deny",
        },
        {
            "action": ["partial_update"],
            "principal": "authenticated",
            "effect": "allow",
            "condition": ["is_owner"],
        },
        {
            "action": ["destroy"],
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
        return qs.filter(user=request.user)

    def is_owner(self, request, view, action):
        notification = view.get_object()
        return notification.user == request.user
