from django.contrib import admin
from blogapp.models import Blogpost, Comment

# Register your models here.
admin.site.register(Blogpost)
admin.site.register(Comment)