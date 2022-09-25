from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('example-page', views.example_page),
]
