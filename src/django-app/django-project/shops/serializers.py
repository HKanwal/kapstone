from rest_framework import serializers

from .models import Shop, Address

class ShopSerializer(serializers.ModelSerializer):
    shop_owner = serializers.PrimaryKeyRelatedField(queryset=Shop.objects.all())
    address =  serializers.StringRelatedField()

    class Meta:
        model = Shop
        fields = '__all__'

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'