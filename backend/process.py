import json
import uuid
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .mongo_db_connection import (
    save_wf_process,
    get_process_object,
    get_document_object,
    update_document,
    save_uuid_hash,
    get_uuid_object,
)


# ---------------------------------------------------------------------------------#
# API Endpoint - 1. -------  Set Wofkflows in document
# ---------------------------------------------------------------------------------#


@api_view(["POST"])
def save_workflows_to_document(request):
    process_id = new_process(
        workflows=request.data["workflows"],
        created_by=request.data["created_by"],
        company_id=request.data["company_id"],
        data_type=request.data["data_type"],
        document_id=request.data["document_id"],
    )
    if process_id:
        # update the doc.
        doc = update_document_with_process(
            document_id=request.data["document_id"],
            workflow_process_id=process_id,
        )
        if doc:
            return Response(status=status.HTTP_200_OK)
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Create Process.
def new_process(workflows, created_by, company_id, data_type, document_id):
    process_title = ""
    process_steps = []

    # construct process
    for workflow in workflows:
        process_steps.extend(workflow["workflows"]["steps"])
        process_title = process_title + workflow["workflows"]["workflow_title"] + " - "

    # save to collection.
    res = json.loads(
        save_wf_process(
            process_title, process_steps, created_by, company_id, data_type, document_id
        )
    )
    # return process id.
    if res["isSuccess"]:
        return res["inserted_id"]


# update document with process id.
def update_document_with_process(document_id, workflow_process_id):
    try:
        res = json.loads(update_document(document_id, workflow_process_id))
        return res["isSuccess"]
    except:
        return


# ---------------------------------------------------------------------------------#
# API Enpoint - 2 -------------  Start the workflow process.
# ---------------------------------------------------------------------------------#


@api_view(["POST"])
def save_and_start_processing(request):
    process_id = new_process(
        workflows=request.data["workflows"],
        document_id=request.data["document_id"],
        created_by=request.data["created_by"],
        company_id=request.data["company_id"],
        data_type=request.data["data_type"],
    )
    if process_id:

        # update the doc.
        doc = update_document_with_process(
            document_id=request.data["document_id"],
            workflow_process_id=process_id,
        )
        if doc:
            print("in doc")
            # fire up the processing action
            return start_processing(
                how_to=request.data["criteria"],
                process_id=process_id,
                document_id=request.data["document_id"],
            )
    return Response(
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )


#  Begin processing the Workflow.
def start_processing(how_to, process_id, document_id):
    print("choices")
    if how_to == "member":
        return process_by_member(process_id, document_id)

    if how_to == "workflow":
        return process_by_workflows(process_id, document_id)

    if how_to == "steps":
        return process_by_steps(process_id, document_id)

    if how_to == "document_content":
        return process_by_document_content(process_id, document_id)

    if how_to == "signing_location":
        return process_by_signing_location(process_id, document_id)

    return Response(status=status.HTTP_400_BAD_REQUEST)


# Process by member choice.
def process_by_member(process_id, document_id):
    print("process_by_member")
    # find a process
    process = get_process_object(process_id)

    # time to generate links
    if process:
        links = generate_links(process, document_id)
        if links:
            return Response(
                links,
                status=status.HTTP_200_OK,
            )
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Process by workflows
def process_by_workflows(process_id, document_id):
    # find a process
    try:
        process = get_process_object(process_id)
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Process by Workflow Steps
def process_by_steps(process_id, document_id):
    # find a process
    try:
        process = get_process_object(process_id)
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Process by Document Content.
def process_by_document_content(process_id, document_id):
    # find a process
    try:
        process = get_process_object(process_id)
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Process by Signing Location.
def process_by_signing_location(process_id, document_id):
    # find a process
    try:
        process = get_process_object(process_id)
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Links generation
def generate_links(process, document_id):
    links = []
    # iterate the process steps
    for step in process["process_steps"]:
        # check the member type.
        if step["member_type"] == "TEAM_MEMBER":
            print("here")
            if "member" in step:
                member_name = step["member"]
                print("member", member_name)
                link = verification_link(process["_id"], member_name, document_id)
                links.append({member_name: link})
        if step["member_type"] == "GUEST":
            if "member" in step:
                member_name = "guest"
                link = verification_link(process["_id"], member_name, document_id)
                links.extend({member_name: link})
        if step["member_type"] == "PUBLIC":
            if "member" in step:
                member_name = "public"
                link = verification_link(process["_id"], member_name, document_id)
                links.extend({member_name: link})
    return links


# application link
def verification_link(process_id, user_name, document_id):
    token = gen_token(process_id, user_name, document_id)
    if token:
        link = f"https://ll04-finance-dowell.github.io/100018-dowellWorkflowAi-testing/#/verify/{token}/"
    return link


# token generation
def gen_token(process_id, user_name, document_id):
    uuid_hash = uuid.uuid4().hex
    res = save_uuid_hash(uuid_hash, process_id, user_name, document_id)
    if res:
        return uuid_hash


# ---------------------------------------------------------------------------------#
# API Endpoint - 3. ---------  Verifying Process
# ---------------------------------------------------------------------------------#


@api_view(["POST"])
def verify_process(request):
    # token info
    try:
        token = get_uuid_object(request.data["token"])
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

   # now verify
    try:
        verified = verify(process_id=token["process_id"], user_name=token["user_name"])
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    #document link
    if verified:
        doc_link = generate_link(token["document_id"])
        if not doc_link:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(doc_link.json(), status=status.HTTP_201_CREATED)


def verify(process_id, user_name):
    verified = True
    #  get a workflow process.
    try:
        process = get_process_object(process_id)
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Iterate over the Process steps
    for step in process["process_steps"]:
        # validate the user access
        if step["member"] != user_name:
            return

        # Check if the current step should be skipped
        # if step["skip"]:
        #     continue

        # how should be steps.
        # if check_display_right(step):
        #     continue

        # Check if the current step is within the allowed time period.
        # if not check_time_limit(step):
        #     continue

        # Check if the current step is within the allowed location.
        # if not check_location(step):
        #     continue

        # Apply the current step to the document.
    return verified


# Check display in the step.
def check_display_right(step):
    allowed = True
    if step["display"] == "document_before_processing_this_step":
        return allowed

    if step["display"] == "document_after_processing_this_step":
        allowed = False
        return allowed

    if step["display"] == "document_in_all_steps":
        return allowed

    if step["display"] == "document_only_this_step":
        return allowed


# Verify time limit of the step.
def check_time_limit(step):
    if step["limit"] == "within 1 hour":
        return
    if step["limit"] == "within 8 hours":
        return
    if step["limit"] == "within 24 hours":
        return
    if step["limit"] == "within 3 days":
        return
    if step["limit"] == "within 7 days":
        return
    if step["limit"] == "custom_time":
        return


# check if the step can be skipped.
def check_step_skipping(step):
    if step["skip"] == True:
        return
    else:
        return


# check signing location.
def check_location(step):
    pass


#  A single Link
def generate_link(document_id):
    print("single link")
    editor_api = "https://100058.pythonanywhere.com/api/generate-editor-link/"
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
            "update_field": {"document_name": "", "content": "", "page": ""},
        },
    }

    link = requests.post(editor_api, data=json.dumps(payload))
    return link


# send reminders
def send_document_reminders(process_id):
    pass
