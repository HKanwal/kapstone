from rest_framework import serializers

from .models import Quote, QuoteRequest
from shops.models import Shop
from shops.serializers import ShopOverviewSerializer
from accounts.serializers import UserViewSerializer
from misc.models import ImageQuote
from misc.serializers import ImageQuoteSerializer
from rest_access_policy import PermittedPkRelatedField
from shops.policies import ShopAccessPolicy
from .policies import QuoteRequestAccessPolicy


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
            "preferred_part_condition",
            "preferred_part_type",
            "preferred_email",
            "description",
            "images",
            "vehicle",
            "status",
            "batch_id",
            "created_at",
        )
        read_only_fields = ("id", "customer", "shop")

    def get_status(self, obj):
        return obj.status


class QuoteRequestBatchSerializer(serializers.ModelSerializer):
    quote_requests = serializers.SerializerMethodField("get_quote_requests")

    class Meta:
        model = QuoteRequest
        fields = ["batch_id", "quote_requests"]

    def get_quote_requests(self, obj):
        quote_requests = QuoteRequest.objects.filter(batch_id=obj.batch_id)
        quote_request_serializer = QuoteRequestSerializer(quote_requests, many=True)
        return quote_request_serializer.data


class QuoteRequestBatchRetrieveSerializer(serializers.ModelSerializer):
    customer = UserViewSerializer(source="user")
    images = ImageQuoteSerializer(many=True, read_only=True)
    status = serializers.SerializerMethodField()

    class Meta:
        model = QuoteRequest
        fields = (
            "customer",
            "preferred_date",
            "preferred_time",
            "preferred_phone_number",
            "preferred_part_condition",
            "preferred_part_type",
            "preferred_email",
            "description",
            "images",
            "vehicle",
            "status",
            "batch_id",
            "created_at",
        )
        read_only_fields = ("customer",)

    def get_status(self, obj):
        return obj.status


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
        allow_null=True,
        default=[],
    )
    shop = PermittedPkRelatedField(
        access_policy=ShopAccessPolicy, queryset=Shop.objects.all()
    )

    class Meta:
        model = QuoteRequest
        fields = (
            "id",
            "shop",
            "customer",
            "preferred_date",
            "preferred_time",
            "preferred_part_condition",
            "preferred_part_type",
            "description",
            "images",
            "uploaded_images",
            "vehicle",
            "batch_id",
        )
        read_only_fields = ("id",)
        extra_kwargs = {
            "customer": {"source": "user"},
            "uploaded_images": {"required": False},
        }

    def create(self, validated_data):
        uploaded_images = validated_data.pop("uploaded_images", None)
        quote_request = QuoteRequest.objects.create(**validated_data)
        if uploaded_images is not None:
            for image in uploaded_images:
                QR_image = ImageQuote.objects.create(
                    quote_request=quote_request, photo=image
                )
        return quote_request


class QuoteSerializer(serializers.ModelSerializer):
    shop = ShopOverviewSerializer()
    quote_request = QuoteRequestSerializer()
    status = serializers.ChoiceField(choices=Quote.Status.choices)
    status_display = serializers.SerializerMethodField()

    class Meta:
        model = Quote
        fields = "__all__"
        read_only_fields = ("id", "shop", "quote_request")

    def get_status_display(self, obj):
        return obj.get_status_display()


class QuoteWriteSerializer(serializers.ModelSerializer):
    quote_request = PermittedPkRelatedField(
        access_policy=QuoteRequestAccessPolicy, queryset=QuoteRequest.objects.all()
    )

    class Meta:
        model = Quote
        fields = "__all__"
        read_only_fields = ("id", "shop")

    def validate(self, data):
        if not self.partial:
            quote_request = data["quote_request"]
            data["shop"] = quote_request.shop
        return data
