from django.shortcuts import render
from rest_framework import viewsets

from .serializers import (
    QuoteRequestSerializer,
    QuoteSerializer,
    QuoteRequestWriteSerializer,
)
from .models import Quote, QuoteRequest
from config.permissions import IsShopOwnerOrEmployee, IsOwner
from .mixins import ReadWriteSerializerMixin


class QuoteViewSet(viewsets.ModelViewSet):
    permission_classes = [IsShopOwnerOrEmployee]
    queryset = Quote.objects.all().order_by("pk")
    serializer_class = QuoteSerializer


class QuoteRequestViewSet(ReadWriteSerializerMixin, viewsets.ModelViewSet):
    permission_classes = [IsShopOwnerOrEmployee | IsOwner]
    queryset = QuoteRequest.objects.all().order_by("pk")
    read_serializer_class = QuoteRequestSerializer
    write_serializer_class = QuoteRequestWriteSerializer
