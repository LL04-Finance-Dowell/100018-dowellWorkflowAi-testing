import os
import ast
import json
import re
import git
from crontab import CronTab

import requests
from rest_framework import status
from django.core.cache import cache
from rest_framework.decorators import api_view
from rest_framework.response import Response
from threading import Thread
from app.processing import HandleProcess, Process, Background
from app.utils import checks, notification_cron
from app.utils.helpers import (
    access_editor,
    cloning_process,
    create_favourite,
    list_favourites,
    remove_favourite,
    validate_id,
    delete_notification,
    register_user_access,
)
from django.core.cache import cache
from app.utils.mongo_db_connection import (
    get_folder_list,
    update_document,
    add_document_to_folder,
    add_template_to_folder,
    delete_document,
    delete_process,
    delete_template,
    delete_workflow,
    delete_folder,
    finalize_item,
    get_document_list,
    get_document_object,
    get_link_object,
    get_links_object_by_process_id,
    get_process_list,
    get_process_object,
    get_team,
    get_team_list,
    get_template_list,
    get_template_object,
    get_wf_list,
    get_wf_object,
    get_workflow_setting_object,
    get_wfai_setting_list,
    get_folder_object,
    save_document,
    save_folder,
    save_team,
    save_template,
    save_workflow,
    save_workflow_setting,
    update_team_data,
    update_template_approval,
    update_wf,
    update_process,
    update_workflow_setting,
    update_folder,
)

from .constants import EDITOR_API


@api_view(["POST"])
def webhook(request):
    """Pick an event from GH and update our PA-server code"""
    if request.method == "POST":
        repo = git.Repo("/home/100094/100094.pythonanywhere.com")
        origin = repo.remotes.origin
        origin.pull()
        return Response("Updated PA successfully", status.HTTP_200_OK)
    return Response("Wrong event Type!", status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def home(request):
    return Response("WorkflowAI Service is running...", status.HTTP_200_OK)


@api_view(["POST"])
def document_processing(request):
    """processing is determined by action picked by user."""
    if not request.data:
        return Response("You are missing something!", status.HTTP_400_BAD_REQUEST)

    process = Process(
        request.data["workflows"],
        request.data["created_by"],
        request.data["creator_portfolio"],
        request.data["company_id"],
        request.data["process_type"],
        request.data["org_name"],
        request.data["workflows_ids"],
        request.data["parent_id"],
        request.data["data_type"],
    )
    action = request.data["action"]
    data = None
    if action == "save_workflow_to_document_and_save_to_drafts":
        process.normal_process(action)
        return Response("Process Saved in drafts.", status.HTTP_201_CREATED)
    if action == "start_document_processing_content_wise":
        if request.data.get("process_id") is not None:
            process = get_process_object(request.data["process_id"])
        else:
            data = process.normal_process(action)
    if action == "start_document_processing_wf_steps_wise":
        if request.data.get("process_id") is not None:
            process = get_process_object(request.data["process_id"])
        else:
            data = process.normal_process(action)  # type: ignore
    if action == "start_document_processing_wf_wise":
        if request.data.get("process_id") is not None:
            process = get_process_object(request.data["process_id"])
        else:
            data = process.normal_process(action)  # type: ignore
    if action == "test_document_processing_content_wise":
        if request.data.get("process_id") is not None:
            process = get_process_object(request.data["process_id"])
        else:
            data = process.test_process(action)  # type: ignore
    if action == "test_document_processing_wf_steps_wise":
        if request.data.get("process_id") is not None:
            process = get_process_object(request.data["process_id"])
        else:
            data = process.test_process(action)  # type: ignore
    if action == "test_document_processing_wf_wise":
        if request.data.get("process_id") is not None:
            process = get_process_object(request.data["process_id"])
        else:
            data = process.test_process(action)  # type: ignore
    if action == "close_processing_and_mark_as_completed":
        process = get_process_object(request.data["process_id"])
        if process["processing_state"] == "completed":
            return Response(
                "This Workflow process is already complete", status.HTTP_200_OK
            )
        res = json.loads(
            update_process(
                process_id=process["process_id"],
                steps=process["processing_steps"],
                state="completed",
            )
        )
        if res["isSuccess"]:
            return Response(
                "Process closed and marked as complete!", status.HTTP_200_OK
            )
        return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)
    if action == "cancel_process_before_completion":
        process = get_process_object(request.data["process_id"])
        if process["processing_state"] == "cancelled":
            return Response("This Workflow process is Cancelled!", status.HTTP_200_OK)
        res = json.loads(
            update_process(
                process_id=process["process_id"],
                steps=process["processing_steps"],
                state="cancelled",
            )
        )
        if res["isSuccess"]:
            return Response("Process has been cancelled!", status.HTTP_200_OK)
        return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)

    if action == "pause_processing_after_completing_ongoing_step":
        return Response(
            "This Option is currently in development",
            status.HTTP_501_NOT_IMPLEMENTED,
        )
    if data:
        verification_links = HandleProcess(data).start()
        return Response(verification_links, status.HTTP_200_OK)
    return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def get_process_link(request, process_id):
    """get a link process for person having notifications"""
    links_info = get_links_object_by_process_id(process_id)
    if not links_info:
        return Response("Verification link unavailable", status.HTTP_400_BAD_REQUEST)
    user = request.data["user_name"]
    if not links_info:
        return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)
    for link in links_info["links"]:
        if user in link:
            return Response(link[user], status.HTTP_200_OK)
    return Response("user is not part of this process", status.HTTP_401_UNAUTHORIZED)


