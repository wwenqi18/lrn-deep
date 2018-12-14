""" Urls for canvas app """

from django.urls import path

from . import views


app_name = 'canvas'
urlpatterns = [
    path('', views.index, name='index'),
    path('workspace/', views.workspace, name='workspace'),
    path('test/', views.test, name='test_back'),
    path('testidx/', views.test_idx, name='test_idx'),
]
