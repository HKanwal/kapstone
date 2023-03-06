from rest_framework import viewsets
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import (
    ShopOwnerDataSerializer,
    EmployeeDataSerializer,
    CustomerDataSerializer,
    CustomTokenObtainPairSerializer,
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


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
