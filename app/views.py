import ast
import json
import re
import git

import requests
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from threading import Thread
from app.utils import checks, processing
from app.utils.helpers import (
    CREATE_WF_AI_SETTING,
    access_editor,
    cloning_process,
    create_favourite,
    list_favourites,
    remove_favourite,
    validate_id,
    notify_push,
)
from django.core.cache import cache
from app.utils.mongo_db_connection import (
    delete_document,
    delete_process,
    delete_template,
    delete_workflow,
    finalize,
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
    get_wf_setting_object,
    get_wfai_setting_list,
    save_document,
    save_team,
    save_template,
    save_wf,
    save_wf_setting,
    update_team_data,
    update_template_approval,
    update_wf,
    update_wf_process,
    wf_setting_update,
)

from .constants import EDITOR_API


@api_view(["POST"])
def webhook(request):
    """Pick an event from GH and update our PA-server code"""
    if request.method == "POST":
        # pull the code and update PA
        repo = git.Repo("/home/100094/100094.pythonanywhere.com")
        origin = repo.remotes.origin
        origin.pull()

        # notify me about what has been done
        notify_push(request.data)
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

    data_type = "Testing_Data"
    action = request.data["action"]
    if action == "save_workflow_to_document_and_save_to_drafts":
        process = processing.new(
            workflows=request.data["workflows"],
            created_by=request.data["created_by"],
            company_id=request.data["company_id"],
            data_type=request.data["data_type"],
            parent_item_id=request.data["parent_id"],
            process_choice="save_process",
            creator_portfolio=request.data["creator_portfolio"],
            workflows_ids=request.data["workflows_ids"],
            process_type=request.data["process_type"],
        )
        return Response("Process Saved in drafts.", status.HTTP_201_CREATED)

    if action == "start_document_processing_content_wise":
        if request.data.get("process_id") is not None:
            process = get_process_object(request.data["process_id"])

        else:
            process = processing.new(
                workflows=request.data["workflows"],
                created_by=request.data["created_by"],
                company_id=request.data["company_id"],
                data_type=request.data["data_type"],
                parent_item_id=request.data["parent_id"],
                process_choice="start_content_wise",
                creator_portfolio=request.data["creator_portfolio"],
                workflows_ids=request.data["workflows_ids"],
                process_type=request.data["process_type"],
            )

        return processing.start(process)

    if action == "start_document_processing_wf_steps_wise":
        if request.data.get("process_id") is not None:
            process = get_process_object(request.data["process_id"])

        else:
            process = processing.new(
                workflows=request.data["workflows"],
                created_by=request.data["created_by"],
                company_id=request.data["company_id"],
                data_type=request.data["data_type"],
                parent_item_id=request.data["parent_id"],
                process_choice="start_steps_wise",
                creator_portfolio=request.data["creator_portfolio"],
                workflows_ids=request.data["workflows_ids"],
                process_type=request.data["process_type"],
            )

        return processing.start(process)

    if action == "start_document_processing_wf_wise":
        if request.data.get("process_id") is not None:
            process = get_process_object(request.data["process_id"])

        else:
            process = processing.new(
                workflows=request.data["workflows"],
                created_by=request.data["created_by"],
                company_id=request.data["company_id"],
                data_type=request.data["data_type"],
                parent_item_id=request.data["parent_id"],
                process_choice="start_workflow_wise",
                creator_portfolio=request.data["creator_portfolio"],
                workflows_ids=request.data["workflows_ids"],
                process_type=request.data["process_type"],
            )

        return processing.start(process)

    if action == "test_document_processing_content_wise":
        if request.data.get("process_id") is not None:
            process = get_process_object(request.data["process_id"])

        else:
            process = processing.new(
                workflows=request.data["workflows"],
                created_by=request.data["created_by"],
                company_id=request.data["company_id"],
                data_type=data_type,
                parent_item_id=request.data["parent_id"],
                process_choice="test_content_wise",
                creator_portfolio=request.data["creator_portfolio"],
                workflows_ids=request.data["workflows_ids"],
                process_type=request.data["process_type"],
            )

        return processing.start(process)

    if action == "test_document_processing_wf_steps_wise":
        if request.data.get("process_id") is not None:
            process = get_process_object(request.data["process_id"])

        else:
            process = processing.new(
                workflows=request.data["workflows"],
                created_by=request.data["created_by"],
                company_id=request.data["company_id"],
                data_type=data_type,
                parent_item_id=request.data["parent_id"],
                process_choice="test_steps_wise",
                creator_portfolio=request.data["creator_portfolio"],
                workflows_ids=request.data["workflows_ids"],
                process_type=request.data["process_type"],
            )

        return processing.start(process)

    if action == "test_document_processing_wf_wise":
        if request.data.get("process_id") is not None:
            process = get_process_object(request.data["process_id"])

        else:
            process = processing.new(
                workflows=request.data["workflows"],
                created_by=request.data["created_by"],
                company_id=request.data["company_id"],
                data_type=data_type,
                parent_item_id=request.data["parent_id"],
                process_choice="test_workflow_wise",
                creator_portfolio=request.data["creator_portfolio"],
                workflows_ids=request.data["workflows_ids"],
                process_type=request.data["process_type"],
            )

        return processing.start(process)

    if action == "close_processing_and_mark_as_completed":
        process = get_process_object(request.data["process_id"])
        if process["processing_state"] == "completed":
            return Response(
                "This Workflow process is already complete", status.HTTP_200_OK
            )
        res = json.loads(
            update_wf_process(
                process_id=process["process_id"],
                steps=process["processing_steps"],
                state="completed",
            )
        )
        if res["isSuccess"]:
            return Response(
                "Process closed and marked as complete!", status.HTTP_200_OK
            )
        return Response(
            "Failed to mark process and completed!",
            status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    if action == "cancel_process_before_completion":
        # document should reset to initial state.
        process = get_process_object(request.data["process_id"])
        if process["processing_state"] == "cancelled":
            return Response("This Workflow process is Cancelled!", status.HTTP_200_OK)
        res = json.loads(
            update_wf_process(
                process_id=process["process_id"],
                steps=process["processing_steps"],
                state="cancelled",
            )
        )
        if res["isSuccess"]:
            return Response("Process has been cancelled!", status.HTTP_200_OK)
        return Response("Failed cancel process!", status.HTTP_500_INTERNAL_SERVER_ERROR)

    if action == "pause_processing_after_completing_ongoing_step":
        """- find the ongoing step - pause processing"""
        return Response(
            "This Option is currently in development",
            status.HTTP_501_NOT_IMPLEMENTED,
        )

    return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def get_process_link(request, process_id):
    """get a link process for person having notifications"""

    links_info = get_links_object_by_process_id(process_id)[0]
    user = request.data["user_name"]
    if not links_info:
        return Response(
            "Could not fetch process info at this time",
            status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    # check presence in link
    for link in links_info["links"]:
        if user in link:
            return Response(link[user], status.HTTP_200_OK)

    return Response("User is not part of this process", status.HTTP_401_UNAUTHORIZED)


@api_view(["POST"])
def process_verification(request):
    """verification of a process step access and checks that duplicate document based on a step."""

    if not request.data:
        return Response("You are missing something!", status.HTTP_400_BAD_REQUEST)

    # check user will be done on the frontend so I dont make an extra db query.
    user_type = request.data["user_type"]
    auth_user = request.data["auth_username"]
    auth_role = request.data["auth_role"]
    auth_portfolio = request.data["auth_portfolio"]
    token = request.data["token"]
    org_name = request.data["org_name"]

    # verify hash details.
    link_info = get_link_object(token)
    if not link_info:
        return Response(
            "Could not verify user permissions", status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    # validate user_name and portfolio match
    # Team | User
    if user_type == "team" or user_type == "user":
        if (
            link_info["user_name"] != auth_user
            or link_info["auth_portfolio"] != auth_portfolio
        ):
            return Response(
                "User Logged in is not part of this process",
                status.HTTP_401_UNAUTHORIZED,
            )

    # get process
    process_id = link_info["process_id"]
    process = get_process_object(process_id)
    if not process:
        return Response(
            "Something went wrong!, Retry", status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    # check states
    if process["processing_state"]:
        if process["processing_state"] == "paused":
            return Response("this workflow process is paused!", status.HTTP_200_OK)

        # was the process not started?
        if process["processing_state"] == "save":
            return Response("this workflow process is not active!", status.HTTP_200_OK)

    # set request location data
    location_data = {
        "city": request.data["city"],
        "country": request.data["country"],
        "continent": request.data["continent"],
    }

    return processing.verify(
        process,
        auth_role,
        location_data,
        auth_user,
        user_type,
        org_name,
        auth_portfolio,
    )


@api_view(["POST"])
def finalize_or_reject(request, process_id):
    """After access is granted and the user has made changes on a document."""

    if not request.data:
        return Response("You are missing something", status.HTTP_400_BAD_REQUEST)

    item_id = request.data["item_id"]
    item_type = request.data["item_type"]

    # Check document current state.
    check, current_state = checks.is_finalized(item_id, item_type)
    if not check:
        return Response(f"Already processed as {current_state}!", status.HTTP_200_OK)

    # set the right state
    if request.data["action"] == "finalize":
        state = "finalized"

    elif request.data["action"] == "reject":
        state = "rejected"

    # mark item as finalized or rejected.
    res = finalize(item_id, state, item_type)
    if res["isSuccess"]:
        # Signal for further processing.
        if processing.background(process_id, item_id, item_type):
            return Response("document processed successfully", status.HTTP_200_OK)

        else:
            # Revert the document state to processing.
            finalize(item_id, "processing", item_type)

    return Response(
        "Error processing the document", status.HTTP_500_INTERNAL_SERVER_ERROR
    )


@api_view(["POST"])
def trigger_process(request):
    """Get process and begin processing it."""
    
    if not validate_id(request.data["process_id"]):
        return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)

    try:
        process = get_process_object(request.data["process_id"])
    except:
        return Response(
            "Could not start processing!", status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    action = request.data["action"]
    state = process["processing_state"]

    # check user.
    if request.data["user_name"] != process["created_by"]:
        return Response("User Unauthorized", status.HTTP_403_FORBIDDEN)

    # check action.
    if action == "halt_process" and state != "paused":
        res = json.loads(
            update_wf_process(
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
        return processing.start(process)


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
def a_single_process(request, process_id):
    """get process by process id"""

    if not validate_id(process_id):
        return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)

    try:
        process = get_process_object(process_id)
    except:
        return Response("Failed fetch process", status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(process, status.HTTP_200_OK)


@api_view(["GET"])
def fetch_process_links(request, process_id):
    """verification links for a process"""
    if not validate_id(process_id):
        return Response("something went wrong!", status.HTTP_400_BAD_REQUEST)

    try:
        process_info = get_links_object_by_process_id(process_id)
    except:
        return Response("Could not fetch links at this time", status.HTTP_500_INTERNAL_SERVER_ERROR)

    if process_info:
        return Response(process_info["links"][0], status.HTTP_200_OK)

    return Response(process_info,  status.HTTP_200_OK)


@api_view(["POST"])
def process_copies(request, process_id):
    if not validate_id(process_id) or not request.data:
        return Response("something went wrong!", status.HTTP_400_BAD_REQUEST)

    if request.method == "POST":
        if not request.data:
            return Response("something went wrong!", status.HTTP_400_BAD_REQUEST)

        process_id = cloning_process(
            process_id, request.data["created_by"], request.data["created_portfolio"]
        )
        if process_id is None:
            return Response(
                "failed to create process clone", status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response("success created a process clone", status.HTTP_201_CREATED)

    # if request.method == "GET":
    #     data_type = request.query_params.get("data_type", "Real_Data")
    #     try:
    #         copies = get_process_list(company_id, data_type)
    #     except:
    #         return Response([], status.HTTP_500_INTERNAL_SERVER_ERROR)

    #     return Response(copies, status.HTTP_200_OK)


@api_view(["POST"])
def create_workflow_setting(request):
    """Create a new workflow setting"""
    form = request.data
    if not form:
        return Response("Setting Data required", status.HTTP_400_BAD_REQUEST)

    company_id = form["company_id"]
    owner_name = form["owner_name"]

    username = form["username"]
    portfolio_name = form["portfolio_name"]
    processes = [{"version": "1.0.0", "flag": "enable", "process": form["proccess"]}]
    wf_set = json.loads(
        save_wf_setting(company_id, owner_name, username, portfolio_name, processes)
    )

    if wf_set["isSuccess"]:
        return Response(
            {
                "workflow_setting": get_wf_setting_object(wf_set["inserted_id"]),
            },
            status.HTTP_201_CREATED,
        )
    return Response(
        "Failed to Save Workflow setting", status.HTTP_500_INTERNAL_SERVER_ERROR
    )


@api_view(["GET", "PUT"])
def get_wf_ai_setting(request, wf_setting_id):
    """Retrive a Wf setting"""

    if not validate_id(wf_setting_id):
        return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)

    if request.method == "GET":
        try:
            setting = get_wf_setting_object(wf_setting_id)
        except:
            return Response(
                "failed to get setting", status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(setting, status.HTTP_200_OK)

    if request.method == "PUT":
        """Update workflow Setting"""

        form = request.data
        if not form:
            return Response("Workflow Data is Required", status.HTTP_400_BAD_REQUEST)

        old_wf_setting = get_wf_setting_object(wf_setting_id)
        version = setting.version_control(old_wf_setting["processes"][-1]["version"])
        old_wf_setting["processes"][-1]["flag"] = "disable"

        old_wf_setting["processes"].append(
            {"version": version, "flag": "enable", "process": form["proccess"]}
        )
        updt_wf = json.loads(wf_setting_update(wf_setting_id, old_wf_setting))

        if updt_wf["isSuccess"]:
            return Response("Workflow Setting Updated", status.HTTP_201_CREATED)

        return Response("Failed to Update Workflow", status.HTTP_200_OK)


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
        save_wf(data, form["company_id"], form["created_by"], form["data_type"])
    )

    if res["isSuccess"]:
        return Response("Workflow Created", status.HTTP_201_CREATED)

    return Response("Failed to Save Workflow", status.HTTP_200_OK)


@api_view(["GET", "PUT"])
def workflow_detail(request, workflow_id):
    """Single workflows"""

    if not validate_id(workflow_id):
        return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)

    if request.method == "GET":
        data = get_wf_object(workflow_id)
        if not data:
            return Response("Failed to Load Workflow", status.HTTP_204_NO_CONTENT)
        else:
            return Response(data, status.HTTP_200_OK)

    if request.method == "PUT":
        """Update content of a workflow"""

        form = request.data
        if not form:
            return Response("Workflow Data is required", status.HTTP_400_BAD_REQUEST)

        workflow = {
            "workflow_title": form["wf_title"],
            "workflow_id": form["workflow_id"],
            "data_type": form["data_type"],
            "steps": form["steps"],
        }
        old_workflow = get_wf_object(form["workflow_id"])
        old_workflow["workflows"]["data_type"] = "Archive Data"

        updt_wf = json.loads(update_wf(form["workflow_id"], old_workflow))
        if updt_wf["isSuccess"]:
            return Response("workflow Updated", status.HTTP_201_CREATED)

        return Response(
            "Failed to Update Workflow", status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["GET"])
def get_workflows(request, company_id):
    """List all workflows"""

    data_type = request.query_params.get("data_type", "Real_Data")
    if not validate_id(company_id):
        return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)

    try:
        workflow_list = get_wf_list(company_id, data_type)
    except:
        return Response({"workflows": []}, status.HTTP_500_INTERNAL_SERVER_ERROR)

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
        try:
            document_list = get_document_list(company_id, data_type)
            cache.set(cache_key, document_list, timeout=60)
        except:
            return Response({"documents": []}, status.HTTP_500_INTERNAL_SERVER_ERROR)

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
    else:
        viewers = [request.data["created_by"]]
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
            )
        )
        if res["isSuccess"]:
            editor_link = access_editor(res["inserted_id"], "document")

            if not editor_link:
                return Response(
                    "Could not open document editor.",
                    status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            return Response(editor_link, status.HTTP_201_CREATED)

        return Response(
            {"message": "Unable to Create Document"},
            status.HTTP_200_OK,
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
        for j in range(0, len(my_dict[i])):
            temp_list.append({"id": my_dict[i][j]["id"], "data": my_dict[i][j]["data"]})
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
        return Response(
            "Could not open document editor.", status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return Response(editor_link, status.HTTP_201_CREATED)


@api_view(["POST"])
def archives(request):
    """Archiving  (Template | Workflow | Document)"""

    if not request.data:
        return Response("You are missing something", status.HTTP_400_BAD_REQUEST)

    id = request.data["item_id"]
    if not validate_id(id):
        return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)

    if request.data["item_type"] == "workflow":
        res = delete_workflow(id, "Archive_Data")
        if res["isSuccess"]:
            return Response("Workflow moved to archives", status.HTTP_200_OK)

    if request.data["item_type"] == "document":
        res = delete_document(id, "Archive_Data")
        if res["isSuccess"]:
            return Response("Document moved to archives", status.HTTP_200_OK)

    if request.data["item_type"] == "template":
        res = delete_template(id, "Archive_Data")
        if res["isSuccess"]:
            return Response("Template moved to archives", status.HTTP_200_OK)

    if request.data["item_type"] == "process":
        res = delete_process(id, "Archive_Data")
        if res["isSuccess"]:
            return Response("Process moved to archives", status.HTTP_200_OK)

    return Response(
        "Item could not be moved to archives", status.HTTP_500_INTERNAL_SERVER_ERROR
    )


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
        if res["isSuccess"]:
            return Response("Workflow restored from archives", status.HTTP_200_OK)

    if request.data["item_type"] == "document":
        res = delete_document(id, "Real_Data")
        if res["isSuccess"]:
            return Response("Document restored from archives", status.HTTP_200_OK)

    if request.data["item_type"] == "template":
        res = delete_template(id, "Real_Data")
        if res["isSuccess"]:
            return Response("Template restored from archives", status.HTTP_200_OK)

    if request.data["item_type"] == "process":
        res = delete_process(id, "Real_Data")
        if res["isSuccess"]:
            return Response("Process restored from archives", status.HTTP_200_OK)

    return Response(
        "Item could not be restored from archives",
        status.HTTP_500_INTERNAL_SERVER_ERROR,
    )


@api_view(["POST"])
def favorites(request):
    """`Favourite` an Item( workflow | template | document) or List favourites"""

    if not request.data:
        return Response("You are missing something", status.HTTP_400_BAD_REQUEST)

        # create a fav

    msg = create_favourite(
        item=request.data["item"],
        type=request.data["item_type"],
        username=request.data["username"],
    )
    if not msg:
        return Response(
            "Item could not be added to bookmarks",
            status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return Response(msg, status.HTTP_201_CREATED)


@api_view(["GET"])
def all_favourites(request, company_id):
    """List favs"""

    if not validate_id(company_id):
        return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)

    data = list_favourites(company_id)
    if not data:
        return Response(
            "failed to get bookmarks",
            status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

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
    if not msg:
        return Response(
            "failed to remove from bookmarks", status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return Response(msg, status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
def get_templates(request, company_id):
    """List of Created Templates."""

    data_type = request.query_params.get("data_type", "Real_Data")
    if not validate_id(company_id):
        return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)

    templates = get_template_list(company_id, data_type)
    if not templates:
        return Response({"templates": []}, status.HTTP_500_INTERNAL_SERVER_ERROR)
    if len(templates) > 0:
        return Response(
            {"templates": templates},
            status.HTTP_200_OK,
        )
    return Response(
        {"templates": []},
        status.HTTP_200_OK,
    )


@api_view(["POST"])
def create_template(request):
    data = ""
    page = ""
    template_name = "Untitled Template"
    if not validate_id(request.data["company_id"]):
        return Response("Invalid company details", status.HTTP_400_BAD_REQUEST)

    res = json.loads(
        save_template(
            template_name,
            data,
            page,
            request.data["created_by"],
            request.data["company_id"],
            request.data["data_type"],
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
        try:
            editor_link = requests.post(
                EDITOR_API,
                data=json.dumps(payload),
            )
        except:
            return Response(
                {"message": "Template Creation Failed"},
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        return Response(
            editor_link.json(),
            status.HTTP_201_CREATED,
        )
    return Response(
        {"message": "Template creation failed."},
        status.HTTP_500_INTERNAL_SERVER_ERROR,
    )


@api_view(["GET"])
def template_detail(request, template_id):
    """editor link for a document"""

    if not validate_id(template_id):
        return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)

    editor_link = access_editor(template_id, "template")
    if not editor_link:
        return Response(
            "Could not open template editor.", status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return Response(editor_link, status.HTTP_201_CREATED)


@api_view(["PUT"])
def approve(request, template_id):
    """Approve a given template"""

    if not validate_id(template_id):
        return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)

    response = json.loads(update_template_approval(template_id, approval=True))
    if not response["isSuccess"]:
        return Response(
            "Template Could not be Approved.",
            status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    return Response({"message": "Template Approved."}, status.HTTP_200_OK)


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
    # team_member = form["team_member"]
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
    return Response("Failed to Save Team Data", status.HTTP_500_INTERNAL_SERVER_ERROR)


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
    return Response("Failed to Update Team Data", status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def get_team_data(request, team_id):
    """Get specific Team"""

    try:
        teams = get_team(team_id)
    except:
        return Response(
            "Failed to Load Team Data", status.HTTP_500_INTERNAL_SERVER_ERROR
        )

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
        # print([data[form['data_type']] for data in all_team])
        return Response(
            [
                data
                for data in all_team
                if form["data_type"] in str(data.get("data_type", ""))
            ],
            status.HTTP_200_OK,
        )
    except:
        # print([data[form['data_type']] for data in all_team])
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

    if not document_list:
        return Response({"documents": []}, status=status.HTTP_200_OK)

    if len(document_list) > 0:
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
    process = request.query_params.get("document_name", process_id)

    if not validate_id(company_id):
        return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)

    document_list = get_document_list(company_id, data_type)

    if not document_list:
        return Response({"documents": []}, status=status.HTTP_200_OK)

    if len(document_list) > 0:
        cloned = list(
            filter(lambda i: i.get("process_id") == process_id, document_list)
        )
        """To retrieve only the cloned list fields"""
        # cloned = [doc.get("clone_list") for doc in document_list if doc.get("_id") == process_id]
        return Response(
            {f"document_list of process: {process_id}": cloned},
            status=status.HTTP_200_OK,
        )

    return Response(
        {f"document_list of process: {process_id}": []},
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
def create_workflow_ai_setting(request):
    # TODO: check if the organization has a setting already if yes, they can only have one so return and tell them that
    if not request.data:
        return Response("You are missing something", status.HTTP_400_BAD_REQUEST)

    company_id = request.data["company_id"]
    if not validate_id(company_id):
        return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)

    is_exists = checks.is_wf_setting_exist(company_id, request.data["created_by"])
    if is_exists:
        return Response({"WF SETTING EXISTS": is_exists}, status.HTTP_200_OK)
    else:
        try:
            res = save_wf_setting(
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
        except Exception as e:
            print(e)
            return Response(
                "Failed to Save Workflow Setting", status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        if res["isSuccess"]:
            return Response(
                "You added WorkflowAI settings for your organization",
                status.HTTP_201_CREATED,
            )

        return Response(
            "Failed to Save Workflow Setting", status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["GET"])
def all_workflow_ai_setting(request, company_id,data_type="Real_data"):
    """Get All WF AI"""
    all_setting = get_wfai_setting_list(company_id,data_type)
    try:
        return Response(
            all_setting,
            status.HTTP_200_OK,
        )
    except:
        return Response(
            "Failed to Get WF AI Data", status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["GET"])
def get_workflow_ai_setting(request, wf_setting_id):
    """Get All WF AI"""
    setting = get_wf_setting_object(wf_setting_id)
    try:
        return Response(
            setting,
            status.HTTP_200_OK,
        )
    except:
        return Response(
            "Failed to Get WF AI Data", status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["POST"])
def update_workflow_ai_setting(request):
    """Retrive a Wf setting"""

    if request.method == "POST":
        """Update workflow Setting"""

        form = request.data
        if not form:
            return Response("Workflow Data is Required", status.HTTP_400_BAD_REQUEST)

        old_wf_setting = get_wf_setting_object(form["wf_setting_id"])
        for key, new_value in form.items():
            if key in old_wf_setting:
                old_wf_setting[key] = new_value

        updt_wf = json.loads(wf_setting_update(form["wf_setting_id"], old_wf_setting))

        if updt_wf["isSuccess"]:
            return Response("Workflow Setting Updated", status.HTTP_201_CREATED)

        return Response("Failed to Update Workflow", status.HTTP_200_OK)
