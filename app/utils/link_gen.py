import json

import requests

from app.constants import EDITOR_API

headers = {"Content-Type": "application/json"}


def to_editor(item_id, item_map, item_rights, user, process_id, user_role, item_type):
    if item_type == "document":
        collection = "DocumentReports"
        document = "documentreports"
        action = "document"
        field = "document_name"
        team_member_id = "11689044433"

    elif item_type == "template":
        collection = "TemplateReports"
        document = "templatereports"
        action = "template"
        field = "template_name"
        team_member_id = "22689044433"

    payload = {
        "product_name": "workflowai",
        "details": {
            "field": "document_name",
            "cluster": "Documents",
            "database": "Documentation",
            "collection": collection,
            "document": document,
            "team_member_ID": team_member_id,
            "function_ID": "ABCDE",
            "command": "update",
            "_id": item_id,
            "flag": "signing",
            "action": item_type,
            "authorized": user,
            "document_map": item_map,
            "document_right": item_rights,
            "role": user_role,
            "process_id": process_id,
            "update_field": {"document_name": "", "content": "", "page": ""},
        },
    }
    try:
        link = requests.post(EDITOR_API, data=json.dumps(payload), headers=headers)
    except ConnectionError:
        return

    return link.json()


def editor(item_id, item_type):
    if item_type == "document":
        collection = "DocumentReports"
        document = "documentreports"
        action = "document"
        field = "document_name"
        team_member_id = "11689044433"

    if item_type == "template":
        collection = "TemplateReports"
        document = "templatereports"
        action = "template"
        field = "template_name"
        team_member_id = "22689044433"

    payload = {
        "product_name": "workflow_ai",
        "details": {
            "cluster": "Documents",
            "database": "Documentation",
            "collection": collection,
            "document": document,
            "team_member_ID": team_member_id,
            "function_ID": "ABCDE",
            "_id": item_id,
            "field": field,
            "type": item_type,
            "action": action,
            "flag": "editing",
            "command": "update",
            "update_field": {field: "", "content": "", "page": ""},
        },
    }
    try:
        response = requests.post(EDITOR_API, data=json.dumps(payload), headers=headers)
    except ConnectionError():
        return

    return response.json()
