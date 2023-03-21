import jsonfield
from django.db import models


class FavoriteTemplate(models.Model):
    _id = models.TextField(primary_key=True)
    company_id = jsonfield.JSONField(default="Company")
    template_name = jsonfield.JSONField(default="Template")
    favourited_by = models.TextField(max_length=200, default="User")


class FavoriteDocument(models.Model):
    _id = models.TextField(primary_key=True)
    document_name = jsonfield.JSONField(default="Document")
    company_id = jsonfield.JSONField(default="Company")
    favourited_by = models.TextField(max_length=200, default="User")


class FavoriteWorkflow(models.Model):
    _id = models.TextField(primary_key=True)
    company_id = jsonfield.JSONField(default="Company")
    workflows = jsonfield.JSONField(default="Workflows")
    favourited_by = models.TextField(max_length=200, default="User")
