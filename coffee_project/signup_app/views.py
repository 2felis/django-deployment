from django.shortcuts import render
from datetime import date
from . import forms
from signup_app.models import SiteUser

# Create your views here.

def index(request):

    def dow_func():
        d=date.today()
        weekday_dict={1: 'Monday', 2:'Tuesday', 3:'Wednesday', 4:'Thursday', 5:'Friday', 6:'Saturday', 7:'Sunday'}
        return weekday_dict [d.isoweekday()]
    dict={'dow': dow_func()}
    return render(request, 'signup_app/index.html', context=dict)


def sign_up_view(request):
    form=forms.SignUpForm()
    dict={'form':form,}

    if request.method=='POST':
        form=forms.SignUpForm(request.POST)
        if form.is_valid():
            new_user=SiteUser(first_name=form.cleaned_data['first_name'], last_name=form.cleaned_data['last_name'], email=form.cleaned_data['email'])
            new_user.save()
            dict['new_user_name']=new_user.__str__()
    return render(request, 'signup_app/signup.html', context=dict)        