@api_view(["POST"])
def process_verification(request):
    """verification of a process step access and checks that duplicate document based on a step."""
    if not request.data:
        return Response("You are missing something!", status.HTTP_400_BAD_REQUEST)
    user_type = request.data["user_type"]
    auth_user = request.data["auth_username"]
    auth_role = request.data["auth_role"]
    auth_portfolio = request.data["auth_portfolio"]
    token = request.data["token"]
    org_name = request.data["org_name"]
    link_object = get_link_object(token)
    if not link_object:
        return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)
    if user_type == "team" or user_type == "user":
        if (
            link_object["user_name"] != auth_user
            or link_object["auth_portfolio"] != auth_portfolio
        ):
            return Response(
                "User Logged in is not part of this process",
                status.HTTP_401_UNAUTHORIZED,
            )
    process_id = link_object["process_id"]
    process = get_process_object(process_id)
    if not process:
        return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)
    if process["processing_state"]:
        if process["processing_state"] == "paused":
            return Response("this workflow process is paused!", status.HTTP_200_OK)
        if process["processing_state"] == "save":
            return Response("this workflow process is not active!", status.HTTP_200_OK)
    location_data = {
        "city": request.data["city"],
        "country": request.data["country"],
        "continent": request.data["continent"],
    }
    process["org_name"] = org_name
    handler = HandleProcess(process)
    editor_link = handler.verify(
        auth_role, location_data, auth_user, user_type, org_name
    )
    if editor_link:
        return Response(editor_link, status.HTTP_200_OK)
    return Response(
        "access to this document is denied at this time!", status.HTTP_400_BAD_REQUEST
    )


@api_view(["POST"])
def finalize_or_reject(request, process_id):
    """After access is granted and the user has made changes on a document."""
    if not request.data:
        return Response("You are missing something", status.HTTP_400_BAD_REQUEST)
    item_id = request.data["item_id"]
    item_type = request.data["item_type"]
    role = request.data["role"]
    user = request.data["authorized"]
    state = request.data["action"]
    check, current_state = checks.is_finalized(item_id, item_type)
    if check and current_state != "processing":
        return Response(f"Already processed as {current_state}!", status.HTTP_200_OK)
    finalize_item(item_id, state, item_type)
    process = get_process_object(process_id)
    background = Background(process, item_type, item_id, role, user)
    Thread(target=lambda: delete_notification(item_id)).start()
    background.processing()
    return Response("document processed successfully", status.HTTP_200_OK)


@api_view(["POST"])
def trigger_process(request, process_id):
    """Get process and begin processing it."""
    if not validate_id(request.data["process_id"]):
        return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
    process = get_process_object(request.data["process_id"])
    action = request.data["action"]
    state = process["processing_state"]
    if request.data["user_name"] != process["created_by"]:
        return Response("User Unauthorized", status.HTTP_403_FORBIDDEN)
    if action == "halt_process" and state != "paused":
        res = json.loads(
            update_process(
                process_id=request.data["process_id"],
                steps=process["process_steps"],
                state="paused",
            )
        )
        if res["isSuccess"]:
            return Response(
                "Process has been paused until manually resumed!",
                status.HTTP_200_OK,
            )
    if action == "process_draft" and state != "processing":
        verification_links = HandleProcess(process).start()
        if verification_links:
            return Response(verification_links, status.HTTP_200_OK)
    return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def processes(request, company_id):
    """fetches workflow process `I` created."""
    data_type = request.query_params.get("data_type", "Real_Data")
    if not validate_id(company_id):
        return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
    cache_key = f"processes_{company_id}"
    process_list = cache.get(cache_key)
    if process_list is None:
        try:
            process_list = get_process_list(company_id, data_type)
            cache.set(cache_key, process_list, timeout=60)
        except:
            return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(process_list, status.HTTP_200_OK)


