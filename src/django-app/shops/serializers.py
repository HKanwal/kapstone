from rest_framework import serializers
from rest_access_policy import PermittedPkRelatedField

from .models import (
    Shop,
    ShopHours,
    ShopAvailability,
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
from .policies import ShopAccessPolicy, AppointmentAccessPolicy, ServiceAccessPolicy
from quotes.policies import QuoteAccessPolicy
from quotes.models import Quote
from vehicles.policies import VehicleAccessPolicy
from vehicles.models import Vehicle
from vehicles.serializers import VehicleSerializer


class ServicePartSerializer(serializers.ModelSerializer):
    quantity = serializers.IntegerField(default=1)

    class Meta:
        model = ServicePart
        fields = "__all__"
        read_only_fields = ("id",)


class ServiceSerializer(serializers.ModelSerializer):
    price = serializers.DecimalField(default=0, max_digits=10, decimal_places=2)
    parts = PartSerializer(many=True)
    has_edit_permission = serializers.SerializerMethodField()

    def get_has_edit_permission(self, obj):
        user = self.context["request"].user
        is_shop_owner = user == obj.shop.shop_owner
        is_employee = obj.shop.has_employee(user.id)
        is_authenticated = user.is_authenticated
        return is_authenticated and (is_shop_owner or is_employee)

    class Meta:
        model = Service
        fields = "__all__"
        read_only_fields = ("id",)


class ServiceWriteSerializer(serializers.ModelSerializer):
    price = serializers.DecimalField(default=0, max_digits=10, decimal_places=2)
    shop = PermittedPkRelatedField(
        access_policy=ShopAccessPolicy, queryset=Shop.objects.all()
    )

    def create(self, validated_data):
        service = Service.objects.create(**validated_data)
        return service

    class Meta:
        model = Service
        fields = "__all__"
        read_only_fields = ("id",)


class ServiceUpdateSerializer(serializers.ModelSerializer):
    price = serializers.DecimalField(default=0, max_digits=10, decimal_places=2)
    shop = PermittedPkRelatedField(
        access_policy=ShopAccessPolicy, queryset=Shop.objects.all()
    )

    class Meta:
        model = Service
        fields = "__all__"
        read_only_fields = ("id", "parts")


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = "__all__"
        read_only_fields = ("id",)


class ShopAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = ShopAvailability
        fields = "__all__"


class ShopHoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShopHours
        fields = "__all__"


class ShopSerializer(serializers.ModelSerializer):
    shop_owner = UserViewSerializer()
    address = AddressSerializer()
    num_employees = serializers.SerializerMethodField()
    shop_services = ServiceSerializer(many=True)
    shophours_set = ShopHoursSerializer(many=True, read_only=True)
    has_edit_permission = serializers.SerializerMethodField()

    def get_num_employees(self, obj):
        return obj.num_employees

    def get_has_edit_permission(self, obj):
        user = self.context["request"].user
        is_shop_owner = user == obj.shop_owner
        is_authenticated = user.is_authenticated
        return is_authenticated and is_shop_owner

    class Meta:
        model = Shop
        fields = "__all__"


class ShopWriteSerializer(serializers.ModelSerializer):
    shop_owner = serializers.PrimaryKeyRelatedField(
        read_only=True, default=serializers.CurrentUserDefault()
    )
    num_bays = serializers.IntegerField(default=0, initial=0)

    def create(self, validated_data):
        shop = Shop.objects.create(
            **validated_data, shop_owner=self.context["request"].user
        )
        return shop

    class Meta:
        model = Shop
        fields = "__all__"
        read_only_fields = ("id", "shop_owner")


class ShopOverviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shop
        fields = ("id", "name", "shop_email", "shop_phone_number")


class InvitationSerializer(serializers.ModelSerializer):
    shop = PermittedPkRelatedField(
        access_policy=ShopAccessPolicy, queryset=Shop.objects.all()
    )

    class Meta:
        model = Invitation
        fields = "__all__"


class AppointmentSerializer(serializers.ModelSerializer):
    from quotes.serializers import QuoteSerializer

    customer = UserViewSerializer()
    shop = ShopOverviewSerializer()
    start_time = serializers.SerializerMethodField()
    end_time = serializers.SerializerMethodField()
    status_display = serializers.SerializerMethodField()
    quote = QuoteSerializer(allow_null=True, required=False)
    service = serializers.SerializerMethodField("get_service")
    vehicle = VehicleSerializer(allow_null=True, required=False)

    class Meta:
        model = Appointment
        fields = "__all__"

    def get_start_time(self, obj):
        return obj.start_time

    def get_end_time(self, obj):
        return obj.end_time

    def get_status_display(self, obj):
        return obj.get_status_display()

    def get_service(self, obj):
        if obj.service is None:
            return None
        serializer_context = {"request": self.context.get("request")}
        return ServiceSerializer(obj.service, context=serializer_context).data


class AppointmentCreateSerializer(serializers.ModelSerializer):
    shop = PermittedPkRelatedField(
        access_policy=ShopAccessPolicy, queryset=Shop.objects.all()
    )
    vehicle = PermittedPkRelatedField(
        access_policy=VehicleAccessPolicy,
        queryset=Vehicle.objects.all(),
        required=False,
    )
    quote = PermittedPkRelatedField(
        access_policy=QuoteAccessPolicy, queryset=Quote.objects.all(), required=False
    )
    service = PermittedPkRelatedField(
        access_policy=ServiceAccessPolicy,
        queryset=Service.objects.all(),
        required=False,
    )

    class Meta:
        model = Appointment
        fields = "__all__"
        read_only_fields = ("id",)

    def create(self, validated_data):
        if validated_data.get("vehicle", None) is None:
            quote = validated_data.get("quote", None)
            if quote is not None:
                vehicle = quote.quote_request.vehicle
                if vehicle is not None:
                    appointment = Appointment.objects.create(
                        **validated_data, vehicle=vehicle
                    )
                    return appointment
        return super().create(validated_data)


class AppointmentUpdateSerializer(serializers.ModelSerializer):
    vehicle = PermittedPkRelatedField(
        access_policy=VehicleAccessPolicy,
        queryset=Vehicle.objects.all(),
        required=False,
    )

    class Meta:
        model = Appointment
        fields = "__all__"
        read_only_fields = ("id", "shop", "customer", "quote", "service")


class AppointmentSlotSerializer(serializers.ModelSerializer):
    shop = PermittedPkRelatedField(
        access_policy=ShopAccessPolicy, queryset=Shop.objects.all()
    )

    class Meta:
        model = AppointmentSlot
        fields = "__all__"
        read_only_fields = ("id",)


class AppointmentSlotUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentSlot
        fields = "__all__"
        read_only_fields = ("id", "shop")


class AppointmentSlotListSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentSlot
        fields = ("id", "shop", "start_time", "end_time")


class WorkOrderSerializer(serializers.ModelSerializer):
    odometer_reading_before = serializers.IntegerField(default=0)
    odometer_reading_after = serializers.IntegerField(default=0)
    discount = serializers.DecimalField(max_digits=5, decimal_places=2, default=0)
    grand_total = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)
    appointment = AppointmentSerializer()
    employee = UserViewSerializer()
    has_edit_permission = serializers.SerializerMethodField()

    def get_has_edit_permission(self, obj):
        user = self.context["request"].user
        is_shop_owner = user == obj.shop.shop_owner
        is_employee = obj.shop.has_employee(user.id)
        is_authenticated = user.is_authenticated
        return is_authenticated and (is_shop_owner or is_employee)

    class Meta:
        model = WorkOrder
        fields = "__all__"
        read_only_fields = ("id",)


class WorkOrderUpdateSerializer(serializers.ModelSerializer):
    odometer_reading_before = serializers.IntegerField(default=0)
    odometer_reading_after = serializers.IntegerField(default=0)
    discount = serializers.DecimalField(max_digits=5, decimal_places=2, default=0)
    grand_total = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)
    appointment = PermittedPkRelatedField(
        access_policy=AppointmentAccessPolicy, queryset=Appointment.objects.all()
    )

    class Meta:
        model = WorkOrder
        fields = "__all__"
        read_only_fields = ("id", "shop")


class WorkOrderCreateSerializer(serializers.ModelSerializer):
    odometer_reading_before = serializers.IntegerField(default=0)
    odometer_reading_after = serializers.IntegerField(default=0)
    discount = serializers.DecimalField(max_digits=5, decimal_places=2, default=0)
    grand_total = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)
    shop = PermittedPkRelatedField(
        access_policy=ShopAccessPolicy, queryset=Shop.objects.all()
    )
    appointment = PermittedPkRelatedField(
        access_policy=AppointmentAccessPolicy, queryset=Appointment.objects.all()
    )

    class Meta:
        model = WorkOrder
        fields = "__all__"
        read_only_fields = ("id",)
