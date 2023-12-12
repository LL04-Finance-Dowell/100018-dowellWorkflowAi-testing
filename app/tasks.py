from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail


@shared_task(bind=True)
def send_reminder_mail(self):
    mail_subject = "Reminder to Sign Docs"
    message = "You've been assigned a document to process, kindly, check"
    to_email = "morvinian@gmail.com"
    send_mail(
        subject = mail_subject,
        message=message,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[to_email],
        fail_silently=True,
    )
    return "Mail sent"