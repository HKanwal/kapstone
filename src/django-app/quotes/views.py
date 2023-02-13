from django.shortcuts import render
from rest_framework import viewsets
from rest_access_policy import AccessViewSetMixin

from .serializers import (
    QuoteRequestSerializer,
    QuoteSerializer,
    QuoteRequestWriteSerializer,
    QuoteWriteSerializer,
)
from .models import Quote, QuoteRequest
from .policies import QuoteAccessPolicy, QuoteRequestAccessPolicy


class QuoteViewSet(AccessViewSetMixin, viewsets.ModelViewSet):
    access_policy = QuoteAccessPolicy
    queryset = Quote.objects.all().order_by("pk")

    def get_queryset(self):
        return self.access_policy.scope_queryset(self.request, self.queryset)

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return QuoteWriteSerializer
        return QuoteSerializer


class QuoteRequestViewSet(AccessViewSetMixin, viewsets.ModelViewSet):
    access_policy = QuoteRequestAccessPolicy
    queryset = QuoteRequest.objects.all().order_by("pk")

    def get_queryset(self):
        return self.access_policy.scope_queryset(self.request, self.queryset)

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return QuoteRequestWriteSerializer
        return QuoteRequestSerializer
