import json
import time
from datetime import datetime

import requests
import multiprocessing

from app.constants import (
    FOLDER_CONNECTION_DICT,
    FOLDER_CONNECTION_LIST,
    DOCUMENT_CONNECTION_DICT,
    DOCUMENT_CONNECTION_LIST,
    CLONES_CONNECTION_DICT,
    CLONES_CONNECTION_LIST,
    DOWELLCONNECTION_URL,
    LINK_CONNECTION_DICT,
    LINK_CONNECTION_LIST,
    MANAGEMENT_REPORTS_DICT,
    MANAGEMENT_REPORTS_LIST,
    PROCESS_CONNECTION_LIST,
    QR_CONNECTION_DICT,
    QR_CONNECTION_LIST,
    TEMPLATE_CONNECTION_DICT,
    TEMPLATE_CONNECTION_LIST,
    WF_AI_SETTING_DICT,
    WF_AI_SETTING_LIST,
    WF_CONNECTION_DICT,
    WF_CONNECTION_LIST,
    PROCESS_CONNECTION_DICT,
)

dd = datetime.now()
time = dd.strftime("%d:%m:%Y,%H:%M:%S")
headers = {"Content-Type": "application/json"}


def bulk_query_qrcode_collection(options):
    qrcodes = get_data_from_data_service(
        *QR_CONNECTION_LIST,
        "fetch",
        field=options,
    )
    return qrcodes


def single_query_qrcode_collection(options):
    qrcode = get_data_from_data_service(
        *QR_CONNECTION_LIST,
        "find",
        field=options,
    )
    return qrcode


def bulk_query_team_collection(options):
    teams = get_data_from_data_service(
        *MANAGEMENT_REPORTS_LIST,
        "fetch",
        field=options,
    )
    return teams


def single_query_team_collection(options):
    team = get_data_from_data_service(
        *MANAGEMENT_REPORTS_LIST,
        "find",
        field=options,
    )
    return team


def bulk_query_process_collection(options):
    processes = get_data_from_data_service(
        *PROCESS_CONNECTION_LIST,
        "fetch",
        field=options,
    )
    return processes


def single_query_process_collection(options):
    processes = get_data_from_data_service(
        *PROCESS_CONNECTION_LIST,
        "find",
        field=options,
    )
    return processes


def bulk_query_document_collection(options):
    documents = get_data_from_data_service(
        *DOCUMENT_CONNECTION_LIST, "fetch", field=options
    )
    return documents


def single_query_document_collection(options):
    documents = get_data_from_data_service(
        *DOCUMENT_CONNECTION_LIST, "find", field=options
    )
    return documents


def bulk_query_template_collection(options):
    templates = get_data_from_data_service(
        *TEMPLATE_CONNECTION_LIST,
        "fetch",
        field=options,
    )
    return templates


def single_query_template_collection(options):
    template = get_data_from_data_service(
        *TEMPLATE_CONNECTION_LIST,
        "find",
        field=options,
    )
    return template


def bulk_query_links_collection(options):
    links = get_data_from_data_service(*LINK_CONNECTION_LIST, "fetch", field=options)
    return links


def single_query_links_collection(options):
    link = get_data_from_data_service(*LINK_CONNECTION_LIST, "fetch", field=options)
    return link


def single_query_clones_collection(options):
    clone = get_data_from_data_service(*CLONES_CONNECTION_LIST, "find", field=options)
    return clone


def bulk_query_clones_collection(options):
    clones = get_data_from_data_service(*CLONES_CONNECTION_LIST, "fetch", field=options)
    return clones


def single_query_settings_collection(options):
    setting = get_data_from_data_service(
        *WF_AI_SETTING_LIST,
        "find",
        field=options,
    )
    return setting


def bulk_query_settings_collection(options):
    settings = get_data_from_data_service(
        *WF_AI_SETTING_LIST,
        "fetch",
        field=options,
    )
    return settings


