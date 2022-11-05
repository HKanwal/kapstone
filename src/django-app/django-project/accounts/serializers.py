# from typing_extensions import override
from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from django.contrib.auth import get_user_model
# from rest_framework import serializers

User = get_user_model()


class UserCreateSerializer(BaseUserCreateSerializer):

    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ("username", "password", "email", "first_name", "last_name", "type")

