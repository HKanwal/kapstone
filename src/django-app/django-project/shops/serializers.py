from rest_framework import serializers

from .models import Shop, Address, Invitation


class ShopSerializer(serializers.ModelSerializer):
    shop_owner = serializers.SlugRelatedField(
        slug_field="name", queryset=Shop.objects.all()
    )
    address = serializers.SlugRelatedField(
        slug_field="street", queryset=Address.objects.all()
    )

    class Meta:
        model = Shop
        fields = "__all__"


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = "__all__"


class InvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation
        fields = "__all__"
