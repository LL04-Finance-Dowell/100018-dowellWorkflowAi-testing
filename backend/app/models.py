from django.db import models


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
