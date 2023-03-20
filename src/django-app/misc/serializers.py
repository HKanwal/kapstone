from rest_framework import serializers

from .models import ImageQuote
from quotes.models import QuoteRequest

class ImageQuoteSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField()
    quote_request = serializers.PrimaryKeyRelatedField(queryset=QuoteRequest.objects.all())
    url = serializers.SerializerMethodField()

    class Meta:
        model = ImageQuote
        fields = '__all__'

    def get_url(self, obj):
        return obj.photo.url
