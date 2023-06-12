import sys
import json
import requests
import threading
NOTIFICATION_API = "https://100092.pythonanywhere.com/api/v1/notifications/products/"
# from .helpers import notification

def send_notification(data):
    try:
        response =  requests.post(
            NOTIFICATION_API,
            # data=data,
            # data=json.dumps(data),
            json=data,
            headers={"Content-Type": "application/json"},
        )
        print(data)
        response.raise_for_status()
    except Exception as err:
        print(err)
        raise
   
    return data

if __name__ == "__main__":
    # Retrieve command line arguments
    args = sys.argv[1:]

    # Ensure the command line arguments are provided
    if len(args) > 0:
        # Parse the JSON argument
        data = json.loads(args[0])
        print(data)

        # Call the send_notification function with the parsed data
        send_notification(data)
        print(data)
