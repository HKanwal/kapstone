from rest_framework import serializers

from .models import Quote, QuoteRequest
from shops.models import Shop
from shops.serializers import ShopOverviewSerializer
from accounts.serializers import UserViewSerializer


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

    class Meta:
        model = QuoteRequest
        fields = (
            "id",
            "shop",
            "customer",
            "preferred_date",
            "preferred_time",
            "description",
        )
        read_only_fields = ("id", "customer", "shop")


class QuoteRequestWriteSerializer(serializers.ModelSerializer):
    customer = serializers.PrimaryKeyRelatedField(
        read_only=True, default=serializers.CurrentUserDefault()
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
        )
        read_only_fields = ("id",)
        extra_kwargs = {"customer": {"source": "user"}}
