import requests
import time
import json
from datetime import datetime
from .dowellconnection import dowellconnection

from app.constants import (
    QR_CONNECTION_DICT,
    QR_CONNECTION_LIST,
    DOCUMENT_CONNECTION_DICT,
    LINK_CONNECTION_DICT,
    LINK_CONNECTION_LIST,
    TARGETED_POPULATION_URL,
    WF_CONNECTION_DICT,
    WF_PROCESS_DICT,
    WF_CONNECTION_LIST,
    WF_AI_SETTING_LIST,
    USER_CONNECTION_LIST,
    TEMPLATE_CONNECTION_DICT,
    PROCESS_CONNECTION_LIST,
    TEMPLATE_CONNECTION_LIST,
    REGISTRATION_ARGS,
    QR_ID_CONNECTION_DICT,
    QR_ID_CONNECTION_LIST,
    DOCUMENT_CONNECTION_DICT,
    DOCUMENT_CONNECTION_LIST,
    WF_AI_SETTING_DICT,
    DOWELLCONNECTION_URL,
    MANAGEMENT_REPORTS_LIST,
    MANAGEMENT_REPORTS_DICT,
)


# time
dd = datetime.now()
time = dd.strftime("%d:%m:%Y,%H:%M:%S")
headers = {"Content-Type": "application/json"}

# old 22sec query
# def get_event_id():
#     dd = datetime.now()
#     time = dd.strftime("%d:%m:%Y,%H:%M:%S")
#     url = "https://100003.pythonanywhere.com/event_creation"
#     data = {
#         "platformcode": "FB",
#         "citycode": "101",
#         "daycode": "0",
#         "dbcode": "pfm",
#         "ip_address": "192.168.0.41",
#         "login_id": "lav",
#         "session_id": "new",
#         "processcode": "1",
#         "regional_time": time,
#         "dowell_time": time,
#         "location": "22446576",
#         "objectcode": "1",
#         "instancecode": "100051",
#         "context": "afdafa ",
#         "document_id": "3004",
#         "rules": "some rules",
#         "status": "work",
#     }
#     r = requests.post(url, json=data)
#     return r.text


def get_event_id():
    url = "https://uxlivinglab.pythonanywhere.com/create_event"
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

    r = requests.post(url, json=data)
    if r.status_code == 201:
        return json.loads(r.text)
    else:
        return json.loads(r.text)["error"]


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
def save_process_links(links, process_id, item_id, company_id):
    payload = json.dumps(
        {
            **LINK_CONNECTION_DICT,
            "command": "insert",
            "field": {
                "eventId": get_event_id()["event_id"],
                "links": links,
                "process_id": process_id,
                "item_id": item_id,
                "company_id": company_id,
                "created_on": time,
            },
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )
    response = requests.request(
        "POST", DOWELLCONNECTION_URL, headers=headers, data=payload
    )

    return json.loads(response.text)


# By processID
def get_links_object_by_process_id(process_id):
    fields = {
        "process_id": str(process_id),
    }
    response_obj = dowellconnection(*LINK_CONNECTION_LIST, "find", fields, "nil")
    res_obj = json.loads(response_obj)
    if res_obj["data"] is not None:
        if len(res_obj["data"]):
            return res_obj["data"]
        else:
            return []
    return []


def get_link_object(unique_hash):
    fields = {
        "unique_hash": str(unique_hash),
    }
    response_obj = dowellconnection(*QR_ID_CONNECTION_LIST, "find", fields, "nil")
    res_obj = json.loads(response_obj)
    if res_obj["data"] is not None:
        if len(res_obj["data"]):
            return res_obj["data"]
        else:
            return []
    return []


# By documentID
def get_links_object_by_document_id(document_id):
    fields = {"document_id": str(document_id)}
    response_obj = dowellconnection(*LINK_CONNECTION_LIST, "find", fields, "nil")
    res_obj = json.loads(response_obj)
    if res_obj["data"] is not None:
        if len(res_obj["data"]):
            return res_obj["data"]
        else:
            return []
    return []


#  -------------------------------Workflow Process------------------
def save_process_qrcodes(
    qrcodes, process_id, item_id, processing_choice, process_title, company_id
):
    payload = json.dumps(
        {
            **QR_CONNECTION_DICT,
            "command": "insert",
            "field": {
                "event_id": get_event_id()["event_id"],
                "qrcodes": qrcodes,
                "process_id": process_id,
                "item_id": item_id,
                "processing_choice": processing_choice,
                "process_title": process_title,
                "created_at": time,
                "company_id": company_id,
            },
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )
    response = requests.request(
        "POST", DOWELLCONNECTION_URL, headers=headers, data=payload
    )

    return json.loads(response.text)


# ----------------------- Links Creation -------------------------


def get_process_link_list(company_id):
    fields = {"company_id": str(company_id)}
    response_obj = dowellconnection(*LINK_CONNECTION_LIST, "fetch", fields, "nil")
    res_obj = json.loads(response_obj)
    if len(res_obj["data"]):
        return res_obj["data"]
    else:
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
    portfolio,
    workflows_ids,
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
                "workflow_construct_ids": workflows_ids,
                "created_at": time,
                "creator_portfolio": portfolio,
            },
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )
    response = requests.request(
        "POST", DOWELLCONNECTION_URL, headers=headers, data=payload
    )

    return json.loads(json.loads(response.text))


