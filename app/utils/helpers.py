import json
import bson
import requests

from app.constants import (
    EDITOR_API,
    PUBLIC_LOGIN_API,
    NOTIFICATION_API,
)
from app.models import FavoriteDocument, FavoriteTemplate, FavoriteWorkflow
from app.serializers import (
    FavouriteDocumentSerializer,
    FavouriteTemplateSerializer,
    FavouriteWorkflowSerializer,
    WorkflowAiSettingSerializer,
)

from .mongo_db_connection import (
    get_document_object,
    get_process_object,
    get_wf_object,
    save_document,
    save_process,
)

headers = {"Content-Type": "application/json"}


def register_user_access(process_steps, authorized_role, user):
    """Once someone has made changes to their docs"""
    for step in process_steps:
        if step["stepRole"] == authorized_role:
            for clone_map in step["stepDocumentCloneMap"]:
                if user in clone_map:
                    clone_map["accessed"] = True
                    break


def delete_notification(notify_id):
    """remove notifications in external products"""
    return requests.delete(f"{NOTIFICATION_API}/{notify_id}")


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
        headers=headers,
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
        doc_name = document["document_name"]
        if has_tilde_characters(doc_name):
            document_name = doc_name
        else:
            document_name = "~" + doc_name + "~"
        save_res = json.loads(
            save_document(
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
    except Exception as e:
        print(e)
        return
    return save_res["inserted_id"]


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
    except Exception as e:
        print(e)
        return
    return save_res["inserted_id"]


# Access to document/template
def access_editor(item_id, item_type):
    collection = None
    document = None
    team_member_id = None
    field = None
    action = None
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
    except Exception as e:
        print(e)
        return
    return response.json()


# complete document and mark as complete
def processing_complete(process):
    if process["processing_state"] == "completed":
        return True
    return


# Get WF Step
def get_step(sid, step_name):
    data = get_wf_object(sid)["workflows"]["steps"]
    for step in data:
        if step_name == step["step_name"]:
            return step


def validate_id(id):
    """Validate anything mongoDB object id"""
    try:
        if bson.objectid.ObjectId.is_valid(id):
            return True
        else:
            return None
    except:
        return None


def versioning(version):
    """Version workflow settings"""
    if version.startswith("New"):
        version = version.removeprefix("New ")
    else:
        version = version.removeprefix("Latest ")
    return version


def version_control(version):
    """Version control for wf settings"""
    version = version.split(".")
    if version[-1] != "9":
        version[-1] = str(int(version[-1]) + 1)
    elif version[1] != "9":
        version[-1] = "0"
        version[1] = str(int(version[1]) + 1)
    elif version[-1] == "9" and version[1] != "9":
        version[-1] = "0"
        version[1] = str(int(version[1]) + 1)
    elif version[1] == "9" and version[-1] == "9":
        version[0] = str(int(version[0]) + 1)
        version[1] = "0"
        version[-1] = "0"
    else:
        version[0] = str(int(version[0]) + 1)
    latest = ".".join(version)
    return latest


def list_favourites(company_id):
    """A List of bookmarks/favourites"""
    try:
        documents = FavoriteDocument.objects.filter(company_id=company_id)
        templates = FavoriteTemplate.objects.filter(company_id=company_id)
        workflows = FavoriteWorkflow.objects.filter(company_id=company_id)
        doc_serializer = FavouriteDocumentSerializer(documents, many=True)
        template_serializer = FavouriteTemplateSerializer(templates, many=True)
        workflow_serializer = FavouriteWorkflowSerializer(workflows, many=True)
    except RuntimeError:
        return 
    return {
        "documents": doc_serializer.data,
        "templates": template_serializer.data,
        "workflows": workflow_serializer.data,
    }


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
        except:
            return 
    if type == "document":
        try:
            FavoriteDocument.objects.filter(
                _id=identifier, favourited_by=username
            ).delete()
            return msg
        except:
            return 
    if type == "template":
        try:
            FavoriteTemplate.objects.filter(
                _id=identifier, favourited_by=username
            ).delete()
            return msg
        except:
            return 


def CREATE_WF_AI_SETTING(data):
    serializer = WorkflowAiSettingSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return WorkflowAiSettingSerializer(serializer).data
    return 
