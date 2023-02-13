from django.urls import include, path
from .views import ImageUploadQuote
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'quote-images', views.ImageUploadQuote)


urlpatterns = [
    path('', include(router.urls))
]