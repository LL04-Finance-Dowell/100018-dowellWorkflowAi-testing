import json
from urllib.parse import parse_qs, urlparse
import hashlib

import bson
import requests
from datetime import datetime

from app.constants import EDITOR_API, MASTERLINK_URL, PUBLIC_LOGIN_API
from app.models import (
    FavoriteDocument,
    FavoriteTemplate,
    FavoriteWorkflow,
    ProcessReminder,
)
from app.serializers import (
    FavouriteDocumentSerializer,
    FavouriteTemplateSerializer,
    FavouriteWorkflowSerializer,
)

from .mongo_db_connection import (
    save_to_clone_collection,
    save_to_clone_metadata_collection,
    save_to_document_collection,
    save_to_document_metadata_collection,
    save_to_process_collection,
    single_query_document_collection,
    single_query_clones_collection,
    single_query_clones_metadata_collection,
    single_query_document_metadata_collection,
    single_query_process_collection,
    single_query_template_collection,
    single_query_template_metadata_collection,
)

# from processing import Process


def register_finalized(link_id):
    response = requests.put(
        f"{MASTERLINK_URL}?link_id={link_id}",
        data=json.dumps({"is_finalized": True}),
        headers={"Content-Type": "application/json"},
    )
    return


def get_query_param_value_from_url(url, query_param):
    parsed_url = urlparse(url)
    query_params = parse_qs(parsed_url.query)
    value = query_params.get(query_param, [None])[0]
    return value


def paginate(dataset, page, limit):
    if dataset is not None:
        elements_to_return = page * limit
        if elements_to_return > len(dataset):
            return dataset[:][::-1]
        else:
            return dataset[:elements_to_return][::-1]
    return []


def register_public_login(qrid, org_name):
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
    try:
        viewers = []
        for m in auth_viewers:
            viewers.append(m["member"])

        document = single_query_document_collection({"_id": document_id})
        # Create new "signed" list to track users who have signed the document
        signed = []
        for item in auth_viewers:
            mem = item["member"]
            signed.append({mem: False})

        for viewer in viewers:
            doc_name = document["document_name"]
            if not doc_name:
                document_name = "doc - " + viewer
            else:
                if isinstance(viewer, dict):
                    document_name = doc_name + "_" + viewer["member"]
                else:
                    document_name = doc_name + "_" + viewer
        save_res = json.loads(
            save_to_clone_collection(
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
                    "document_state": "processing",
                    "parent_id": parent_id,
                    "process_id": process_id,
                    "folders": "untitled",
                    "message": "",
                    "signed_by": signed,
                }
            )
        )
        if save_res["isSuccess"]:
            save_res_metadata = json.loads(
                save_to_clone_metadata_collection(
                    {
                        "document_name": document_name,
                        "collection_id": save_res["inserted_id"],
                        "created_by": document["created_by"],
                        "company_id": document["company_id"],
                        "data_type": document["data_type"],
                        "auth_viewers": auth_viewers,
                        "document_type": "clone",
                        "document_state": "processing",
                        "process_id": process_id,
                        "parent_id": parent_id,
                        "signed_by": signed,
                    }
                )
            )
        return save_res["inserted_id"]
    except Exception as e:
        print(e)
        return


def cloning_clone(clone_id, auth_viewers, parent_id, process_id):
    try:
        viewers = []
        for m in auth_viewers:
            viewers.append(m["member"])
        document = single_query_clones_collection({"_id": clone_id})
        for viewer in viewers:
            doc_name = document["document_name"]
            if not doc_name:
                document_name = "doc - " + viewer
            else:
                if isinstance(viewer, dict):
                    document_name = doc_name + "_" + viewer["member"]
                else:
                    document_name = doc_name + "_" + viewer

        clone_dict = {
            "document_name": document_name,
            "content": document["content"],
            "page": document["page"],
            "created_by": document["created_by"],
            "company_id": document["company_id"],
            "data_type": document["data_type"],
            "document_state": "processing",
            "auth_viewers": auth_viewers,
            "document_type": "clone",
            "document_state": "processing",
            "parent_id": parent_id,
            "process_id": process_id,
            "folders": "untitled",
            "message": "",
        }
        if document.get("signed_by"):
            clone_dict["signed_by"] = document["signed_by"]

        save_res = json.loads(save_to_clone_collection(clone_dict))

        if save_res["isSuccess"]:
            metadata_dict = {
                "document_name": document_name,
                "collection_id": save_res["inserted_id"],
                "created_by": document["created_by"],
                "company_id": document["company_id"],
                "data_type": document["data_type"],
                "auth_viewers": auth_viewers,
                "document_type": "clone",
                "document_state": "processing",
                "parent_id": parent_id,
                "process_id": process_id,
            }
            if document.get("signed_by"):
                metadata_dict["signed_by"] = document["signed_by"]

            save_res_metadata = json.loads(
                save_to_clone_metadata_collection(metadata_dict)
            )
        return save_res["inserted_id"]
    except Exception as e:
        print(e)
        return


