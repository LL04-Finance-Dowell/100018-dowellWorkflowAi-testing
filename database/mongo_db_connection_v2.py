from cgitb import handler
from email import header
import requests
import time
import json
from datetime import datetime
from .dowellconnection import dowellconnection
from .mongo_db_connection import TEMPLATE_CONNECTION_LIST, get_event_id, get_template_object, get_wf_list, get_wf_object

QR_ID_CONNECTION_LIST = [
    "Documents",
    "bangalore",
    "Documentation",
    "qridtokens",
    "qridtokens",
    "10008484",
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

DOCUMENT_CONNECTION_LIST = [
    "Documents",
    "bangalore",
    "Documentation",
    "DocumentReports",
    "documentreports",
    "11689044433",
    "ABCDE",
]

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

# time
dd = datetime.now()
time = dd.strftime("%d:%m:%Y,%H:%M:%S")

# DB connection  URL
url = "https://uxlivinglab.pythonanywhere.com"


# ----------------------- Links Creation -------------------------
def save_process_links(
        links, process_id, document_id, processing_choice, process_title, company_id
):
    payload = json.dumps(
        {
            **LINK_CONNECTION_DICT,
            "command": "insert",
            "field": {
                "event_id": get_event_id()["event_id"],
                "links": links,
                "process_id": process_id,
                "document_id": document_id,
                "processing_choice": processing_choice,
                "process_title": process_title,
                "created_at": time,
                "company_id": company_id

            },
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )
    headers = {"Content-Type": "application/json"}
    response = requests.request("POST", url, headers=headers, data=payload)
    print("DB: SAVED LINKS ----------- \n")
    return json.loads(response.text)


# By processID
def get_links_object_by_process_id(process_id):
    print("DB: getting process link object... \n")
    fields = {"process_id": str(process_id)}
    response_obj = dowellconnection(*LINK_CONNECTION_LIST, "find", fields, "nil")
    print(response_obj)
    res_obj = json.loads(response_obj)
    if res_obj["data"] is not None:
        if len(res_obj["data"]):
            return res_obj["data"]
        else:
            return []
    return []


# By documentID
def get_links_object_by_document_id(document_id):
    print("DB: getting process link object... \n")
    fields = {"document_id": str(document_id)}
    response_obj = dowellconnection(*LINK_CONNECTION_LIST, "find", fields, "nil")
    res_obj = json.loads(response_obj)
    # print("PL query object response :  \n", response_obj)
    if res_obj["data"] is not None:
        if len(res_obj["data"]):
            return res_obj["data"]
        else:
            return []
    return []


#  -------------------------------Workflow Process------------------
def save_wf_process(
        process_title,
        process_steps,
        user,
        company_id,
        data_type,
        document_id,
        process_action,
        portfolio
):
    payload = json.dumps(
        {
            **WF_PROCESS_DICT,
            "command": "insert",
            "field": {
                "event_id": get_event_id()["event_id"],
                "process_title": process_title,
                "process_steps": process_steps,
                "company_id": company_id,
                "created_by": user,
                "data_type": data_type,
                "parent_document_id": document_id,
                "processing_action": process_action,
                "processing_state": "draft",
                "created_at": time,
                "creator_portfolio": portfolio
            },
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )
    headers = {"Content-Type": "application/json"}
    response = requests.request("POST", url, headers=headers, data=payload)
    print("DB: SAVE WORKFLOW PROCESS----------- \n")
    return json.loads(json.loads(response.text))


def update_wf_process(process_id, steps, state):
    payload = json.dumps(
        {
            **WF_PROCESS_DICT,
            "command": "update",
            "field": {
                "_id": process_id,
            },
            "update_field": {
                "process_steps": steps,
                "processing_state": state
            },
            "platform": "bangalore",
        }
    )
    headers = {"Content-Type": "application/json"}
    response = requests.request("POST", url, headers=headers, data=payload)
    print("DB: SAVE WORKFLOW UPDATE--------------- \n", )
    return json.loads(response.text)


def get_process_object(workflow_process_id):
    print("DB: getting process object...... \n")
    fields = {"_id": str(workflow_process_id)}
    response_obj = dowellconnection(*PROCESS_CONNECTION_LIST, "find", fields, "nil")
    res_obj = json.loads(response_obj)
    if len(res_obj["data"]):
        return res_obj["data"]
    else:
        return []


def get_process_list(company_id):
    print("DB: Getting process list \n")
    fields = {
        "company_id": str(company_id),

    }
    response_obj = dowellconnection(*PROCESS_CONNECTION_LIST, "fetch", fields, "nil")
    res_obj = json.loads(response_obj)
    if len(res_obj["data"]):
        return res_obj["data"]
    else:
        return []


# -------------------------- Document----------------------------------------
def save_document(name, data, created_by, company_id, data_type, page, state, auth_viewers, document_type, parent_id):
    det = datetime.now()
    created_time = det.strftime("%d:%m:%Y,%H:%M:%S")
    payload = json.dumps(
        {
            **DOCUMENT_CONNECTION_DICT,
            "command": "insert",
            "field": {
                "event_id": get_event_id()["event_id"],
                "document_name": name,
                "content": data,
                "company_id": company_id,
                "created_by": created_by,
                "created_at": created_time,
                "rejection_message": "",
                "rejected_by": "",
                "document_state": state,
                "page": page,
                "data_type": data_type,
                "clone_list": [],
                "auth_viewers": auth_viewers,
                "document_type": document_type,
                "parent_id": parent_id,
            },
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )

    headers = {"Content-Type": "application/json"}
    response = requests.request("POST", url, headers=headers, data=payload)
    print("SAVED DOCUMENT--------------- \n")
    return json.loads(response.text)


def get_document_object(document_id):
    fields = {"_id": document_id}
    response_obj = dowellconnection(*DOCUMENT_CONNECTION_LIST, "find", fields, "nil")
    res_obj = json.loads(response_obj)
    try:
        return res_obj["data"]
    except RuntimeError:
        return []


def update_document(document_id, process_id, state):
    payload = json.dumps(
        {
            **DOCUMENT_CONNECTION_DICT,
            "command": "update",
            "field": {
                "_id": document_id,
            },
            "update_field": {
                "process_id": process_id,
                "document_state": state,
            },
            "platform": "bangalore",
        }
    )
    headers = {"Content-Type": "application/json"}
    response = requests.request("POST", url, headers=headers, data=payload)
    print("DB: DOCUMENT UPDATED------------ \n")
    return json.loads(response.text)


def document_to_trash(document_id, state):
    payload = json.dumps(
        {
            **DOCUMENT_CONNECTION_DICT,
            "command": "update",
            "field": {
                "_id": document_id,
            },
            "update_field": {
                "document_state": state,
            },
            "platform": "bangalore",
        }
    )
    headers = {"Content-Type": "application/json"}
    response = requests.request("POST", url, headers=headers, data=payload)
    print("DB: DOCUMENT UPDATED------------ \n")
    return json.loads(response.text)


def update_document_clone(document_id, clone_list):
    payload = json.dumps(
        {
            **DOCUMENT_CONNECTION_DICT,
            "command": "update",
            "field": {
                "_id": document_id,
            },
            "update_field": {
                "clone_list": clone_list
            },
            "platform": "bangalore",
        }
    )
    headers = {"Content-Type": "application/json"}
    response = requests.request("POST", url, headers=headers, data=payload)
    print("DB: DOCUMENT UPDATED------------ \n")
    return json.loads(response.text)

