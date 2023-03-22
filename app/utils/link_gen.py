import json

import requests

from app.constants import EDITOR_API


def document(document_id, doc_map, doc_rights, user, process_id, role):
    payload = {
        "product_name": "workflowai",
        "details": {
            "_id": document_id,
            "field": "document_name",
            "action": "document",
            "cluster": "Documents",
            "database": "Documentation",
            "collection": "DocumentReports",
            "document": "documentreports",
            "team_member_ID": "11689044433",
            "function_ID": "ABCDE",
            "command": "update",
            "flag": "signing",
            "authorized": user,
            "document_map": doc_map,
            "document_right": doc_rights,
            "role": role,
            "process_id": process_id,
            "update_field": {"document_name": "", "content": "", "page": ""},
        },
    }
    try:
        link = requests.post(EDITOR_API, data=json.dumps(payload))
        return link
    except ConnectionError:
        return


def editor(item_id, type):

    if type == "document":
        collection = "DocumentReports"
        document = "documentreports"
        action = "document"
        field = "document_name"
        team_member_id = "11689044433"

    if type == "template":
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
            "action": action,
            "flag": "editing",
            "command": "update",
            "update_field": {field: "", "content": "", "page": ""},
        },
    }
    try:
        response = requests.post(
            EDITOR_API,
            data=json.dumps(payload),
        )
    except:
        return None

    return response.json()