def cloning_process(process_id, created_by, creator_portfolio):
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


def access_editor(item_id, item_type, username="", portfolio="", email=""):
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
        item_name = single_query_document_collection({"_id": item_id})
        meta_data = single_query_document_metadata_collection(
            {"collection_id": item_id}
        )
    elif item_type == "clone":
        item_name = single_query_clones_collection({"_id": item_id})
        meta_data = single_query_clones_metadata_collection({"collection_id": item_id})
    else:
        item_name = single_query_template_collection({"_id": item_id})
        meta_data = single_query_template_metadata_collection(
            {"collection_id": item_id}
        )
    name = item_name.get(field, "")
    metadata_id = meta_data.get("_id")
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
            "metadata_id": metadata_id,
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


# TODO: will be updated
def access_editor_metadata(item_id, item_type, metadata_id, email):
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
        item_name = single_query_document_collection({"_id": item_id})
    elif item_type == "clone":
        item_name = single_query_clones_collection({"_id": item_id})
    else:
        item_name = single_query_template_collection({"_id": item_id})
    name = item_name.get(field, "")
    payload = {
        "product_name": "Workflow AI",
        "details": {
            "cluster": "Documents",
            "database": "Documentation",
            "collection": collection,
            "document": document,
            "team_member_ID": team_member_id,
            "email": email,
            "function_ID": "ABCDE",
            "_id": item_id,
            "metadata_id": metadata_id,
            "field": field,
            "type": item_type,
            "action": (
                "document"
                if item_type == "document"
                else "clone" if item_type == "clone" else "template"
            ),
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


def processing_complete(process):
    if process["processing_state"] == "completed":
        return True
    return


def validate_id(id):
    try:
        if bson.objectid.ObjectId.is_valid(id):
            return True
        else:
            return None
    except:
        return None


def list_favourites(company_id):
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
            "collection_id": item["collection_id"],
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
            "collection_id": item["collection_id"],
            "favourited_by": username,
        }
        serializer = FavouriteTemplateSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return msg
    return


def remove_favourite(identifier, type, username):
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
    return [
        single_query_document_collection({"_id": i})["document_state"] == "finalized"
        for i in items
        if isinstance(i, str)
    ]


def check_all_finalized_true(data, process_type) -> bool:
    for item in data:
        step_document_clone_map = item.get("stepDocumentCloneMap", [])
        doc_states = []
        for doc in step_document_clone_map:
            for key, value in doc.items():
                if key != "accessed":
                    if process_type == "document" or process_type == "internal":
                        doc_state = single_query_clones_collection({"_id": value}).get(
                            "document_state"
                        )
                        if doc_state == "finalized":
                            doc_states.append(True)
                        elif doc_state == "processing":
                            doc_states.append(False)
                        else:
                            doc_states.append(False)
                    elif process_type == "template":
                        doc_state = single_query_template_collection(
                            {"_id": value}
                        ).get("template_state")
                        if doc_state == "saved":
                            doc_states.append(True)
                        elif doc_state == "draft":
                            doc_states.append(False)
                        else:
                            doc_states.append(False)
        if not all(doc_states):
            return False
    return True


def check_progress(process_id):
    steps = single_query_process_collection({"_id": process_id})["process_steps"]
    steps_count = len(steps)
    accessed = 0
    for step in steps:
        step_clone_map = step.get("stepDocumentCloneMap", [])
        if step_clone_map:
            if check_all_accessed(step_clone_map):
                accessed += 1

    percentage_progress = round((accessed / steps_count * 100), 2)
    return percentage_progress


def get_metadata_id(item_id, item_type):
    if item_type == "document":
        try:
            coll_id = single_query_document_metadata_collection(
                {"collection_id": item_id}
            )["_id"]
            return coll_id
        except Exception as err:
            print(err)
    elif item_type == "clone":
        try:
            coll_id = single_query_clones_metadata_collection(
                {"collection_id": item_id}
            )["_id"]
            return coll_id
        except Exception as err:
            print(err)

    elif item_type == "template":
        try:
            coll_id = single_query_template_metadata_collection(
                {"collection_id": item_id}
            )["_id"]
            return coll_id
        except Exception as err:
            print(err)


def check_step_items_state(items) -> bool:
    doc_states = []
    for i in items:
        doc_state = single_query_clones_collection({"_id": i}).get("document_state")
        if doc_state == "finalized":
            doc_states.append(True)
        elif doc_state == "processing":
            doc_states.append(False)
        else:
            doc_states.append(False)
    if not all(doc_states):
        return False
    return True


def check_user_in_auth_viewers(user, item, item_type) -> bool:
    auth_viewers = []
    if item_type == "document":
        viewers = single_query_clones_collection({"_id": item}).get("auth_viewers")

    elif item_type == "template":
        viewers = single_query_template_collection({"_id": item}).get("auth_viewers")
        viewers = viewers[0]

    for i in viewers:
        if isinstance(i, list):
            # if item comes as a list, get the first item
            i = i[0]

        for k, v in i.items():
            if k != "portfolio":
                auth_viewers.append(v)

    if user in auth_viewers:
        return True
    else:
        return False


def remove_members_from_steps(data):
    for step in data.get("process_steps", []):
        step["stepPublicMembers"] = []
        step["stepTeamMembers"] = []
        step["stepUserMembers"] = []
        step["stepDocumentCloneMap"] = []


def update_signed(signers_list: list, member: str, status: bool) -> list:
    if signers_list:
        for elem in signers_list:
            for key, val in elem.items():
                if key == member:
                    elem[key] = status
        return signers_list
    else:
        return [{member: status}]


def check_all_accessed(dic):
    return all([item.get("accessed") for item in dic])


def get_link(user, role, links):
    for link in links:
        if link.get(user):
            # auth_role = f"auth_role={role}"
            auth_role = role
            parsed_url = urlparse(link[user])
            query_params = parse_qs(parsed_url.fragment)
            if query_params["username"] == [user] and query_params["auth_role"] == [
                auth_role
            ]:
                return link[user]


def get_hash(password: str):
    pwd_buffer = bytes(password, "utf-8")
    hash_object = hashlib.sha256(pwd_buffer)
    hashed_str = hash_object.hexdigest()
    # print(hex_dig)
    return hashed_str


def compare_hash(valid_hash: str, input: str):
    hashed_input = get_hash(input)
    return valid_hash == hashed_input


def create_document_helper(
    created_by, company_id, template_id, data_type, viewers: list
) -> tuple:
    """_summary_

    Args:
        created_by (str): _description_
        portfolio (str): _description_
        company_id (str): _description_
        template_id (str): _description_
    """
    try:
        content = single_query_template_collection({"_id": template_id})["content"]
        page = single_query_template_collection({"_id": template_id})["page"]
        res = json.loads(
            save_to_document_collection(
                {
                    "document_name": "Untitled Document",
                    "content": content,
                    "created_by": created_by,
                    "company_id": company_id,
                    "page": page,
                    "data_type": data_type,
                    "document_state": "draft",
                    "auth_viewers": viewers,
                    "document_type": "original",
                    "parent_id": None,
                    "process_id": "",
                    "folders": [],
                    "template": template_id,
                    "message": "",
                }
            )
        )
        if res["isSuccess"]:
            res_metadata = json.loads(
                save_to_document_metadata_collection(
                    {
                        "document_name": "Untitled Document",
                        "collection_id": res["inserted_id"],
                        "created_by": created_by,
                        "company_id": company_id,
                        "data_type": data_type,
                        "document_state": "draft",
                        "auth_viewers": viewers,
                    }
                )
            )
            return res, res_metadata

    except Exception as ex:
        print(ex)
        return


def get_prev_and_next_users(
    process: dict, auth_user: str, auth_role: str, user_type: str
) -> tuple:
    """Gets the previous step signers and potential next step signers
        for specific process step

    Args:
        process (dict): A process dictionary
        auth_user (str):  Username of the user in question
        auth_role (str):  Role of the user in question

    Returns:
        tuple: (previous, next)
    """
    process_steps = process["process_steps"]
    prev_step = None
    next_step = None
    prev_viewers = None
    next_viewers = None

    if user_type == "public":
        auth_user = auth_user[0]
    else:
        auth_user = auth_user

    for current_idx, step in enumerate(process["process_steps"]):
        if step.get("stepRole") == auth_role:
            for item in step["stepDocumentCloneMap"]:
                if item.get(auth_user):
                    current_doc_id = item.get(auth_user)
                    # Check previous step get it's users
                    if current_idx > 0:
                        prev_step = process["process_steps"][current_idx - 1]
                        prev_viewers_doc_map = prev_step["stepDocumentCloneMap"]
                        prev_viewers = [
                            k
                            for item in prev_viewers_doc_map
                            for k, v in item.items()
                            if v == current_doc_id
                        ]

                    if current_idx < len(process_steps) - 1:
                        next_step = process["process_steps"][current_idx + 1]
                        next_viewers_team_doc_map = next_step["stepTeamMembers"]
                        next_viewers_user_doc_map = next_step["stepUserMembers"]
                        next_viewers_public_doc_map = next_step["stepPublicMembers"]
                        next_viewers = [
                            item.get("member")
                            for doc_map in [
                                next_viewers_team_doc_map,
                                next_viewers_user_doc_map,
                                next_viewers_public_doc_map,
                            ]
                            for item in doc_map
                        ]

    return (prev_viewers, next_viewers)


def dowell_email_sender(name, email, subject, email_content):
    email_url = "https://100085.pythonanywhere.com/api/uxlivinglab/email/"
    payload = {
        "toname": name,
        "toemail": email,
        "fromname": "Workflow AI",
        "fromemail": "workflowai@dowellresearch.sg",
        "subject": subject,
        "email_content": email_content,
    }

    requests.post(email_url, data=payload)


def check_last_finalizer(user, user_type, process) -> bool:
    steps = process["process_steps"]
    non_skipped_steps = []

    for step in steps:
        if step.get("skipStep") == False:
            non_skipped_steps.append(step)

    last_step = non_skipped_steps[len(non_skipped_steps) - 1]
    step_clone_map = last_step.get("stepDocumentCloneMap", [])

    if user_type == "team":
        for data in last_step["stepTeamMembers"]:
            if data.get("member") == user:
                if check_all_accessed(step_clone_map):
                    return True

    elif user_type == "user":
        for data in last_step["stepUserMembers"]:
            if data.get("member") == user:
                if check_all_accessed(step_clone_map):
                    return True

    elif user_type == "public":
        for data in last_step["stepPublicMembers"]:
            if data.get("member") == user:
                if check_all_accessed(step_clone_map):
                    return True
    else:
        return False


def set_reminder(reminder, step, process_id, created_by):
    try:
        team = step.get("stepTeamMembers", [])
        user = step.get("stepUserMembers", [])

        if reminder == "every_hour":
            if team:
                create_reminder(process_id, 60, team, created_by)
            if user:
                create_reminder(process_id, 60, user, created_by)

        elif reminder == "every_day":
            if team:
                create_reminder(process_id, 1440, team, created_by)
            if user:
                create_reminder(process_id, 1440, user, created_by)
    except Exception:
        return


def create_reminder(process_id, interval, members, created_by):
    try:
        for member in members:
            member_name = member.get("member")
            member_email = member.get("email")
            current_datetime = datetime.utcnow().strftime("%d:%m:%Y,%H:%M:%S")

            if member_name and member_email:
                ProcessReminder.objects.create(
                    process_id=process_id,
                    step_finalizer=member_name,
                    email=member_email,
                    interval=interval,
                    last_reminder_datetime=current_datetime,
                    created_by=created_by,
                )
    except Exception:
        return


def remove_finalized_reminder(user, process_id):
    try:
        reminder = ProcessReminder.objects.get(
            step_finalizer=user, process_id=process_id
        )
        reminder.delete()
        return True
    except Exception as e:
        return False


def remove_finalized_reminder(user, process_id):
    try:
        reminder = ProcessReminder.objects.get(
            step_finalizer=user, process_id=process_id
        )
        reminder.delete()
        return True
    except Exception as e:
        return False
