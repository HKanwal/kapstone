from django.shortcuts import render
from rest_framework import viewsets

from .serializers import QuoteRequestSerializer, QuoteSerializer
from .models import Quote, QuoteRequest


class QuoteViewSet(viewsets.ModelViewSet):
    queryset = Quote.objects.all().order_by('pk')
    serializer_class = QuoteSerializer

class QuoteRequestViewSet(viewsets.ModelViewSet):
    queryset = QuoteRequest.objects.all().order_by('pk')
    serializer_class = QuoteRequestSerializer
