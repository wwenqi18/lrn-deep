""" Views for canvas app """

from django.shortcuts import render, redirect
from django.urls import  reverse

def index(request):
    return render(request, 'canvas/index.html')

def workspace(request):
    if request.user.is_authenticated:
        return render(request, 'canvas/workspace.html')
    else:
        return redirect('users:signup')
