from django.urls import path, re_path
from blogapp import views


urlpatterns=[
    path('about/', views.AboutView.as_view(), name='about'),
    path('', views.BlogpostListView.as_view(), name='blogpost_list'),
    re_path(r'blogpost/(?P<pk>\d+)$', views.BlogpostDetailView.as_view(), name='blogpost_detail'),
    path('blogpost/new/', views.CreateBlogpostView.as_view(), name='blogpost_new'),
    re_path(r'blogpost/(?P<pk>\d+)/edit/$', views.UpdateBlogpostView.as_view(), name='blogpost_edit'),
    re_path(r'blogpost/(?P<pk>\d+)/remove/$', views.DeleteBlogpostView.as_view(), name='blogpost_remove'),
    path('drafts/', views.DraftListView.as_view(), name='draft_list'),
    re_path(r'blogpost/(?P<pk>\d+)/comment/$', views.add_comment_to_blogpost, name='add_comment_to_post'),
    re_path(r'comment/(?P<pk>\d+)/approve/$', views.comment_aprove, name='comment_approve'),
    re_path(r'comment/(?P<pk>\d+)/delete/$', views.comment_remove, name='comment_remove'),
    re_path(r'blogpost/(?P<pk>\d+)/publish/$',views.blogpost_publish, name='blogpost_publish'),
    ]