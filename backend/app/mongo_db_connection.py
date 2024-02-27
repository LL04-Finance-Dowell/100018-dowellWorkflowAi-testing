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
    DOCUMENT_METADATA_CONNECTION_DICT,
    DOCUMENT_METADATA_CONNECTION_LIST,
    CLONES_CONNECTION_DICT,
    CLONES_CONNECTION_LIST,
    CLONES_METADATA_CONNECTION_DICT,
    CLONES_METADATA_CONNECTION_LIST,
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
    TEMPLATE_METADATA_CONNECTION_DICT,
    TEMPLATE_METADATA_CONNECTION_LIST,
    WF_AI_SETTING_DICT,
    WF_AI_SETTING_LIST,
    WF_CONNECTION_DICT,
    WF_CONNECTION_LIST,
    PROCESS_CONNECTION_DICT,
    PUBLIC_CONNECTION_LIST,
    PUBLIC_CONNECTION_DICT,
)

dd = datetime.utcnow()
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


def bulk_query_public_collection(options):
    public = get_data_from_data_service(*PUBLIC_CONNECTION_LIST, "fetch", field=options)
    return public


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


def bulk_query_document_metadata_collection(options):
    documents = get_data_from_data_service(
        *DOCUMENT_METADATA_CONNECTION_LIST, "fetch", field=options
    )
    return documents


