from django.db import models
from django.utils.translation import gettext as _

class Image(models.Model):
    title = models.CharField(max_length=100)
    photo = models.ImageField(upload_to='user_upload_images/')
