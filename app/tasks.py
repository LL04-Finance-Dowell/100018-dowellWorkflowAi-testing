from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail

@shared_task(bind=True)
def func_test(self):
    for x in range(10):
        print(x)
    return "Task Complete !!"

@shared_task(bind=True)
def send_reminder_mail(self):
    mail_subject = "Reminder to Sign Docs"
    message = "If you are liking my content, please hit the like button and do subscribe to my channel"
    to_email = "morvinian@gmail.com"
    send_mail(
        subject = mail_subject,
        message=message,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[to_email],
        fail_silently=True,
    )
    return "Mail sent"