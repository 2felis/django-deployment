from django.shortcuts import render, get_object_or_404, redirect
from django.views.generic import (TemplateView, ListView, DetailView, CreateView, UpdateView, DeleteView, )
from blogapp.models import Blogpost, Comment
from blogapp.forms import BlogpostForm, CommentForm
from django.utils import timezone
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.decorators import login_required
from django.urls import reverse_lazy

# Create your views here.

class AboutView(TemplateView):
    template_name='about.html'

class BlogpostListView(ListView):
    model=Blogpost
    def get_queryset(self):
        return Blogpost.objects.filter(published_date__lte=timezone.now()).order_by('-published_date')    
    
class BlogpostDetailView(DetailView):
    model=Blogpost  

class CreateBlogpostView(LoginRequiredMixin,CreateView):
    login_url='/login/'
    redirect_field_name='blogapp/blogpost_detail.html'
    form_class=BlogpostForm
    model=Blogpost

class UpdateBlogpostView(LoginRequiredMixin, UpdateView):
    login_url='/login/'
    redirect_field_name='blogapp/blogpost_detail.html'
    form_class=BlogpostForm
    model=Blogpost

class DeleteBlogpostView(LoginRequiredMixin, DeleteView):
    model=Blogpost
    success_url=reverse_lazy('blogpost_list')    


class DraftListView(LoginRequiredMixin, ListView):
    template_name="blogapp/post_draft_list.html"
    login_url='/login/'    
    redirect_field_name='blogapp/blogpost_list.html'
    model=Blogpost
    def get_queryset(self):
        return Blogpost.objects.filter(published_date__isnull=True).order_by('create_date')
    

###
###    

@login_required
def add_comment_to_blogpost(request, pk):
    blogpost=get_object_or_404(Blogpost, pk=pk)
    if request.method=='POST':
        form=CommentForm(request.POST)
        if form.is_valid():
            comment=form.save(commit=False)
            comment.blogpost=blogpost
            comment.save()
            return redirect('blogpost_detail', pk=blogpost.pk)
    else:
        form=CommentForm()
    return render(request, 'blogapp/comment_form.html', {'form':form})     

@login_required
def comment_aprove(request, pk):
    comment=get_object_or_404(Comment, pk=pk)
    comment.approve()
    return redirect('blogpost_detail', pk=comment.blogpost.pk)


@login_required
def comment_remove(request, pk):
    comment=get_object_or_404(Comment, pk=pk)
    blogpost_pk=comment.blogpost.pk
    comment.delete()
    return redirect('blogpost_detail', pk=blogpost_pk)


@login_required
def blogpost_publish(request, pk):
    blogpost=get_object_or_404(Blogpost, pk=pk)
    blogpost.publish()
    return redirect('blogpost_detail', pk=pk)