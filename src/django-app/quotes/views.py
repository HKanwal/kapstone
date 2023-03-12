from django.shortcuts import render
from django.db import transaction
from django.core.exceptions import ValidationError
from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
from rest_access_policy import AccessViewSetMixin
from rest_framework.decorators import action
from copy import deepcopy
import traceback
import logging

from .serializers import (
    QuoteRequestSerializer,
    QuoteSerializer,
    QuoteCommentSerializer,
    QuoteCommentListSerializer,
    QuoteCommentWriteSerializer,
    QuoteCommentUpdateSerializer,
    QuoteRequestWriteSerializer,
    QuoteWriteSerializer,
)
from .models import Quote, QuoteComment, QuoteRequest
from .policies import (
    QuoteAccessPolicy,
    QuoteCommentAccessPolicy,
    QuoteRequestAccessPolicy,
)
from vehicles.models import Vehicle


class QuoteViewSet(AccessViewSetMixin, viewsets.ModelViewSet):
    access_policy = QuoteAccessPolicy
    queryset = Quote.objects.all().order_by("pk")

    def get_queryset(self):
        return self.access_policy.scope_queryset(self.request, self.queryset)

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return QuoteWriteSerializer
        return QuoteSerializer


class QuoteCommentViewSet(AccessViewSetMixin, viewsets.ModelViewSet):
    access_policy = QuoteCommentAccessPolicy
    queryset = QuoteComment.objects.all().order_by("created_at")

    def get_queryset(self):
        queryset = self.access_policy.scope_queryset(self.request, self.queryset)
        queryset = self._filter_by_quote(queryset)
        return queryset

    def _filter_by_quote(self, queryset):
        quote_id = self.request.GET.get("quote")
        if quote_id is not None:
            return queryset.filter(quote=quote_id)
        else:
            return queryset

    def get_serializer_class(self):
        if self.action in ["create"]:
            return QuoteCommentWriteSerializer
        elif self.action in ["update", "partial_update"]:
            return QuoteCommentUpdateSerializer
        elif self.action in ["list"]:
            return QuoteCommentListSerializer
        return QuoteCommentSerializer


class QuoteRequestViewSet(AccessViewSetMixin, viewsets.ModelViewSet):
    access_policy = QuoteRequestAccessPolicy
    queryset = QuoteRequest.objects.all().order_by("pk")

    def get_queryset(self):
        return self.access_policy.scope_queryset(self.request, self.queryset)

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return QuoteRequestWriteSerializer
        return QuoteRequestSerializer

    @action(detail=False, methods=["post"])
    def bulk_create(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                quote_request = request.data

                vehicle_vin = quote_request.pop("vehicle_vin", None)
                vehicle_make = quote_request.pop("vehicle_make", None)
                vehicle_model = quote_request.pop("vehicle_model", None)
                vehicle_year = quote_request.pop("vehicle_year", None)
                vehicle, created = Vehicle.objects.get_or_create(
                    vin=vehicle_vin,
                    manufacturer=vehicle_make,
                    model=vehicle_model,
                    year=vehicle_year,
                    customer=request.user,
                )
                quote_request["vehicle"] = vehicle.pk

                shop_ids = quote_request.pop("shops", [])
                quote_requests = []
                for shop_id in shop_ids:
                    qr = deepcopy(quote_request)
                    qr["shop"] = shop_id
                    quote_requests.append(qr)

                serializer = QuoteRequestWriteSerializer(
                    data=quote_requests, many=True, context={"request": request}
                )
                serializer.is_valid(raise_exception=True)

                validated_data = serializer.validated_data
                for data in validated_data:
                    del data["uploaded_images"]
                quote_requests = [
                    QuoteRequest(**data, user=request.user) for data in validated_data
                ]

                QuoteRequest.objects.bulk_create(quote_requests)
                return Response(
                    {"message": f"{len(quote_requests)} quote requests created."},
                    status=status.HTTP_201_CREATED,
                )
        except Exception as err:
            logging.error(traceback.format_exc())
            return Response(
                {
                    "status": False,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
