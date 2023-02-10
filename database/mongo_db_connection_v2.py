import requests
import time
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


def get_event_id():
    uri = "https://uxlivinglab.pythonanywhere.com/create_event"
    data = {
        "platformcode": "FB",
        "citycode": "101",
        "daycode": "0",
        "dbcode": "pfm",
        "ip_address": "192.168.0.41",  # get from dowell track my ip function
        "login_id": "lav",  # get from login function
        "session_id": "new",  # get from login function
        "processcode": "1",
        "location": "22446576",  # get from dowell track my ip function
        "objectcode": "1",
        "instancecode": "100051",
        "context": "afdafa ",
        "document_id": "3004",
        "rules": "some rules",
        "status": "work",
        "data_type": "learn",
        "purpose_of_usage": "add",
        "colour": "color value",
        "hashtags": "hash tag alue",
        "mentions": "mentions value",
        "emojis": "emojis",
        "bookmarks": "a book marks",
    }

    r = requests.post(uri, json=data)
    if r.status_code == 201:
        return json.loads(r.text)
    else:
        return json.loads(r.text)["error"]


# ----------------------- Links Creation -------------------------
def save_process_links(
        links, process_id, document_id, processing_choice, process_title
):
    payload = json.dumps(
        {
            **LINK_CONNECTION_DICT,
            "command": "insert",
            "field": {
                "eventId": get_event_id()["event_id"],
                "links": links,
                "processId": process_id,
                "documentId": document_id,
                "processingChoice": processing_choice,
                "processTitle": process_title,
                "createdAt": time,
            },
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )
    headers = {"Content-Type": "application/json"}
    response = requests.request("POST", url, headers=headers, data=payload)
    print("SAVED LINKS ----------- \n")
    return json.loads(response.text)


# By processID
def get_links_object_by_process_id(process_id):
    print("getting process link object... \n")
    fields = {"processId": str(process_id)}
    response_obj = dowellconnection(*LINK_CONNECTION_LIST, "find", fields, "nil")
    res_obj = json.loads(response_obj)
    if res_obj["data"] is not None:
        if len(res_obj["data"]):
            return res_obj["data"]
        else:
            return []
    return []


# By documentID
def get_links_object_by_document_id(document_id):
    print("getting process link object,... \n")
    fields = {"documentId": str(document_id)}
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
        process_choice,
):
    payload = json.dumps(
        {
            **WF_PROCESS_DICT,
            "command": "insert",
            "field": {
                "eventId": get_event_id()["event_id"],
                "processTitle": process_title,
                "processSteps": process_steps,
                "companyId": company_id,
                "createdBy": user,
                "dataType": data_type,
                "parentDocumentId": document_id,
                "processingAction": process_choice,
                "createdAt": time,
            },
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )
    headers = {"Content-Type": "application/json"}
    response = requests.request("POST", url, headers=headers, data=payload)
    print("SAVE WORKFLOW PROCESS----------- \n")
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
                "processSteps": steps,
                "processingState": state
            },
            "platform": "bangalore",
        }
    )
    headers = {"Content-Type": "application/json"}
    response = requests.request("POST", url, headers=headers, data=payload)
    print("SAVE WORKFLOW UPDATE--------------- \n", json.loads(response.text))
    return json.loads(response.text)


def get_process_object(workflow_process_id):
    fields = {"_id": str(workflow_process_id)}
    response_obj = dowellconnection(*PROCESS_CONNECTION_LIST, "find", fields, "nil")
    res_obj = json.loads(response_obj)
    print("getting process object......")
    if len(res_obj["data"]):
        return res_obj["data"]
    else:
        return []


def get_process_list(company_id):
    fields = {"companyId": str(company_id)}
    response_obj = dowellconnection(*PROCESS_CONNECTION_LIST, "fetch", fields, "nil")
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


# -------------------------- Document----------------------------------------
def save_document(name, data, created_by, company_id, page, data_type, state):
    det = datetime.now()
    created_time = det.strftime("%d:%m:%Y,%H:%M:%S")
    payload = json.dumps(
        {
            **DOCUMENT_CONNECTION_DICT,
            "command": "insert",
            "field": {
                "eventId": get_event_id()["event_id"],
                "documentName": name,
                "content": data,
                "companyId": company_id,
                "createdBy": created_by,
                "createdAt": created_time,
                "rejectionMessage": "",
                "rejectedBy": "",
                "documentState": state,
                "page": page,
                "dataType": data_type,
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
    print(res_obj)
    try:
        return res_obj["data"]
    except RuntimeError:
        return []


def update_document(document_id, workflow_process_id, state):
    payload = json.dumps(
        {
            **DOCUMENT_CONNECTION_DICT,
            "command": "update",
            "field": {
                "_id": document_id,
            },
            "update_field": {
                "processId": workflow_process_id,
                "documentState": state,
            },
            "platform": "bangalore",
        }
    )
    headers = {"Content-Type": "application/json"}
    response = requests.request("POST", url, headers=headers, data=payload)
    print("DOCUMENT UPDATED------------ \n")
    return json.loads(response.text)
