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