@api_view(["GET"])
def get_completed_processes(request, company_id):
    """fetches workflow process `I` created."""
    data_type = request.query_params.get("data_type", "Real_Data")
    if not validate_id(company_id):
        return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
    cache_key = f"processes_{company_id}_completed"
    process_list = cache.get(cache_key)
    completed = None
    if process_list is None:
        try:
            process_list = get_process_list(company_id, data_type)
            if len(process_list) > 0:
                completed = list(
                    filter(
                        lambda x: x.get("processing_state") == "finalized", process_list
                    )
                )
            cache.set(cache_key, completed, timeout=60)
        except Exception as err:
            return Response(err, status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(completed, status.HTTP_200_OK)


@api_view(["GET"])
def a_single_process(request, process_id):
    """get process by process id"""
    if not validate_id(process_id):
        return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
    process = get_process_object(process_id)
    document_id = process["parent_item_id"]
    document = get_document_object(document_id)
    document_name = document["document_name"]
    process.update({"document_name": document_name})
    return Response(process, status.HTTP_200_OK)


@api_view(["GET"])
def fetch_process_links(request, process_id):
    """verification links for a process"""
    if not validate_id(process_id):
        return Response("something went wrong!", status.HTTP_400_BAD_REQUEST)
    process_info = get_links_object_by_process_id(process_id)
    if process_info:
        process = process_info[0]
        return Response(process["links"], status.HTTP_200_OK)
    return Response([], status.HTTP_200_OK)


@api_view(["POST"])
def process_copies(request, process_id):
    if not validate_id(process_id) or not request.data:
        return Response("something went wrong!", status.HTTP_400_BAD_REQUEST)
    if request.method == "POST":
        if not request.data:
            return Response("something went wrong!", status.HTTP_400_BAD_REQUEST)
        process_id = cloning_process(
            process_id, request.data["created_by"], request.data["portfolio"]
        )
        if process_id is None:
            return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response("success created a process clone", status.HTTP_201_CREATED)


@api_view(["POST"])
def create_workflow(request):
    """Creates a new workflow"""
    form = request.data
    if not form:
        return Response("Workflow Data required", status.HTTP_400_BAD_REQUEST)
    data = {
        "workflow_title": form["wf_title"],
        "steps": form["steps"],
    }
    res = json.loads(
        save_workflow(
            data,
            form["company_id"],
            form["created_by"],
            form["portfolio"],
            form["data_type"],
            "original",
        )
    )
    if res["isSuccess"]:
        return Response(
            {
                "_id": res["inserted_id"],
                "workflows": data,
                "created_by": form["created_by"],
                "company_id": form["company_id"],
                "creator_portfolio": form["portfolio"],
                "workflow_type": "original",
                "data_type": form["data_type"],
            },
            status.HTTP_201_CREATED,
        )
    return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET", "PUT"])
def workflow_detail(request, workflow_id):
    """Single workflows"""
    if not validate_id(workflow_id):
        return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
    if request.method == "GET":
        data = get_wf_object(workflow_id)
        return Response(data, status.HTTP_200_OK)
    if request.method == "PUT":
        form = request.data
        if not form:
            return Response(
                "Workflow Data is required", status=status.HTTP_400_BAD_REQUEST
            )

        old_workflow = get_wf_object(workflow_id)

        old_workflow["workflows"]["workflow_title"] = form["wf_title"]
        old_workflow["workflows"]["data_type"] = form["data_type"]

        old_workflow["workflows"]["steps"][0]["step_name"] = form["steps"][0][
            "step_name"
        ]
        old_workflow["workflows"]["steps"][0]["role"] = form["steps"][0]["role"]

        updt_wf = update_wf(workflow_id, old_workflow)
        updt_wf = json.loads(updt_wf)
        if updt_wf.get("isSuccess"):
            return Response("Workflow Updated", status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def get_workflows(request, company_id):
    """List all workflows"""
    data_type = request.query_params.get("data_type", "Real_Data")
    if not validate_id(company_id):
        return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
    workflow_list = get_wf_list(company_id, data_type)
    if len(workflow_list) > 0:
        return Response(
            {"workflows": workflow_list},
            status.HTTP_200_OK,
        )
    return Response(
        {"workflows": []},
        status.HTTP_200_OK,
    )


@api_view(["GET"])
def get_documents(request, company_id):
    """List of Created Documents."""
    data_type = request.query_params.get("data_type", "Real_Data")
    if not validate_id(company_id):
        return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
    cache_key = f"documents_{company_id}"
    document_list = cache.get(cache_key)
    if document_list is None:
        document_list = get_document_list(company_id, data_type)
        cache.set(cache_key, document_list, timeout=60)
    return Response(
        {"documents": document_list},
        status.HTTP_200_OK,
    )


@api_view(["POST"])
def create_document(request):
    """Document Creation."""
    if not request.data:
        return Response(
            {"message": "Failed to process document creation."},
            status.HTTP_200_OK,
        )
    viewers = [request.data["created_by"]]
    folder = []
    res = json.loads(
        save_document(
            name="Untitled Document",
            data=request.data["content"],
            created_by=request.data["created_by"],
            company_id=request.data["company_id"],
            page=request.data["page"],
            data_type=request.data["data_type"],
            state="draft",
            auth_viewers=viewers,
            document_type="original",
            parent_id=None,
            process_id="",
            folders=folder,
        )
    )
    if res["isSuccess"]:
        editor_link = access_editor(res["inserted_id"], "document")
        if not editor_link:
            return Response(
                "Could not open document editor.",
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        return Response(
            {"editor_link": editor_link, "_id": res["inserted_id"]},
            status.HTTP_201_CREATED,
        )


@api_view(["GET"])
def get_document_content(request, document_id):
    """Content map of a given document"""
    if not validate_id(document_id):
        return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
    content = []
    my_dict = ast.literal_eval(get_document_object(document_id)["content"])[0][0]
    all_keys = [i for i in my_dict.keys()]
    for i in all_keys:
        temp_list = []
        for j in my_dict[i]:
            if j["type"] == "CONTAINER_INPUT":
                container_list = []
                for item in j["data"]:
                    container_list.append({"id": item["id"], "data": item["data"]})
                temp_list.append({"id": j["id"], "data": container_list})
            else:
                temp_list.append({"id": j["id"], "data": j["data"]})
        content.append(
            {
                i: temp_list,
            }
        )
    sorted_content = []
    for dicts in content:
        for key, val in dicts.items():
            sorted_content.append(
                {
                    key: sorted(
                        dicts[key],
                        key=lambda x: int([a for a in re.findall("\d+", x["id"])][-1]),
                    )
                }
            )
    return Response(sorted_content, status.HTTP_200_OK)


@api_view(["GET"])
def document_detail(request, document_id):
    """editor link for a document"""
    if not validate_id(document_id):
        return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
    editor_link = access_editor(document_id, "document")
    if not editor_link:
        return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(editor_link, status.HTTP_201_CREATED)


@api_view(["GET"])
def document_object(request, document_id):
    """Retrieves the document object for a specific document"""
    if not validate_id(document_id):
        return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
    document = get_document_object(document_id)
    return Response(document, status.HTTP_200_OK)


@api_view(["POST"])
def archives(request):
    """Archiving  (Template | Workflow | Document | Folder)"""
    if not request.data:
        return Response("You are missing something", status.HTTP_400_BAD_REQUEST)
    id = request.data["item_id"]
    if not validate_id(id):
        return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
    if request.data["item_type"] == "workflow":
        res = delete_workflow(id, "Archive_Data")
        try:
            res_dict = json.loads(res)
            if res_dict["isSuccess"]:
                return Response("Workflow moved to archives", status.HTTP_200_OK)
            return Response(
                "Failed to move workflow to archives",
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except json.JSONDecodeError:
            return Response(
                "Invalid response data", status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    if request.data["item_type"] == "document":
        res = delete_document(id, "Archive_Data")
        try:
            res_dict = json.loads(res)
            if res_dict["isSuccess"]:
                return Response("Document moved to archives", status.HTTP_200_OK)
            return Response(
                "Failed to move document to archives",
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except json.JSONDecodeError:
            return Response(
                "Invalid response data", status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    if request.data["item_type"] == "template":
        res = delete_template(id, "Archive_Data")
        try:
            res_dict = json.loads(res)
            if res_dict["isSuccess"]:
                return Response("Template moved to archives", status.HTTP_200_OK)
            return Response(
                "Failed to move template to archives",
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except json.JSONDecodeError:
            return Response(
                "Invalid response data", status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    if request.data["item_type"] == "process":
        res = delete_process(id, "Archive_Data")
        try:
            res_dict = json.loads(res)
            if res_dict["isSuccess"]:
                return Response("Process moved to archives", status.HTTP_200_OK)
            return Response(
                "Failed to move process to archives",
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except json.JSONDecodeError:
            return Response(
                "Invalid response data", status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    if request.data["item_type"] == "folder":
        res = delete_folder(id, "Archive_Data")
        try:
            res_dict = json.loads(res)
            if res_dict["isSuccess"]:
                return Response("Folder moved to archives", status.HTTP_200_OK)
            return Response(
                "Failed to move process to archives",
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except json.JSONDecodeError:
            return Response(
                "Invalid response data", status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def archive_restore(request):
    """Restore  (Template | Workflow | Document)"""
    if not request.data:
        return Response("You are missing something", status.HTTP_400_BAD_REQUEST)
    id = request.data["item_id"]
    if not validate_id(id):
        return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
    if request.data["item_type"] == "workflow":
        res = delete_workflow(id, "Real_Data")
        try:
            res_dict = json.loads(res)
            if res_dict["isSuccess"]:
                return Response("Workflow restored from archives", status.HTTP_200_OK)
            return Response(
                "Failed to restore Workflow from archives",
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except json.JSONDecodeError:
            return Response(
                "Invalid response data", status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    if request.data["item_type"] == "document":
        res = delete_document(id, "Real_Data")
        try:
            res_dict = json.loads(res)
            if res_dict["isSuccess"]:
                return Response("Document restored from archives", status.HTTP_200_OK)
            return Response(
                "Failed to restore document from archives",
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except json.JSONDecodeError:
            return Response(
                "Invalid response data", status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    if request.data["item_type"] == "template":
        res = delete_template(id, "Real_Data")
        try:
            res_dict = json.loads(res)
            if res_dict["isSuccess"]:
                return Response("Template restored from archives", status.HTTP_200_OK)
            return Response(
                "Failed to restore template from archives",
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except json.JSONDecodeError:
            return Response(
                "Invalid response data", status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    if request.data["item_type"] == "process":
        res = delete_process(id, "Real_Data")
        try:
            res_dict = json.loads(res)
            if res_dict["isSuccess"]:
                return Response("Process restored from archives", status.HTTP_200_OK)
            return Response(
                "Failed to restore process from archives",
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except json.JSONDecodeError:
            return Response(
                "Invalid response data", status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    if request.data["item_type"] == "Folder":
        res = delete_folder(id, "Real_Data")
        try:
            res_dict = json.loads(res)
            if res_dict["isSuccess"]:
                return Response("Folder restored from archives", status.HTTP_200_OK)
            return Response(
                "Failed to restore folder from archives",
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except json.JSONDecodeError:
            return Response(
                "Invalid response data", status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def favorites(request):
    """`Favourite` an Item( workflow | template | document) or List favourites"""
    if not request.data:
        return Response("You are missing something", status.HTTP_400_BAD_REQUEST)
    msg = create_favourite(
        request.data["item"],
        request.data["item_type"],
        request.data["username"],
    )
    return Response(msg, status.HTTP_201_CREATED)


@api_view(["GET"])
def all_favourites(request, company_id):
    """List favs"""
    if not validate_id(company_id):
        return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
    data = list_favourites(company_id)
    return Response(data, status.HTTP_200_OK)


@api_view(["DELETE"])
def trash_favourites(request, item_id, item_type, username):
    """Trash Favourites"""
    if not validate_id(item_id):
        return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
    msg = remove_favourite(
        identifier=item_id,
        type=item_type,
        username=username,
    )
    return Response(msg, status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
def get_templates(request, company_id):
    """List of Created Templates."""
    data_type = request.query_params.get("data_type", "Real_Data")
    if not validate_id(company_id):
        return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
    templates = get_template_list(company_id, data_type)
    return Response(
        {"templates": templates},
        status.HTTP_200_OK,
    )


@api_view(["POST"])
def create_template(request):
    data = ""
    page = ""
    folder = []
    template_name = "Untitled Template"
    if not validate_id(request.data["company_id"]):
        return Response("Invalid company details", status.HTTP_400_BAD_REQUEST)
    res = json.loads(
        save_template(
            template_name,
            data,
            page,
            folder,
            request.data["created_by"],
            request.data["company_id"],
            request.data["data_type"],
            "original",
        )
    )
    if res["isSuccess"]:
        payload = {
            "product_name": "workflowai",
            "details": {
                "_id": res["inserted_id"],
                "field": "template_name",
                "action": "template",
                "cluster": "Documents",
                "database": "Documentation",
                "collection": "TemplateReports",
                "document": "templatereports",
                "team_member_ID": "22689044433",
                "function_ID": "ABCDE",
                "command": "update",
                "flag": "editing",
                "update_field": {"template_name": "", "content": "", "page": ""},
            },
        }
        editor_link = requests.post(
            EDITOR_API,
            data=json.dumps(payload),
        )
        return Response(
            {"editor_link": editor_link.json(), "_id": res["inserted_id"]},
            status.HTTP_201_CREATED,
        )
    return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def template_detail(request, template_id):
    """editor link for a document"""
    if not validate_id(template_id):
        return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
    editor_link = access_editor(template_id, "template")
    if not editor_link:
        return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(editor_link, status.HTTP_201_CREATED)


@api_view(["GET"])
def template_object(request, template_id):
    """Gets the JSON object for a template id"""
    if not validate_id(template_id):
        return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
    template = get_template_object(template_id)
    return Response(template, status.HTTP_200_OK)


@api_view(["PUT"])
def approve(request, template_id):
    """Approve a given template"""
    if not validate_id(template_id):
        return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
    res = json.loads(update_template_approval(template_id, approval=True))
    if res["isSuccess"]:
        return Response("Template Approved", status.HTTP_200_OK)


@api_view(["POST"])
def create_team(request):
    """Create a new Team"""
    form = request.data
    if not form:
        return Response("Team Data required", status.HTTP_400_BAD_REQUEST)
    company_id = form["company_id"]
    created_by = form["created_by"]
    team_type = form["team_type"]
    team_name = form["team_name"]
    team_code = form["team_code"]
    team_spec = form["team_spec"]
    portfolio_list = form["portfolio_list"]
    details = form["details"]
    universal_code = form["universal_code"]
    data_type = form["data_type"]
    team_set = json.loads(
        save_team(
            team_name,
            team_type,
            team_code,
            team_spec,
            details,
            universal_code,
            portfolio_list,
            company_id,
            created_by,
            data_type,
        )
    )
    if team_set["isSuccess"]:
        return Response(
            {
                "Team Saved": get_team(team_set["inserted_id"]),
            },
            status.HTTP_201_CREATED,
        )
    return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def update_team(request):
    """Update Team"""
    form = request.data
    if not form:
        return Response("Team Data required", status.HTTP_400_BAD_REQUEST)
    team_data = get_team(form["team_id"])
    team_data["company_id"] = form["company_id"]
    team_data["created_by"] = form["created_by"]
    team_data["team_id"] = form["team_id"]
    team_data["team_name"] = form["team_name"]
    team_data["team_type"] = form["team_type"]
    team_data["team_code"] = form["team_code"]
    team_data["team_spec"] = form["team_spec"]
    team_data["portfolio_list"] = form["portfolio_list"]
    team_data["details"] = form["details"]
    team_data["universal_code"] = form["universal_code"]
    team_data["data_type"] = form["data_type"]
    team_set = json.loads(update_team_data(form["team_id"], team_data))
    if team_set["isSuccess"]:
        return Response(
            {
                "Team Updated": get_team(form["team_id"]),
            },
            status.HTTP_201_CREATED,
        )
    return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def get_team_data(request, team_id):
    """Get specific Team"""
    teams = get_team(team_id)
    return Response(teams, status.HTTP_200_OK)


@api_view(["POST", "GET"])
def get_all_teams(request, company_id):
    """Get All Team"""
    all_team = get_team_list(company_id)
    form = request.data
    if not form:
        try:
            return Response(all_team, status.HTTP_200_OK)
        except:
            return Response("Data Type Required", status.HTTP_400_BAD_REQUEST)
    try:
        return Response(
            [
                data
                for data in all_team
                if form["data_type"] in str(data.get("data_type", ""))
            ],
            status.HTTP_200_OK,
        )
    except:
        return Response(
            "Failed to Load Team Data", status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["GET"])
def get_completed_documents(request, company_id):
    """List of Completed Documents."""
    data_type = request.query_params.get("data_type", "Real_Data")
    if not validate_id(company_id):
        return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
    document_list = get_document_list(company_id, data_type)
    if document_list:
        completed = list(
            filter(lambda i: i.get("document_state") == "finalized", document_list)
        )
        return Response(
            {"documents": completed},
            status=status.HTTP_200_OK,
        )
    return Response(
        {"documents": []},
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
def get_completed_documents_by_process(request, company_id, process_id):
    """List of Completed Documents."""
    data_type = request.query_params.get("data_type", "Real_Data")
    if not validate_id(company_id):
        return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
    document_list = get_document_list(company_id, data_type)
    if len(document_list) > 0:
        cloned = list(
            filter(lambda i: i.get("process_id") == process_id, document_list)
        )
        return Response(
            {f"document_list of process: {process_id}": cloned},
            status=status.HTTP_200_OK,
        )
    return Response(
        {f"document_list of process: {process_id}": []},
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
def create_application_settings(request):
    if not request.data:
        return Response("You are missing something", status.HTTP_400_BAD_REQUEST)
    company_id = request.data["company_id"]
    if not validate_id(company_id):
        return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
    is_exists = checks.is_wf_setting_exist(
        company_id, request.data["created_by"], request.data["data_type"]
    )
    if is_exists:
        return Response({"WF SETTING EXISTS": is_exists}, status.HTTP_200_OK)
    try:
        res = json.loads(
            save_workflow_setting(
                company_id=company_id,
                created_by=request.data["created_by"],
                data_type=request.data["data_type"],
                process=request.data["Process"],
                documents=request.data["Documents"],
                templates=request.data["Templates"],
                workflows=request.data["Workflows"],
                notarisation=request.data["Notarisation"],
                folders=request.data["Folders"],
                records=request.data["Records"],
                references=request.data["References"],
                approval=request.data["Approval_Process"],
                evaluation=request.data["Evaluation_Process"],
                reports=request.data["Reports"],
                management=request.data["Management"],
                portfolio=request.data["Portfolio_Choice"],
                theme_color=request.data["theme_color"],
            )
        )
        if res["isSuccess"]:
            return Response(
                f"You added WorkflowAI settings for your organization: {res}",
                status.HTTP_201_CREATED,
            )
    except Exception as e:
        return Response(
            f"Failed to Save Workflow Setting: {e}",
            status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
def all_workflow_ai_setting(request, company_id, data_type="Real_data"):
    """Get All WF AI"""
    all_setting = get_wfai_setting_list(company_id, data_type)
    return Response(
        all_setting,
        status.HTTP_200_OK,
    )


@api_view(["GET"])
def get_workflow_ai_setting(request, wf_setting_id):
    """Get All WF AI"""
    setting = get_workflow_setting_object(wf_setting_id)
    return Response(setting, status.HTTP_200_OK)


@api_view(["POST"])
def update_application_settings(request):
    """Update workflow Setting"""
    form = request.data
    if not form:
        return Response("Workflow Data is Required", status.HTTP_400_BAD_REQUEST)
    old_wf_setting = get_workflow_setting_object(form["wf_setting_id"])
    for key, new_value in form.items():
        if key in old_wf_setting:
            old_wf_setting[key] = new_value
    updt_wf = json.loads(update_workflow_setting(form["wf_setting_id"], old_wf_setting))
    if updt_wf["isSuccess"]:
        return Response(
            {"body": "Workflow Setting Updated", "updated": updt_wf},
            status.HTTP_201_CREATED,
        )
    return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def read_reminder(request, process_id, username):
    # cron = CronTab('root')
    if not validate_id(process_id):
        return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
    cache_key = f"processes_{process_id}"
    process_detail = cache.get(cache_key)
    if process_detail is None:
        try:
            process_detail = get_process_object(process_id)
            cache.set(cache_key, process_detail, timeout=60)
            process_steps = process_detail["process_steps"]
            for step in process_steps:
                for mem in step["stepTeamMembers"]:
                    if mem["member"] == username:
                        if not register_user_access(
                            process_steps=process_steps,
                            authorized_role=step["stepRole"],
                            user=username,
                        ):
                            data = {
                                "username": username,
                                "portfolio": mem["portfolio"],
                                "product_name": "Workflow AI",
                                "company_id": process_detail["company_id"],
                                "org_name": "WorkflowAi",
                                "org_id": process_detail["company_id"],
                                "title": "Document to Sign",
                                "message": "You have a document to sign.",
                                "link": process_detail["_id"],
                                "duration": "5",  # TODO: pass reminder time here
                                "button_status": "",
                            }

                            current_directory = os.getcwd()
                            script_path = os.path.join(
                                current_directory, "/utils/notification_cron.py"
                            )
                            command = f'python3 {script_path} "{data}"'
                            cron = CronTab("root")
                            job = cron.new(command=command)
                            if step["stepReminder"] == "every_hour":
                                # # Schedule cron job to run notification_cron.py every hour
                                # # command = f"0 * * * * python3 {current_directory}/utils/notification_cron.py '{data}'"
                                # # os.system(f"crontab -l | {{ cat; echo '{command}'; }} | crontab -")
                                # hourly_job = cron.new(command=f"python3 {current_directory}/utils/notification_cron.py '{data}'")
                                # hourly_job.minute.every(1)
                                # cron.write()
                                # print(hourly_job.command)
                                # response_data = {
                                #     "command": hourly_job.command,
                                #     # "next_run": hourly_job.next_run(),
                                # }
                                # return Response(response_data)
                                job.setall("* * * * *")
                            elif step["stepReminder"] == "every_day":
                                # Schedule cron job to run notification_cron.py every day
                                # command = f"0 0 * * * python3 {current_directory}/utils/notification_cron.py '{data}'"
                                # os.system(f"crontab -l | {{ cat; echo '{command}'; }} | crontab -")
                                # daily_job = cron.new(command=f"python3 {current_directory}/utils/notification_cron.py '{data}'")
                                # daily_job.day.every(1)
                                # cron.write()
                                # response_data = {
                                #     "command": hourly_job.command,
                                #     # "next_run": hourly_job.next_run(),
                                # }
                                # return Response(response_data)
                                job.setall("0 0 * * *")
                            else:
                                return Response(
                                    f"Invalid step reminder value: {step['stepReminder']}",
                                    status.HTTP_400_BAD_REQUEST,
                                )

                            job.enable()
                            cron.write()
                            return Response("Cron job scheduled", status.HTTP_200_OK)
                            # return Response(f"User hasnt accessed process: {step['stepReminder']}")
        except Exception as err:
            return Response(
                f"An error occured: {err}", status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    return Response(process_detail, status.HTTP_200_OK)


@api_view(["POST"])
def send_notif(request):
    data = {
        "created_by": request.data["created_by"],
        "portfolio": request.data["portfolio"],
        "product_name": request.data["product_name"],
        "company_id": request.data["company_id"],
        "org_name": request.data["org_name"],
        "org_id": request.data["org_id"],
        "title": "Document to Sign",
        "message": "You have a document to sign.",
        "link": request.data["link"],
        "duration": "5",
        "button_status": "",
    }
    try:
        notification_cron.send_notification(data)
        return Response("Notification sent", status.HTTP_201_CREATED)

    except Exception as err:
        return Response(
            f"Something went wrong: {err}", status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    # daily_reminder=cache.get("daily_reminder_data")
    # hourly_reminder=cache.get("hourly_reminder_data")

    # if daily_reminder is not None:

    #     daily_result = [(item['process_id'], item['message']) for item in daily_reminder if username in item['member']]
    # else:
    #     daily_result = []
    # if  hourly_reminder is not None:
    #     hourly_result = [(item['process_id'], item['message']) for item in hourly_reminder if username in item['member']]
    # else:
    #     hourly_result = []
    # try:
    #     return Response([hourly_result,daily_result],
    #         status.HTTP_200_OK
    #     )
    # except:
    #     return Response("Failed to Get Reminder", status.HTTP_500_INTERNAL_SERVER_ERROR)


# Create New Folder with empty data that accepts templates and documents ID
@api_view(["POST"])
def create_folder(request):
    data = []
    folder_name = "Untitled Folder"
    if not validate_id(request.data["company_id"]):
        return Response("Invalid company details", status.HTTP_400_BAD_REQUEST)
    res = json.loads(
        save_folder(
            folder_name,
            data,
            request.data["created_by"],
            request.data["company_id"],
            request.data["data_type"],
            "original",
        )
    )
    if res["isSuccess"]:
        return Response(
            {"_id": res["inserted_id"], "Message": folder_name + " created"},
            status.HTTP_201_CREATED,
        )
    return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)


# Accessing and Updating the folder to accept IDs In data field
@api_view(["GET", "PUT"])
def folder_update(request, folder_id):
    if not validate_id(folder_id):
        return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
    if request.method == "GET":
        settings = get_folder_object(folder_id)
        return Response(settings, status.HTTP_200_OK)
    if request.method == "PUT":
        form = request.data
        id = request.data["item_id"]
        if not form:
            return Response("Folder Data is Required", status.HTTP_400_BAD_REQUEST)
        old_folder = get_folder_object(folder_id)
        old_folder["folder_name"] = form["folder_name"]
        old_folder["data"].append(
            {"item_id:": form["item_id"], "item_type": form["item_type"]}
        )
        updt_folder = json.loads(update_folder(folder_id, old_folder))
        if request.data["item_type"] == "document":
            old_document = get_document_object(id)
            old_document["folders"] = old_document.get("folders")
            if old_document["folders"] is not None:
                old_document["folders"].append(old_folder["folder_name"])
                res = add_document_to_folder(id, folder_id)
        if request.data["item_type"] == "template":
            old_template = get_template_object(id)
            old_template["folders"] = old_template.get("folders")
            if old_template["folders"] is not None:
                old_template["folders"].append(old_folder["folder_name"])
                res = add_template_to_folder(id, folder_id)
        if updt_folder["isSuccess"]:
            return Response("Folder Updated", status.HTTP_201_CREATED)
        return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)


# To fetch all folders
@api_view(["GET"])
def all_folders(request, company_id):
    """fetches Folders created."""
    data_type = request.query_params.get("data_type", "Real_Data")
    if not validate_id(company_id):
        return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
    cache_key = f"folders_{company_id}"
    folders_list = cache.get(cache_key)
    if folders_list is None:
        try:
            folders_list = get_folder_list(company_id, data_type)
            cache.set(cache_key, folders_list, timeout=60)
        except:
            return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(folders_list, status.HTTP_200_OK)
