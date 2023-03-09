import json
from threading import Thread

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from app.database.mongo_db_connection_v2 import (
    document_finalize,
    get_document_object,
    get_process_object,
    update_wf_process,
)
from app.utils import checks, cloning, processing, threads


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

    return Response("Verification failed", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
        # TODO: Find the documents in next step and change their state to processing
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
