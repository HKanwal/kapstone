from django.urls import include, path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'shops', views.ShopViewSet)
router.register(r'addresses', views.AddressViewSet)
router.register(r'invitations', views.InvitationViewSet)
router.register(r'services', views.ServiceViewSet)
router.register(r'appointment-slots', views.AppointmentSlotViewSet)
router.register(r'appointments', views.AppointmentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]