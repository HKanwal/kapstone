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
        read_only_fields = ("id", "shop", "quote_request")


class QuoteWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quote
        fields = "__all__"
        read_only_fields = ("id", "shop")

    def validate(self, data):
        quote_request = data["quote_request"]
        data["shop"] = quote_request.shop
        return data


class QuoteRequestSerializer(serializers.ModelSerializer):
    shop = ShopOverviewSerializer()
    customer = UserViewSerializer(source="user")
    images = ImageQuoteSerializer(many=True, read_only=True)
    status = serializers.SerializerMethodField()

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
            "vehicle",
            "status",
        )
        read_only_fields = ("id", "customer", "shop")

    def get_status():
        return QuoteRequest.status


class QuoteRequestWriteSerializer(serializers.ModelSerializer):
    customer = serializers.PrimaryKeyRelatedField(
        read_only=True, default=serializers.CurrentUserDefault()
    )
    images = ImageQuoteSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(
            max_length=1000000, allow_empty_file=False, use_url=False
        ),
        write_only=True,
    )

    class Meta:
        model = QuoteRequest
        fields = (
            "id",
            "shop",
            "customer",
            "preferred_date",
            "preferred_time",
            "description",
            "images",
            "uploaded_images",
            "vehicle",
        )
        read_only_fields = ("id",)
        extra_kwargs = {"customer": {"source": "user"}}

    def create(self, validated_data):
        uploaded_images = validated_data.pop("uploaded_images")
        quote_request = QuoteRequest.objects.create(**validated_data)
        for image in uploaded_images:
            QR_image = ImageQuote.objects.create(
                quote_request=quote_request, photo=image
            )
        return quote_request
