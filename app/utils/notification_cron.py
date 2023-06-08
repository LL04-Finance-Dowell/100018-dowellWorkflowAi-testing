import json
import requests
import threading
from app.constants import NOTIFICATION_API
from .helpers import notification

def send_notification(data):
    notification(data)
