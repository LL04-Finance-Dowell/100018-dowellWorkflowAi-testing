import jsonfield
from django.db import models


class FavoriteTemplate(models.Model):
    _id = models.TextField(primary_key=True)
    company_id = jsonfield.JSONField()
    collection_id = jsonfield.JSONField()
    template_name = jsonfield.JSONField()
    favourited_by = models.TextField(max_length=200)


class FavoriteDocument(models.Model):
    _id = models.TextField(primary_key=True)
    document_name = jsonfield.JSONField()
    company_id = jsonfield.JSONField()
    collection_id = jsonfield.JSONField()
    favourited_by = models.TextField(max_length=200)


class FavoriteWorkflow(models.Model):
    _id = models.TextField(primary_key=True)
    company_id = jsonfield.JSONField()
    workflows = jsonfield.JSONField()
    favourited_by = models.TextField(max_length=200)

class ProcessReminders(models.Model):
    _id = models.TextField(primary_key=True)
    process_email = models.EmailField(),
    interval = models.IntegerField(),
    process_creation_date =models.TextField(max_length=100)
    process_created_by = models.TextField(max_length=50)