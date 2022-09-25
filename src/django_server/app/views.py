from django.shortcuts import render
from django_nextjs.render import render_nextjs_page_async
from django.http import HttpResponse

# Create your views here.

async def index(request):
    return await render_nextjs_page_async(request)

async def example_page(request):
    return await render_nextjs_page_async(request)
