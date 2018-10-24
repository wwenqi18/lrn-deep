from django.urls import path

from . import views


app_name = 'canvas'
urlpatterns = [
    path('', views.index, name='index'),
    path('workspace/', views.workspace, name='workspace'),
]
