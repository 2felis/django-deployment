from django.forms import ModelForm
from signup_app.models import SiteUser


class SignUpForm(ModelForm):
    class Meta:
        model=SiteUser
        fields='__all__'