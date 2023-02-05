from django.shortcuts import render
from django.db import transaction
from django.core.exceptions import ValidationError

from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_access_policy import AccessViewSetMixin

from datetime import datetime, timedelta
import json

from .serializers import (
    ShopSerializer,
    ShopWriteSerializer,
    AddressSerializer,
    InvitationSerializer,
    ServicePartSerializer,
    ServiceSerializer,
    ServiceUpdateSerializer,
    AppointmentSerializer,
    AppointmentCreateSerializer,
    AppointmentUpdateSerializer,
    AppointmentSlotSerializer,
    AppointmentSlotListSerializer,
    AppointmentSlotUpdateSerializer,
    WorkOrderSerializer,
    WorkOrderCreateSerializer,
    WorkOrderUpdateSerializer,
)
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
from .policies import (
    ShopAccessPolicy,
    AddressAccessPolicy,
    ServiceAccessPolicy,
    AppointmentAccessPolicy,
    AppointmentSlotAccessPolicy,
    WorkOrderAccessPolicy,
)


class ShopViewSet(AccessViewSetMixin, viewsets.ModelViewSet):
    access_policy = ShopAccessPolicy
    queryset = Shop.objects.all().order_by("name")

    def get_queryset(self):
        return self.access_policy.scope_queryset(self.request, self.queryset)

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return ShopWriteSerializer
        return ShopSerializer


class AddressViewSet(AccessViewSetMixin, viewsets.ModelViewSet):
    access_policy = AddressAccessPolicy
    queryset = Address.objects.all().order_by("street")
    serializer_class = AddressSerializer


class InvitationViewSet(viewsets.ModelViewSet):
    queryset = Invitation.objects.all()
    serializer_class = InvitationSerializer


class ServiceViewSet(AccessViewSetMixin, viewsets.ModelViewSet):
    access_policy = ServiceAccessPolicy
    queryset = Service.objects.all()

    def get_queryset(self):
        return self.access_policy.scope_queryset(self.request, self.queryset)

    def get_serializer_class(self):
        if self.action in ["update", "partial_update"]:
            return ServiceUpdateSerializer
        return ServiceSerializer


class ServicePartViewSet(viewsets.ModelViewSet):
    queryset = ServicePart.objects.all()
    serializer_class = ServicePartSerializer


class AppointmentViewSet(AccessViewSetMixin, viewsets.ModelViewSet):
    access_policy = AppointmentAccessPolicy
    queryset = Appointment.objects.all()

    def get_queryset(self):
        queryset = self.access_policy.scope_queryset(self.request, self.queryset)
        queryset = self._filter_by_shop(queryset)
        queryset = self._filter_by_status(queryset)
        return queryset

    def get_serializer_class(self):
        if self.action in ["create"]:
            return AppointmentCreateSerializer
        elif self.action in ["update", "partial_update"]:
            return AppointmentUpdateSerializer
        return AppointmentSerializer

    def _filter_by_shop(self, queryset):
        shop_id = self.request.GET.get("shop")
        if shop_id is not None:
            return queryset.filter(shop=shop_id)
        else:
            return queryset

    def _filter_by_status(self, queryset):
        status = self.request.GET.get("status")
        if status is not None:
            return queryset.filter(status=status)
        else:
            return queryset

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                data = request.data
                appointment_slots = data.pop("appointment_slots")
                appointment_serializer = self.get_serializer_class()(data=data)
                if appointment_serializer.is_valid(raise_exception=True):
                    appointment = appointment_serializer.save()
                    slots = AppointmentSlot.objects.filter(
                        pk__in=appointment_slots
                    ).order_by("start_time")

                    if slots.count() != len(appointment_slots):
                        raise ValidationError("Incorrect slots were requested.")

                    duration_sum = timedelta(minutes=0)
                    through_appointments = []
                    for slot in slots:
                        # ensure slot is available
                        if not slot.is_available:
                            raise ValidationError(f"{slot} is unavailable.")

                        if slot.shop != appointment.shop:
                            raise ValidationError(
                                f"Invalid slot for the respective shop."
                            )

                        duration_sum += slot.duration
                        through_appointments.append(
                            AppointmentSlot.appointments.through(
                                appointment_id=appointment.id,
                                appointmentslot_id=slot.id,
                            )
                        )

                    # ensure slots are sorted and not missing a slot
                    if (
                        (
                            duration_sum
                            != slots.last().end_time - slots.first().start_time
                        )
                        or (appointment.duration > duration_sum)
                        or (
                            duration_sum - appointment.duration >= timedelta(minutes=15)
                        )
                    ):
                        raise ValidationError(
                            f"Invalid duration or slots selected for the appointment."
                        )

                    AppointmentSlot.appointments.through.objects.bulk_create(
                        through_appointments
                    )
                return Response(
                    {
                        "status": True,
                        "results": "Appointment Created",
                        "data": AppointmentSerializer(appointment).data,
                    },
                    status=status.HTTP_201_CREATED,
                )
        except ValidationError as err:
            return Response(
                {"status": False, "error_description": err.message},
                status=status.HTTP_400_BAD_REQUEST,
            )


