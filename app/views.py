import json
import ast
from threading import Thread
import requests
from .utils.algolia import get_algolia_data, get_fav_data
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .utils.thread_start import ThreadAlgolia, UpdateThreadAlgolia
from .utils.thread_start import FavoriteThread, DeleteFavoriteThread
from .constants import EDITOR_API
from .models import FavoriteDocument, FavoriteWorkflow, FavoriteTemplate

from app.utils.mongo_db_connection_v2 import (
    document_finalize,
    get_document_object,
    get_process_object,
    update_wf_process,
    save_document,
    get_links_object_by_process_id,
)
from app.utils.mongo_db_connection import (
    save_wf_setting,
    get_wf_setting_object,
    wf_setting_update,
    get_wf_list,
    get_process_list,
    update_wf,
    delete_workflow,
    delete_document,
    get_document_list,
    get_document_object,
    get_template_list,
    save_template,
    update_template_approval,
    get_template_object,
    delete_template,
    save_wf,
    delete_process,
    get_wf_object,
    get_wf_list,
    update_wf,
    delete_workflow,
)
from app.utils import checks, processing, threads
from .utils import setting
from app.utils import cloning


@api_view(["GET"])
def home(request):
    return Response("WorkflowAI Service is running...", status=status.HTTP_200_OK)


