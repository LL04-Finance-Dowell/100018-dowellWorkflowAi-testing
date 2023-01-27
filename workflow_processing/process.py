import jwt
import json
import uuid
import requests
from .models import Notification
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from database.mongo_db_connection import (
    save_wf_process,
    get_process_object,
    update_document,
    save_process_links,
    get_links_object_by_process_id,
    get_process_list,
    update_wf_process,
)


"""
assert completion of a given step finalize/reject
"""


@api_view(["POST"])
def register_finalize_or_reject(request):
    # get process
    try:
        process = get_process_object(workflow_process_id=request.data["process_id"])
    except:
        return Response(
            "failed to get process, retry!",
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    # check the action
    for step in process["process_steps"]:
        # find matching step for auth member
        if step["member"] == request.data["authorized"]:
            if request.data["action"] == "finalize":
                step.update({"finalized": True})
                action = "finalized"
                break
            if request.data["action"] == "reject":
                step.update({"finalized": True}, {"rejected": True})
                action = "rejected"
                break
    # update the workflow
    response = json.loads(
        update_wf_process(
            process_id=request.data["process_id"], steps=process["process_steps"]
        )
    )
    if response["isSuccess"]:
        return Response(f"step marked as {action}", status=status.HTTP_201_CREATED)
    return Response("error, retry!", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


"""
fetches workflow process `I` created.
"""


@api_view(["POST"])
def processes(request):
    print("fecthing processes..... \n")
    try:
        processes = get_process_list(request.data["company_id"])
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    # find matching
    print("filter my processes.... \n")
    my_processes = [
        p for p in processes if p["created_by"] == request.data["created_by"]
    ]
    if len(my_processes) > 0:
        return Response(processes, status=status.HTTP_200_OK)
    return Response([], status=status.HTTP_200_OK)


"""
get process by process id
"""


@api_view(["POST"])
def a_single_process(request):
    try:
        process = get_process_object(request.data["process_id"])
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(process, status=status.HTTP_200_OK)


"""
get a link process for person having notifications
"""


@api_view(["POST"])
def get_process_link(request):
    # get links info
    links_info = get_links_object_by_process_id(request.data["process_id"])
    user = request.data["user_name"]
    if not links_info["links"]:
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


"""
GET-verification links for a process
"""


@api_view(["POST"])
def fetch_process_links(request):
    try:
        process_info = get_links_object_by_process_id(request.data["process_id"])
    except:
        return Response(
            "could not fetch process links",
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    if len(process_info["links"]) > 0:
        return Response(process_info["links"], status=status.HTTP_200_OK)
    return Response("no links found for this process", status=status.HTTP_404_NOT_FOUND)


# ---------------------------------------------------------------------------------#
# API Endpoint - 3. ---------  Verifying Process
# ---------------------------------------------------------------------------------#

# verify user & portfolio -- utility func
def verify_user_in_process(process_id, user_name):
    print("checking allowed... \n")
    allowed = False
    processing_links_info = get_links_object_by_process_id(process_id)
    # print(processing_links_info)
    if processing_links_info:
        for link in processing_links_info["links"]:
            if user_name in link:
                allowed = True
                return allowed
    return allowed


#  A single Doc Link
def generate_link(document_id, doc_map, doc_rights, user, process_id):
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
            "authorized": user,
            "document_map": doc_map,
            "document_right": doc_rights,
            "process_id": process_id,
            "update_field": {"document_name": "", "content": "", "page": ""},
        },
    }
    link = requests.post(editor_api, data=json.dumps(payload))
    return link


"""
process verification to peform check and issue access
"""


@api_view(["POST"])
def verify_process(request):
    print("verification started...... \n")
    print("normal checks..... \n")
    # decode token
    decoded = jwt.decode(request.data["token"], "secret", algorithms="HS256")
    print(decoded)
    # find links
    try:
        processing_links_info = get_links_object_by_process_id(decoded["process_id"])
    except:
        return Response(
            "something went wrong when verifying process",
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    # the process
    try:
        process = get_process_object(workflow_process_id=decoded["process_id"])
    except:
        return Response(
            "something went wrong when verifying process",
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    map = None
    right = None
    user = None
    for step in process["process_steps"]:
        # user check.
        if step["member"] == request.data["user_name"]:
            # portfolio check.
            if step["member_portfolio"] == request.data["portfolio"]:
                print("Started the checks.... \n")
                # Display check
                # if not check_display_right(step.get("display_before")):
                #     return Response(
                #         "missing display rights", status=status.HTTP_401_UNAUTHORIZED
                #     )
                # Location Check
                # if step.get("location"):
                #     if not check_location(step.get("location"), request.data["location"]):
                #         return Response(
                #             f'Signing allowed from location:{step.get("location")} only',
                #             status=status.HTTP_403_FORBIDDEN,
                #         )
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
                user = step.get("member")
                # match = True
            # else:
            #     return Response(
            #         f'authorized portfolio for this username is { step["member_portfolio"] }',
            #         status=status.HTTP_401_UNAUTHORIZED,
            #     )
        # else:
        #     return Response(
        #         f'authorized this user : { step["member"] } ',
        #         status=status.HTTP_401_UNAUTHORIZED,
        #     )
    # if not match:
    #     return Response(
    #         "document access forbidden",
    #         status=status.HTTP_403_FORBIDDEN,
    #     )

    # generate document link.
    doc_link = generate_link(
        document_id=processing_links_info["document_id"],
        doc_map=map,
        doc_rights=right,
        user=user,
        process_id=decoded["process_id"],
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
        {step["member"]: verification_link(process["process_id"], document_id)}
        for step in process["process_steps"]
    ]
    # SQLITE
    # notification = Notification(
    #     links=links,
    #     process_id=process["process_id"],
    #     document_id=document_id,
    #     processing_choice=choice,
    # )
    # notification.save()

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
def verification_link(process_id, document_id):
    # Token generation.
    print("creating verification links........... \n")
    # create a jwt token
    payload = {
        "uuid_hash": uuid.uuid4().hex,
        "process_id": process_id,
        "document_id": document_id,
    }
    hash_token = jwt.encode(
        json.loads(json.dumps(payload)), "secret", algorithm="HS256"
    )
    return f"https://ll04-finance-dowell.github.io/100018-dowellWorkflowAi-testing/#/verify/{hash_token}/"


# ---------------------------------------------------------------------------------#
# API Endpoint - 1. -------  Set Wofkflows in document
# ---------------------------------------------------------------------------------#


"""
save workflow to document to create process.
"""


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
