from rest_framework import serializers

from .models import ImageQuote, Notification
from quotes.models import QuoteRequest
from accounts.serializers import UserViewSerializer


class ImageQuoteSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField()
    quote_request = serializers.PrimaryKeyRelatedField(
        queryset=QuoteRequest.objects.all()
    )
    url = serializers.SerializerMethodField()

    class Meta:
        model = ImageQuote
        fields = "__all__"

    def get_url(self, obj):
        return obj.photo.url


class NotificationSerializer(serializers.ModelSerializer):
    user = UserViewSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = "__all__"
