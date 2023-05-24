import json
import uuid
from threading import Thread
import urllib.parse
import bson
import qrcode
import requests
from django.conf import settings
from django.core.mail import send_mail

from app.constants import (
    EDITOR_API,
    PUBLIC_LOGIN_API,
    VERIFICATION_LINK,
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
    save_uuid_hash,
    save_wf_process,
)
from .threads import notification

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


def notify_push(data):
    """Tells me if code is pushed and deployed"""
    pushed_by = data["pusher"].get("name")
    subject = "Push and Deploy Done!"
    message = f"Hi Edwin, {pushed_by} just pushed code and it is going to be deployed by your CI/CD pipeline."
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [
        "workflowaiedwin@gmail.com",
    ]
    try:
        send_mail(subject, message, email_from, recipient_list)
    except:
        print("Mail not sent")


def get_domain_host():
    """Grab the current domain host"""
    current_site = Site.objects.get_current()
    domain_host = current_site.domain
    return domain_host


def public_login(qrid, org_name):
    """Find out if a public link has been used or not"""
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
    hash = uuid.uuid4().hex
    if user_type == "public":
        query_params = {
            "portfolio": auth_portfolio,
            "auth_role": step_role,
            "user_type": user_type,
        }
        for i in range(0, len(auth_name)):
            field = auth_name[i]
            query_params[f"username"] = field

        encoded_query_params = urllib.parse.urlencode(query_params)
        link = f"{VERIFICATION_LINK}/{hash}/?product=Workflow AI&org=WorkflowAi&{encoded_query_params}"

    # User | Team
    else:
        link = f"{VERIFICATION_LINK}/{hash}/?product=Workflow AI&org=WorkflowAi&username={auth_name}&portfolio={auth_portfolio}&auth_role={step_role}&user_type={user_type}"

    # save link
    res = json.loads(
        save_uuid_hash(
            link,
            process_id,
            item_id,
            step_role,
            auth_name,
            auth_portfolio,
            hash,
            item_type,
        )
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
        document_name = document["document_name"] + " |-"

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
        save_res = json.loads(
            save_wf_process(
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

    except:
        return
    return save_res["inserted_id"]


# Access to document/template
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
    """A List of bookmarks/favourites"""

    try:
        documents = FavoriteDocument.objects.filter(company_id=company_id)
        templates = FavoriteTemplate.objects.filter(company_id=company_id)
        workflows = FavoriteWorkflow.objects.filter(company_id=company_id)
        doc_serializer = FavouriteDocumentSerializer(documents, many=True)
        template_serializer = FavouriteTemplateSerializer(templates, many=True)
        workflow_serializer = FavouriteWorkflowSerializer(workflows, many=True)
    except RuntimeError:
        return None

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

    # Fav
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

    return None


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
