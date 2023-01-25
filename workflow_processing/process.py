import jwt
import json
import uuid
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from database.mongo_db_connection import (
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
    print(links_info)
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

# verify user & portfolio -- utility func
def verify_user_in_process(process_id, user_name):
    print("checking allowed... \n")
    allowed = False
    processing_links_info = get_links_object_by_process_id(process_id)
    if processing_links_info:
        for link in processing_links_info["links"]:
            if user_name in link:
                allowed = True
                break
    return allowed


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
            "flag": "signing",
            "document_map": doc_map,
            "document_right": doc_rights,
            "update_field": {"document_name": "", "content": "", "page": ""},
        },
    }
    link = requests.post(editor_api, data=json.dumps(payload))
    return link


@api_view(["POST"])
def verify_process(request):
    print("verification started...... \n")
    print("normal checks..... \n")
    # decode token
    decoded = jwt.decode(request.data["token"], "secret", algorithms="HS256")
    # find links
    try:
        processing_links_info = get_links_object_by_process_id(decoded["process_id"])
    except:
        return Response(
            "something went wrong when verifying process",
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    # verify user & portfolio
    is_allowed = verify_user_in_process(
        process_id=decoded["process_id"], user_name=request.data["user_name"]
    )
    # find the document map & run checks.
    if not is_allowed:
        return Response(
            "user is not part of process", status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    # the process
    try:
        process = get_process_object(workflow_process_id=decoded["process_id"])
    except:
        return Response(
            "something went wrong when verifying process",
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    match = False
    for step in process["process_steps"]:
        # user check.
        if step["member"] == request.data["user_name"]:
            # portfolio check.
            if step["member_portfolio"] == request.data["portfolio"]:
                print("Started the checks.... \n")
                # Display check
                if not check_display_right(step.get("display_before")):
                    return Response(
                        "missing display rights", status=status.HTTP_401_UNAUTHORIZED
                    )
                # Location Check
                if not check_location(step.get("location"), request.data["location"]):
                    return Response(
                        f'Signing allowed from {step.get("location")} only',
                        status=status.HTTP_403_FORBIDDEN,
                    )
                # Time Limit Check.
                # if not check_time_limit(
                #     step.get("limit"), step.get("start_time"), step.get("end_time")
                # ):
                #     return Response(
                #         "time limit for document processing elapsed",
                #         status=status.HTTP_403_FORBIDDEN,
                #     )
                # Skip check

                # Doc Map & Rights & match
                map = step.get("document_map")
                right = step.get("rights")
                match = True
                break
            else:
                return Response(
                    f'authorized portfolio for this username is { step["member_portfolio"] }',
                    status=status.HTTP_401_UNAUTHORIZED,
                )
        else:
            return Response(
                f'authorized this user : { step["member"] } ',
                status=status.HTTP_401_UNAUTHORIZED,
            )
    if not match:
        return Response(
            "document access forbidden",
            status=status.HTTP_403_FORBIDDEN,
        )

    # generate document link.
    doc_link = generate_link(
        document_id=processing_links_info["document_id"],
        doc_map=map,
        doc_rights=right,
    )
    return Response(doc_link.json(), status=status.HTTP_201_CREATED)


# CHECKS...........

# Check display in the step.
def check_display_right(display):
    print("checking display.... \n")
    display_allowed = {
        "document_before_processing_this_step": True,
        "document_after_processing_this_step": False,
        "document_in_all_steps": True,
        "document_only_this_step": True,
    }
    return display_allowed.get(display)


# check signing location.
def check_location(step_location, location):
    print("checking location.... \n")
    allow = False
    if step_location == location:
        allow = True
        return allow
    return allow


# Verify time limit of the step.
def check_time_limit(limit, start_time, end_time):
    print("checking time.... \n")
    # check current time
    print(f"start time is {start_time}.. \n")
    print(f"end time {end_time}.... \n")
    accepted = False
    # no time limit
    if limit == "no_time_limit":
        accepted = True
        return accepted
    return accepted

    #
    # hours = 0
    # if limit == "within_1_hour":

    #     return
    # if limit == "within_8_hours":
    #     return
    # if limit == "within_24_hours":
    #     return
    # if limit == "within_3_days":
    #     return
    # if limit == "within_7_days":
    #     return
    # if limit == "custom_time":
    #     return


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
