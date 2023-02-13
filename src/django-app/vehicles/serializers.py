from rest_framework import serializers

from .models import Part, Vehicle


class PartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Part
        fields = "__all__"
        read_only_fields = ("id",)


class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = "__all__"
        read_only_fields = ("id",)


class VehicleWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = ("manufacturer", "model", "color", "year", "vin", "customer")
        read_only_fields = ("id", "customer")

    def create(self, validated_data):
        validated_data["customer"] = self.context["request"].user
        return Vehicle.objects.create(**validated_data)
