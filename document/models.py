import jsonfield
from django.db import models


class FavoriteTemplate(models.Model):
    _id = models.TextField(primary_key=True)
    company_id = jsonfield.JSONField(null=True)
    content = jsonfield.JSONField(null=True)
    created_by = jsonfield.JSONField(null=True)
    created_on = jsonfield.JSONField(null=True)
    data_type = jsonfield.JSONField(null=True)
    eventId = jsonfield.JSONField(null=True)
    page = jsonfield.JSONField(null=True)
    template_name = jsonfield.JSONField(null=True)


class FavoriteDocument(models.Model):
    _id = models.TextField(primary_key=True)
    company_id = jsonfield.JSONField(null=True)
    created_by = jsonfield.JSONField(null=True)
    eventId = jsonfield.JSONField(null=True)
    page = jsonfield.JSONField(null=True)
    auth_user_list = jsonfield.JSONField(null=True)
    content = jsonfield.JSONField(null=True)
    created_on = jsonfield.JSONField(null=True)
    document_name = jsonfield.JSONField(null=True)
    reject_message = jsonfield.JSONField(null=True)
    rejected_by = jsonfield.JSONField(null=True)
    state = jsonfield.JSONField(null=True)
    update_time = jsonfield.JSONField(null=True)
    workflow_id = jsonfield.JSONField(null=True)
    workflow_process = jsonfield.JSONField(null=True)


class FavoriteWorkflow(models.Model):
    # data = jsonfield.JSONField()
    _id = models.TextField(primary_key=True)
    company_id = jsonfield.JSONField(null=True)
    created_by = jsonfield.JSONField(null=True)
    eventId = jsonfield.JSONField(null=True)
    workflows = jsonfield.JSONField(null=True)
