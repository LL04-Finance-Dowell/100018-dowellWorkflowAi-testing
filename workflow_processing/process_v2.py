import json
import jwt
from threading import Thread
from .process import new_process, check_display_right, generate_link, document_update
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from database.mongo_db_connection import (
    get_document_object,
    save_document,
    update_document,
    save_process_links,
    get_process_object,
    update_wf_process,
)

"""
utility function to clone documents
"""


def clone_document(document_id, creator):
    # get doc
    try:
        document = get_document_object(document_id)
        # create new doc
        save_res = json.loads(
            save_document(
                name=document["document_name"],
                data=document["content"],
                created_by=creator,
                company_id=document["company_id"],
                page=document["page"],
                data_type=document["data_type"],
            )
        )
        return save_res["inserted_id"]
    except RuntimeError:
        return


"""
TODO:
- verification.
- check data_type.
- check if the user is part of the process steps.
- check document clone count.
- clone document for user trying to access the doc if it doesn't exist.
- reduce clone counter.
- update process step with document clone id + user_clone.
- do rest of checks.
- generate doc link.
"""


@api_view(["POST"])
def verification(request):
    user_name = request.data["user_name"]
    # decode token
    decoded = jwt.decode(request.data["token"], "secret", algorithms="HS256")
    user_allowed = False
    if (
            user_name in decoded["user_users"]
            or user_name in decoded["public_users"]
            or user_name in decoded["team_users"]
    ):
        user_allowed = True
    if not user_allowed:
        return Response(
            "User is not part of this process", status=status.HTTP_401_UNAUTHORIZED
        )
    # get process
    process = get_process_object(workflow_process_id=request.data["process_id"])
    if not process:
        Response(
            "Something went wrong!, Retry", status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    # find step the user belongs
    doc_map = None
    right = None
    user = None
    match = False
    clone_id = process["process_id"]
    for step in process["steps"]:
        # step role matching auth process
        if step.get("stepRole") == process["step_role"]:
            print("Started the checks.... \n")
            # display check
            if step.get("stepDisplay"):
                pass
            # location check
            if step.get("stepLocation"):
                pass

            # time limit check
            if step.get("stepTimeLimit"):
                pass

            #

            # clone check
            if step.get("stepCloneCount") > 0:
                # check if the user is part of the stepDocumentCloneMap
                if any(user_name in d_map for d_map in step["stepDocumentCloneMap"]):
                    # grab the doc id and gen document link
                    for d_map in step["stepDocumentCloneMap"]:
                        clone_id = d_map.get("user_name")
                else:
                    # clone the document out of the parent id
                    clone_id = clone_document(
                        document_id=process["parent_document_id"], creator=user_name
                    )
                    clone_count = step["stepCloneCount"] = step["stepCloneCount"] - 1
                    # update clone count
                    step.update({"stepCloneCount": clone_count})
                    # update document clone map
                    step["stepDocumentCloneMap"].extend({user_name: clone_id})
            else:
                # what if this step role has no clone
                clone_id = process["document_id"]

            # Display check
            doc_map = step.get("document_map")
            right = step.get("rights")
            user = step.get("member")
            match = True

    if not match:
        return Response("Document Access forbidden!", status=status.HTTP_403_FORBIDDEN)

    # thread work to update the process
    process_data = {
        "process_id": process["_id"],
        "process_steps": process["process_steps"],
    }
    pt = Thread(
        target=process_update,
        args=(process_data,),
    )
    pt.start()

    # generate document link.
    doc_link = generate_link(
        document_id=clone_id,
        doc_map=doc_map,
        doc_rights=right,
        user=user,
        process_id=process["_id"],
    )
    return Response(doc_link.json(), status=status.HTTP_201_CREATED)


"""
Thread process update
"""


def process_update(data):
    print("Updating process .... \n")
    update_wf_process(process_id=data["process_id"], steps=data["process_steps"])
    print("Thread: Process Update! \n")
    return


"""
processing is determined by action 
"""


@api_view(["POST"])
def document_processing(request):
    data_type = "test"
    if request.data["action"] == "save_workflow_to_document_and_save_to_drafts":
        choice = "save"
        # create process with new id-
        process = new_process(
            workflows=request.data["workflows"],
            created_by=request.data["document_id"],
            company_id=request.data["company_id"],
            data_type=request.data["data_type"],
            document_id=clone_document(
                document_id=request.data["document_id"],
                creator=request.data["created_by"],
            ),
            process_choice=choice,
        )
        # update doc with process.
        doc_data = {
            "document_id": process["document_id"],
            "process_id": process["process_id"],
            "state": "processing",
        }
        dt = Thread(
            target=document_update,
            args=(doc_data,),
        )
        dt.start()
        return Response(status=status.HTTP_201_CREATED)

    if request.data["action"] == "start_document_processing_content_wise":
        choice = "content"
        # create process with new id-
        process = new_process(
            workflows=request.data["workflows"],
            created_by=request.data["document_id"],
            company_id=request.data["company_id"],
            data_type=request.data["data_type"],
            document_id=clone_document(
                document_id=request.data["document_id"],
                creator=request.data["created_by"],
            ),
            process_choice=choice,
        )
        doc_data = {
            "document_id": process["document_id"],
            "process_id": process["process_id"],
            "state": "processing",
        }
        # update doc with process.
        dt = Thread(
            target=document_update,
            args=(doc_data,),
        )
        dt.start()
        return start_processing(process)

    if request.data["action"] == "start_document_processing_wf_steps_wise":
        choice = "steps"
        # create process with new id->
        process = new_process(
            workflows=request.data["workflows"],
            created_by=request.data["document_id"],
            company_id=request.data["company_id"],
            data_type=request.data["data_type"],
            document_id=clone_document(
                document_id=request.data["document_id"],
                creator=request.data["created_by"],
            ),
            process_choice=choice,
        )
        doc_data = {
            "document_id": process["document_id"],
            "process_id": process["process_id"],
            "state": "processing",
        }
        # update doc with process.
        dt = Thread(
            target=document_update,
            args=(doc_data,),
        )
        dt.start()
        return start_processing(process)

    if request.data["action"] == "start_document_processing_wf_wise":
        choice = "workflow"
        # create process with new id.
        process = new_process(
            workflows=request.data["workflows"],
            created_by=request.data["document_id"],
            company_id=request.data["company_id"],
            data_type=request.data["data_type"],
            document_id=clone_document(
                document_id=request.data["document_id"],
                creator=request.data["created_by"],
            ),
            process_choice=choice,
        )
        doc_data = {
            "document_id": process["document_id"],
            "process_id": process["process_id"],
            "state": "processing",
        }
        # update doc with process.
        dt = Thread(
            target=document_update,
            args=(doc_data,),
        )
        dt.start()
        return start_processing(process)

    if request.data["action"] == "test_document_processing_content_wise":
        choice = "content"
        # create process with new id->
        process = new_process(
            workflows=request.data["workflows"],
            created_by=request.data["document_id"],
            company_id=request.data["company_id"],
            data_type=data_type,
            document_id=clone_document(
                document_id=request.data["document_id"],
                creator=request.data["created_by"],
            ),
            process_choice=choice,
        )
        doc_data = {
            "document_id": process["document_id"],
            "process_id": process["process_id"],
            "state": "processing",
        }
        # update doc with process.
        dt = Thread(
            target=document_update,
            args=(doc_data,),
        )
        dt.start()
        return start_processing(process)

    if request.data["action"] == "test_document_processing_wf_steps_wise":
        choice = "steps"
        # create process with new id->
        process = new_process(
            workflows=request.data["workflows"],
            created_by=request.data["document_id"],
            company_id=request.data["company_id"],
            data_type=data_type,
            document_id=clone_document(
                document_id=request.data["document_id"],
                creator=request.data["created_by"],
            ),
            process_choice=choice,
        )
        doc_data = {
            "document_id": process["document_id"],
            "process_id": process["process_id"],
            "state": "processing",
        }
        # update doc with process.
        dt = Thread(
            target=document_update,
            args=(doc_data,),
        )
        dt.start()
        return start_processing(process)

    if request.data["action"] == "test_document_processing_wf_wise":
        choice = "workflow"
        # create process with new id->
        process = new_process(
            workflows=request.data["workflows"],
            created_by=request.data["document_id"],
            company_id=request.data["company_id"],
            data_type=data_type,
            document_id=clone_document(
                document_id=request.data["document_id"],
                creator=request.data["created_by"],
            ),
            process_choice=choice,
        )
        doc_data = {
            "document_id": process["document_id"],
            "process_id": process["process_id"],
            "state": "processing",
        }
        # update doc with process.
        dt = Thread(
            target=document_update,
            args=(doc_data,),
        )
        dt.start()
        return start_processing(process)


"""
 Begin processing the Workflow.
"""


def start_processing(process):
    print("Generating links.............\n")
    links = []
    for step in process["process_steps"]:
        links.append(
            {
                step.get("stepName"): verification_link(
                    process_id=process["process_id"],
                    document_id=process["document_id"],
                    team_users=step.get("stepTeamMembers", None),
                    public_users=step.get("stepPublicMembers", None),
                    user_users=step.get("stepUserMembers", None),
                    step_role=step.get("stepRole"),
                )
            }
        )
    # Save Links -
    data = {
        "links": links,
        "process_id": process["process_id"],
        "document_id": process["document_id"],
        "process_choice": process["process_choice"],
        "process_title": process["process_title"],
    }
    t = Thread(target=save_links_v2, args=(data,))
    t.start()
    if len(links) > 0:
        return Response(
            links,
            status=status.HTTP_200_OK,
        )
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


"""
 application link + token generation
"""


def verification_link(
        process_id, document_id, team_users, public_users, user_users, step_role
):
    print("creating verification links........... \n")
    # create a jwt token
    payload = {
        "process_id": process_id,
        "document_id": document_id,
        "team_users": team_users,
        "public_users": public_users,
        "user_users": user_users,
        "step_role": step_role,
    }
    hash_token = jwt.encode(
        json.loads(json.dumps(payload)), "secret", algorithm="HS256"
    )
    return f"https://ll04-finance-dowell.github.io/100018-dowellWorkflowAi-testing/#/verify/{hash_token}/"


# thread process.
def save_links_v2(data):
    print("saving process links........ \n")
    save_process_links(
        links=data["links"],
        process_id=data["process_id"],
        document_id=data["document_id"],
        processing_choice=data["process_choice"],
        process_title=data["process_title"],
    )
    print("Thread: Process Link Save! \n")
    return
