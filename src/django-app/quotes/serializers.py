from rest_framework import serializers

from .models import Quote, QuoteRequest
from shops.models import Shop
from shops.serializers import ShopOverviewSerializer
from accounts.models import Customer
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
        read_only_fields = ["customer"]
