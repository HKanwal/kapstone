from rest_framework import serializers

from .models import Shop, Address, Invitation, Service, AppointmentSlot, Appointment
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
        read_only_fields = ("UUID",)


class AppointmentSerializer(serializers.ModelSerializer):
    customer = UserViewSerializer()
    shop = ShopOverviewSerializer()
    start_time = serializers.SerializerMethodField()
    end_time = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = "__all__"

    def get_start_time(self, obj):
        return obj.start_time

    def get_end_time(self, obj):
        return obj.end_time


class AppointmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = "__all__"


class AppointmentSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentSlot
        fields = "__all__"


class AppointmentSlotListSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentSlot
        fields = ("id", "shop", "start_time", "end_time")
