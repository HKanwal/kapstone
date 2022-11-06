from djoser.serializers import (
    UserCreatePasswordRetypeSerializer as BaseUserCreateSerializer,
)
from django.contrib.auth import get_user_model

User = get_user_model()


class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ("username", "password", "email", "first_name", "last_name", "type")
