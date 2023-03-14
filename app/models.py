import jsonfield
from django.db import models
from app.utils.mongo_db_connection import (
    get_document_object,
    get_wf_object,
    get_template_object,
)


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
    username= models.TextField(max_length=200,default=created_by)


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
    username= models.TextField(max_length=200,default=created_by)


class FavoriteWorkflow(models.Model):
    # data = jsonfield.JSONField()
    _id = models.TextField(primary_key=True)
    company_id = jsonfield.JSONField(null=True)
    created_by = jsonfield.JSONField(null=True)
    eventId = jsonfield.JSONField(null=True)
    workflows = jsonfield.JSONField(null=True)
    username= models.TextField(max_length=200,default=created_by)


def save_as_favorite(identifier, type,username):
    if type == "workflow":
        data = get_wf_object(identifier)
        data['username']=username
        model = FavoriteWorkflow(**data)
        model.save()
    if type == "document":
        data = get_document_object(identifier)
        data['username']=username

        try:
            data["content"] = eval(data["content"])
        except:
            pass
        model = FavoriteDocument(**data)
        model.save()
    if type == "template":
        data = get_template_object(identifier)
        data['username']=username
        try:
            data["content"] = eval(data["content"])
        except:
            pass
        model = FavoriteTemplate(**data)
        model.save()


def remove_favorite(identifier, type):
    if type == "workflow":

        FavoriteWorkflow.objects.filter(_id=identifier).delete()

    if type == "document":

        FavoriteDocument.objects.filter(_id=identifier).delete()

    if type == "template":

        FavoriteTemplate.objects.filter(_id=identifier).delete()
