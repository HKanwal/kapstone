from rest_framework import viewsets
from rest_access_policy import AccessViewSetMixin

from .serializers import PartSerializer, VehicleSerializer, VehicleWriteSerializer
from .models import Part, Vehicle

from .policies import PartAccessPolicy, VehicleAccessPolicy


class PartViewSet(AccessViewSetMixin, viewsets.ModelViewSet):
    access_policy = PartAccessPolicy
    queryset = Part.objects.all()

    def get_queryset(self):
        return self.access_policy.scope_queryset(self.request, self.queryset)

    def get_serializer_class(self):
        return PartSerializer


class VehicleViewSet(AccessViewSetMixin, viewsets.ModelViewSet):
    access_policy = VehicleAccessPolicy
    queryset = Vehicle.objects.all()

    def get_queryset(self):
        return self.access_policy.scope_queryset(self.request, self.queryset)

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return VehicleWriteSerializer
        return VehicleSerializer
