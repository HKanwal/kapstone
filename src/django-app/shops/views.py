from django.shortcuts import render
from rest_framework import viewsets

from .serializers import ShopSerializer, AddressSerializer, InvitationSerializer
from .models import Shop, Address, Invitation


class ShopViewSet(viewsets.ModelViewSet):
    queryset = Shop.objects.all().order_by('name')
    serializer_class = ShopSerializer

class AddressViewSet(viewsets.ModelViewSet):
    queryset = Address.objects.all().order_by('street')
    serializer_class = AddressSerializer

class InvitationViewSet(viewsets.ModelViewSet):
    queryset = Invitation.objects.all()
    serializer_class = InvitationSerializer
