from django.contrib import admin

from .models import Quote, QuoteRequest

admin.site.register(Quote)
admin.site.register(QuoteRequest)
