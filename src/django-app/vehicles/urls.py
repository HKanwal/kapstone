from django.urls import include, path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r"vehicles", views.VehicleViewSet)
router.register(r"parts", views.PartViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
