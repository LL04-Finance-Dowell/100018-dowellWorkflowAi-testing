import requests
import json
from datetime import datetime
from .dowellconnection import dowellconnection


QR_ID_CONNECTION_LIST = [
    "Documents",
    "bangalore",
    "Documentation",
    "qridtokens",
    "qridtokens",
    "10008484",
    "ABCDE",
]

USER_CONNECTION_LIST = [
    "login",
    "bangalore",
    "login",
    "registration",
    "registration",
    "10004545",
    "ABCDE",
]
WF_CONNECTION_LIST = [
    "Documents",
    "bangalore",
    "Documentation",
    "WorkflowReports",
    "workflowreports",
    "33689044433",
    "ABCDE",
]
TEMPLATE_CONNECTION_LIST = [
    "Documents",
    "bangalore",
    "Documentation",
    "TemplateReports",
    "templatereports",
    "22689044433",
    "ABCDE",
]
DOCUMENT_CONNECTION_LIST = [
    "Documents",
    "bangalore",
    "Documentation",
    "DocumentReports",
    "documentreports",
    "11689044433",
    "ABCDE",
]

SESSION_ARGS = ["login", "bangalore", "login", "login", "login", "6752828281", "ABCDE"]
REGISTRATION_ARGS = [
    "login",
    "bangalore",
    "login",
    "registration",
    "registration",
    "10004545",
    "ABCDE",
]


QR_ID_CONNECTION_DICT = {
    "cluster": "Documents",
    "database": "Documentation",
    "collection": "qridtokens",
    "document": "qridtokens",
    "team_member_ID": "10008484",
    "function_ID": "ABCDE",
}

WF_CONNECTION_DICT = {
    "cluster": "Documents",
    "database": "Documentation",
    "collection": "WorkflowReports",
    "document": "workflowreports",
    "team_member_ID": "33689044433",
    "function_ID": "ABCDE",
}

TEMPLATE_CONNECTION_DICT = {
    "cluster": "Documents",
    "database": "Documentation",
    "collection": "TemplateReports",
    "document": "templatereports",
    "team_member_ID": "22689044433",
    "function_ID": "ABCDE",
}

DOCUMENT_CONNECTION_DICT = {
    "cluster": "Documents",
    "database": "Documentation",
    "collection": "DocumentReports",
    "document": "documentreports",
    "team_member_ID": "11689044433",
    "function_ID": "ABCDE",
}

print(TEMPLATE_CONNECTION_LIST)
def get_event_id():
    dd = datetime.now()
    time = dd.strftime("%d:%m:%Y,%H:%M:%S")
    url = "https://100003.pythonanywhere.com/event_creation"
    data = {
        "platformcode": "FB",
        "citycode": "101",
        "daycode": "0",
        "dbcode": "pfm",
        "ip_address": "192.168.0.41",
        "login_id": "lav",
        "session_id": "new",
        "processcode": "1",
        "regional_time": time,
        "dowell_time": time,
        "location": "22446576",
        "objectcode": "1",
        "instancecode": "100051",
        "context": "afdafa ",
        "document_id": "3004",
        "rules": "some rules",
        "status": "work",
    }
    r = requests.post(url, json=data)
    return r.text


def get_user_info_by_username(username):
    fields = {"Username": username}
    response = dowellconnection(*REGISTRATION_ARGS, "fetch", fields, "nil")
    usrdic = json.loads(response)
    print("LoggedIn as ---->: ", usrdic["data"])
    if len(usrdic["data"]) == 0:
        return []
    else:
        return usrdic["data"][0]


