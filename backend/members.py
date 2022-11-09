import requests

url = "https://100014.pythonanywhere.com/api/userinfo/"

def get_members(session_id):
    payload = {"session_id": session_id}
    r = requests.post(url=url, data=payload)
    return r.json()

