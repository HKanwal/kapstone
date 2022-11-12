from django.urls import include, path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r"shop-owner", views.ShopOwnerDataViewSet)
router.register(r"employee", views.EmployeeDataViewSet)
router.register(r"customer", views.CustomerDataViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
