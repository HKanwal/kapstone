from rest_framework import serializers

from .models import Quote, QuoteRequest, Status
from shops.models import Shop

class QuoteSerializer(serializers.ModelSerializer):
    shop = serializers.PrimaryKeyRelatedField(queryset=Shop.objects.all())
    quote_request = serializers.PrimaryKeyRelatedField(queryset=QuoteRequest.objects.all())
    status = serializers.ChoiceField(choices=Status.choices)

    class Meta:
        model = Quote
        fields = '__all__'

class QuoteRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuoteRequest
        fields = '__all__'
