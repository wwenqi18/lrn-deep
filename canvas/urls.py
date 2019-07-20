""" Urls for canvas app """

from django.urls import path

from . import views


app_name = 'canvas'
urlpatterns = [
    path('', views.index, name='index'),
    path('workspace/', views.workspace, name='workspace'),
    path('workspace/save/', views.save, name='save'),
    path('workspace/load/', views.load_graph, name='load'),
    path('workspace/graph_list/', views.user_graph_list, name='graph_list'),
    path('test/', views.test, name='test_back'),
    path('testidx/', views.test_idx, name='test_idx'),
]
