""" Views for canvas app """
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.urls import  reverse

def index(request):
    """ Return index page """
    return render(request, 'canvas/index.html')


@login_required
def workspace(request):
    """ Return workspace page """
    if request.user.is_authenticated:
        return render(request, 'canvas/workspace.html')
    else:
        return redirect('users:signup')
