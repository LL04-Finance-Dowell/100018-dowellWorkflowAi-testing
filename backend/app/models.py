from django.db import models
import uuid


class FavoriteTemplate(models.Model):
    _id = models.TextField(primary_key=True)
    company_id = models.JSONField()
    collection_id = models.JSONField()
    template_name = models.JSONField()
    favourited_by = models.TextField(max_length=200)


class FavoriteDocument(models.Model):
    _id = models.TextField(primary_key=True)
    document_name = models.JSONField()
    company_id = models.JSONField()
    collection_id = models.JSONField()
    favourited_by = models.TextField(max_length=200)


class FavoriteWorkflow(models.Model):
    _id = models.TextField(primary_key=True)
    company_id = models.JSONField()
    workflows = models.JSONField()
    favourited_by = models.TextField(max_length=200)

class ProcessReminder(models.Model):
    _id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True)
    process_id = models.TextField()
    step_finalizer = models.TextField()
    email = models.JSONField()
    interval = models.JSONField()
    last_reminder_datetime = models.JSONField()
    created_by = models.TextField(max_length=200)