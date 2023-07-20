import json

import bson
import requests

from app.constants import EDITOR_API, PUBLIC_LOGIN_API
from app.models import FavoriteDocument, FavoriteTemplate, FavoriteWorkflow
from app.serializers import (
    FavouriteDocumentSerializer,
    FavouriteTemplateSerializer,
    FavouriteWorkflowSerializer,
)

from .mongo_db_connection import (
    get_document_object,
    get_clone_object,
    get_process_object,
    get_template_object,
    # save_document,
    save_clone,
    save_process,
)


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
    try:
        viewers = []
        viewers = (
            [item for item in set(auth_viewers)]
            if auth_viewers is not None and isinstance(auth_viewers, list)
            else [auth_viewers]
        )
        document = get_document_object(document_id)
        for viewer in viewers:
            doc_name = document["document_name"]
            if has_tilde_characters(doc_name):
                document_name = doc_name.replace('~', '')
            else:
                document_name = doc_name + viewer
        save_res = json.loads(
            save_clone(
                name=document_name,
                data=document["content"],
                page=document["page"],
                created_by=document["created_by"],
                company_id=document["company_id"],
                data_type=document["data_type"],
                state="processing",
                auth_viewers=viewers,
                document_type="clone",
                parent_id=parent_id,
                process_id=process_id,
                folders="untitled",
            )
        )
        print(save_res)
        return save_res["inserted_id"]
    except Exception as e:
        print(e)
        return


def cloning_process(process_id, created_by, creator_portfolio):
    """creating a process copy"""
    try:
        process = get_process_object(process_id)
        save_res = json.loads(
            save_process(
                process["process_title"],
                process["process_steps"],
                created_by,
                process["company_id"],
                process["data_type"],
                "no_parent_id",
                process["processing_action"],
                creator_portfolio,
                process["workflow_construct_ids"],
                process["process_type"],
                "clone",
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
        item_name = get_document_object(item_id)
        name = item_name["document_name"]
    elif item_name == "clone":
        collection = "CloneReports"
        document = "CloneReports"
        action = "document"
        field = "document_name"
        team_member_id = "1212001"
        item_name = get_clone_object(item_id)
        name = item_name["document_name"]
    if item_type == "template":
        collection = "TemplateReports"
        document = "templatereports"
        action = "template"
        field = "template_name"
        team_member_id = "22689044433"
        item_name = get_template_object(item_id)
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


def check_items_state(items) -> list:
    """Checks if item state is finalized"""
    return [
        get_clone_object(i)["document_state"] == "finalized"
        for i in items
        if isinstance(i, str)
    ]
