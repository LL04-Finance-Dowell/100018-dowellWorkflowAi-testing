import jsonfield
from django.db import models

class FavoriteData(models.Model):
    data = jsonfield.JSONField()
    # data_type= models.TextField(max_length=50,default=None)
