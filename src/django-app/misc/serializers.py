from rest_framework import serializers

from .models import Image

class ImageSerializer(serializers.ModelSerializer):
    title = serializers.CharField(max_length=100)
    photo = serializers.ImageField()

    class Meta:
        model = Image
        fields = '__all__'
