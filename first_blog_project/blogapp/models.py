from django.db import models
from django.utils import timezone
from django.urls import reverse

# Create your models here.
class Blogpost(models.Model):
    author=models.ForeignKey('auth.User', null=True, on_delete=models.SET_NULL)
    title=models.CharField(max_length=1000)
    text=models.TextField()
    create_date=models.DateTimeField(default=timezone.now)
    published_date=models.DateTimeField(blank=True, null=True)
    

    def publish(self):
        self.published_date=timezone.now()
        self.save()

    def text_short(self):
        if len(self.text)<400:
            return self.text
        else:
            return self.text[:400]+'...'  


    def approve_comments(self):
        return self.comments.filter(approved_comment=True)

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('blogpost_detail', kwargs={'pk':self.pk}) 

class Comment(models.Model):
    blogpost=models.ForeignKey('blogapp.Blogpost', related_name='comments', on_delete=models.CASCADE)
    author=models.ForeignKey('auth.User', null=True, on_delete=models.SET_NULL)
    text=models.TextField()
    create_date=models.DateTimeField(default=timezone.now)
    approved_comment=models.BooleanField(default=False)  

    def approve(self):
        self.approved_comment=True
        self.save()

    def __str__(self):
        return self.text 

    def get_absolute_url(self):
        return reverse('blogpost_list')     
