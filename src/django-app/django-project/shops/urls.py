from django.urls import include, path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'shops', views.ShopViewSet)
router.register(r'addresses', views.AddressViewSet)

urlpatterns = [
    path('', include(router.urls)),
]