class AppointmentSlotViewSet(AccessViewSetMixin, viewsets.ModelViewSet):
    access_policy = AppointmentSlotAccessPolicy
    queryset = AppointmentSlot.objects.all()

    def get_serializer_class(self):
        if self.action in ["list"]:
            return AppointmentSlotListSerializer
        elif self.action in ["update", "partial_update"]:
            return AppointmentSlotUpdateSerializer
        return AppointmentSlotSerializer

    def get_queryset(self):
        queryset = self.access_policy.scope_queryset(self.request, self.queryset)
        queryset = self._filter_by_shop(queryset)
        queryset = self._filter_by_start_date(queryset)
        queryset = self._filter_by_end_date(queryset)
        queryset = self._filter_by_available_appointments(queryset)
        return queryset

    def _filter_by_shop(self, queryset):
        shop_id = self.request.GET.get("shop")
        if shop_id is not None:
            return queryset.filter(shop=shop_id)
        else:
            return queryset

    def _filter_by_start_date(self, queryset):
        try:
            start_date = datetime.combine(
                self.request.GET.get("start_date"), datetime.min.time()
            )
            return queryset.filter(start_time__gte=start_date)
        except:
            return queryset

    def _filter_by_end_date(self, queryset):
        try:
            end_date = datetime.combine(
                self.request.GET.get("end_date"), datetime.max.time()
            )
            return queryset.filter(end_time__lte=end_date)
        except:
            return queryset

    def _filter_by_available_appointments(self, queryset):
        try:
            available_only = json.loads(self.request.GET.get("available_only"))
            if type(available_only) is bool and available_only:
                return (slot for slot in queryset if slot.is_available)
            else:
                return queryset
        except:
            return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        duration_minutes = int(self.request.GET.get("minutes", 0))
        if duration_minutes == 0:
            serializer = AppointmentSlotSerializer(queryset, many=True)
            return Response(serializer.data)

        duration = timedelta(minutes=duration_minutes)
        query_list = []
        for slot in list(queryset):
            q_set = slot.get_current_plus_duration(duration)
            if q_set is not None and q_set.count() != 0:
                serializer = self.get_serializer_class()(q_set, many=True)
                query_list.append(serializer.data)
        return Response({"slots": query_list})


class WorkOrderViewSet(AccessViewSetMixin, viewsets.ModelViewSet):
    access_policy = WorkOrderAccessPolicy
    queryset = WorkOrder.objects.all()
    serializer_class = WorkOrderSerializer

    def get_queryset(self):
        return self.access_policy.scope_queryset(self.request, self.queryset)

    def get_serializer_class(self):
        if self.action in ["update", "partial_update"]:
            return WorkOrderUpdateSerializer
        elif self.action in ["create"]:
            return WorkOrderCreateSerializer
        return WorkOrderSerializer
