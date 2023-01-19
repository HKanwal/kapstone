from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import viewsets

from .serializers import ImageQuoteSerializer
from .models import ImageQuote


class ImageUploadQuote(viewsets.ModelViewSet):
    queryset = ImageQuote.objects.all().order_by('title')
    serializer_class = ImageQuoteSerializer

    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        serializer.save()