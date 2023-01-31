from rest_framework import serializers

from .models import (
    Shop,
    Address,
    Invitation,
    Service,
    ServicePart,
    AppointmentSlot,
    Appointment,
    WorkOrder,
)
from accounts.serializers import UserViewSerializer
from vehicles.serializers import PartSerializer


class ServicePartSerializer(serializers.ModelSerializer):
    price = serializers.DecimalField(default=0, max_digits=10, decimal_places=2)
    quantity = serializers.IntegerField(default=1)

    class Meta:
        model = ServicePart
        fields = "__all__"
        read_only_fields = ("id",)


class ServiceSerializer(serializers.ModelSerializer):
    price = serializers.DecimalField(default=0, max_digits=10, decimal_places=2)
    parts = PartSerializer(many=True)

    class Meta:
        model = Service
        fields = "__all__"
        read_only_fields = ("id",)


class ServiceUpdateSerializer(serializers.ModelSerializer):
    price = serializers.DecimalField(default=0, max_digits=10, decimal_places=2)

    class Meta:
        model = Service
        fields = "__all__"
        read_only_fields = ("id", "shop")


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = "__all__"
        read_only_fields = ("id",)


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


class ShopWriteSerializer(serializers.ModelSerializer):
    shop_owner = serializers.PrimaryKeyRelatedField(
        read_only=True, default=serializers.CurrentUserDefault()
    )
    num_bays = serializers.IntegerField(default=0, initial=0)

    class Meta:
        model = Shop
        fields = "__all__"
        read_only_fields = ("id", "shop_owner")


class ShopOverviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shop
        fields = ("id", "name")


class InvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation
        fields = "__all__"


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


class WorkOrderSerializer(serializers.ModelSerializer):
    odometer_reading_before = serializers.IntegerField(default=0)
    odometer_reading_after = serializers.IntegerField(default=0)
    discount = serializers.DecimalField(max_digits=5, decimal_places=2, default=0)
    grand_total = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        model = WorkOrder
        fields = "__all__"
        read_only_fields = ("id",)
