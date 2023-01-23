from rest_framework import serializers

from .models import ImageQuote
from quotes.models import QuoteRequest

class ImageQuoteSerializer(serializers.ModelSerializer):
    title = serializers.CharField(max_length=100)
    photo = serializers.ImageField()
    quote_request = serializers.PrimaryKeyRelatedField(queryset=QuoteRequest.objects.all())

    class Meta:
        model = ImageQuote
        fields = '__all__'
