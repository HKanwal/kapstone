import json
import uuid
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
    QuoteRequestBatchSerializer,
    QuoteRequestBatchRetrieveSerializer,
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
from misc.models import ImageQuote


class QuoteViewSet(AccessViewSetMixin, viewsets.ModelViewSet):
    access_policy = QuoteAccessPolicy
    queryset = Quote.objects.all().order_by("pk")

    def get_queryset(self):
        queryset = self.access_policy.scope_queryset(self.request, self.queryset)
        queryset = self._filter_by_quote_request_batch_id(queryset)
        return queryset

    def _filter_by_quote_request_batch_id(self, queryset):
        batch_id = self.request.GET.get("batch_id", None)
        if batch_id is not None:
            return queryset.filter(quote_request__batch_id=batch_id)
        else:
            return queryset

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return QuoteWriteSerializer
        return QuoteSerializer

    def partial_update(self, request, *args, **kwargs):
        with transaction.atomic():
            if "status" in request.data and request.data["status"] == "accepted":
                quote = self.get_object()
                if quote.status != "accepted":  # current status
                    batch_quotes = Quote.objects.filter(
                        quote_request__batch_id=quote.quote_request.batch_id
                    ).exclude(pk=quote.pk)
                    for batch_quote in batch_quotes:
                        batch_quote.status = (
                            "rejected"  # reject other quotes in the batch
                        )
                    Quote.objects.bulk_update(batch_quotes, ["status"])
            response = super().partial_update(request, *args, **kwargs)
        return response


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
    queryset = QuoteRequest.objects.all().order_by("-created_at")

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
                uploaded_images = request.FILES.getlist("uploaded_images", None)

                quote_request = {}
                for key, value in request.data.items():
                    if key != "uploaded_images":
                        quote_request[key] = json.loads(value)

                vehicle_vin = quote_request.pop("vehicle_vin", None)
                vehicle_make = quote_request.pop("vehicle_make", None)
                vehicle_model = quote_request.pop("vehicle_model", None)
                vehicle_year = quote_request.pop("vehicle_year", None)

                vehicle, created = Vehicle.objects.get_or_create(
                    vin=vehicle_vin,
                    defaults={
                        "manufacturer": vehicle_make,
                        "model": vehicle_model,
                        "year": vehicle_year,
                        "customer": request.user,
                    },
                )
                quote_request["vehicle"] = vehicle.pk

                shop_ids = quote_request.pop("shops", [])
                batch_id = uuid.uuid4()
                quote_requests = []
                for shop_id in shop_ids:
                    qr = deepcopy(quote_request)
                    qr["shop"] = shop_id
                    qr["batch_id"] = batch_id
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

                created_quote_requests = QuoteRequest.objects.bulk_create(
                    quote_requests
                )

                if uploaded_images is not None and len(uploaded_images) > 0:
                    created_quote_request = created_quote_requests[0]
                    for image in uploaded_images:
                        ImageQuote.objects.create(
                            quote_request_batch_id=created_quote_request.batch_id,
                            photo=image,
                        )

                return Response(
                    {
                        "message": f"{len(quote_requests)} quote requests created.",
                        "data": QuoteRequestSerializer(
                            created_quote_requests, many=True
                        ).data,
                    },
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

    @action(detail=False, methods=["patch"])
    def bulk_patch(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                data = request.data
                batch_id = data.pop("batch_id", None)
                if batch_id is None:
                    return Response(
                        {
                            "message": "Batch ID must be provided in thew request data.",
                            "status": False,
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                quote_requests = list(self.get_queryset().filter(batch_id=batch_id))

                for quote_request in quote_requests:
                    for key, value in data.items():
                        setattr(quote_request, key, value)

                QuoteRequest.objects.bulk_update(quote_requests, [key for key in data])

                return Response(
                    {
                        "message": f"{len(quote_requests)} quote requests updated.",
                        "status": "OK",
                    },
                    status=status.HTTP_200_OK,
                )
        except Exception as err:
            logging.error(traceback.format_exc())
            return Response(
                {
                    "status": False,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    @action(detail=False, methods=["get"])
    def bulk_list(self, request, *args, **kwargs):
        unique_quote_requests = (
            self.get_queryset()
            .order_by("batch_id")
            .distinct("batch_id")
            .only("batch_id")
        )
        quote_requests = (
            self.get_queryset().filter(pk__in=unique_quote_requests)
        ).order_by("-created_at")
        serializer = QuoteRequestBatchSerializer(quote_requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"])
    def batch_retrieve(self, request, *args, **kwargs):
        if request.query_params.get("batch_id") is None:
            return Response(
                {
                    "message": "Batch ID must be provided as query parameter.",
                    "status": False,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        quote_request = (
            self.get_queryset()
            .filter(batch_id=request.query_params["batch_id"])
            .order_by("batch_id")
            .distinct("batch_id")
            .only("batch_id")
        ).first()
        serializer = QuoteRequestBatchRetrieveSerializer(quote_request)
        return Response(serializer.data, status=status.HTTP_200_OK)
