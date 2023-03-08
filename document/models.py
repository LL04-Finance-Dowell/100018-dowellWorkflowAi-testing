import jsonfield
from django.db import models


class FavoriteTemplte(models.Model):
    _id = models.TextField(unique=True, primary_key=True)
    company_id = models.TextField()
    content = models.TextField()
    created_by = models.TextField()
    created_on = models.TextField()
    data_type = models.TextField()
    eventId = models.TextField()
    page = models.TextField()
    template_name = models.TextField()


class FavoriteDocument(models.Model):
    _id = models.TextField(unique=True, primary_key=True)
    company_id = models.TextField()
    created_by = models.TextField()
    eventId = models.TextField()
    page = models.TextField()

    auth_user_list = models.TextField()
    content = models.TextField()
    created_on = models.TextField()
    document_name = models.TextField()
    reject_message = models.TextField()
    rejected_by = models.TextField()
    state = models.TextField()
    update_time = models.TextField()
    workflow_id = models.TextField()
    workflow_process = models.TextField()


class FavoriteWorkflow(models.Model):
    # data = models.TextField()
    _id = models.TextField(unique=True, primary_key=True)
    company_id = models.TextField()
    created_by = models.TextField()
    eventId = models.TextField()
    workflows = models.TextField()
