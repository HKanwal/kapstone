from rest_framework import serializers

from .models import Quote, QuoteComment, QuoteRequest
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
            "preferred_email",
            "description",
            "images",
            "vehicle",
            "status",
            "created_at",
        )
        read_only_fields = ("id", "customer", "shop")

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
            "description",
            "images",
            "uploaded_images",
            "vehicle",
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


class QuoteCommentListSerializer(serializers.ModelSerializer):
    has_edit_permission = serializers.SerializerMethodField()
    user = UserViewSerializer()

    class Meta:
        model = QuoteComment
        fields = "__all__"
        read_only_fields = ("id", "user", "quote")

    def get_has_edit_permission(self, obj):
        return obj.user == self.context["request"].user


class QuoteCommentSerializer(serializers.ModelSerializer):
    has_edit_permission = serializers.SerializerMethodField()
    quote = QuoteSerializer()
    user = UserViewSerializer()

    class Meta:
        model = QuoteComment
        fields = "__all__"
        read_only_fields = ("id", "user", "quote")

    def get_has_edit_permission(self, obj):
        return obj.user == self.context["request"].user


class QuoteCommentWriteSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = QuoteComment
        fields = "__all__"
        read_only_fields = ("id", "user")


class QuoteCommentUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuoteComment
        fields = "__all__"
        read_only_fields = ("id", "user", "quote")
