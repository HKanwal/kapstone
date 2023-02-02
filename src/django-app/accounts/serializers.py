from djoser.serializers import (
    UserCreatePasswordRetypeSerializer as BaseUserCreateSerializer,
)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.db import transaction

User = get_user_model()

from .models import ShopOwnerData, EmployeeData, CustomerData
from shops.models import Invitation, Shop


class UserCreateSerializer(BaseUserCreateSerializer):
    invite_key = serializers.UUIDField(write_only=True, required=False)
    tokens = serializers.SerializerMethodField(method_name="get_tokens")

    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = (
            "username",
            "password",
            "email",
            "first_name",
            "last_name",
            "type",
            "invite_key",
            "tokens",
        )

    def get_tokens(self, obj):
        refresh = TokenObtainPairSerializer.get_token(obj)
        tokens = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
        return tokens

    def validate(self, attrs):
        """
        Override the default validate method to remove
        invite key before validation.
        """
        invite = attrs.pop("invite_key", None)
        attrs = super().validate(attrs)
        attrs["invite_key"] = invite
        return attrs

    def create(self, validated_data):
        """
        Override the default create method to atomically
        create user and user data.
        """
        invite_key = validated_data.pop("invite_key", None)
        with transaction.atomic():
            user = super().create(validated_data)
            if user.type == User.Types.SHOP_OWNER:
                ShopOwnerData.objects.create(user=user)
            elif user.type == User.Types.CUSTOMER:
                CustomerData.objects.create(user=user)
            elif user.type == User.Types.EMPLOYEE:
                try:
                    invitation = Invitation.objects.get(invitation_key=invite_key)
                    if invitation.is_expired:
                        raise serializers.ValidationError(
                            "This invitation key has expired."
                        )
                    elif invitation.is_used:
                        raise serializers.ValidationError(
                            "This invitation key has already been used."
                        )

                    EmployeeData.objects.create(user=user, shop=invitation.shop)
                    invitation.is_used = True
                    invitation.save()
                except Invitation.DoesNotExist:
                    raise serializers.ValidationError(
                        "There is no such invitation key."
                    )
            return user


class UserViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "first_name", "last_name", "email", "phone_number")
        read_only_fields = (
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "phone_number",
        )


class ShopOwnerDataSerializer(serializers.ModelSerializer):
    user = UserViewSerializer()

    class Meta:
        model = ShopOwnerData
        fields = "__all__"


class EmployeeDataSerializer(serializers.ModelSerializer):
    user = UserViewSerializer()

    class Meta:
        model = EmployeeData
        fields = "__all__"


class CustomerDataSerializer(serializers.ModelSerializer):
    user = UserViewSerializer()

    class Meta:
        model = CustomerData
        fields = "__all__"


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data["user_type"] = self.user.type
        return data
