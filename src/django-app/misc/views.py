from django.shortcuts import render
from rest_framework import viewsets

from .serializers import ImageSerializer
from .models import Image


class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all().order_by('title')
    serializer_class = ImageSerializer