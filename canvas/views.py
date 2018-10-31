""" Views for canvas app """

from django.shortcuts import render

def index(request):
    return render(request, 'canvas/index.html')

def workspace(request):
    return render(request, 'canvas/workspace.html')
