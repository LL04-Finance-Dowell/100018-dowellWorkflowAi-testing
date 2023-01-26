from django.db import models


class Notification(models.Model):
    process_id = models.CharField(max_length=150) 
    document_id = models.CharField(max_length=150)
    processing_choice = models.CharField(max_length=225)
    links = models.JSONField()


    def get_notifications(self):
        return Notification.objects.all()
