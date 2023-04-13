from django.shortcuts import render
from django.http import HttpResponseRedirect, FileResponse
from django.urls import reverse, path
from pathlib import Path

# Create your views here.

def index(request):
    dict={'info_title': 'Калькулятор парентерального питания',
          'info_description': 'Внимание! В вашем браузере отключен JavaScript, в связи с этим калькулятор не может работать. Включите JavaScript в настройках вашего браузера.'}
    return render(request, 'app1/index.html', dict)


def download(request):
    dict={'info_title': 'Загрузка калькулятора', 
          'info_description': 'Загрузите калькулятор парентерального питания и пользуйтесь им оффлайн.',}
    if request.method=='POST':
        file_path = Path(__file__).resolve().parent.parent / 'static' / 'app1' / 'parenteral_calculator_v0.25.html'
        return FileResponse(open(file_path, 'rb'), as_attachment=True)
    else: 
        return render (request, 'app1/download.html', dict)
