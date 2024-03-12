# helper functions
from app import processing
from education.datacube_connection import (
    datacube_collection_retrieval,
    single_query_clones_collection,
    single_query_document_collection,
    single_query_template_collection,
)
from app.constants import EDITOR_API
import json
from datetime import datetime
import requests


def check_database():
    if True:
        return True
    else:
        return {
            "Message": "Please This service key has no database prepared; create a new database",
            "Url": "https://datacube.uxlivinglab.online/",
        }


def generate_unique_collection_name(existing_collection_names, base_name):
    # Extract indices from existing names
    indices = [
        int(name.split("_")[-1])
        for name in existing_collection_names
        if name.startswith(base_name)
    ]
    # If no indices found, start from 1
    if not indices:
        return f"{base_name}_1"
    # Increment the highest index and generate the new name
    new_index = max(indices) + 1
    return f"{base_name}_{new_index}"


def check_if_name_exists_collection(api_key, collection_name, db_name):
    res = datacube_collection_retrieval(api_key, db_name)
    if res["success"] == True:
        if collection_name not in res["data"][0]:
            new_collection_name = generate_unique_collection_name(res["data"][0])
            return {
                "name": new_collection_name,
                "success": True,
                "Message": "New_name_generated",
                "status": "New",
            }
        else:
            return {
                "name": collection_name,
                "success": True,
                "Message": "template_generated",
                "status": "Existing",
            }
    else:
        return {
            "Message": res["message"],
            "Url": "https://datacube.uxlivinglab.online/",
        }


def create_process_helper(
    company_id,
    workflows,
    created_by,
    creator_portfolio,
    process_type,
    org_name,
    workflows_ids,
    parent_id,
    data_type,
    process_title,
    action,
    email=None,
):
    processing.Process(
        company_id,
        workflows,
        created_by,
        creator_portfolio,
        process_type,
        org_name,
        workflows_ids,
        parent_id,
        data_type,
        process_title,
        action,
        email,
    )


def access_editor(
    item_id,
    item_type,
    api_key,
    database,
    collection_name,
    username="",
    portfolio="",
    email="",
):
    team_member_id = (
        "11689044433"
        if item_type == "document"
        else "1212001" if item_type == "clone" else "22689044433"
    )
    if item_type == "document":
        collection = "DocumentReports"
        document = "documentreports"
        field = "document_name"
    if item_type == "clone":
        collection = "CloneReports"
        document = "CloneReports"
        field = "document_name"
    elif item_type == "template":
        collection = "TemplateReports"
        document = "templatereports"
        field = "template_name"
    if item_type == "document":
        item_name = single_query_document_collection(
            api_key, database, collection_name, {"_id": item_id}
        )
    elif item_type == "clone":
        item_name = single_query_clones_collection(
            api_key, database, collection_name, {"_id": item_id}
        )
    else:
        item_name = single_query_template_collection(
            api_key, database, collection_name, {"_id": item_id}
        )

    name = item_name.get(field, "")
    payload = {
        "product_name": "Workflow AI",
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
            "action": (
                "document"
                if item_type == "document"
                else "clone" if item_type == "clone" else "template"
            ),
            "flag": "editing",
            "name": name,
            "username": username,
            "portfolio": portfolio,
            "email": email,
            "time": str(datetime.utcnow()),
            "command": "update",
            "update_field": {
                field: "",
                "content": "",
                "page": "",
                "edited_by": username,
                "portfolio": portfolio,
                "edited_on": str(datetime.utcnow()),
            },
        },
    }
    try:
        response = requests.post(
            EDITOR_API,
            data=json.dumps(payload),
            headers={"Content-Type": "application/json"},
        )
        return response.json()
    except Exception as e:
        print(e)
        return
