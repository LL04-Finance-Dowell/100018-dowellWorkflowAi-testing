import json

import jsonfield
from django.db import models



class FavoriteTemplate(models.Model):
    _id = models.TextField(primary_key=True)
    company_id = jsonfield.JSONField()
    template_name = jsonfield.JSONField()
    favourited_by = models.TextField(max_length=200)


class FavoriteDocument(models.Model):
    _id = models.TextField(primary_key=True)
    document_name = jsonfield.JSONField()
    company_id = jsonfield.JSONField()
    favourited_by = models.TextField(max_length=200)


class FavoriteWorkflow(models.Model):
    _id = models.TextField(primary_key=True)
    company_id = jsonfield.JSONField()
    workflows = jsonfield.JSONField()
    favourited_by = models.TextField(max_length=200)


