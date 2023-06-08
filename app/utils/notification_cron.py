import json
import requests
import threading
from app.constants import NOTIFICATION_API
# from .helpers import notification

def send_notification(data):
    try:
        response =  requests.post(
            NOTIFICATION_API,
            data=json.dumps(data),
            headers={"Content-Type": "application/json"},
        )
        print("Notification sent")
        response.raise_for_status()
    except requests.RequestException as err:
        print(err)
        raise
   
    return data