def bulk_query_workflow_collection(options):
    workflows = get_data_from_data_service(
        *WF_CONNECTION_LIST,
        "fetch",
        field=options,
    )
    return workflows


def single_query_workflow_collection(options):
    workflow = get_data_from_data_service(
        *WF_CONNECTION_LIST,
        "find",
        field=options,
    )
    return workflow


def single_query_folder_collection(options):
    folder = get_data_from_data_service(*FOLDER_CONNECTION_LIST, "find", field=options)
    return folder


def bulk_query_folder_collection(options):
    folders = get_data_from_data_service(
        *FOLDER_CONNECTION_LIST, "fetch", field=options
    )
    return folders


def post_to_data_service(data):
    response = requests.post(url=DOWELLCONNECTION_URL, data=data, headers=headers)
    return json.loads(response.text)


# The Popular dowell connection
def get_data_from_data_service(
    cluster: str,
    platform: str,
    database: str,
    collection: str,
    document: str,
    team_member_ID: str,
    function_ID: str,
    command: str,
    field: dict,
):
    """Pass In DB info + look fields + DB query to get data"""
    payload = json.dumps(
        {
            "cluster": cluster,
            "platform": platform,
            "database": database,
            "collection": collection,
            "document": document,
            "team_member_ID": team_member_ID,
            "function_ID": function_ID,
            "command": command,
            "field": field,
            "update_field": "nil",
        }
    )
    response = post_to_data_service(payload)
    res = json.loads(response)
    if res["data"] is not None:
        if len(res["data"]):
            return res["data"]
    return


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


