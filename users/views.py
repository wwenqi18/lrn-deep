from django.shortcuts import render, redirect
from django.urls import reverse_lazy, reverse
from django.views import generic
from django.http import HttpResponse
from django.contrib import auth

from .forms import CustomUserCreationForm

# Create your views here.

#class SignUp(generic.CreateView):
def SignUp(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('users:login')
        else:
            return render(request, 'users/signup.html', {'error': 'Sign up error! Please check your input.'}) 
    else:
        form = CustomUserCreationForm()
    return render(request, 'users/signup.html', {'form': form})


def LogIn(request):
    if request.method == 'POST':
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        user = auth.authenticate(username=username, password=password)
        if user is not None:
            auth.login(request, user)
            request.session['uesr'] = username  # record the session info on server
            return redirect('canvas:workspace')
        else:
            return render(request, 'users/login.html', {'error': 'username or password error!'})
    else:
        return render(request, 'users/login.html')