def save_uuid_hash(uuid_hash, user_email, document_id):
    url = "http://100002.pythonanywhere.com/"
    payload = json.dumps(
        {
            **QR_ID_CONNECTION_DICT,
            "command": "insert",
            "field": {
                "eventId": get_event_id(),
                "email": user_email,
                "uuid_hash": uuid_hash,
                "document_id": document_id,
                "status": True,  #   if True: valid ? Invalid
            },
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )
    headers = {"Content-Type": "application/json"}
    response = requests.request("POST", url, headers=headers, data=payload)
    print("SAVED UUID ENTRY", response.text)
    return response.text


def get_uuid_object(uuid_hash):
    fields = {"uuid_hash": uuid_hash}
    response_obj = dowellconnection(*QR_ID_CONNECTION_LIST, "find", fields, "nil")
    print("UUID query object response : ", response_obj)
    res_obj = json.loads(response_obj)
    if len(res_obj["data"]):
        return res_obj["data"]
    else:
        return []


# for links in wf lists
def get_uuid(document_id):
    fields = {"document_id": document_id}
    response_obj = dowellconnection(*QR_ID_CONNECTION_LIST, "find", fields, "nil")
    print("UUID Hash : ", response_obj)
    res_obj = json.loads(response_obj)
    if len(res_obj["data"]):
        return res_obj["data"]
    else:
        return []


def update_uuid_object(uuid_hash):
    url = "http://100002.pythonanywhere.com/"

    payload = json.dumps(
        {
            **QR_ID_CONNECTION_DICT,
            "command": "update",
            "field": {"uuid_hash": uuid_hash},
            "update_field": {"status": False},
            "platform": "bangalore",
        }
    )
    headers = {"Content-Type": "application/json"}
    response = requests.request("POST", url, headers=headers, data=payload)
    print("SAVED UUID-----------: \n", response.text)
    return response.text


def save_wf(wf_name, int_wf_string, ext_wf_string, user, company_id):
    url = "http://100002.pythonanywhere.com/"
    payload = json.dumps(
        {
            **WF_CONNECTION_DICT,
            "command": "insert",
            "field": {
                "eventId": get_event_id(),
                "workflow_title": wf_name,
                "int_wf_string": int_wf_string,
                "ext_wf_string": ext_wf_string,
                "company_id": company_id,
                "created_by": user,
            },
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )
    headers = {"Content-Type": "application/json"}
    response = requests.request("POST", url, headers=headers, data=payload)
    print("SAVE WORKFLOW ENTRY----------- \n", response.text)
    return response.text


def update_wf(workflow_id, int_wf_string, ext_wf_string):
    url = "http://100002.pythonanywhere.com/"
    print(
        "---------Update wf before update int_wf_string---------------- \n :",
        int_wf_string,
    )
    print(
        "---------Uodate wf before  ext_wf_string---------------- \n :", ext_wf_string
    )
    payload = json.dumps(
        {
            **WF_CONNECTION_DICT,
            # "command": "insert",
            "command": "update",
            "field": {
                "_id": workflow_id,
            },
            "update_field": {
                # "event_id": get_event_id(),
                "eventId": get_event_id(),
                "int_wf_string": int_wf_string,
                "ext_wf_string": ext_wf_string,
            },
            "platform": "bangalore",
        }
    )
    headers = {"Content-Type": "application/json"}
    response = requests.request("POST", url, headers=headers, data=payload)
    print("SAVE WORKFLOW UPDATE--------------- \n", response.text)
    return response.text


def update_wf_approval(workflow_id, approval):
    url = "http://100002.pythonanywhere.com/"
    payload = json.dumps(
        {
            **WF_CONNECTION_DICT,
            # "command": "insert",
            "command": "update",
            "field": {
                "_id": workflow_id,
            },
            "update_field": {
                "approved": approval,
            },
            "platform": "bangalore",
        }
    )
    headers = {"Content-Type": "application/json"}
    response = requests.request("POST", url, headers=headers, data=payload)
    print("SAVE WORKFLOW APPROVAL--------------- \n", response.text)
    return response.text


def save_template(name, data, created_by, company_id):
    url = "http://100002.pythonanywhere.com/"
    event_id = get_event_id()
    payload = json.dumps(
        {
            **TEMPLATE_CONNECTION_DICT,
            "command": "insert",
            "field": {
                "eventId": event_id,
                "template_name": name,
                "content": data,
                "company_id": company_id,
                "created_by": created_by,
            },
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )
    headers = {"Content-Type": "application/json"}
    response = requests.request("POST", url, headers=headers, data=payload)
    print("SAVED TEMPLATE----------- \n", response.text)
    return response.text


def get_template_object(template_id):
    fields = {"_id": template_id}
    response_obj = dowellconnection(*TEMPLATE_CONNECTION_LIST, "find", fields, "nil")
    # print("Template object----------------- \n", response_obj)
    res_obj = json.loads(response_obj)
    if len(res_obj["data"]):
        return res_obj["data"]
    else:
        return []


def update_template(template_id, data):
    url = "http://100002.pythonanywhere.com/"
    payload = json.dumps(
        {
            **TEMPLATE_CONNECTION_DICT,
            "command": "update",
            "field": {
                "_id": template_id,
            },
            "update_field": {
                "content": data,
            },
            "platform": "bangalore",
        }
    )
    headers = {"Content-Type": "application/json"}
    response = requests.request("POST", url, headers=headers, data=payload)
    print("TEMPLATE UPDATED----------- \n", response.text)
    return response.text


def update_template_approval(template_id, approval):
    url = "http://100002.pythonanywhere.com/"
    payload = json.dumps(
        {
            **TEMPLATE_CONNECTION_DICT,
            # "command": "insert",
            "command": "update",
            "field": {
                "_id": template_id,
            },
            "update_field": {
                "approved": approval,
            },
            "platform": "bangalore",
        }
    )
    headers = {"Content-Type": "application/json"}
    response = requests.request("POST", url, headers=headers, data=payload)
    print("SAVE TEMPLATE APPROVAL--------------- \n", response.text)
    return response.text


def save_document(name, template_id, data, created_by, company_id):
    url = "http://100002.pythonanywhere.com/"
    template_obj = get_template_object(template_id)
    print("Request 1 on document save----------- \n", template_obj)
    event_id = get_event_id()
    dd = datetime.now()
    time = dd.strftime("%d:%m:%Y,%H:%M:%S")
    payload = json.dumps(
        {
            **DOCUMENT_CONNECTION_DICT,
            "command": "insert",
            "field": {
                "eventId": event_id,
                "document_name": name,
                "content": template_obj["content"],
                "template_id": template_id,
                "workflow_id": template_obj["workflow_id"],
                "auth_user_list": [],
                "company_id": company_id,
                "created_by": created_by,
                "created_on": time,
                "reject_message": "",
                "rejected_by": "",
                "int_wf_position": 0,
                "int_wf_step": "",
                "ext_wf_position": 0,
                "ext_wf_step": "",
                "link_wf_step": "",
                "link_wf_position": 0,
                "update_time": time,
            },
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )

    headers = {"Content-Type": "application/json"}
    response = requests.request("POST", url, headers=headers, data=payload)
    print("SAVED DOCUMENT--------------- \n", response.text)
    return response.text


def update_document(document_id, data):
    url = "http://100002.pythonanywhere.com/"
    payload = json.dumps(
        {
            **DOCUMENT_CONNECTION_DICT,
            "command": "update",
            "field": {
                "_id": document_id,
            },
            "update_field": {**data},
            "platform": "bangalore",
        }
    )
    headers = {"Content-Type": "application/json"}
    response = requests.request("POST", url, headers=headers, data=payload)
    print("DOCUMENT UPDATED------------ \n", response.text)
    return response.text


def get_document_object(document_id):
    fields = {"_id": document_id}
    response_obj = dowellconnection(*DOCUMENT_CONNECTION_LIST, "find", fields, "nil")
    print("document object-------------- \n", response_obj)
    res_obj = json.loads(response_obj)
    if len(res_obj["data"]):
        return res_obj["data"]
    else:
        return []


def get_document_list(company_id):
    fields = {"company_id": str(company_id)}
    response_obj = dowellconnection(*DOCUMENT_CONNECTION_LIST, "fetch", fields, "nil")
    res_obj = json.loads(response_obj)
    if len(res_obj["data"]):
        return res_obj["data"]
    else:
        return []


def get_wf_object(workflow_id):
    fields = {"_id": str(workflow_id)}
    response_obj = dowellconnection(*WF_CONNECTION_LIST, "find", fields, "nil")
    res_obj = json.loads(response_obj)
    if len(res_obj["data"]):
        return res_obj["data"]
    else:
        return []


def get_all_wf_list():
    fields = {}
    response_obj = dowellconnection(*WF_CONNECTION_LIST, "fetch", fields, "nil")
    res_obj = json.loads(response_obj)
    wf_list = []
    for wf in res_obj["data"]:
        wf["id"] = wf["_id"]
        wf_list.append(wf)
    if len(res_obj["data"]):
        return wf_list  #   res_obj["data"]
    else:
        return []


def get_wf_list(company_id):
    fields = {"company_id": str(company_id)}
    response_obj = dowellconnection(*WF_CONNECTION_LIST, "fetch", fields, "nil")
    res_obj = json.loads(response_obj)
    if len(res_obj["data"]):
        return res_obj["data"]
    else:
        return []


def get_user_list(company_id):
    field = {"company_id": str(company_id)}
    response_obj = dowellconnection(*USER_CONNECTION_LIST, "fetch", field, "nil")
    res_obj = json.loads(response_obj)
    if len(res_obj["data"]):
        return res_obj["data"]
    else:
        return []


def get_user(user_name):
    field = {"user_name": str(user_name)}
    response_obj = dowellconnection(*USER_CONNECTION_LIST, "find", field, "nil")
    res_obj = json.loads(response_obj)
    if len(res_obj["data"]):
        return res_obj["data"]
    else:
        return []


def get_template_list(company_id):
    fields = {
        "company_id": company_id,
    }
    response_obj = dowellconnection(*TEMPLATE_CONNECTION_LIST, "fetch", fields, "nil")
    res_obj = json.loads(response_obj)
    if len(res_obj["data"]):
        return res_obj["data"]
    else:
        return []
