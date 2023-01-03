from rest_framework import serializers

from .models import Shop, Address, Invitation, Service
from accounts.serializers import UserViewSerializer


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = "__all__"


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = "__all__"


class ShopSerializer(serializers.ModelSerializer):
    shop_owner = UserViewSerializer()
    address = AddressSerializer()
    num_employees = serializers.SerializerMethodField()
    shop_services = ServiceSerializer(many=True)

    def get_num_employees(self, obj):
        return obj.num_employees

    class Meta:
        model = Shop
        fields = "__all__"


class ShopOverviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shop
        fields = ("id", "name")


class InvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation
        fields = "__all__"
