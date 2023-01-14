import jwt
import json
import uuid
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .mongo_db_connection import (
    save_wf_process,
    get_process_object,
    update_document,
    save_process_links,
    get_links_object_by_process_id,
    get_links_object_by_document_id,
    get_process_list,
)

# ---------------------------------------------------------------------------------#
# API Endpoint - 4. ---------  Workflows process Notification API
# ---------------------------------------------------------------------------------#


@api_view(["POST"])
def processes(request):  # Pending Workflow processes.
    try:
        processes = get_process_list(request.data["company_id"])
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    if len(processes) <= 0:
        return Response([], status=status.HTTP_200_OK)
    return Response(processes, status=status.HTTP_200_OK)


@api_view(["POST"])
def get_process_link(request):  # Get a links process for person having notifications
    # get links info
    links_info = get_links_object_by_document_id(request.data["document_id"])
    if not links_info:
        return Response(
            "Could not fetch process info at this time",
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    # check presence in link

    for link in links_info["links"]:
        if request.data["user_name"] in link:
            verify_link = link.get(request.data["user_name"])
            break
        else:
            return Response(
                "User is not part of this process", status=status.HTTP_401_UNAUTHORIZED
            )
    return Response(verify_link, status=status.HTTP_200_OK)


# ---------------------------------------------------------------------------------#
# API Endpoint - 3. ---------  Verifying Process
# ---------------------------------------------------------------------------------#


@api_view(["POST"])
def verify_process(request):
    print("verification started...... \n")
    # decode token
    decoded = jwt.decode(request.data["token"], "secret", algorithms="HS256")
    # find links
    try:
        processing_links_info = get_links_object_by_process_id(decoded["process_id"])
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    # check presence of the user trying to access in the links
    flag = False
    for link in processing_links_info["links"]:
        if request.data["user_name"] in link:
            flag = True
            break
        else:
            return Response(
                "User is not part of this process", status=status.HTTP_401_UNAUTHORIZED
            )
    # get document map for that user.
    try:
        process = get_process_object(workflow_process_id=decoded["process_id"])
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    # find the document map & run checks.
    for step in process["process_steps"]:
        # Portfolio Check.
        if (
            step["member"] == request.data["user_name"]
            and step["member_portfolio"] == request.data["portfolio"]
        ):
            # Doc Map & Rights
            map = step.get("document_map")
            right = step.get("rights")
            print("Started the checks....")
            # Display check
            # if check_display_right(step.get("display")):
            #     continue

            # Time Limit Check.
            # if check_time_limit(step.get("limit")):
            #     continue

            # Skip check
            # if check_step_skipping(step.get("skip")):
            #     continue

            # Location Check
            # if check_location(step.get("location")):
            #     continue

            break
        else:
            return Response(
                "Document Access Forbidden",
                status=status.HTTP_403_FORBIDDEN,
            )
    # Authorize creation
    if flag:
        # generate document link.
        doc_link = generate_link(
            document_id=processing_links_info["document_id"],
            doc_map=map,
            doc_rights=right,
        )
        return Response(doc_link.json(), status=status.HTTP_201_CREATED)
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


#  A single Doc Link
def generate_link(document_id, doc_map, doc_rights):
    print("generating document link .... \n")
    editor_api = "https://100058.pythonanywhere.com/api/generate-editor-link/"
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
            "document_map": doc_map,
            "document_right": doc_rights,
            "update_field": {"document_name": "", "content": "", "page": ""},
        },
    }
    link = requests.post(editor_api, data=json.dumps(payload))
    return link


# CHECKS...........
# Check display in the step.
def check_display_right(step):
    display_allowed = {
        "document_before_processing_this_step": True,
        "document_after_processing_this_step": False,
        "document_in_all_steps": True,
        "document_only_this_step": True,
    }
    return display_allowed.get(step["display"], False)


# Verify time limit of the step.
def check_time_limit(step):
    hours = 0
    if step["limit"] == "within_1_hour":

        return
    if step["limit"] == "within_8_hours":
        return
    if step["limit"] == "within_24_hours":
        return
    if step["limit"] == "within_3_days":
        return
    if step["limit"] == "within_7_days":
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


# ---------------------------------------------------------------------------------#
# API Enpoint - 2 -------------  Start the workflow process.
# ---------------------------------------------------------------------------------#


@api_view(["POST"])
def save_and_start_processing(request):
    process = new_process(
        workflows=request.data["workflows"],
        document_id=request.data["document_id"],
        created_by=request.data["created_by"],
        company_id=request.data["company_id"],
        data_type=request.data["data_type"],
    )
    if process:
        # update the doc. DB - 2
        print("Updating document with process id.... \n")
        res = json.loads(
            update_document(
                document_id=request.data["document_id"],
                workflow_process_id=process["process_id"],
            )
        )
        if res["isSuccess"]:
            # fire up the processing action
            return start_processing(
                process=process,
                document_id=request.data["document_id"],
                choice=request.data["criteria"],
            )
    return Response(
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )


#  Begin processing the Workflow.
def start_processing(process, document_id, choice):
    links = generate_links(process, document_id, choice)
    print("started processing......")
    if len(links) > 0:
        return Response(
            links,
            status=status.HTTP_200_OK,
        )
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Links generation
def generate_links(process, document_id, choice):
    print("generating links.............\n")
    links = [
        {step["member"]: verification_link(process["process_id"])}
        for step in process["process_steps"]
    ]
    # Save Links - DB-3
    print("saving process links........ \n")
    save_process_links(
        links=links,
        process_id=process["process_id"],
        document_id=document_id,
        processing_choice=choice,
    )
    return links


# application link
def verification_link(process_id):
    # Token generation.
    print("creating verification links........... \n")
    # create a jwt token
    payload = {"uuid_hash": uuid.uuid4().hex, "process_id": process_id}
    hash_token = jwt.encode(
        json.loads(json.dumps(payload)), "secret", algorithm="HS256"
    )
    return f"https://ll04-finance-dowell.github.io/100018-dowellWorkflowAi-testing/#/verify/{hash_token}/"


# ---------------------------------------------------------------------------------#
# API Endpoint - 1. -------  Set Wofkflows in document
# ---------------------------------------------------------------------------------#


@api_view(["POST"])
def save_workflows_to_document(request):
    process = new_process(
        workflows=request.data["workflows"],
        created_by=request.data["created_by"],
        company_id=request.data["company_id"],
        data_type=request.data["data_type"],
        document_id=request.data["document_id"],
    )
    if process:
        # update the doc.
        print("Updating document with process id.... \n")
        res = json.loads(
            update_document(
                document_id=request.data["document_id"],
                workflow_process_id=process["process_id"],
            )
        )
        if res["isSuccess"]:
            return Response(status=status.HTTP_201_CREATED)
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Create Process.
def new_process(workflows, created_by, company_id, data_type, document_id):
    print("creating process.......... \n")
    process_title = ""
    process_steps = [
        step for workflow in workflows for step in workflow["workflows"]["steps"]
    ]
    process_title = " - ".join(
        [workflow["workflows"]["workflow_title"] for workflow in workflows]
    )
    # save to collection.
    res = json.loads(
        save_wf_process(
            process_title, process_steps, created_by, company_id, data_type, document_id
        )
    )
    # return process id.
    if res["isSuccess"]:
        process = {
            "process_title": process_title,
            "process_steps": process_steps,
            "created_by": created_by,
            "company_id": company_id,
            "data_type": data_type,
            "document_id": document_id,
            "process_id": res["inserted_id"],
        }
        return process
