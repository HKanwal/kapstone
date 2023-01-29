from rest_framework import serializers

from .models import Quote, QuoteRequest
from shops.models import Shop
from shops.serializers import ShopOverviewSerializer
from accounts.serializers import UserViewSerializer
from misc.models import ImageQuote
from misc.serializers import ImageQuoteSerializer


class QuoteSerializer(serializers.ModelSerializer):
    shop = serializers.PrimaryKeyRelatedField(queryset=Shop.objects.all())
    quote_request = serializers.PrimaryKeyRelatedField(
        queryset=QuoteRequest.objects.all()
    )
    status = serializers.ChoiceField(choices=Quote.Status.choices)

    class Meta:
        model = Quote
        fields = "__all__"


class QuoteRequestSerializer(serializers.ModelSerializer):
    shop = ShopOverviewSerializer()
    customer = UserViewSerializer(source="user")
    images = ImageQuoteSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child = serializers.ImageField(max_length = 1000000, allow_empty_file = False, use_url = False),
        write_only=True)

    class Meta:
        model = QuoteRequest
        fields = (
            "id",
            "shop",
            "customer",
            "preferred_date",
            "preferred_time",
            "preferred_phone_number",
            "preferred_email",
            "description",
            "images",
            "uploaded_images"
        )
        read_only_fields = ["customer"]
    
    def create(self, validated_data):
        uploaded_images = validated_data.pop("uploaded_images")
        quote_request = QuoteRequest.objects.create(**validated_data)
        for image in uploaded_images:
            QR_image = ImageQuote.objects.create(quote_request=quote_request, image=image)
        return quote_request
