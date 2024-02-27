import jsonfield
from django.db import models
import uuid


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

class ProcessReminder(models.Model):
    _id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True)
    process_id = models.TextField()
    step_finalizer = models.TextField()
    email = jsonfield.JSONField()
    interval = jsonfield.JSONField()
    last_reminder_datetime = jsonfield.JSONField()
    created_by = models.TextField(max_length=200)