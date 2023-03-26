from rest_framework import viewsets
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import APIException

import traceback
import logging

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

    @action(detail=False, methods=["get"])
    def get_customer_by_email(self, request, *args, **kwargs):
        email = request.GET.get("email", None)
        if email is None:
            raise APIException("Must provide email in URL params.")
        try:
            customer = CustomerData.objects.get(user__email=email)
            serializer = CustomerDataSerializer(customer, context={"request": request})
            return Response(serializer.data)
        except Exception as e:
            logging.error(traceback.format_exc())
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
            )


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