def single_query_document_metadata_collection(options):
    documents = get_data_from_data_service(
        *DOCUMENT_METADATA_CONNECTION_LIST, "find", field=options
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


def bulk_query_template_metadata_collection(options):
    templates = get_data_from_data_service(
        *TEMPLATE_METADATA_CONNECTION_LIST,
        "fetch",
        field=options,
    )
    return templates


def single_query_template_metadata_collection(options):
    template = get_data_from_data_service(
        *TEMPLATE_METADATA_CONNECTION_LIST,
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


def single_query_clones_metadata_collection(options):
    clone = get_data_from_data_service(
        *CLONES_METADATA_CONNECTION_LIST, "find", field=options
    )
    return clone


def bulk_query_clones_metadata_collection(options):
    clones = get_data_from_data_service(
        *CLONES_METADATA_CONNECTION_LIST, "fetch", field=options
    )
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
    return []


def get_template_list(company_id, data_type):
    templates = get_data_from_data_service(
        *TEMPLATE_CONNECTION_LIST,
        "fetch",
        {"company_id": company_id, "data_type": data_type},
    )
    return templates


def get_links_object_by_process_id(process_id):
    links = get_data_from_data_service(
        *LINK_CONNECTION_LIST,
        "fetch",
        {"process_id": str(process_id)},
    )
    return links


def get_link_object(unique_hash):
    link_ob = get_data_from_data_service(
        *QR_CONNECTION_LIST, "find", {"unique_hash": str(unique_hash)}
    )
    return link_ob


def get_links_object_by_document_id(document_id):
    links_ob = get_data_from_data_service(
        *LINK_CONNECTION_LIST, "fetch", {"document_id": str(document_id)}
    )
    return links_ob


def get_links_list(company_id):
    links = get_data_from_data_service(
        *LINK_CONNECTION_LIST, "fetch", {"company_id": str(company_id)}
    )
    return links


def get_workflow_setting_object(wf_setting_id):
    setting = get_data_from_data_service(
        *WF_AI_SETTING_LIST,
        "find",
        {"_id": wf_setting_id},
    )
    return setting


def get_wfai_setting_list(company_id, data_type):
    settings = get_data_from_data_service(
        *WF_AI_SETTING_LIST,
        "fetch",
        {"company_id": str(company_id), "data_type": data_type},
    )
    return settings


def get_document_object(document_id):
    document = get_data_from_data_service(
        *DOCUMENT_CONNECTION_LIST, "find", {"_id": document_id}
    )
    return document


def get_clone_object(clone_id):
    clone = get_data_from_data_service(
        *CLONES_CONNECTION_LIST, "find", {"_id": clone_id}
    )
    return clone


def get_document_list(company_id, data_type):
    documents = get_data_from_data_service(
        *DOCUMENT_CONNECTION_LIST,
        "fetch",
        {"company_id": str(company_id), "data_type": data_type},
    )
    return documents


def get_clone_list(company_id, data_type):
    clones = get_data_from_data_service(
        *CLONES_CONNECTION_LIST,
        "fetch",
        {"company_id": str(company_id), "data_type": data_type},
    )
    return clones


def get_folder_list(company_id, data_type):
    folders = get_data_from_data_service(
        *FOLDER_CONNECTION_LIST,
        "fetch",
        {"company_id": str(company_id), "data_type": data_type},
    )
    return folders


def get_uuid_object(uuid_hash):
    uuid = get_data_from_data_service(
        *QR_CONNECTION_LIST, "find", {"uuid_hash": uuid_hash}
    )
    return uuid


def get_uuid(process_id):
    return get_data_from_data_service(
        *QR_CONNECTION_LIST, "fetch", {"process_id": process_id}
    )


def get_team(team_id):
    team = get_data_from_data_service(
        *MANAGEMENT_REPORTS_LIST, "find", {"_id": team_id}
    )
    return team


def get_team_list(company_id):
    teams = get_data_from_data_service(
        *MANAGEMENT_REPORTS_LIST,
        "fetch",
        {"company_id": str(company_id)},
    )
    return teams


def get_template_object(template_id):
    template = get_data_from_data_service(
        *TEMPLATE_CONNECTION_LIST, "find", {"_id": template_id}
    )
    return template


def get_folder_object(folder_id):
    folder = get_data_from_data_service(
        *FOLDER_CONNECTION_LIST, "find", {"_id": folder_id}
    )
    return folder


def get_wf_list(company_id, data_type):
    workflows = get_data_from_data_service(
        *WF_CONNECTION_LIST,
        "fetch",
        {"company_id": str(company_id), "data_type": data_type},
    )
    return workflows


def get_wf_object(workflow_id):
    workflow = get_data_from_data_service(
        *WF_CONNECTION_LIST, "find", {"_id": str(workflow_id)}
    )
    return workflow


def get_process_object(workflow_process_id):
    process = get_data_from_data_service(
        *PROCESS_CONNECTION_LIST,
        "find",
        {"_id": str(workflow_process_id)},
    )
    return process


def get_process_list(company_id, data_type):
    processes = get_data_from_data_service(
        *PROCESS_CONNECTION_LIST,
        "fetch",
        {
            "company_id": str(company_id),
            "data_type": data_type,
        },
    )
    return processes


def get_process_link_list(company_id):
    process_links = get_data_from_data_service(
        *LINK_CONNECTION_LIST, "fetch", {"company_id": str(company_id)}
    )
    return process_links


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


# ------- DB INSERT -------------


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


def save_to_template_metadata_collection(options):
    options["created_on"] = time
    options["approved"] = False
    options["rejected"] = False
    options["template_state"] = "draft"
    payload = json.dumps(
        {
            **TEMPLATE_METADATA_CONNECTION_DICT,
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


def save_to_document_metadata_collection(options):
    options["eventId"] = get_event_id()["event_id"]
    options["created_on"] = time
    options["clone_list"] = []
    payload = json.dumps(
        {
            **DOCUMENT_METADATA_CONNECTION_DICT,
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


def save_to_clone_metadata_collection(options):
    options["eventId"] = get_event_id()["event_id"]
    options["created_on"] = time
    options["approved"] = False
    options["rejected"] = False
    options["clone_list"] = []
    payload = json.dumps(
        {
            **CLONES_METADATA_CONNECTION_DICT,
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


def save_to_team_collection(options):
    options["eventId"] = get_event_id()["event_id"]
    options["created_on"] = time
    payload = json.dumps(
        {
            **MANAGEMENT_REPORTS_DICT,
            "command": "insert",
            "field": options,
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )
    return post_to_data_service(payload)


def save_to_process_collection(options):
    options["eventId"] = get_event_id()["event_id"]
    options["created_on"] = time
    payload = json.dumps(
        {
            **PROCESS_CONNECTION_DICT,
            "command": "insert",
            "field": options,
            "update_field": {"order_nos": 21},
            "platform": "bangalore",
        }
    )
    return post_to_data_service(payload)


def save_to_public_collection(options):
    payload = json.dumps(
        {
            **PUBLIC_CONNECTION_DICT,
            "command": "insert",
            "field": options,
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


def authorize_metadata(metadata_id, viewers, process_id, item_type):
    payload = None
    if item_type == "document":  # document here is process_type
        payload = json.dumps(
            {
                **CLONES_METADATA_CONNECTION_DICT,
                "command": "update",
                "field": {
                    "_id": metadata_id,
                },
                "update_field": {
                    "auth_viewers": [viewers],
                    "document_state": "processing",
                    "process_id": process_id,
                },
                "platform": "bangalore",
            }
        )
    if item_type == "template":
        payload = json.dumps(
            {
                **TEMPLATE_METADATA_CONNECTION_DICT,
                "command": "update",
                "field": {
                    "_id": metadata_id,
                },
                "update_field": {
                    "auth_viewers": [viewers],
                    "document_state": "processing",
                    "process_id": process_id,
                },
                "platform": "bangalore",
            }
        )
    if payload is not None:
        return post_to_data_service(payload)

    return


def authorize(document_id, viewers, process_id, item_type):
    payload = None
    metadata_payload = None
    if item_type == "document":
        if isinstance(viewers, list):
            payload = json.dumps(
                {
                    **CLONES_CONNECTION_DICT,
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
            metadata_payload = json.dumps(
                {
                    **CLONES_METADATA_CONNECTION_DICT,
                    "command": "update",
                    "field": {
                        "collection_id": document_id,
                    },
                    "update_field": {
                        "auth_viewers": viewers,
                        "document_state": "processing",
                        "process_id": process_id,
                    },
                    "platform": "bangalore",
                }
            )
        else:
            payload = json.dumps(
                {
                    **CLONES_CONNECTION_DICT,
                    "command": "update",
                    "field": {
                        "_id": document_id,
                    },
                    "update_field": {
                        "auth_viewers": [viewers],
                        "document_state": "processing",
                        "process_id": process_id,
                    },
                    "platform": "bangalore",
                }
            )
            metadata_payload = json.dumps(
                {
                    **CLONES_METADATA_CONNECTION_DICT,
                    "command": "update",
                    "field": {
                        "collection_id": document_id,
                    },
                    "update_field": {
                        "auth_viewers": [viewers],
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
                    "auth_viewers": [viewers],
                    "template_state": "draft",
                    "process_id": process_id,
                },
                "platform": "bangalore",
            }
        )

    if payload is not None:
        if metadata_payload is not None:
            post_to_data_service(metadata_payload)
        return post_to_data_service(payload)

    return


def finalize_item(item_id, state, item_type, message, signers=None):
    payload = None
    payload_dict = None
    if item_type == "document":
        payload_dict = {
            **DOCUMENT_CONNECTION_DICT,
            "command": "update",
            "field": {
                "_id": item_id,
            },
            "update_field": {"document_state": state, "message": message},
            "platform": "bangalore",
        }
        payload = json.dumps(payload_dict)
    elif item_type == "clone":
        payload_dict = {
            **CLONES_CONNECTION_DICT,
            "command": "update",
            "field": {
                "_id": item_id,
            },
            "update_field": {"document_state": state, "message": message},
            "platform": "bangalore",
        }
        payload = json.dumps(payload_dict)
    elif item_type == "template":
        payload_dict = {
            **TEMPLATE_CONNECTION_DICT,
            "command": "update",
            "field": {
                "_id": item_id,
            },
            "update_field": {"template_state": state, "message": message},
            "platform": "bangalore",
        }
        payload = json.dumps(payload_dict)
    elif item_type == "workflow":
        payload_dict = {
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
        payload = json.dumps(payload_dict)

    if payload is not None:
        if signers is not None:
            update_field = payload_dict["update_field"]
            update_field["signed_by"] = signers
            payload = json.dumps(payload_dict)

            return post_to_data_service(payload)
        else:
            return post_to_data_service(payload)
    return


def update_metadata(item_id, state, item_type, signers=None):
    payload = None
    payload_dict = None
    if item_type == "document":
        payload_dict = {
            **DOCUMENT_METADATA_CONNECTION_DICT,
            "command": "update",
            "field": {
                "_id": item_id,
            },
            "update_field": {
                "document_state": state,
            },
            "platform": "bangalore",
        }
        payload = json.dumps(payload_dict)
    elif item_type == "clone":
        payload_dict = {
            **CLONES_METADATA_CONNECTION_DICT,
            "command": "update",
            "field": {
                "_id": item_id,
            },
            "update_field": {
                "document_state": state,
            },
            "platform": "bangalore",
        }
        payload = json.dumps(payload_dict)
    elif item_type == "template":
        payload_dict = {
            **TEMPLATE_METADATA_CONNECTION_DICT,
            "command": "update",
            "field": {
                "_id": item_id,
            },
            "update_field": {
                "template_state": state,
            },
            "platform": "bangalore",
        }
        payload = json.dumps(payload_dict)
    if payload is not None:
        if signers is not None:
            update_field = payload_dict["update_field"]
            update_field["signed_by"] = signers
            return post_to_data_service(payload)
        else:
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


def update_template(template_id, process_id, state):
    payload = json.dumps(
        {
            **DOCUMENT_CONNECTION_DICT,
            "command": "update",
            "field": {
                "_id": template_id,
            },
            "update_field": {
                "process_id": process_id,
                "template_state": state,
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
            **TEMPLATE_METADATA_CONNECTION_DICT,
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
            **DOCUMENT_METADATA_CONNECTION_DICT,
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

def update_group_collection(group_id, options):
    payload = json.dumps(
        {
            **MANAGEMENT_REPORTS_DICT,
            "command": "update",
            "field": {
                "_id": group_id,
            },
            "update_field": options,
            "platform": "bangalore",
        }
    )
    return post_to_data_service(payload)


def delete_group_collection(group_id, data_type):
    payload = json.dumps(
        {
            **MANAGEMENT_REPORTS_DICT,
            "command": "update",
            "field": {
                "_id": group_id,
            },
            "update_field": {
              "data_type":data_type  
            },
            "platform": "bangalore",
        }
    )
     
    return post_to_data_service(payload)

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