@api_view(["POST"])
def document_processing(request):
    """processing is determined by action picked by user."""
    if not request.data:
        return Response(
            "You are missing something!", status=status.HTTP_400_BAD_REQUEST
        )
    data_type = "Testing_Data"
    if request.data["action"] == "save_workflow_to_document_and_save_to_drafts":
        choice = "save"
        process = processing.new(
            workflows=request.data["workflows"],
            created_by=request.data["created_by"],
            company_id=request.data["company_id"],
            data_type=request.data["data_type"],
            document_id=cloning.document(
                document_id=request.data["document_id"],
                auth_viewer=None,
                parent_id=request.data["document_id"],
                process_id="",
            ),
            process_choice=choice,
            creator_portfolio=request.data["creator_portfolio"],
        )
        # update doc with process.
        doc_data = {
            "document_id": process["document_id"],
            "process_id": process["_id"],
            "state": "processing",
        }
        dt = Thread(
            target=threads.document_update,
            args=(doc_data,),
        )
        dt.start()

        return Response(
            "Created Workflow and Saved in drafts.", status=status.HTTP_201_CREATED
        )

    if request.data["action"] == "start_document_processing_content_wise":
        choice = "content"
        # create process with new id-
        process = processing.new(
            workflows=request.data["workflows"],
            created_by=request.data["created_by"],
            company_id=request.data["company_id"],
            data_type=request.data["data_type"],
            document_id=cloning.document(
                document_id=request.data["document_id"],
                auth_viewer=None,
                parent_id=request.data["document_id"],
                process_id="",
            ),
            process_choice=choice,
            creator_portfolio=request.data["creator_portfolio"],
        )
        doc_data = {
            "document_id": process["document_id"],
            "process_id": process["_id"],
            "state": "processing",
        }
        # update doc with process.
        dt = Thread(
            target=threads.document_update,
            args=(doc_data,),
        )
        dt.start()
        return processing.start(process)

    if request.data["action"] == "start_document_processing_wf_steps_wise":
        choice = "steps"
        # create process with new id->
        process = processing.new(
            workflows=request.data["workflows"],
            created_by=request.data["created_by"],
            company_id=request.data["company_id"],
            data_type=request.data["data_type"],
            document_id=cloning.document(
                document_id=request.data["parent_document_id"],
                auth_viewer=None,
                parent_id=request.data["document_id"],
                process_id="",
            ),
            process_choice=choice,
            creator_portfolio=request.data["creator_portfolio"],
        )
        doc_data = {
            "document_id": process["document_id"],
            "process_id": process["_id"],
            "state": "processing",
        }
        # update doc with process.
        dt = Thread(
            target=threads.document_update,
            args=(doc_data,),
        )
        dt.start()
        return processing.start(process)

    if request.data["action"] == "start_document_processing_wf_wise":
        choice = "workflow"
        # create process with new id.
        process = processing.new(
            workflows=request.data["workflows"],
            created_by=request.data["created_by"],
            company_id=request.data["company_id"],
            data_type=request.data["data_type"],
            document_id=cloning.document(
                document_id=request.data["parent_document_id"],
                auth_viewer=None,
                parent_id=request.data["parent_document_id"],
                process_id="",
            ),
            process_choice=choice,
            creator_portfolio=request.data["creator_portfolio"],
        )
        doc_data = {
            "document_id": process["parent_document_id"],
            "process_id": process["_id"],
            "state": "processing",
        }
        # update doc with process.
        dt = Thread(
            target=threads.document_update,
            args=(doc_data,),
        )
        dt.start()
        return processing.start(process)

    if request.data["action"] == "test_document_processing_content_wise":
        choice = "content"
        # create process with new id->
        process = processing.new(
            workflows=request.data["workflows"],
            created_by=request.data["created_by"],
            company_id=request.data["company_id"],
            data_type=data_type,
            document_id=cloning.document(
                document_id=request.data["parent_document_id"],
                auth_viewer=None,
                parent_id=request.data["parent_document_id"],
                process_id="",
            ),
            process_choice=choice,
            creator_portfolio=request.data["creator_portfolio"],
        )
        doc_data = {
            "document_id": process["parent_document_id"],
            "process_id": process["_id"],
            "state": "processing",
        }
        # update doc with process.
        dt = Thread(
            target=threads.document_update,
            args=(doc_data,),
        )
        dt.start()
        return processing.start(process)

    if request.data["action"] == "test_document_processing_wf_steps_wise":
        choice = "steps"
        # create process with new id->
        process = processing.new(
            workflows=request.data["workflows"],
            created_by=request.data["created_by"],
            company_id=request.data["company_id"],
            data_type=data_type,
            document_id=cloning.document(
                document_id=request.data["parent_document_id"],
                auth_viewer=None,
                parent_id=request.data["parent_document_id"],
                process_id="",
            ),
            process_choice=choice,
            creator_portfolio=request.data["creator_portfolio"],
        )
        doc_data = {
            "document_id": process["parent_document_id"],
            "process_id": process["_id"],
            "state": "processing",
        }
        # update doc with process.
        dt = Thread(
            target=threads.document_update,
            args=(doc_data,),
        )
        dt.start()
        return processing.start(process)

    if request.data["action"] == "test_document_processing_wf_wise":
        choice = "workflow"
        # create process with new id->
        process = processing.new(
            workflows=request.data["workflows"],
            created_by=request.data["created_by"],
            company_id=request.data["company_id"],
            data_type=data_type,
            document_id=cloning.document(
                document_id=request.data["parent_document_id"],
                auth_viewer=None,
                parent_id=request.data["parent_document_id"],
                process_id="",
            ),
            process_choice=choice,
            creator_portfolio=request.data["creator_portfolio"],
        )
        doc_data = {
            "document_id": process["parent_document_id"],
            "process_id": process["_id"],
            "state": "processing",
        }
        # update doc with process.
        dt = Thread(
            target=threads.document_update,
            args=(doc_data,),
        )
        dt.start()
        return processing.start(process)

    if request.data["action"] == "close_processing_and_mark_as_completed":

        process = get_process_object(workflow_process_id=request.data["process_id"])
        if process["processing_state"] == "complete":
            return Response(
                "This Workflow process is already complete", status=status.HTTP_200_OK
            )
        res = json.loads(
            update_wf_process(
                process_id=process["process_id"],
                steps=process["processing_steps"],
                state="complete",
            )
        )
        if res["isSuccess"]:
            return Response(
                "Process closed and marked as complete!", status=status.HTTP_200_OK
            )
        return Response(
            "Failed to mark process and completed!",
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    if (
        request.data["action"] == "cancel_process_before_completion"
    ):  # document should reset to initial state.

        process = get_process_object(workflow_process_id=request.data["process_id"])
        if process["processing_state"] == "canceled":
            return Response(
                "This Workflow process is Cancelled!", status=status.HTTP_200_OK
            )
        res = json.loads(
            update_wf_process(
                process_id=process["process_id"],
                steps=process["processing_steps"],
                state="canceled",
            )
        )
        if res["isSuccess"]:
            return Response("Process has been cancelled!", status=status.HTTP_200_OK)
        return Response(
            "Failed cancel process!", status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    if request.data["action"] == "pause_processing_after_completing_ongoing_step":
        """- find the ongoing step - pause processing"""
        return Response(
            "This Option is currently in development",
            status=status.HTTP_501_NOT_IMPLEMENTED,
        )

    return Response("Something went wrong!", status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def process_verification(request):
    """verification of a process step access and checks that duplicate document based on a step."""
    if (
        not request.data["portfolio"]
        and request.data["user_name"]
        and request.data["continent"]
        and request.data["country"]
        and request.data["city"]
    ):
        return Response(
            "You are missing something!", status=status.HTTP_400_BAD_REQUEST
        )

    # check user
    user_name = request.data["user_name"]
    auth_user, process_id, auth_step_role = checks.user_presence(
        token=request.data["token"],
        user_name=user_name,
        portfolio=request.data["portfolio"],
    )
    if not auth_user:
        return Response(
            "User is not part of this process", status=status.HTTP_401_UNAUTHORIZED
        )

    # get process
    process = get_process_object(workflow_process_id=process_id)
    if not process:
        Response(
            "Something went wrong!, Retry", status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    # check states
    if process["processing_state"]:
        if process["processing_state"] == "paused":
            return Response(
                "This workflow process is currently on hold!", status=status.HTTP_200_OK
            )
        # was the process not started?
        if process["processing_state"] == "save":
            return Response(
                "This workflow process is not activated!", status=status.HTTP_200_OK
            )
    location_data = {
        "city": request.data["city"],
        "country": request.data["country"],
        "continent": request.data["continent"],
    }

    access_link = processing.verify(process, auth_step_role, location_data, user_name)
    if access_link:
        return Response(access_link, status.HTTP_200_OK)

    return Response("Access to document denied at this time!", status=status.HTTP_401_UNAUTHORIZED)


@api_view(["POST"])
def mark_process_as_finalize_or_reject(request):
    """After access is granted and the user has made changes on a document."""
    if (
        not request.data["company_id"]
        and request.data["action"]
        and request.data["document_id"]
        and request.data["process_id"]
        and request.data["authorized"]
        and request.data["role"]
    ):
        return Response("You are missing something", status=status.HTTP_400_BAD_REQUEST)

    # get document
    try:
        document = get_document_object(document_id=request.data["document_id"])
    except ConnectionError:
        return Response(
            "Something went wrong!", status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    # check state.
    if document["document_state"] == "complete":
        return Response(
            "Document has already been finalized", status=status.HTTP_200_OK
        )

    # mark the doc as complete

    if request.data["action"] == "finalize":
        state = "complete"
    elif request.data["action"] == "reject":
        state = "rejected"

    # mark document as finalize.
    res = document_finalize(document_id=request.data["document_id"], state=state)
    if res["isSuccess"]:
        # Signal for further processing.
        data = {
            "process_id": request.data["process_id"],
            "auth_step_role": request.data["role"],
            "authorized": request.data["authorized"],
            "document_id": request.data["document_id"]
        }
        Thread(target=threads.background, args=(data,)).start()
        return Response("document processed successfully", status=status.HTTP_200_OK)

    return Response(
        "Error processing the document", status=status.HTTP_500_INTERNAL_SERVER_ERROR
    )


@api_view(["POST"])
def trigger_process(request):
    """Get process and begin processing it."""
    try:
        process = get_process_object(request.data["process_id"])
    except ConnectionError:
        return Response(
            "Could not start processing!", status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    # check user.
    if request.data["user_name"] != process["created_by"]:
        return Response(
            "User not allowed to trigger process", status=status.HTTP_403_FORBIDDEN
        )

    # check action.
    if (
        request.data["action"] == "halt_process"
        and process["processing_state"] != "paused"
    ):
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
                status=status.HTTP_200_OK,
            )
    if (
        request.data["action"] == "process_draft"
        and process["processing_state"] != "processing"
    ):
        return processing.start(process)


@api_view(["POST"])
def create_workflow_setting(request):  # Document Creation.
    if request.method == "POST":
        form = request.data
        if not form:
            return Response(
                {"message": "Workflow AI Setting Data required"},
                status=status.HTTP_404_NOT_FOUND,
            )
        else:

            company_id = form["company_id"]
            owner_name = form["owner_name"]

            username = form["username"]
            portfolio_name = form["portfolio_name"]
            processes = [
                {"version": "1.0.0", "flag": "enable", "process": form["proccess"]}
            ]
            wf_set = json.loads(
                save_wf_setting(
                    company_id, owner_name, username, portfolio_name, processes
                )
            )

            if wf_set["isSuccess"]:
                try:
                    return Response(
                        {
                            "workflow_setting": get_wf_setting_object(
                                wf_set["inserted_id"]
                            ),
                        },
                        status=status.HTTP_201_CREATED,
                    )
                except:
                    return Response(
                        {
                            "workflow_setting": [],
                            "message": "Failed to Save Workflow setting data",
                        },
                        status=status.HTTP_200_OK,
                    )


@api_view(["GET"])
def get_wf_ai_setting(request, wf_setting_id):
    try:
        return Response(
            {"workflow_ai_setting": get_wf_setting_object(wf_setting_id)},
            status=status.HTTP_200_OK,
        )
    except:
        return Response(
            {"workflow_ai_setting": [], "message": "Failed to get response"},
            status=status.HTTP_200_OK,
        )


@api_view(["POST"])
def update_wfai_setting(request):  # Document Creation.
    if request.method == "POST":
        form = request.data
        if not form:
            return Response(
                {"workflow": [], "message": "Workflow Data is required for Update"},
                status=status.HTTP_200_OK,
            )
        else:
            old_wf_setting = get_wf_setting_object(form["wf_setting_id"])
            # print(old_wf_setting)
            version = setting.version_control(
                old_wf_setting["processes"][-1]["version"]
            )
            old_wf_setting["processes"][-1]["flag"] = "disable"

            old_wf_setting["processes"].append(
                {"version": version, "flag": "enable", "process": form["proccess"]}
            )
            updt_wf = json.loads(
                wf_setting_update(form["wf_setting_id"], old_wf_setting)
            )

            if updt_wf["isSuccess"]:
                try:
                    return Response(
                        {
                            "WF_Setting_Updated": old_wf_setting
                            # ,"WF_Setting_Archived":get_wf_setting_object(arch_wf['inserted_id'])
                        },
                        status=status.HTTP_201_CREATED,
                    )
                except:
                    return Response(
                        {"workflow": [], "message": "Failed to Update Workflow"},
                        status=status.HTTP_200_OK,
                    )


@api_view(["POST"])
def create_workflow(request):  # Document Creation.
    completed = False
    form = request.data
    if not form:
        return Response(
            {"message": "Workflow Data required"},
            status=status.HTTP_404_NOT_FOUND,
        )
    else:
        data = {
            "workflow_title": form["wf_title"],
            "data_type": form["data_type"],
            "steps": form["steps"],
        }
        res = json.loads(save_wf(data, form["company_id"], form["created_by"]))
        if res["isSuccess"]:
            wf_data = get_wf_object(res["inserted_id"])
            try:
                ThreadAlgolia(res["inserted_id"], get_wf_object).start()
                return Response(
                    {
                        "workflow": wf_data,
                    },
                    status=status.HTTP_201_CREATED,
                )
            except RuntimeError:
                return Response(
                    {"workflow": [], "message": "Failed to Save Workflow"},
                    status=status.HTTP_200_OK,
                )


@api_view(["POST"])
def update_workflow(request):  # Document Creation.

    form = request.data
    if not form:
        return Response(
            {"workflow": [], "message": "Workflow Data is required for Update"},
            status=status.HTTP_200_OK,
        )
    else:

        workflow = {
            "workflow_title": form["wf_title"],
            "workflow_id": form["workflow_id"],
            "data_type": form["data_type"],
            "steps": form["steps"],
        }
        old_workflow = get_wf_object(form["workflow_id"])
        old_workflow["workflows"]["data_type"] = "Archive Data"

        updt_wf = json.loads(update_wf(form["workflow_id"], old_workflow))
        nw_wf = json.loads(
            save_wf(
                {key: val for key, val in workflow.items() if key != "workflow_id"},
                form["company_id"],
                form["created_by"],
            )
        )

        if updt_wf["isSuccess"]:
            try:
                updated_wf = get_wf_object(nw_wf["inserted_id"])
                ThreadAlgolia(nw_wf["inserted_id"], get_wf_object).start()
                return Response(
                    {"workflow": updated_wf},
                    status=status.HTTP_201_CREATED,
                )
            except RuntimeError:
                return Response(
                    {"workflow": [], "message": "Failed to Update Workflow"},
                    status=status.HTTP_200_OK,
                )


@api_view(["GET"])
def workflow_detail(request, workflow_id):  # Single document
    data = get_wf_object(workflow_id)
    if not data:
        return Response(
            {"workflow": [], "message": "Failed to Load Workflow."},
            status=status.HTTP_200_OK,
        )
    else:
        return Response(
            {"workflow": data},
            status=status.HTTP_201_CREATED,
        )


@api_view(["GET"])
def archive_workflow(request, workflow_id):
    try:
        delete_workflow(workflow_id)
        return Response("Workflow Added to trash", status=status.HTTP_200_OK)
    except ConnectionError:
        return Response("Failed to add workflow to trash", status=status.HTTP_200_OK)


def workflow_index_update(payload):
    try:
        UpdateThreadAlgolia(payload).start()
    except RuntimeError:
        ThreadAlgolia(payload["_id"], get_wf_object).start()


@api_view(["GET"])
def get_workflows(request, company_id):
    workflow_list = get_wf_list(company_id)
    if not workflow_list:
        return Response({"workflows": []}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if len(workflow_list) > 0:
        return Response(
            {"workflows": workflow_list},
            status=status.HTTP_200_OK,
        )
    return Response(
        {"workflows": []},
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
def get_documents(request, company_id):  # List of Created Templates.
    document_list = get_document_list(company_id)
    if not document_list:
        return Response({"documents": []}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if len(document_list) > 0:
        return Response(
            {"documents": document_list},
            status=status.HTTP_200_OK,
        )

    return Response(
        {"documents": []},
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
def create_document(request):  # Document Creation.
    if not request.data:
        return Response(
            {"message": "Failed to process document creation."},
            status=status.HTTP_200_OK,
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
            payload = json.dumps(
                {
                    "product_name": "workflowai",
                    "details": {
                        "_id": res["inserted_id"],
                        "field": "document_name",
                        "action": "document",
                        "cluster": "Documents",
                        "database": "Documentation",
                        "collection": "DocumentReports",
                        "document": "documentreports",
                        "team_member_ID": "11689044433",
                        "function_ID": "ABCDE",
                        "command": "update",
                        "flag": "editing",
                        "update_field": {
                            "document_name": "",
                            "content": "",
                            "page": "",
                        },
                    },
                }
            )
            headers = {"Content-Type": "application/json"}
            editor_link = requests.request(
                "POST", EDITOR_API, headers=headers, data=payload
            )
            try:
                ThreadAlgolia(res["inserted_id"], get_document_object).start()
                return Response(
                    editor_link.json(),
                    status=status.HTTP_201_CREATED,
                )
            except ConnectionError:
                return Response(
                    {"document": [], "message": "Failed to call EDITOR_API"},
                    status=status.HTTP_200_OK,
                )

        return Response(
            {"document": [], "message": "Unable to Create Document"},
            status=status.HTTP_200_OK,
        )


@api_view(["GET"])
def get_document_content(request, document_id):
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
    return Response(content, status=status.HTTP_200_OK)


@api_view(["GET"])
def document_detail(request, document_id):  # Single document
    payload = json.dumps(
        {
            "product_name": "workflowai",
            "details": {
                "cluster": "Documents",
                "database": "Documentation",
                "collection": "DocumentReports",
                "document": "documentreports",
                "team_member_ID": "11689044433",
                "function_ID": "ABCDE",
                "_id": document_id,
                "field": "document_name",
                "action": "document",
                "flag": "editing",
                "command": "update",
                "update_field": {"content": "", "document_name": "", "page": ""},
            },
        }
    )
    headers = {"Content-Type": "application/json"}
    try:
        editor_link = requests.post(EDITOR_API, headers=headers, data=payload)
    except ConnectionError:
        return Response(
            {"document": [], "message": "Failed to call EDITOR_API"},
            status=status.HTTP_200_OK,
        )
    return Response(
        editor_link.json(),
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET"])
def archive_document(request, document_id):
    try:
        delete_document(document_id)
        return Response(
            "Document Added to trash",
            status=status.HTTP_200_OK,
        )
    except ConnectionError:
        return Response("Failed to add to trash", status=status.HTTP_200_OK)


@api_view(["POST"])
def search(request):
    return Response(
        {
            "search_keyword": request.data["search"],
            "search_result": get_algolia_data(
                request.data["search"], request.data["company_id"]
            ),
        },
        status=status.HTTP_200_OK,
    )


@api_view(["GET", "POST"])
def get_fav(request):
    documents = []
    templates = []
    workflows = []
    if request.method == "POST":
        company_id = request.data["company_id"]
        created_by = request.data["created_by"]
        documents = FavoriteDocument.objects.filter(
            company_id=company_id, created_by=created_by
        ).values()
        templates = FavoriteTemplate.objects.filter(
            company_id=company_id, created_by=created_by
        ).values()
        workflows = FavoriteWorkflow.objects.filter(
            company_id=company_id, created_by=created_by
        ).values()
    return Response(
        {"documents": documents, "templates": templates, "workflows": workflows},
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
def favorite(request, item_id, item_type):
    try:

        FavoriteThread(item_id, item_type).start()
        return Response(status=status.HTTP_200_OK)
    except RuntimeError:
        return


@api_view(["GET"])
def delete_favorite(request, item_id, item_type):
    try:

        DeleteFavoriteThread(item_id, item_type).start()
        return Response(status=status.HTTP_200_OK)
    except RuntimeError:
        return


@api_view(["GET"])
def get_templates(request, company_id):
    """List of Created Templates."""
    templates = get_template_list(company_id)
    if not templates:
        return Response({"templates": []}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    if len(templates) > 0:
        return Response(
            {"templates": templates},
            status=status.HTTP_200_OK,
        )
    return Response(
        {"templates": []},
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
def create_template(request):
    data = ""
    page = ""
    template_name = "Untitled Template"
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
            ThreadAlgolia(res["inserted_id"], get_template_object).start()
            editor_link = requests.post(
                EDITOR_API,
                data=json.dumps(payload),
            )
        except ConnectionError:
            return Response(
                {"message": "Template Creation Failed"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        return Response(
            editor_link.json(),
            status=status.HTTP_201_CREATED,
        )
    return Response(
        {"message": "Template creation failed."},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )


@api_view(["GET"])
def template_detail(request, template_id):
    payload = {
        "product_name": "workflow_ai",
        "details": {
            "cluster": "Documents",
            "database": "Documentation",
            "collection": "TemplateReports",
            "document": "templatereports",
            "team_member_ID": "22689044433",
            "function_ID": "ABCDE",
            "_id": template_id,
            "field": "template_name",
            "action": "template",
            "flag": "editing",
            "command": "update",
            "update_field": {"template_name": "", "content": "", "page": ""},
        },
    }
    try:
        editor_link = requests.post(
            EDITOR_API,
            data=json.dumps(payload),
        )
    except ConnectionError:
        return Response(
            {"message": "Failed to go to editor."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    return Response(
        editor_link.json(),
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
def archive_template(request, template_id):
    try:
        delete_template(template_id)
        return Response("Template added to trash", status=status.HTTP_200_OK)
    except ConnectionError:
        return Response("Failed to add template to trash", status=status.HTTP_200_OK)


@api_view(["GET"])
def approve(request, template_id):
    response = json.loads(update_template_approval(template_id, approval=True))
    if not response["isSuccess"]:
        return Response(
            "Template Could not be Approved.",
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    return Response({"message": "Template Approved."}, status=status.HTTP_200_OK)


@api_view(["POST"])
def index_update(request):
    try:
        UpdateThreadAlgolia(request.data).start()
        return Response(status=status.HTTP_200_OK)
    except RuntimeError:
        return


# Old


@api_view(["GET"])
def processes(request, company_id):
    """fetches workflow process `I` created."""
    try:
        process_list = get_process_list(company_id)
    except ConnectionError:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    if len(process_list) > 0:
        return Response(process_list, status=status.HTTP_200_OK)
    return Response([], status=status.HTTP_200_OK)


@api_view(["POST"])
def get_process_link(request):
    """get a link process for person having notifications"""
    links_info = get_links_object_by_process_id(request.data["process_id"])
    user = request.data["user_name"]
    if not links_info:
        return Response(
            "Could not fetch process info at this time",
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    # check presence in link
    for link in links_info["links"]:
        if user in link:
            return Response(link[user], status=status.HTTP_200_OK)

    return Response(
        "User is not part of this process", status=status.HTTP_401_UNAUTHORIZED
    )


@api_view(["GET"])
def a_single_process(request, process_id):
    """get process by process id"""
    try:
        process = get_process_object(process_id)
    except ConnectionError:
        return Response(
            "Failed to get a process \n", status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    return Response(process, status=status.HTTP_200_OK)


@api_view(["GET"])
def fetch_process_links(request, process_id):
    """verification links for a process"""
    print("Fetching verification links \n")
    try:
        process_info = get_links_object_by_process_id(process_id)
    except ConnectionError:
        return Response(
            "Could not fetch process links",
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    if process_info["links"]:
        return Response(process_info["links"], status=status.HTTP_200_OK)
    return Response("No links found for this process", status=status.HTTP_404_NOT_FOUND)


@api_view(["GET"])
def archive_process(request, process_id):
    try:
        delete_process(process_id)
        return Response(
            "Process added to trash",
            status=status.HTTP_200_OK,
        )
    except ConnectionError:
        return Response(
            "Failed to add to process to trash",
            status=status.HTTP_200_OK,
        )
