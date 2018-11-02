""" Views for canvas app """

from django.shortcuts import render

def index(request):
    """ Return index page """
    return render(request, 'canvas/index.html')

def workspace(request):
    """ Return workspace page """
    return render(request, 'canvas/workspace.html')