def save_process_links(options):
    options["eventId"] = get_event_id()["event_id"]
    payload = json.dumps(
        {
            **LINK_CONNECTION_DICT,
            "command": "insert",
            "field": options,
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )
    return post_to_data_service(payload)


def save_to_qrcode_collection(options):
    options["eventId"] = get_event_id()["event_id"]
    payload = json.dumps(
        {
            **QR_CONNECTION_DICT,
            "command": "insert",
            "field": options,
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )
    return post_to_data_service(payload)


def save_to_links_collection(options):
    options["eventId"] = get_event_id()["event_id"]
    payload = json.dumps(
        {
            **LINK_CONNECTION_DICT,
            "command": "insert",
            "field": options,
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )
    return post_to_data_service(payload)


def save_to_workflow_collection(options):
    options["eventId"] = get_event_id()["event_id"]
    options["created_on"] = time
    options["approved"] = False
    options["rejected"] = False
    options["auth_viewers"] = []
    payload = json.dumps(
        {
            **WF_CONNECTION_DICT,
            "command": "insert",
            "field": options,
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )
    return post_to_data_service(payload)


def save_to_template_collection(options):
    options["eventId"] = get_event_id()["event_id"]
    options["created_on"] = time
    options["approved"] = False
    options["rejected"] = False
    options["auth_viewers"] = []
    options["template_state"] = "draft"
    payload = json.dumps(
        {
            **TEMPLATE_CONNECTION_DICT,
            "command": "insert",
            "field": options,
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )
    return post_to_data_service(payload)


def save_to_document_collection(options):
    options["eventId"] = get_event_id()["event_id"]
    options["created_on"] = time
    options["clone_list"] = []
    payload = json.dumps(
        {
            **DOCUMENT_CONNECTION_DICT,
            "command": "insert",
            "field": options,
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )
    return post_to_data_service(payload)


def save_to_clone_collection(options):
    options["eventId"] = get_event_id()["event_id"]
    options["created_on"] = time
    options["approved"] = False
    options["rejected"] = False
    options["clone_list"] = []
    payload = json.dumps(
        {
            **CLONES_CONNECTION_DICT,
            "command": "insert",
            "field": options,
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )
    return post_to_data_service(payload)


def save_to_setting_collection(options):
    """Saving workflow settings"""
    options["eventId"] = get_event_id()["event_id"]
    options["created_on"] = time
    payload = json.dumps(
        {
            **WF_AI_SETTING_DICT,
            "command": "insert",
            "field": options,
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )

    return post_to_data_service(payload)


def save_to_folder_collection(options):
    options["eventId"] = get_event_id()["event_id"]
    options["created_on"] = time
    options["folder_state"] = "draft"
    payload = json.dumps(
        {
            **FOLDER_CONNECTION_DICT,
            "command": "insert",
            "field": options,
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )
    return post_to_data_service(payload)



# Old Functions

def save_process_qrcodes(
    qrcodes, process_id, item_id, processing_choice, process_title, company_id
):
    payload = json.dumps(
        {
            **QR_CONNECTION_DICT,
            "command": "insert",
            "field": {
                "eventId": get_event_id()["event_id"],
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

    return post_to_data_service(payload)


def save_process(
    process_title,
    process_steps,
    created_by,
    company_id,
    data_type,
    parent_item_id,
    process_action,
    creator_portfolio,
    workflows_ids,
    process_type,
    process_kind,
):
    payload = json.dumps(
        {
            **PROCESS_CONNECTION_DICT,
            "command": "insert",
            "field": {
                "eventId": get_event_id()["event_id"],
                "process_title": process_title,
                "process_steps": process_steps,
                "company_id": company_id,
                "created_by": created_by,
                "data_type": data_type,
                "parent_item_id": parent_item_id,
                "processing_action": process_action,
                "processing_state": "draft",
                "process_type": process_type,
                "process_kind": process_kind,
                "workflow_construct_ids": workflows_ids,
                "created_at": time,
                "creator_portfolio": creator_portfolio,
            },
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )
    return post_to_data_service(payload)


def save_workflow(
    workflows, company_id, created_by, portfolio, data_type, workflow_type
):
    payload = json.dumps(
        {
            **WF_CONNECTION_DICT,
            "command": "insert",
            "field": {
                "eventId": get_event_id()["event_id"],
                "workflows": workflows,
                "created_by": created_by,
                "creator_portfolio": portfolio,
                "company_id": company_id,
                "workflow_type": workflow_type,
                "data_type": data_type,
                "approved": False,
                "rejected": False,
                "rejected_by": "",
                "rejected_message": "",
                "auth_viewers": [],
                "created_on": time,
            },
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )
    return post_to_data_service(payload)


def save_template(
    name, data, page, folders, created_by, company_id, data_type, template_type
):
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
                "template_type": template_type,
                "data_type": data_type,
                "approved": False,
                "rejected": False,
                "rejected_by": "",
                "rejected_message": "",
                "auth_viewers": [],
                "template_state": "draft",
                "created_on": time,
                "folders": folders,
            },
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )
    return post_to_data_service(payload)


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
    folders,
):
    payload = json.dumps(
        {
            **DOCUMENT_CONNECTION_DICT,
            "command": "insert",
            "field": {
                "eventId": get_event_id()["event_id"],
                "document_name": name,
                "content": data,
                "company_id": company_id,
                "created_by": created_by,
                "created_at": time,
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
                "folders": folders,
            },
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )
    return post_to_data_service(payload)


def save_clone(
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
    folders,
):
    payload = json.dumps(
        {
            **CLONES_CONNECTION_DICT,
            "command": "insert",
            "field": {
                "eventId": get_event_id()["event_id"],
                "document_name": name,
                "content": data,
                "company_id": company_id,
                "created_by": created_by,
                "created_at": time,
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
                "folders": folders,
            },
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )
    return post_to_data_service(payload)


def save_workflow_setting(
    company_id,
    created_by,
    data_type,
    process,
    documents,
    templates,
    workflows,
    notarisation,
    folders,
    records,
    references,
    approval,
    evaluation,
    reports,
    management,
    portfolio,
    theme_color,
):
    """Saving workflow settings"""

    payload = json.dumps(
        {
            **WF_AI_SETTING_DICT,
            "command": "insert",
            "field": {
                "eventId": get_event_id()["event_id"],
                "company_id": company_id,
                "created_by": created_by,
                "Process": process,
                "Documents": documents,
                "Templates": templates,
                "Workflows": workflows,
                "Notarisation": notarisation,
                "Folders": folders,
                "Records": records,
                "References": references,
                "Approval_Process": approval,
                "Evaluation_Process": evaluation,
                "Reports": reports,
                "Management": management,
                "Portfolio_Choice": portfolio,
                "theme_color": theme_color,
                "data_type": data_type,
                "created_on": time,
            },
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )

    return post_to_data_service(payload)


# New folder
def save_folder(name, data, created_by, company_id, data_type, folder_type):
    payload = json.dumps(
        {
            **FOLDER_CONNECTION_DICT,
            "command": "insert",
            "field": {
                "eventId": get_event_id()["event_id"],
                "folder_name": name,
                "company_id": company_id,
                "created_by": created_by,
                "folder_type": folder_type,
                "data_type": data_type,
                "auth_viewers": [],
                "folder_state": "draft",
                "created_on": time,
                "data": data,
            },
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )
    return post_to_data_service(payload)


def update_folder(folder_id, old_folder):
    payload = json.dumps(
        {
            **FOLDER_CONNECTION_DICT,
            "command": "update",
            "field": {
                "_id": folder_id,
            },
            "update_field": {
                "eventId": get_event_id()["event_id"],
                "data": old_folder["data"],
                "created_by": old_folder["created_by"],
                "company_id": old_folder["company_id"],
                "folder_name": old_folder["folder_name"],
            },
            "platform": "bangalore",
        }
    )
    return post_to_data_service(payload)


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
            **QR_CONNECTION_DICT,
            "command": "insert",
            "field": {
                "eventId": get_event_id()["event_id"],
                "link": link,
                "item_id": item_id,
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
    return post_to_data_service(payload)


def save_team(
    team_name,
    team_type,
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
                "team_name": team_name,
                "team_type": team_type,
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
    return post_to_data_service(payload)


def authorize(document_id, viewers, process_id, item_type):
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
                    "process_id": process_id,
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
                    "process_id": process_id,
                },
                "platform": "bangalore",
            }
        )
    if payload is not None:
        return post_to_data_service(payload)

    return


def finalize_item(item_id, state, item_type):
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
        # print(payload)
        return post_to_data_service(payload)
    return


def update_process(process_id, steps, state):
    payload = json.dumps(
        {
            **PROCESS_CONNECTION_DICT,
            "command": "update",
            "field": {
                "_id": process_id,
            },
            "update_field": {"process_steps": steps, "processing_state": state},
            "platform": "bangalore",
        }
    )
    return post_to_data_service(payload)


def update_process_with_links(process_id, steps, state, links):
    payload = json.dumps(
        {
            **PROCESS_CONNECTION_DICT,
            "command": "update",
            "field": {
                "_id": process_id,
            },
            "update_field": {
                "process_steps": steps,
                "processing_state": state,
                "links": links,
            },
            "platform": "bangalore",
        }
    )
    return post_to_data_service(payload)


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
    return post_to_data_service(payload)


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
    return post_to_data_service(payload)


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
    return post_to_data_service(payload)


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
    return post_to_data_service(payload)


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
    return post_to_data_service(payload)


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
    return post_to_data_service(payload)


def org_wfai_setting(company_id, org_name, data_type="Real_data"):
    fields = {
        "company_id": str(company_id),
        "created_by": org_name,
        "data_type": data_type,
    }
    response_obj = get_data_from_data_service(*WF_AI_SETTING_LIST, "fetch", fields)
    # res_obj = json.loads(response_obj)
    # if len(res_obj["data"]) > 0:
    #     return res_obj["data"]
    # else:
    #     return []
    return response_obj


def update_workflow_setting(wf_setting_id, data):
    payload = json.dumps(
        {
            **WF_AI_SETTING_DICT,
            "command": "update",
            "field": {
                "_id": wf_setting_id,
            },
            "update_field": {
                "Process": data["Process"],
                "Documents": data["Documents"],
                "Templates": data["Templates"],
                "Workflows": data["Workflows"],
                "Notarisation": data["Notarisation"],
                "Folders": data["Folders"],
                "Records": data["Records"],
                "References": data["References"],
                "Approval_Process": data["Approval_Process"],
                "Evaluation_Process": data["Evaluation_Process"],
                "Reports": data["Reports"],
                "Management": data["Management"],
                "Portfolio_Choice": data["Portfolio_Choice"],
                "theme_color": data["theme_color"],
                "data_type": "Real_data",
                "created_at": time,
            },
            "platform": "bangalore",
        }
    )
    return post_to_data_service(payload)


def update_uuid_object(uuid_hash):
    payload = json.dumps(
        {
            **QR_CONNECTION_DICT,
            "command": "update",
            "field": {"uuid_hash": uuid_hash},
            "update_field": {"status": False},
            "platform": "bangalore",
        }
    )
    return post_to_data_service(payload)


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
    return post_to_data_service(payload)


def delete_folder(folder_id, data_type):
    payload = json.dumps(
        {
            **FOLDER_CONNECTION_DICT,
            "command": "update",
            "field": {
                "_id": folder_id,
            },
            "update_field": {
                "data_type": data_type,
            },
            "platform": "bangalore",
        }
    )
    return post_to_data_service(payload)


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
    return post_to_data_service(payload)


def add_document_to_folder(document_id, folder):
    old_document = single_query_document_collection({"_id": document_id})
    old_document["folders"] = old_document.get("folders")
    if old_document["folders"] is not None:
        try:
            old_document["folders"].append(folder)
        except:
            old_document["folders"] = [folder]
    new_folder = old_document["folders"]
    payload = json.dumps(
        {
            **DOCUMENT_CONNECTION_DICT,
            "command": "update",
            "field": {
                "_id": document_id,
            },
            "update_field": {
                "folders": new_folder,
            },
            "platform": "bangalore",
        }
    )
    return post_to_data_service(payload)


def add_template_to_folder(template_id, folder):
    old_template = single_query_template_collection({"_id": template_id})
    old_template["folders"] = old_template.get("folders")
    if old_template["folders"] is not None:
        try:
            old_template["folders"].append(folder)
        except:
            old_template["folders"] = [folder]
    new_folder = old_template["folders"]
    payload = json.dumps(
        {
            **TEMPLATE_CONNECTION_DICT,
            "command": "update",
            "field": {
                "_id": template_id,
            },
            "update_field": {
                "folders": new_folder,
            },
            "platform": "bangalore",
        }
    )
    return post_to_data_service(payload)


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
    return post_to_data_service(payload)


def delete_process(process_id, data_type):
    payload = json.dumps(
        {
            **PROCESS_CONNECTION_DICT,
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
    return post_to_data_service(payload)


def update_team_data(team_id, team_data):
    payload = json.dumps(
        {
            **MANAGEMENT_REPORTS_DICT,
            "command": "update",
            "field": {
                "_id": team_id,
            },
            "update_field": {
                "team_name": team_data["team_name"],
                "team_type": team_data["team_type"],
                "team_code": team_data["team_code"],
                "team_spec": team_data["team_spec"],
                "universal_code": team_data["universal_code"],
                "details": team_data["details"],
                "portfolio_list": team_data["portfolio_list"],
                "company_id": team_data["company_id"],
                "created_by": team_data["created_by"],
                "data_type": team_data["data_type"],
            },
            "platform": "bangalore",
        }
    )
    return post_to_data_service(payload)


def reminder_func(reminder):
    data = get_data_from_data_service(
        *PROCESS_CONNECTION_LIST,
        "fetch",
        {
            "data_type": "Real_Data",
            "processing_state": {"$ne": "completed"},
            "process_steps.stepReminder": reminder,
            "process_steps.stepTeamMembers": {"$exists": True},
            # "process_steps.stepState": {"$exists": True, "$ne": "completed"},
        },
    )
    reminder_list = [
        reminders[0]
        for reminders in list(
            [
                [
                    {
                        "process_id": x["_id"],
                        "processing_state": x["processing_state"],
                        "item_id": x["parent_document_id"],
                        "productName": "Workflow AI",
                        "companyId": x["company_id"],
                        "title": x["process_title"],
                        "orgName": "WorkflowAi",
                        "message": "You have a document to sign.",
                        "link": "",
                        "duration": "no limit",  # TODO: pass reminder time here
                        "username": [
                            item["member"]
                            for item in st["stepTeamMembers"]
                            if "member" in item
                        ],
                        "portfolio": [
                            item["portfolio"]
                            for item in st["stepTeamMembers"]
                            if "portfolio" in item
                        ],
                        "reminder": st["stepReminder"],
                        # "step_state": st["stepState"],
                        "message": f"You have incomplete step in  Process {x['_id']}. Please Complete it as Soon as Possible!",
                    }
                    for st in x["process_steps"]
                    if "stepTeamMembers" and "stepReminder" in st
                ]
                for x in data
                if "parent_document_id" in x
            ],
        )
    ]
    return reminder_list


def process_folders_to_item(ids, folder_id, add_item_to_folder):
    processes = []
    for id in ids:
        process = multiprocessing.Process(
            target=add_item_to_folder, args=(id, folder_id)
        )
        process.start()
        processes.append(process)

    for process in processes:
        process.join()


def delete_items_in_folder(item_id, folder_id, item_type):
    old_folder = single_query_folder_collection({"_id": folder_id})
    old_data = old_folder.get("data")
    if item_type == "template":
        new_data = [
            {k: v for k, v in item.items() if not (k == "template_id" and v == item_id)}
            for item in old_data
            if item
        ]
        old_template = single_query_template_collection({"_id": item_id})
        old_template["folders"] = old_template.get("folders")
        if old_template["folders"] is not None:
            try:
                old_template["folders"].remove(folder_id)
            except:
                old_template["folders"] = []
        new_folder = old_template["folders"]
        payload = json.dumps(
            {
                **TEMPLATE_CONNECTION_DICT,
                "command": "update",
                "field": {
                    "_id": item_id,
                },
                "update_field": {
                    "folders": new_folder,
                },
                "platform": "bangalore",
            }
        )
        post_to_data_service(payload)
    if item_type == "document":
        new_data = [
            {k: v for k, v in item.items() if not (k == "document_id" and v == item_id)}
            for item in old_data
            if item
        ]
        old_document = single_query_document_collection({"_id": item_id})
        old_document["folders"] = old_document.get("folders")
        if old_document["folders"] is not None:
            try:
                old_document["folders"].remove(folder_id)
            except:
                old_document["folders"] = []
        new_folder = old_document["folders"]
        payload = json.dumps(
            {
                **DOCUMENT_CONNECTION_DICT,
                "command": "update",
                "field": {
                    "_id": item_id,
                },
                "update_field": {
                    "folders": new_folder,
                },
                "platform": "bangalore",
            }
        )
        post_to_data_service(payload)

    new_data = [d for d in new_data if d]

    payload = json.dumps(
        {
            **FOLDER_CONNECTION_DICT,
            "command": "update",
            "field": {
                "_id": folder_id,
            },
            "update_field": {
                "eventId": get_event_id()["event_id"],
                "data": new_data,
                "created_by": old_folder["created_by"],
                "company_id": old_folder["company_id"],
                "folder_name": old_folder["folder_name"],
            },
            "platform": "bangalore",
        }
    )
    return post_to_data_service(payload)
