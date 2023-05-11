from django import forms
from blogapp.models import Blogpost, Comment



class BlogpostForm(forms.ModelForm):

    class Meta():
        model=Blogpost
        fields=('title', 'text', 'author')

        widgets={
            'title':forms.TextInput(attrs={'class':'textinputclass'}),
            'text':forms.Textarea(attrs={'class':'editable medium-editor-textarea postcontent'})
        }



class CommentForm(forms.ModelForm):

    class Meta():
        model=Comment   
        fields=('author', 'text') 
        widgets={
            
            'text':forms.TextInput(attrs={'class': 'editable medium-editor-textarea',}),

        }    


