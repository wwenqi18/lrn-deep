""" Views for canvas app """
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_protect
from django.shortcuts import render, redirect
from django.urls import reverse
from django.http import HttpResponse
from .models import Graph
import json

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

def test_idx(request):
    return render(request, 'canvas/test.html')

def test(request):
    if request.method == 'POST':
        status = 0
        user = request.user.username
        graph = request.POST.get('graph_name')
        data = request.body

        print('1 ' + str(user))
        print('2 ' + str(graph))
        print(b'3 ' + data)
    return HttpResponse(data, content_type='application/json')


@login_required
@csrf_protect
def save(request):
    """ Save current working graph """

    if not request.user.is_authenticated:
        return redirect('users:signup')

    user = request.user.username
    graph = request.POST.get('graph_name')
    data = request.POST.get('data')
    # request.body should be a json string
    print('1 ' + str(user))
    print('2 ' + str(graph))
    print('3 ' + data)

    Graph.objects.update_or_create(username = user,
                                   graph_name = graph,
                                   defaults = {
                                       'json_data' : data
                                   })

    return HttpResponse(data, content_type='application/json') 

    #add = Graph(username=user, graph_name=graph, json_data=data)
    #add.save()
    # or Graph.objects.create(aa='aa', bb='bb', cc='cc')

    #data = [1,2,3,4]
    #return render(request, 'index.html', {'data': data})
    #<div>{{data}}</div>

    #list = ['view', 'Json', 'JS']
    #return render(request, 'index.html', {'List': json.dumps(list),})
    #var List = {{ List|safe }};

@csrf_protect
def load_graph(request):
    # use Ajax
    if request.method == 'POST':
        status = 0
        user = request.user.username
        graph = request.POST.get('graph_name')
        
        ret = Graph.objects.filter(username=user, graph_name=graph).values_list('json_data', flat=True).first() 
        # here ret_obj will be the data or none 
        return HttpResponse(ret, content_type='application/json')

@csrf_protect
def user_graph_list(request):
    """ when user want to load graph, they need to get graph_name_list """
    # use Ajax
    if request.method == 'POST':
        status = 0
        user = request.user.username
        # SQL lookup
        graph_list = Graph.objects.filter(username=user).values_list('graph_name', flat=True)
        ret = []
        for name in graph_list:
           ret.append(name) 
        ret = json.dumps(ret)

        return HttpResponse(ret, content_type='application/json')