def update_wf_process(process_id, steps, state):
    payload = json.dumps(
        {
            **WF_PROCESS_DICT,
            "command": "update",
            "field": {
                "_id": process_id,
            },
            "update_field": {"process_steps": steps, "processing_state": state},
            "platform": "bangalore",
        }
    )
    response = requests.request(
        "POST", DOWELLCONNECTION_URL, headers=headers, data=payload
    )

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


def get_process_list(company_id):
    fields = {"company_id": str(company_id)}
    response_obj = dowellconnection(*PROCESS_CONNECTION_LIST, "fetch", fields, "nil")
    res_obj = json.loads(response_obj)
    if len(res_obj["data"]):
        return res_obj["data"]
    else:
        return []


# -------------------------------- Workflows-------------------


def save_wf(workflows, company_id, created_by):
    payload = json.dumps(
        {
            **WF_CONNECTION_DICT,
            "command": "insert",
            "field": {
                "eventId": get_event_id()["event_id"],
                "workflows": workflows,
                "created_by": created_by,
                "company_id": company_id,
                "approved": False,
                "rejected": False,
                "rejected_by": "",
                "rejected_message": "",
                "data_type": data_type,
                "auth_viewers": [],
                "created_on": time,
            },
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )
    response = requests.request(
        "POST", DOWELLCONNECTION_URL, headers=headers, data=payload
    )

    return json.loads(response.text)


def update_wf(workflow_id, old_workflow):

    payload = json.dumps(
        {
            **WF_CONNECTION_DICT,
            "command": "update",
            "field": {
                "_id": workflow_id,
            },
            "update_field": {
                "eventId": get_event_id()["event_id"],
                "workflows": old_workflow["workflows"],
                "created_by": old_workflow["created_by"],
                "company_id": old_workflow["company_id"],
            },
            "platform": "bangalore",
        }
    )
    response = requests.request(
        "POST", DOWELLCONNECTION_URL, headers=headers, data=payload
    )

    return json.loads(response.text)


def update_wf_approval(workflow_id, approval):
    payload = json.dumps(
        {
            **WF_CONNECTION_DICT,
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
    response = requests.request(
        "POST", DOWELLCONNECTION_URL, headers=headers, data=payload
    )
    return json.loads(response.text)


def get_wf_object(workflow_id):
    fields = {"_id": str(workflow_id)}
    response_obj = dowellconnection(*WF_CONNECTION_LIST, "find", fields, "nil")
    res_obj = json.loads(response_obj)
    if len(res_obj["data"]) > 0:
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
    if len(res_obj["data"]) > 0:
        return wf_list  # res_obj["data"]
    else:
        return []


def get_wf_list(company_id, data_type):
    # "data_type": data_type
    fields = {"company_id": str(company_id), }
    response_obj = dowellconnection(*WF_CONNECTION_LIST, "fetch", fields, "nil")
    res_obj = json.loads(response_obj)
    if len(res_obj["data"]) > 0:
        return res_obj["data"]
    else:
        return []


# ------------------------------------------ Templates-----------------------------
def save_template(name, data, page, created_by, company_id, data_type):
    payload = json.dumps(
        {
            **TEMPLATE_CONNECTION_DICT,
            "command": "insert",
            "field": {
                "eventId": get_event_id()["event_id"],
                "template_name": name,
                "content": data,
                "page": page,
                "company_id": company_id,
                "created_by": created_by,
                "approved": False,
                "rejected": False,
                "rejected_by": "",
                "rejected_message": "",
                "data_type": data_type,
                "auth_viewers": [],
                "created_on": time,
            },
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )
    response = requests.request(
        "POST", DOWELLCONNECTION_URL, headers=headers, data=payload
    )
    return json.loads(response.text)


def get_template_object(template_id):
    fields = {"_id": template_id}
    response_obj = dowellconnection(*TEMPLATE_CONNECTION_LIST, "find", fields, "nil")
    res_obj = json.loads(response_obj)
    if len(res_obj["data"]) > 0:
        return res_obj["data"]
    else:
        return []


def update_template(template_id, data):
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
    response = requests.request(
        "POST", DOWELLCONNECTION_URL, headers=headers, data=payload
    )

    return json.loads(response.text)


def update_template_approval(template_id, approval):
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
    response = requests.request(
        "POST", DOWELLCONNECTION_URL, headers=headers, data=payload
    )

    return json.loads(response.text)


def get_template_list(company_id, data_type):
    fields = {"company_id": company_id, "data_type": data_type}
    response_obj = dowellconnection(*TEMPLATE_CONNECTION_LIST, "fetch", fields, "nil")
    res_obj = json.loads(response_obj)
    if len(res_obj["data"]) > 0:
        return res_obj["data"]
    else:
        return []


# -------------------------- Document----------------------------------------
def save_document(
    name,
    data,
    created_by,
    company_id,
    data_type,
    page,
    state,
    auth_viewers,
    document_type,
    parent_id,
    process_id,
):
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
                "process_id": process_id,
            },
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )

    response = requests.request(
        "POST", DOWELLCONNECTION_URL, headers=headers, data=payload
    )

    return json.loads(response.text)


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
    response = requests.request(
        "POST", DOWELLCONNECTION_URL, headers=headers, data=payload
    )

    return json.loads(response.text)


def finalize(item_id, state, item_type):
    payload = None

    if item_type == "document":
        payload = json.dumps(
            {
                **DOCUMENT_CONNECTION_DICT,
                "command": "update",
                "field": {
                    "_id": item_id,
                },
                "update_field": {
                    "document_state": state,
                },
                "platform": "bangalore",
            }
        )

    elif item_type == "template":
        payload = json.dumps(
            {
                **TEMPLATE_CONNECTION_DICT,
                "command": "update",
                "field": {
                    "_id": item_id,
                },
                "update_field": {
                    "document_state": state,
                },
                "platform": "bangalore",
            }
        )

    elif item_type == "workflow":
        payload = json.dumps(
            {
                **WF_CONNECTION_DICT,
                "command": "update",
                "field": {
                    "_id": item_id,
                },
                "update_field": {
                    "document_state": state,
                },
                "platform": "bangalore",
            }
        )

    if payload is not None:
        response = requests.request(
            "POST", DOWELLCONNECTION_URL, headers=headers, data=payload
        )

        return json.loads(json.loads(response.text))

    return


def update_document_clone(document_id, clone_list):
    payload = json.dumps(
        {
            **DOCUMENT_CONNECTION_DICT,
            "command": "update",
            "field": {
                "_id": document_id,
            },
            "update_field": {"clone_list": clone_list},
            "platform": "bangalore",
        }
    )
    response = requests.request(
        "POST", DOWELLCONNECTION_URL, headers=headers, data=payload
    )

    return json.loads(response.text)


def authorize(document_id, viewers, process, item_type):
    payload = None

    if item_type == "document":
        payload = json.dumps(
            {
                **DOCUMENT_CONNECTION_DICT,
                "command": "update",
                "field": {
                    "_id": document_id,
                },
                "update_field": {
                    "auth_viewers": viewers,
                    "document_state": "processing",
                    "process_id": process,
                },
                "platform": "bangalore",
            }
        )

    if item_type == "template":
        payload = json.dumps(
            {
                **TEMPLATE_CONNECTION_DICT,
                "command": "update",
                "field": {
                    "_id": document_id,
                },
                "update_field": {
                    "auth_viewers": viewers,
                    "document_state": "processing",
                    "process_id": process,
                },
                "platform": "bangalore",
            }
        )

    if payload is not None:
        response = requests.request(
            "POST", DOWELLCONNECTION_URL, headers=headers, data=payload
        )

        return json.loads(response.text)

    return


def get_links_list(company_id):
    """Get all links in an org"""
    fields = {
        "company_id": str(company_id),
        # "process_id": str("640260a8bd505fa70c180aa9"),
    }
    response_obj = dowellconnection(*LINK_CONNECTION_LIST, "fetch", fields, "nil")
    res_obj = json.loads(response_obj)
    if len(res_obj["data"]):
        return res_obj["data"]
    else:
        return []


def save_wf_setting(company_id, owner_name, username, portfolio_name, process):
    """Saving workflow settings"""
    payload = json.dumps(
        {
            **WF_AI_SETTING_DICT,
            "command": "insert",
            "field": {
                "eventId": get_event_id()["event_id"],
                "company_id": company_id,
                "owner_name": owner_name,
                "username": username,
                "portfolio_name": portfolio_name,
                "processes": process,
                "data_type": "Real_data",
                "created_on": time,
            },
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )

    response = requests.request(
        "POST", DOWELLCONNECTION_URL, headers=headers, data=payload
    )

    return json.loads(response.text)


# Get WF Setting Data
def get_wf_setting_object(wf_setting_id):
    fields = {"_id": wf_setting_id}
    response_obj = dowellconnection(*WF_AI_SETTING_LIST, "find", fields, "nil")
    # print("document object-------------- \n", response_obj)
    res_obj = json.loads(response_obj)
    try:
        return res_obj["data"]
    except RuntimeError:
        return []


def get_wfai_setting_list(company_id):
    fields = {"company_id": str(company_id)}
    response_obj = dowellconnection(*WF_AI_SETTING_LIST, "fetch", fields, "nil")
    res_obj = json.loads(response_obj)
    if len(res_obj["data"]):
        return res_obj["data"]
    else:
        return []


def wf_setting_update(wf_setting_id, wf_ai_data):

    dd = datetime.now()
    time = dd.strftime("%d:%m:%Y,%H:%M:%S")
    payload = json.dumps(
        {
            **WF_AI_SETTING_DICT,
            "command": "update",
            "field": {
                "_id": wf_setting_id,
            },
            "update_field": {
                "eventId": get_event_id()["event_id"],
                "company_id": wf_ai_data["company_id"],
                "owner_name": wf_ai_data["owner_name"],
                "username": wf_ai_data["username"],
                "portfolio_name": wf_ai_data["portfolio_name"],
                "processes": wf_ai_data["processes"],
                "data_type": "Real_data",
                "created_on": time,
            },
            "platform": "bangalore",
        }
    )
    response = requests.request(
        "POST", DOWELLCONNECTION_URL, headers=headers, data=payload
    )

    return json.loads(response.text)


def get_document_object(document_id):
    fields = {"_id": document_id}
    response_obj = dowellconnection(*DOCUMENT_CONNECTION_LIST, "find", fields, "nil")
    res_obj = json.loads(response_obj)
    try:
        return res_obj["data"]
    except RuntimeError:
        return []


def get_document_list(company_id, data_type):
    fields = {"company_id": str(company_id), "data_type": data_type}
    response_obj = dowellconnection(*DOCUMENT_CONNECTION_LIST, "fetch", fields, "nil")
    res_obj = json.loads(response_obj)
    if len(res_obj["data"]) > 0:
        return res_obj["data"]
    else:
        return []


# ---------- Hashes --------------------------


def save_uuid_hash(
    link,
    process_id,
    item_id,
    auth_role,
    user_name,
    auth_portfolio,
    unique_hash,
    item_type,
):
    payload = json.dumps(
        {
            **QR_ID_CONNECTION_DICT,
            "command": "insert",
            "field": {
                "eventId": get_event_id()["event_id"],
                "link": link,
                "item_id": document_id,
                "process_id": process_id,
                "auth_role": auth_role,
                "user_name": user_name,
                "auth_portfolio": auth_portfolio,
                "unique_hash": unique_hash,
                "item_type": item_type,
                "status": True,  # if True: valid ? Invalid
            },
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )

    response = requests.request(
        "POST", DOWELLCONNECTION_URL, headers=headers, data=payload
    )

    return json.loads(response.text)


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
    payload = json.dumps(
        {
            **QR_ID_CONNECTION_DICT,
            "command": "update",
            "field": {"uuid_hash": uuid_hash},
            "update_field": {"status": False},
            "platform": "bangalore",
        }
    )
    response = requests.request(
        "POST", DOWELLCONNECTION_URL, headers=headers, data=payload
    )

    return json.loads(response.text)


def delete_template(template_id, data_type):

    payload = json.dumps(
        {
            **TEMPLATE_CONNECTION_DICT,
            "command": "update",
            "field": {
                "_id": template_id,
            },
            "update_field": {
                "data_type": data_type,
            },
            "platform": "bangalore",
        }
    )
    response = requests.request(
        "POST", DOWELLCONNECTION_URL, headers=headers, data=payload
    )

    return json.loads(json.loads(response.text))


def delete_document(document_id, data_type):
    payload = json.dumps(
        {
            **DOCUMENT_CONNECTION_DICT,
            "command": "update",
            "field": {
                "_id": document_id,
            },
            "update_field": {
                "data_type": data_type,
            },
            "platform": "bangalore",
        }
    )
    response = requests.request(
        "POST", DOWELLCONNECTION_URL, headers=headers, data=payload
    )

    return json.loads(json.loads(response.text))


def delete_workflow(workflow_id, data_type):
    payload = json.dumps(
        {
            **WF_CONNECTION_DICT,
            "command": "update",
            "field": {
                "_id": workflow_id,
            },
            "update_field": {
                "data_type": data_type,
            },
            "platform": "bangalore",
        }
    )
    response = requests.request(
        "POST", DOWELLCONNECTION_URL, headers=headers, data=payload
    )

    return json.loads(json.loads(response.text))


def delete_process(process_id, data_type):
    payload = json.dumps(
        {
            **WF_PROCESS_DICT,
            "command": "update",
            "field": {
                "_id": process_id,
            },
            "update_field": {
                "data_type": data_type,
            },
            "platform": "bangalore",
        }
    )
    response = requests.request(
        "POST", DOWELLCONNECTION_URL, headers=headers, data=payload
    )

    return json.loads(json.loads(response.text))


def targeted_population(database, collection, fields, period):
    """
    Population Function

    Args:
        database(str): select db name
        collection(str): select collection in that db
        fields: select collection fields
        period: select period

    """

    database_details = {
        "database_name": "mongodb",
        "collection": collection,
        "database": database,
        "fields": fields,
    }

    # number of variables for sampling rule
    number_of_variables = -1

    """
        period can be 'custom' or 'last_1_day' or 'last_30_days' or 'last_90_days' or 'last_180_days' or 'last_1_year' or 'life_time'
        if custom is given then need to specify start_point and end_point
        for others datatpe 'm_or_A_selction' can be 'maximum_point' or 'population_average'
        the the value of that selection in 'm_or_A_value'
        error is the error allowed in percentage
    """

    time_input = {
        "column_name": "Date",
        "split": "week",
        "period": period,
        "start_point": "2021/01/08",
        "end_point": "2021/01/25",
    }

    stage_input_list = []

    # distribution input
    distribution_input = {"normal": 1, "poisson": 0, "binomial": 0, "bernoulli": 0}

    request_data = {
        "database_details": database_details,
        "distribution_input": distribution_input,
        "number_of_variable": number_of_variables,
        "stages": stage_input_list,
        "time_input": time_input,
    }

    response = requests.post(
        url=TARGETED_POPULATION_URL, json=request_data, headers=headers
    )

    res = json.loads(response.text)

    return res


def save_team(
    team_name,
    team_code,
    team_spec,
    details,
    universal_code,
    portfolio_list,
    company_id,
    created_by,
    data_type,
):
    payload = json.dumps(
        {
            **MANAGEMENT_REPORTS_DICT,
            "command": "insert",
            "field": {
                "event_id": get_event_id()["event_id"],
                "team_name": team_name,
                "team_code": team_code,
                "team_spec": team_spec,
                "universal_code": universal_code,
                "details": details,
                # "team_member": team_member,
                "portfolio_list": portfolio_list,
                "created_at": time,
                "company_id": company_id,
                "created_by": created_by,
                "data_type": data_type,
            },
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )
    response = requests.request(
        "POST", DOWELLCONNECTION_URL, headers=headers, data=payload
    )

    return json.loads(response.text)


def get_team(team_id):
    fields = {"_id": team_id}
    response_obj = dowellconnection(*MANAGEMENT_REPORTS_LIST, "find", fields, "nil")
    # print("document object-------------- \n", response_obj)
    res_obj = json.loads(response_obj)
    try:
        return res_obj["data"]
    except RuntimeError:
        return []
