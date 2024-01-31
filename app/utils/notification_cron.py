import sys
import json
import requests
from datetime import datetime
              
from app.constants import NOTIFICATION_API
from app.helpers import dowell_email_sender
from app.models import ProcessReminder



def send_notification(data):
    try:
        response = requests.post(
            NOTIFICATION_API,
            # data=data,
            # data=json.dumps(data),
            json=data,
            headers={"Content-Type": "application/json"},
        )
        response.raise_for_status()
    except Exception as err:
        print(err)
        raise

    return data


def send_reminders():
    reminders = ProcessReminder.objects.all()
    for reminder in reminders:
        current_datetime = datetime.strptime(str(datetime.utcnow()), '%Y-%m-%d %H:%M:%S.%f')
        last_reminder = datetime.strptime(reminder.last_reminder_datetime, '%d:%m:%Y,%H:%M:%S')
        time_difference = current_datetime - last_reminder
        if reminder.interval == 60:
            if reminder.interval%(time_difference.seconds/60) == 0:
                dowell_email_sender("Morvin Ian", reminder.email, "Crontab", "Hello Morvin")
        elif reminder.interval == 1440:
            if reminder.interval%(time_difference.seconds/60) == 0:
                dowell_email_sender("Morvin Ian", reminder.email, "Crontab", "Hello Morvin")



if __name__ == "__main__":
    # Retrieve command line arguments
    args = sys.argv[1:]

    # Ensure the command line arguments are provided
    if len(args) > 0:
        # Parse the JSON argument
        data = json.loads(args[0])
        # Call the send_notification function with the parsed data
        send_notification(data)
