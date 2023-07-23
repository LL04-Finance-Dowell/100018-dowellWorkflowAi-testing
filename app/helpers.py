import json
from urllib.parse import parse_qs, urlparse

import bson
import requests

from app.constants import EDITOR_API, MASTERLINK_URL, PUBLIC_LOGIN_API
from app.models import FavoriteDocument, FavoriteTemplate, FavoriteWorkflow
from app.serializers import (
    FavouriteDocumentSerializer,
    FavouriteTemplateSerializer,
    FavouriteWorkflowSerializer,
)

from .mongo_db_connection import (
    save_to_document_collection,
    save_to_process_collection,
    single_query_document_collection,
    single_query_process_collection,
    single_query_template_collection,
)


def register_finalized(link_id):
    """Master single link as finalized"""
    print("here2 ")
    response = requests.put(
        f"{MASTERLINK_URL}?link_id={link_id}",
        data={"is_finalized": True},
        headers={"Content-Type": "application/json"},
    )
    if response.status_code == 200:
        print("finalized")
    else:
        print("failed")
    return


def get_query_param_value_from_url(url, query_param):
    # Parse the URL to get the query parameters
    parsed_url = urlparse(url)
    query_params = parse_qs(parsed_url.query)
    value = query_params.get(query_param, [None])[0]
    return value


def paginate(dataset, page, limit):
    """Paginate/Chunk Results"""
    start = (page - 1) * limit
    end = start + limit
    return dataset[start:end]


def register_public_login(qrid, org_name):
    """Register a public QRID as used"""
    res = requests.post(
        url=PUBLIC_LOGIN_API,
        data=json.dumps(
            {
                "qrid": qrid,
                "org_name": org_name,
                "product": "Workflow AI",
            }
        ),
        headers={"Content-Type": "application/json"},
    )
    if res.status_code == 200:
        return True
    return


def has_tilde_characters(string):
    for char in string:
        if char == "~":
            return True
    return False


def cloning_document(document_id, auth_viewers, parent_id, process_id):
    """creating a document copy"""
    print("auth_viewers", auth_viewers)
    try:
        viewers = []
        for m in auth_viewers:
            viewers.append(m["member"])
        # viewers = (
        #     [item for item in set(auth_viewers)]
        #     if auth_viewers is not None and isinstance(auth_viewers, list)
        #     else [auth_viewers]
        # )
        document = single_query_document_collection({"_id": document_id})
        for viewer in viewers:
            doc_name = document["document_name"]
            if has_tilde_characters(doc_name):
                document_name = doc_name.replace("~", "")
            else:
                document_name = doc_name + "-" + viewer
        save_res = json.loads(
            save_to_document_collection(
                {
                    "document_name": document_name,
                    "content": document["content"],
                    "page": document["page"],
                    "created_by": document["created_by"],
                    "company_id": document["company_id"],
                    "data_type": document["data_type"],
                    "document_state": "processing",
                    "auth_viewers": auth_viewers,
                    "document_type": "clone",
                    "parent_id": parent_id,
                    "process_id": process_id,
                    "folders": "untitled",
                }
            )
        )
        return save_res["inserted_id"]
    except Exception as e:
        print(e)
        return


def cloning_process(process_id, created_by, creator_portfolio):
    """creating a process copy"""
    try:
        process = single_query_process_collection({"_id": process_id})
        save_res = json.loads(
            save_to_process_collection(
                {
                    "process_title": process["process_title"],
                    "process_steps": process["process_steps"],
                    "created_by": created_by,
                    "company_id": process["company_id"],
                    "data_type": process["data_type"],
                    "parent_item_id": "no_parent_id",
                    "processing_action": process["processing_action"],
                    "creator_portfolio": creator_portfolio,
                    "workflow_construct_ids": process["workflow_construct_ids"],
                    "process_type": process["process_type"],
                    "process_kind": "clone",
                    "processing_state": "draft",
                }
            )
        )
        return save_res["inserted_id"]
    except Exception as e:
        print(e)
        return


def access_editor(item_id, item_type):
    """Access to document/template"""
    collection = None
    document = None
    team_member_id = None
    field = None
    action = None
    item_name = ""
    if item_type == "document":
        collection = "DocumentReports"
        document = "documentreports"
        action = "document"
        field = "document_name"
        team_member_id = "11689044433"
        item_name = single_query_document_collection({"_id": item_id})
        name = item_name["document_name"]
    if item_type == "template":
        collection = "TemplateReports"
        document = "templatereports"
        action = "template"
        field = "template_name"
        team_member_id = "22689044433"
        item_name = single_query_template_collection({"_id": item_id})
        name = item_name["template_name"]
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
            "action": action,
            "flag": "editing",
            "name": name,
            "command": "update",
            "update_field": {field: "", "content": "", "page": ""},
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


# complete document and mark as complete
def processing_complete(process):
    if process["processing_state"] == "completed":
        return True
    return


def validate_id(id):
    """Validate anything mongoDB object id"""
    try:
        if bson.objectid.ObjectId.is_valid(id):
            return True
        else:
            return None
    except:
        return None


def list_favourites(company_id):
    """A List of bookmarks/favourites"""
    try:
        documents = FavoriteDocument.objects.filter(company_id=company_id)
        templates = FavoriteTemplate.objects.filter(company_id=company_id)
        workflows = FavoriteWorkflow.objects.filter(company_id=company_id)
        doc_serializer = FavouriteDocumentSerializer(documents, many=True)
        template_serializer = FavouriteTemplateSerializer(templates, many=True)
        workflow_serializer = FavouriteWorkflowSerializer(workflows, many=True)
        return {
            "documents": doc_serializer.data,
            "templates": template_serializer.data,
            "workflows": workflow_serializer.data,
        }
    except Exception as e:
        print(e)
        return


def create_favourite(item, item_type, username):
    """Add to favourites/Bookmarks"""
    msg = "Item added to bookmarks"
    if item_type == "workflow":
        data = {
            "_id": item["_id"],
            "workflows": json.dumps(item["workflows"]),
            "company_id": item["company_id"],
            "favourited_by": username,
        }
        serializer = FavouriteWorkflowSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return msg
    if item_type == "document":
        data = {
            "_id": item["_id"],
            "document_name": item["document_name"],
            "company_id": item["company_id"],
            "favourited_by": username,
        }
        serializer = FavouriteDocumentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return msg
    if item_type == "template":
        data = {
            "_id": item["_id"],
            "template_name": item["template_name"],
            "company_id": item["company_id"],
            "favourited_by": username,
        }
        serializer = FavouriteTemplateSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return msg
    return


def remove_favourite(identifier, type, username):
    """Remove Item from favourites"""
    msg = "Item removed from bookmarks."
    if type == "workflow":
        try:
            FavoriteWorkflow.objects.filter(
                _id=identifier, favourited_by=username
            ).delete()
            return msg
        except Exception as e:
            print(e)
            return
    if type == "document":
        try:
            FavoriteDocument.objects.filter(
                _id=identifier, favourited_by=username
            ).delete()
            return msg
        except Exception as e:
            print(e)
            return
    if type == "template":
        try:
            FavoriteTemplate.objects.filter(
                _id=identifier, favourited_by=username
            ).delete()
            return msg
        except Exception as e:
            print(e)
            return
