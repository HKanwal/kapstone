from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action

from .serializers import ImageQuoteSerializer, NotificationSerializer
from .models import ImageQuote, Notification
from .policies import NotificationAccessPolicy


class ImageUploadQuote(viewsets.ModelViewSet):
    queryset = ImageQuote.objects.all()
    serializer_class = ImageQuoteSerializer

    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        serializer.save()


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    access_policy = NotificationAccessPolicy

    def get_queryset(self):
        queryset = self.access_policy.scope_queryset(self.request, self.queryset)
        return queryset

    def get_serializer_class(self):
        return NotificationSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.read_notification()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def count(self, request, *args, **kwargs):
        return Response({"count": self.get_queryset().count()}, status=status.HTTP_200_OK)
