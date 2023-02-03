from rest_framework import viewsets

from .serializers import (
    ShopOwnerDataSerializer,
    EmployeeDataSerializer,
    CustomerDataSerializer,
)
from .models import ShopOwnerData, EmployeeData, CustomerData


class ShopOwnerDataViewSet(viewsets.ModelViewSet):
    queryset = ShopOwnerData.objects.all()
    serializer_class = ShopOwnerDataSerializer


class EmployeeDataViewSet(viewsets.ModelViewSet):
    queryset = EmployeeData.objects.all()
    serializer_class = EmployeeDataSerializer


class CustomerDataViewSet(viewsets.ModelViewSet):
    queryset = CustomerData.objects.all()
    serializer_class = CustomerDataSerializer
