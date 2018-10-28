from django.urls import path
# to implement the login and logout
from django.contrib.auth import login, logout
from . import views

app_name = 'users'
urlpatterns = [
    #path('signup/', views.SignUp.as_view(), name='signup'),
    path('signup/', views.SignUp, name='signup'),
    path('login/', views.LogIn, name='login'),
]
