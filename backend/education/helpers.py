# helper functions
from app import processing
from education.datacube_connection import (
    datacube_collection_retrieval,
    get_clone_from_collection,
    get_data_from_collection,
    get_document_from_collection,
    get_template_from_collection,
)
from app.constants import EDITOR_API
import json
from datetime import datetime
import requests
from rest_framework.response import Response
import re

import concurrent.futures


class InvalidTokenException(Exception):
    pass


def CustomResponse(success=True, message=None, response=None, status_code=None):
    """
    Create a custom response.
    :param success: Whether the operation was successful or not.
    :param message: Any message associated with the response.
    :param data: Data to be included in the response.
    :param status_code: HTTP status code for the response.
    :return: Response object.
    """
    response_data = {"success": success}
    if message is not None:
        response_data["message"] = message
    if response is not None:
        response_data["response"] = response

    return (
        Response(response_data, status=status_code)
        if status_code
        else Response(response_data)
    )


def authorization_check(api_key):
    """
    Checks the validity of the API key.

    :param api_key: The API key to be validated.
    :return: The extracted token if the API key is valid.
    :raises InvalidTokenException: If the API key is missing, invalid, or has an incorrect format.
    """
    if not api_key or not api_key.startswith("Bearer "):

        raise InvalidTokenException("Bearer token is missing or invalid")
    try:
        _, token = api_key.split(" ")
    except ValueError:
        raise InvalidTokenException("Invalid Authorization header format")

    return token


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
    base_name = re.sub(r"_\d+$", "", collection_name)
    if res["success"]:
        # THIS SHOULD WORK AS WELL
        # if not [collection_name in item for item in res["data"][0]]:
        #     print("essssss: ", res["data"][0])
        #     new_collection_name = generate_unique_collection_name(res["data"][0], base_name)
        if collection_name in res["data"][0]:
            new_collection_name = generate_unique_collection_name(
                res["data"][0], base_name
            )
            return {
                "name": new_collection_name,
                "success": True,
                "Message": "New_name_generated",
                "status": "New",
            }
        else:
            return {
                # "name": [item for item in res["data"][0] if collection_name in item][0],
                "name": collection_name,
                "success": True,
                "Message": "template_generated",
                "status": "Existing",
            }
    else:
        return {
            "success": False,
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
        item_name = get_document_from_collection(
            api_key, database, collection_name, {"_id": item_id}
        )
    elif item_type == "clone":
        item_name = get_clone_from_collection(
            api_key, database, collection_name, {"_id": item_id}
        )
    else:
        item_name = get_template_from_collection(
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


# to be used later
"""collection_names = check_if_name_exists_collection(
            api_key, collection_name, db_name
        )
        if collection_names["success"]:
            collection_name = f"{collection_names['name']}
        create_new_collection_for_template = add_collection_to_database(
                api_key=api_key,
                database=db_name,
                collections=collection_name,
            )
            print(create_new_collection_for_template)
        else:
            return CustomResponse(
                False,
                str(collection_names["Message"]),
                "Create a database",
                status.HTTP_400_BAD_REQUEST,
            )
        ##   create_new_collection_for_template_metadata=

        if create_new_collection_for_template["success"]:"""



def is_finalized(api_key, db_name, collection_name, item_id, item_type):
    if item_type == "document":
        document = get_document_from_collection(
            api_key, db_name, collection_name, {"_id": item_id}
        )
        doc_state = document["document_state"]
        if doc_state == "finalized":
            return True, doc_state
        if doc_state == "rejected":
            return True, doc_state
    if item_type == "clone":
        document = get_clone_from_collection(
            api_key, db_name, collection_name, {"_id": item_id}
        )
        doc_state = document["document_state"]
        if doc_state == "finalized":
            return True, doc_state
        if doc_state == "rejected":
            return True, doc_state
    if item_type == "template":
        template = get_template_from_collection(
            api_key, db_name, collection_name, {"collection_name": collection_name}
        )
        temp_state = template["template_state"]
        if temp_state == "saved":
            return True, temp_state
        elif temp_state == "rejected":
            return True, temp_state
        elif temp_state == "draft":
            return False, "draft"
    return False, "processing"


def update_signed(signers_list: list, member: str, status: bool) -> list:
    if signers_list:
        for elem in signers_list:
            for key, val in elem.items():
                if key == member:
                    elem[key] = status
        return signers_list
    else:
        return [{member: status}]
    
    

def get_metadata_id(api_key, database, collection, item_id, item_type):
    if item_type == "document":
        try:
            coll_id = get_data_from_collection(
                api_key, database, collection, {"collection_id": item_id}
            )["_id"]
            return coll_id
        except Exception as err:
            print(err)
    elif item_type == "clone":
        try:
            coll_id = get_data_from_collection(
                api_key, database, collection, {"collection_id": item_id}
            )["_id"]
            return coll_id
        except Exception as err:
            print(err)

    elif item_type == "template":
        try:
            coll_id = get_data_from_collection(
                api_key, database, collection, {"collection_id": item_id}
            )["_id"]
            return coll_id
        except Exception as err:
            print(err)