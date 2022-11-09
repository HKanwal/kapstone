from rest_framework import serializers

from .models import Quote, QuoteRequest
from shops.models import Shop

new_quote = 'NEW_QUOTE'
accepted = 'ACCEPTED'
in_progress = 'IN_PROGRESS'
done = 'DONE'
rework = 'REWORK'
status_choices = [
    (new_quote, 'New Quote'),
    (accepted, 'Accepted'),
    (in_progress, 'In Progress'),
    (done, 'Done'),
    (rework, 'Rework')
]

class QuoteSerializer(serializers.ModelSerializer):
    shop = serializers.PrimaryKeyRelatedField(queryset=Shop.objects.all())
    quote_request = serializers.PrimaryKeyRelatedField(queryset=QuoteRequest.objects.all())
    status = serializers.ChoiceField(choices=status_choices)

    class Meta:
        model = Quote
        fields = '__all__'

class QuoteRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuoteRequest
        fields = '__all__'
