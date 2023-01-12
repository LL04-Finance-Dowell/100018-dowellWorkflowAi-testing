import requests
import json
from datetime import datetime
from .dowellconnection import dowellconnection
import requests

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

PROCESS_CONNECTION_LIST = [
    "Documents",
    "bangalore",
    "Documentation",
    "WorkflowProcess",
    "WorkflowProcess",
    "1000180001",
    "ABCDE",
]


LINK_CONNECTION_LIST = [
    "Documents",
    "bangalore",
    "Documentation",
    "DocumentLink",
    "DocumentLink",
    "1000180010",
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

WF_PROCESS_DICT = {
    "cluster": "Documents",
    "database": "Documentation",
    "collection": "WorkflowProcess",
    "document": "WorkflowProcess",
    "team_member_ID": "1000180001",
    "function_ID": "ABCDE",
}

LINK_CONNECTION_DICT = {
    "cluster": "Documents",
    "database": "Documentation",
    "collection": "DocumentLink",
    "document": "DocumentLink",
    "team_member_ID": "1000180010",
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


# --------- User Info-------------------------


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
    response_obj = dowellconnection(*REGISTRATION_ARGS, "find", field, "nil")
    res_obj = json.loads(response_obj)
    print(res_obj)
    if len(res_obj["data"]):
        return res_obj["data"]
    else:
        return []


def get_user_info_by_username(username):
    fields = {"Username": username}
    response = dowellconnection(*REGISTRATION_ARGS, "fetch", fields, "nil")
    usrdic = json.loads(response)
    if len(usrdic["data"]) == 0:
        return []
    else:
        return usrdic["data"][0]


# ----------------------- Links Creation -------------------------
def save_process_links(links, process_id, document_id, processing_choice):
    url = "http://100002.pythonanywhere.com/"
    payload = json.dumps(
        {
            **LINK_CONNECTION_DICT,
            "command": "insert",
            "field": {
                "eventId": get_event_id(),
                "links": links,
                "process_id": process_id,
                "document_id": document_id,
                "processing_choice": processing_choice,
            },
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )
    headers = {"Content-Type": "application/json"}
    response = requests.request("POST", url, headers=headers, data=payload)
    print("SAVED LINKS ----------- \n")
    return response.text


# By processID
def get_links_object_by_process_id(process_id):
    print("getting process link object,... \n")
    fields = {"process_id": str(process_id)}
    response_obj = dowellconnection(*LINK_CONNECTION_LIST, "find", fields, "nil")
    res_obj = json.loads(response_obj)
    # print("PL query object response :  \n", response_obj)
    if len(res_obj["data"]):
        return res_obj["data"]
    else:
        return []


# By documentID
def get_links_object_by_document_id(document_id):
    print("getting process link object,... \n")
    fields = {"document_id": str(document_id)}
    response_obj = dowellconnection(*LINK_CONNECTION_LIST, "find", fields, "nil")
    res_obj = json.loads(response_obj)
    if len(res_obj["data"]):
        return res_obj["data"]
    else:
        return []


#  -------------------------------Workflow Process------------------
def save_wf_process(
    process_title, process_steps, user, company_id, data_type, document_id
):
    # print("got here")
    url = "http://100002.pythonanywhere.com/"
    payload = json.dumps(
        {
            **WF_PROCESS_DICT,
            "command": "insert",
            "field": {
                "eventId": get_event_id(),
                "process_title": process_title,
                "process_steps": process_steps,
                "company_id": company_id,
                "created_by": user,
                "data_type": data_type,
                "document_id": document_id,
            },
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )
    headers = {"Content-Type": "application/json"}
    response = requests.request("POST", url, headers=headers, data=payload)
    print("SAVE WORKFLOW PROCESS----------- \n")
    return response.text


# def update_wf_process(workflow_process_id, workflows):
#     url = "http://100002.pythonanywhere.com/"
#     payload = json.dumps(
#         {
#             **WF_PROCESS_CONNECTION,
#             # "command": "insert",
#             "command": "update",
#             "field": {
#                 "_id": workflow_process_id,
#             },
#             "update_field": {
#                 "eventId": get_event_id(),
#                 "workflow": workflow,
#             },
#             "platform": "bangalore",
#         }
#     )
#     headers = {"Content-Type": "application/json"}
#     response = requests.request("POST", url, headers=headers, data=payload)
#     print("SAVE WORKFLOW UPDATE--------------- \n", response.text)
#     return response.text


def get_process_object(workflow_process_id):
    print("got here", workflow_process_id)
    fields = {"_id": str(workflow_process_id)}
    response_obj = dowellconnection(*PROCESS_CONNECTION_LIST, "find", fields, "nil")
    res_obj = json.loads(response_obj)
    print("getiing process object......")
    if len(res_obj["data"]):
        return res_obj["data"]
    else:
        return []


def get_process_list(company_id):
    fields = {"company_id": str(company_id)}
    response_obj = dowellconnection(*PROCESS_CONNECTION_LIST, "fetch", fields, "nil")
    res_obj = json.loads(response_obj)
    if len(res_obj["data"]):
        return res_obj["data"]
    else:
        return []


# ---------- Hashes --------------------------


def save_uuid_hash(process_links, process_id, document_id, processing_choice):
    url = "http://100002.pythonanywhere.com/"
    payload = json.dumps(
        {
            **QR_ID_CONNECTION_DICT,
            "command": "insert",
            "field": {
                "eventId": get_event_id(),
                "process_links": process_links,
                "document_id": document_id,
                "process_id": process_id,
                "processing_choice": processing_choice,
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
    print("SAVED UUID-----------: \n")
    return response.text


# -------------------------------- Workflows-------------------


def save_wf(workflows, company_id, created_by):
    url = "http://100002.pythonanywhere.com/"
    payload = json.dumps(
        {
            **WF_CONNECTION_DICT,
            "command": "insert",
            "field": {
                "eventId": get_event_id(),
                "workflows": workflows,
                "created_by": created_by,
                "company_id": company_id,
            },
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )
    headers = {"Content-Type": "application/json"}
    response = requests.request("POST", url, headers=headers, data=payload)
    print("SAVE WORKFLOW ENTRY----------- \n")
    return response.text


def update_wf(workflow_id, old_workflow):
    url = "http://100002.pythonanywhere.com/"

    payload = json.dumps(
        {
            **WF_CONNECTION_DICT,
            "command": "update",
            "field": {
                "_id": workflow_id,
            },
            "update_field": {
                "eventId": get_event_id(),
                "workflows": old_workflow["workflows"],
                "created_by": old_workflow["created_by"],
                "company_id": old_workflow["company_id"],
            },
            "platform": "bangalore",
        }
    )
    headers = {"Content-Type": "application/json"}
    response = requests.request("POST", url, headers=headers, data=payload)
    print("SAVE WORKFLOW UPDATE--------------- \n")
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
    print("SAVE WORKFLOW APPROVAL--------------- \n")
    return response.text


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


# ------------------------------------------ Templates-----------------------------
def save_template(name, data, page, created_by, company_id, data_type):
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
                "page": page,
                "company_id": company_id,
                "created_by": created_by,
                "data_type": data_type,
            },
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )
    headers = {"Content-Type": "application/json"}
    response = requests.request("POST", url, headers=headers, data=payload)
    print("SAVED TEMPLATE----------- \n")
    return response.text


def get_template_object(template_id):
    fields = {"_id": template_id}
    response_obj = dowellconnection(*TEMPLATE_CONNECTION_LIST, "find", fields, "nil")
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
    print("TEMPLATE UPDATED----------- \n")
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
    print("SAVE TEMPLATE APPROVAL--------------- \n")
    return response.text


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


# -------------------------- Document----------------------------------------
def save_document(name, data, created_by, company_id, page, data_type):
    url = "http://100002.pythonanywhere.com/"
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
                "content": data,
                "workflow_id": "",
                "auth_user_list": [],
                "company_id": company_id,
                "created_by": created_by,
                "created_on": time,
                "reject_message": "",
                "rejected_by": "",
                "update_time": time,
                "page": page,
                "data_type": data_type,
            },
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )

    headers = {"Content-Type": "application/json"}
    response = requests.request("POST", url, headers=headers, data=payload)
    print("SAVED DOCUMENT--------------- \n")
    return response.text


def update_document(document_id, workflow_process_id):
    url = "http://100002.pythonanywhere.com/"

    payload = json.dumps(
        {
            **DOCUMENT_CONNECTION_DICT,
            "command": "update",
            "field": {
                "_id": document_id,
            },
            "update_field": {"workflow_process": workflow_process_id},
            "platform": "bangalore",
        }
    )
    headers = {"Content-Type": "application/json"}
    response = requests.request("POST", url, headers=headers, data=payload)
    print("DOCUMENT UPDATED------------ \n")
    return response.text


def get_document_object(document_id):
    fields = {"_id": document_id}
    response_obj = dowellconnection(*DOCUMENT_CONNECTION_LIST, "find", fields, "nil")
    # print("document object-------------- \n", response_obj)
    res_obj = json.loads(response_obj)
    try:
        return res_obj["data"]
    except:
        return []


def get_document_list(company_id):
    fields = {"company_id": str(company_id)}
    response_obj = dowellconnection(*DOCUMENT_CONNECTION_LIST, "fetch", fields, "nil")
    res_obj = json.loads(response_obj)
    if len(res_obj["data"]):
        return res_obj["data"]
    else:
        return []
