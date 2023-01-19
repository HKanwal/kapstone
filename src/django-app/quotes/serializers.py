from rest_framework import serializers

from .models import Quote, QuoteRequest
from shops.models import Shop
from accounts.models import Customer

class QuoteSerializer(serializers.ModelSerializer):
    shop = serializers.PrimaryKeyRelatedField(queryset=Shop.objects.all())
    quote_request = serializers.PrimaryKeyRelatedField(queryset=QuoteRequest.objects.all())
    status = serializers.ChoiceField(choices=Quote.Status.choices)

    class Meta:
        model = Quote
        fields = '__all__'

class QuoteRequestSerializer(serializers.ModelSerializer):
    shop = serializers.PrimaryKeyRelatedField(many=True, queryset=Shop.objects.all())
    customer = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all())
    
    class Meta:
        model = QuoteRequest
        fields = '__all__'
