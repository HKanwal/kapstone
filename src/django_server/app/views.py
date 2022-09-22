from django.shortcuts import render
from django_nextjs.render import render_nextjs_page_sync

# Create your views here.

def index(request):
    return render_nextjs_page_sync(request)
