import json
import uuid
from threading import Thread
import qrcode
import bson
import requests

from app.constants import EDITOR_API, VERIFICATION_LINK, PUBLIC_LOGIN_API
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
    save_uuid_hash,
    save_wf_process,
)

from .threads import notification

headers = {"Content-Type": "application/json"}


def get_domain_host():
    current_site = Site.objects.get_current()
    domain_host = current_site.domain
    return domain_host


def public_login(qrid, org_name):
    res = requests.post(
        url=PUBLIC_LOGIN_API,
        data=json.dumps(
            {
                "qrid": qrid,
                "org_name": org_name,
                "product": "WorkflowAI",
            }
        ),
        headers=headers,
    )
    if res.status_code == 200:
        return True
        
    else:
        return None


def verification_data(
    process_id,
    item_id,
    step_role,
    auth_name,
    auth_portfolio,
    company_id,
    process_title,
    item_type,
    user_type,
):
    """"""
    hash = uuid.uuid4().hex
    link = f"{VERIFICATION_LINK}/{hash}/?auth_user={auth_name}&auth_portfolio={auth_portfolio}&auth_role={step_role}&user_type={user_type}"
    # save link
    res = save_uuid_hash(
        link,
        process_id,
        item_id,
        step_role,
        auth_name,
        auth_portfolio,
        hash,
        item_type,
    )

    if res["isSuccess"]:
        ddata = {
            "username": auth_name,
            "portfolio": auth_portfolio,
            "process_id": process_id,
            "step_role": step_role,
            "item_id": item_id,
            "company_id": company_id,
            "process_title": process_title,
            "link": link,
        }
        # setup notification
        Thread(target=notification, args=(ddata,)).start()

    return link, generate_qrcode(link)


def cloning_document(document_id, auth_viewers, parent_id, process_id):
    """creating a document copy"""
    try:
        viewers = []
        viewers = (
            [item for item in set(auth_viewers)]
            if auth_viewers is not None and isinstance(auth_viewers, list)
            else []
        )

        document = get_document_object(document_id)
        # if auth_viewers is not None:
        #     if isinstance(auth_viewers, list):
        #         for item in set(auth_viewers):
        #             viewers.append(item)
        #     else:
        #         viewers.append(auth_viewers)

        # else:
        #     viewers = []

        document_name = "-" + document["document_name"] + "-"

        # create new doc
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
            )
        )
    except RuntimeError:
        return

    return save_res["inserted_id"]


def cloning_process(process_id, created_by, creator_portfolio):
    """creating a process copy"""
    try:
        process = get_process_object(process_id)
        process_kind = "clone"
        save_res = json.loads(
            save_wf_process(
                process["process_title"],
                process["process_steps"],
                created_by,
                process["company_id"],
                process["data_type"],
                None,
                process["processing_action"],
                creator_portfolio,
                process["workflow_construct_ids"],
                process["process_type"],
                process_kind,
            )
        )
    except:
        return

    return save_res["inserted_id"]


def access_editor(item_id, item_type):
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


def link_to_editor(
    item_id, item_map, item_rights, user, process_id, user_role, item_type
):
    """navigate user to editor for signing"""

    # set document
    if item_type == "document":
        collection = "DocumentReports"
        document = "documentreports"
        action = "document"
        field = "document_name"
        team_member_id = "11689044433"
        document = get_document_object(item_id)

        if document["document_state"] == "finalized":
            item_flag = "finalized"

        if document["document_state"] == "processing":
            item_flag = "processing"

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
            "document_flag": item_flag,
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


# complete document and mark as complete
def processing_complete(process):
    # check if all process steps are marked finalized
    complete = False
    if process["isSuccess"]:
        complete = process["isSuccess"]
    return complete


# Get WF Step
def get_step(sid, step_name):
    data = get_wf_object(sid)["workflows"]["steps"]
    # the_step=None
    for step in data:
        if step_name == step["step_name"]:
            return step


# Validate a mongoDB ID
def validate_id(id):
    try:
        if bson.objectid.ObjectId.is_valid(id):
            return True
        else:
            return None
    except:
        return None


# Versioning WF settings
def versioning(version):
    if version.startswith("New"):
        version = version.removeprefix("New ")
    else:
        version = version.removeprefix("Latest ")
    return version


# VC for WF settings
def version_control(version):
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


def generate_qrcode(verification_link):
    """Generates a qrcode for the data provided and stores the qrcodes"""

    # In Prod -- this works
    # TODO: find out how to extract domain url
    qr_path = f"100094.pythonanywhere.com/media/qrcodes/{uuid.uuid4().hex}.png"

    # On dev -- this works
    # qr_path = f"media/qrcodes/{uuid.uuid4().hex}.png"

    qr_code = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H)
    qr_code.add_data(verification_link)
    qr_code.make()
    qr_color = "black"
    qr_img = qr_code.make_image(fill_color=qr_color, back_color="#DCDCDC")
    qr_img.save(qr_path)

    return f"https://{qr_path}"


def list_favourites(company_id):
    try:
        documents = FavoriteDocument.objects.filter(company_id=company_id)
        doc_serializer = FavouriteDocumentSerializer(documents, many=True)

        templates = FavoriteTemplate.objects.filter(company_id=company_id)
        template_serializer = FavouriteTemplateSerializer(templates, many=True)

        workflows = FavoriteWorkflow.objects.filter(company_id=company_id)
        workflow_serializer = FavouriteWorkflowSerializer(workflows, many=True)

    except RuntimeError:
        return None

    return {
        "documents": doc_serializer.data,
        "templates": template_serializer.data,
        "workflows": workflow_serializer.data,
    }


def create_favourite(item, type, username):
    """
    Add to favourites/Bookmarks

    Args:
        item(dict): the item details
        type(str): the type of item
        username: identifier of person creating the fav

    Returns:
        msg(str): response success
    """
    msg = "Item added to bookmarks"
    if type == "workflow":
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

        print(serializer.errors)

    if type == "document":
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

        print(serializer.errors)

    # Fav
    if type == "template":
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

        print(serializer.errors)

    return None


def remove_favourite(identifier, type, username):
    msg = "Item removed from bookmarks."

    if type == "workflow":
        try:
            FavoriteWorkflow.objects.filter(
                _id=identifier, favourited_by=username
            ).delete()
            return msg
        except:
            return None

    if type == "document":
        try:
            FavoriteDocument.objects.filter(
                _id=identifier, favourited_by=username
            ).delete()
            return msg
        except:
            return None

    if type == "template":
        try:
            FavoriteTemplate.objects.filter(
                _id=identifier, favourited_by=username
            ).delete()
            return msg
        except:
            return None


def CREATE_WF_AI_SETTING(data):
    """
    Save Workflow Setting

    Args:
        data(dict): the details of the setting


    Returns:
        msg(str): response success
    """
    msg = "WF_Setting Saved"

    # wf_setting = {

    #     "company_id": data["company_id"],
    #     "created_by": data["created_by"],
    #     "Process" : data["Process"],
    #     "Documents" : data["Documents"],
    #     "Templates" : data["Templates"],
    #     "Workflows" : data["Workflows"],
    #     "Notarisation" : data["Notarisation"],
    #     "Folders" : data["Folders"],
    #     "Records" : data["Records"],
    #     "References" : data["References"],
    #     "Approval_Process" : data["Approval_Process"],
    #     "Evaluation_Process" : data["Evaluation_Process"],
    #     "Reports" : data["Reports"],
    #     "Management" : data["Management"],
    # }
    serializer = WorkflowAiSettingSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return WorkflowAiSettingSerializer(serializer).data

    return None
