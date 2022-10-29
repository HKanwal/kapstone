from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserCreateSerializer(UserCreateSerializer):
    type = serializers.ChoiceField(choices=User.Types, allow_blank=False)

    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ("username", "password", "email", "first_name", "last_name", "type")

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data["username"],
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            type=validated_data["type"],
        )
        user.set_password(validated_data["password"])
        user.save()
        return user
