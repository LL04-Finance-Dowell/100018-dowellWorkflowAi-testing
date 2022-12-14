import json
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .mongo_db_connection import (
    save_wf_process,
    get_process_object,
    get_document_object,
    update_document,
)

editor_api = "https://100058.pythonanywhere.com/api/generate-editor-link/"

"""
---------------------------------------SET WORKFLOWS IN DOCUMENT------------------------------------------
1.Select a document to add to a workflow.
    - user picks a document from the list 
2.Select a workflow to add to the document.
    - user picks a workflow from workflow list 
- ACTION - Add Workflow to selected document.
3.Connect selected workflow to selected document.
ACTION - Update Workflow Process. 
4. Check Workflows before processing.
process: ["content_wise", "member_wise", "workflow_step_wise", "location_wise", "time_wise"] - 1st process will be set to option.
ACTION - Sort Process
5. Process Document.

"""

# Create Process.
def new_process(workflows, created_by, company_id):
    process_title = ""
    process_steps = []
    try:
        for workflow in workflows:
            process_steps.extend(workflow["workflows"]["steps"])
            process_title = (
                process_title + workflow["workflows"]["workflow_title"] + " - "
            )
        print(process_steps)
        res = save_wf_process(process_title, process_steps, created_by, company_id)
        return res["inserted_id"]
    except:
        return False


# update document with process id.
def update_document_with_process(document_id, workflow_process_id):
    document = get_document_object(document_id)
    if not document:
        return False
    res = update_document(document_id, document["content"], workflow_process_id)
    if res["isSuccess"]:
        return True
    return False


@api_view(["POST"])
def save_workflows_to_document(request):
    process_id = new_process(
        workflows=request.data["workflows"],
        document_id=request.data["document_id"],
        created_by=request.data["created_by"],
        company_id=request.data["company_id"],
    )
    print(process_id)
    # if process_id:
    #     # update the doc.
    #     doc = update_document_with_process(
    #         document_id=request.data["document_id"],
    #         workflow_process_id=process_id,
    #     )
    #     if doc:
    #         return Response(status=status.HTTP_200_OK)
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


"""

Start the workflow process.

"""


@api_view(["POST"])
def save_and_start_processing(request):
    # fire up the processing action
    resp = start_processing(
        how_to=request.data["how_to"], process_id=request.data["process_id"]
    )
    return resp


"""

Process by member -> Process by workflow -> Process by workflow step -> Process by document content -> Process By location -> Process by time Limit.

"""


#  Begin processing the Workflow.
def start_processing(how_to, process_id, document_id):
    process = get_process_object(process_id)
    if not process:
        return Response(
            {"message": "Failed to Start Processing"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    if how_to == "member":
        return process_by_member(process, document_id)

    return Response(
        {"message": "Failed to Start Processing"}, status=status.HTTP_400_BAD_REQUEST
    )


#  A single Link
def generate_link(document_id, member_name):
    document = get_document_object(document_id)
    if not document:
        return
    payload = {
        "product_name": "workflowai",
        "details": {
            "_id": document_id,
            "field": "document_name",
            "action": "document",
            "cluster": "Documents",
            "database": "Documentation",
            "collection": "DocumentReports",
            "document": "documentreports",
            "team_member_ID": "11689044433",
            "function_ID": "ABCDE",
            "command": "update",
            "member": member_name,
            "update_field": {
                "document_name": "",
                "content": "",
            },
        },
    }
    try:
        link = json(requests.post(editor_api, data=json.dumps(payload)))
        return link
    except:
        return 


# Links generation
def generate_links(process, document_id):
    links = []
    for step in process["process_steps"]:
        if "member" in step:
            member_name = step["member"]
            link = generate_link(document_id, member_name)
            links.extend({member_name: link})
    return links


# processin by member choice.
def process_by_member(process, document_id):
    links = generate_links(process, document_id)
    if links:
        return Response(
            links,
            status=status.HTTP_200_OK,
        )
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


"""

Process Verification.

"""


def verify(process_id):
    #  get a workflow process.
    workflow = get_process_object(process_id)
    if not workflow:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    # Iterate over the workflow steps
    for step in workflow["steps"]:
        # Check if the current step should be skipped
        if step["skip"]:
            continue

        # Check if the current step applies to the current user
        if not check_user_permissions(step):
            continue

        # Check if the current step is within the allowed time period
        if not check_time_period(step):
            continue

        # Check if the current step is within the allowed location
        if not check_location(step):
            continue

        # Apply the current step to the document
        document = apply_step(step, document)

    # Return the final version of the document
    return document


"""
Check if the workflow has moved through given steps.
"""


def check_time_period(step):

    pass


def check_user_permissions(step):

    pass


def apply_step(step):
    pass


def check_location(step):
    pass
