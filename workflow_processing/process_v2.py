import json
import jwt
import requests
from datetime import datetime
from threading import Thread
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from database.mongo_db_connection_v2 import (
    get_document_object,
    save_document,
    save_process_links,
    get_process_object,
    update_wf_process,
    save_wf_process,
    update_document,
    get_process_list,
    update_document_clone,
)

editor_api = "https://100058.pythonanywhere.com/api/generate-editor-link/"


@api_view(["POST"])
def document_processing(request):
    """processing is determined by action picked by user."""
    if not request.data:
        return Response("You are missing something!", status=status.HTTP_400_BAD_REQUEST)
    data_type = "Testing_Data"
    if request.data["action"] == "save_workflow_to_document_and_save_to_drafts":
        print("Action: save_workflow_to_document_and_save_to_drafts \n")
        choice = "save"
        # create process with new id-
        process = new_process(
            workflows=request.data["workflows"],
            created_by=request.data["created_by"],
            company_id=request.data["company_id"],
            data_type=request.data["data_type"],
            document_id=clone_document(
                document_id=request.data["parent_document_id"],
                creator=request.data["created_by"],
                parent_id=request.data["parent_document_id"]
            ),
            process_choice=choice,
            creator_portfolio=request.data["creator_portfolio"]
        )
        # update doc with process.
        doc_data = {
            "document_id": process["parent_document_id"],
            "process_id": process["_id"],
            "state": "processing",
        }
        dt = Thread(
            target=document_update,
            args=(doc_data,),
        )
        dt.start()

        return Response("Created Workflow and Saved in drafts.", status=status.HTTP_201_CREATED)

    if request.data["action"] == "start_document_processing_content_wise":
        print("Action: start_document_processing_content_wise \n")
        choice = "content"
        # create process with new id-
        process = new_process(
            workflows=request.data["workflows"],
            created_by=request.data["parent_document_id"],
            company_id=request.data["company_id"],
            data_type=request.data["data_type"],
            document_id=clone_document(
                document_id=request.data["parent_document_id"],
                creator=request.data["created_by"],
                parent_id=request.data["parent_document_id"]
            ),
            process_choice=choice,
            creator_portfolio=request.data["creator_portfolio"]
        )
        doc_data = {
            "document_id": process["parent_document_id"],
            "process_id": process["_id"],
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
        print("Action: start_document_processing_wf_steps_wise \n")
        choice = "steps"
        # create process with new id->
        process = new_process(
            workflows=request.data["workflows"],
            created_by=request.data["parent_document_id"],
            company_id=request.data["company_id"],
            data_type=request.data["data_type"],
            document_id=clone_document(
                document_id=request.data["parent_document_id"],
                creator=request.data["created_by"],
                parent_id=request.data["parent_document_id"]
            ),
            process_choice=choice,
            creator_portfolio=request.data["creator_portfolio"]
        )
        doc_data = {
            "document_id": process["parent_document_id"],
            "process_id": process["_id"],
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
        print("Action: start_document_processing_wf_wise \n")
        choice = "workflow"
        # create process with new id.
        process = new_process(
            workflows=request.data["workflows"],
            created_by=request.data["parent_document_id"],
            company_id=request.data["company_id"],
            data_type=request.data["data_type"],
            document_id=clone_document(
                document_id=request.data["parent_document_id"],
                creator=request.data["created_by"],
                parent_id=request.data["parent_document_id"]
            ),
            process_choice=choice,
            creator_portfolio=request.data["creator_portfolio"]
        )
        doc_data = {
            "document_id": process["parent_document_id"],
            "process_id": process["_id"],
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
        print("Action: test_document_processing_content_wise \n")
        choice = "content"
        # create process with new id->
        process = new_process(
            workflows=request.data["workflows"],
            created_by=request.data["parent_document_id"],
            company_id=request.data["company_id"],
            data_type=data_type,
            document_id=clone_document(
                document_id=request.data["parent_document_id"],
                creator=request.data["created_by"],
                parent_id=request.data["parent_document_id"]
            ),
            process_choice=choice,
            creator_portfolio=request.data["creator_portfolio"]
        )
        doc_data = {
            "document_id": process["parent_document_id"],
            "process_id": process["_id"],
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
        print("Action: test_document_processing_wf_steps_wise \n")
        choice = "steps"
        # create process with new id->
        process = new_process(
            workflows=request.data["workflows"],
            created_by=request.data["parent_document_id"],
            company_id=request.data["company_id"],
            data_type=data_type,
            document_id=clone_document(
                document_id=request.data["parent_document_id"],
                creator=request.data["created_by"],
                parent_id=request.data["parent_document_id"]
            ),
            process_choice=choice,
            creator_portfolio=request.data["creator_portfolio"]
        )
        doc_data = {
            "document_id": process["parent_document_id"],
            "process_id": process["_id"],
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
        print("Action: test_document_processing_wf_wise \n")
        choice = "workflow"
        # create process with new id->
        process = new_process(
            workflows=request.data["workflows"],
            created_by=request.data["document_id"],
            company_id=request.data["parent_company_id"],
            data_type=data_type,
            document_id=clone_document(
                document_id=request.data["parent_document_id"],
                creator=request.data["created_by"],
                parent_id=request.data["parent_document_id"]
            ),
            process_choice=choice,
            creator_portfolio=request.data["creator_portfolio"]
        )
        doc_data = {
            "document_id": process["parent_document_id"],
            "process_id": process["_id"],
            "state": "processing",
        }
        # update doc with process.
        dt = Thread(
            target=document_update,
            args=(doc_data,),
        )
        dt.start()
        return start_processing(process)

    if request.data["action"] == "close_processing_and_mark_as_completed":
        print("Action: close_processing_and_mark_as_completed \n")
        process = get_process_object(workflow_process_id=request.data["process_id"])
        if process["processing_state"] == "complete":
            return Response("This Workflow process is already complete", status=status.HTTP_200_OK)
        res = json.loads(
            update_wf_process(process_id=process["process_id"], steps=process["processing_steps"], state="complete"))
        if res["isSuccess"]:
            return Response("Process closed and marked as complete!", status=status.HTTP_200_OK)
        return Response("Failed to mark process and completed!", status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if request.data["action"] == "cancel_process_before_completion":  # document should reset to initial state.
        print("Action: cancel_process_before_completion \n")
        process = get_process_object(workflow_process_id=request.data["process_id"])
        if process["processing_state"] == "canceled":
            return Response("This Workflow process is Cancelled!", status=status.HTTP_200_OK)
        res = json.loads(
            update_wf_process(process_id=process["process_id"], steps=process["processing_steps"], state="canceled"))
        if res["isSuccess"]:
            return Response("Process has been cancelled!", status=status.HTTP_200_OK)
        return Response("Failed cancel process!", status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if request.data["action"] == "pause_processing_after_completing_ongoing_step":
        """ - find the ongoing step - pause processing"""
        return Response("This Option is currently in development", status=status.HTTP_501_NOT_IMPLEMENTED)

    return Response("Something went wrong!", status=status.HTTP_400_BAD_REQUEST)


def clone_document(document_id, creator, parent_id):
    print("Creating a document clone... \n")
    try:
        document = get_document_object(document_id)
        # create new doc
        viewers = []
        save_res = json.loads(
            save_document(
                name=document["document_name"],
                data=document["content"],
                page=document["page"],
                created_by=document["created_by"],
                company_id=document["company_id"],
                data_type=document["data_type"],
                state="processing",
                auth_viewers=viewers.append(creator),
                document_type="clone",
                parent_id=parent_id
            )
        )
        return save_res["inserted_id"]
    except RuntimeError:
        return


def new_process(
        workflows, created_by, company_id, data_type, document_id, process_choice, creator_portfolio
):
    print("creating process.......... \n")
    process_steps = [
        step for workflow in workflows for step in workflow["workflows"]["steps"]
    ]
    process_title = " - ".join(
        [workflow["workflows"]["workflow_title"] for workflow in workflows]
    )
    # save to collection.
    res = save_wf_process(
        process_title,
        process_steps,
        created_by,
        company_id,
        data_type,
        document_id,
        process_choice,
        creator_portfolio
    )
    # return process id.
    if res["isSuccess"]:
        process = {
            "process_title": process_title,
            "process_steps": process_steps,
            "processing_action": process_choice,
            "created_by": created_by,
            "company_id": company_id,
            "data_type": data_type,
            "parent_document_id": document_id,
            "_id": res["inserted_id"],
        }
        return process


# Begin processing the Workflow.
def start_processing(process):
    print("Generating links.............\n")
    links = []
    for step in process["process_steps"]:
        links.append(
            {
                step.get("stepName"): verification_link(
                    process_id=process["_id"],
                    document_id=process["parent_document_id"],
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
        "process_id": process["_id"],
        "document_id": process["parent_document_id"],
        "process_choice": process["processing_action"],
        "process_title": process["process_title"],
    }
    t = Thread(target=save_links_v2, args=(data,))
    t.start()
    # update process state
    if get_process_object(workflow_process_id=process["_id"])["processing_state"] == "draft":
        process_data = {
            "process_id": process["_id"],
            "process_steps": process["process_steps"],
            "processing_state": "processing"
        }
        pt = Thread(target=process_update, args=(process_data,))
        pt.start()
    if len(links) > 0:
        return Response(links, status=status.HTTP_200_OK)
    return Response("Something went wrong!", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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


# Thread to update a doc
def document_update(doc_data):
    update_document(
        document_id=doc_data["document_id"],
        process_id=doc_data["process_id"],
        state=doc_data["state"],
    )
    print("Thread: Document Updated! \n")
    return


def check_user_presence(token, user_name, portfolio):
    print("Checking user presence in process links map \n")
    # decode token
    decoded = jwt.decode(token, "secret", algorithms="HS256")
    user_allowed = any(user["member"] == user_name and user["portfolio"] == portfolio for user in
                       decoded["team_users"] + decoded["public_users"] + decoded["user_users"])
    return user_allowed, decoded["process_id"], decoded["step_role"]


@api_view(["POST"])
def verification(request):
    """verification of a process step access and checks that duplicate document based on a step."""
    print("Performing process verification.. \n")
    if not request.data:
        return Response('You are missing something!', status=status.HTTP_400_BAD_REQUEST)
    user_name = request.data['user_name']
    auth_user, process_id, auth_step_role = check_user_presence(token=request.data['token'], user_name=user_name,
                                                                portfolio=request.data['portfolio'])
    if not auth_user:
        return Response(
            'User is not part of this process', status=status.HTTP_401_UNAUTHORIZED
        )
    # get process
    process = get_process_object(workflow_process_id=process_id)
    if not process:
        Response(
            'Something went wrong!, Retry', status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    if process['processing_state']:
        if process['processing_state'] == 'paused':
            return Response('This workflow process is currently on hold!', status=status.HTTP_200_OK)
        # was the process not started?
        if process['processing_state'] == 'save':
            return Response('This workflow process is not activated!', status=status.HTTP_200_OK)
    # find step the user belongs
    doc_map = None
    right = None
    role = None
    user = None
    match = False
    clone_id = None
    for step in process['process_steps']:
        # step role matching auth process
        if step.get("stepRole") == auth_step_role:
            print("Matched step role:", step["stepRole"])
            # display check
            if step.get("stepDisplay"):
                print("Got display right... \n")
                if not check_display_right(step.get("stepDisplay")):
                    return Response(
                        "Missing display rights!", status=status.HTTP_401_UNAUTHORIZED
                    )
            # location check
            if step.get("stepLocation"):
                print("Got location ... \n")
                if not check_location_right(location=step.get("stepLocation"), continent=step.get("stepContinent"),
                                            my_continent=request.data["continent"],
                                            country=step.get("stepCountry"), my_country=request.data["country"],
                                            city=step.get("stepCity"), my_city=request.data["city"]):
                    return Response("Signing not permitted from your current location!",
                                    status=status.HTTP_401_UNAUTHORIZED)
            # time limit check
            if step.get("stepTimeLimit"):
                print("Got step limit ... \n")
                if not check_time_limit_right(time=step.get("stepTime"), select_time_limits=step.get("stepTimeLimit"),
                                              start_time=step.get("stepStartTime"), end_time=step.get("stepEndTime"),
                                              creation_time=process["created_at"]):
                    return Response("Time limit for processing document has elapsed!", status=status.HTTP_403_FORBIDDEN)
            # check step activity
            if step.get("stepTaskType"):
                print("Got task type:")
                if step.get("stepTaskType") == "request_for_task":
                    print("Task Type is :", step["stepTaskType"])
                    # clone check
                    if step.get("stepCloneCount"):
                        print("Got step clone count ... \n")
                        if step.get("stepCloneCount") > 1:
                            # check if the user is part of the stepDocumentCloneMap
                            if any(user_name in d_map for d_map in step["stepDocumentCloneMap"]):
                                print("user is part of document clone map ...\n")
                                # grab the doc id and gen document link
                                for d_map in step["stepDocumentCloneMap"]:
                                    clone_id = d_map.get("user_name")
                            else:
                                print("user is not part of doc clone map... \n")
                                # clone the document out of the parent id
                                clone_id = clone_document(
                                    document_id=process["parent_document_id"], creator=user_name,
                                    parent_id=process["parent_document_id"]
                                )
                                clone_count = step["stepCloneCount"] = step["stepCloneCount"] - 1
                                # update clone count
                                step.update({"stepCloneCount": clone_count})
                                # update document clone map
                                step["stepDocumentCloneMap"].extend({user_name: clone_id})
                                # updating the document clone list
                                data = {
                                    'doc_id': process['parent_document_id'],
                                    'clone_id': clone_id
                                }
                                ct = Thread(
                                    target=clone_update,
                                    args=(data,),
                                )
                                ct.start()
                        else:
                            # what if this step role has no clone
                            clone_id = process["parent_document_id"]
                if step.get("stepTaskType") == "assign_task":
                    print("Task Type: ", step["stepTaskType"])
                    continue

                # Display check
                doc_map = step.get("stepDocumentMap")
                right = step.get("stepRights")
                user = user_name
                role = step.get('stepRole')
                match = True
    if not match:
        return Response("Document Access forbidden!", status=status.HTTP_403_FORBIDDEN)
    if clone_id and right and user and role and doc_map:
        # thread work to update the process
        process_data = {
            "process_id": process["_id"],
            "process_steps": process["process_steps"],
            "processing_state": process["processing_state"]
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
            role=role
        )
        return Response(doc_link.json(), status=status.HTTP_201_CREATED)
    return Response("Verification failed", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def clone_update(data):
    """add a clone id to a documents clone list"""
    print('Updating clone ...... \n')
    document = get_document_object(document_id=data['doc_id'])
    clone_list = document['clone_list'].append(data['clone_id'])
    update_document_clone(document_id=data['doc_id'], clone_list=clone_list)
    print('Thread: Clone Update!')
    return


def process_update(data):
    print("Updating process .... \n")
    update_wf_process(process_id=data["process_id"], steps=data["process_steps"], state=data["processing_state"])
    print("Thread: Process Update! \n")
    return


def check_display_right(display):
    print("checking display.... \n")
    display_allowed = {
        "before_this_step": True,
        "after_this_step": False,
        "in_all_steps": True,
        "only_this_step": True,
    }
    return display_allowed.get(display)


def check_location_right(location, continent, my_continent, country, my_country, city, my_city):
    """- check the location selection - verify matching geo information."""
    allowed = False
    if location == "any":
        allowed = True
        return allowed
    if location == "select":
        if continent == my_continent and country == my_country and city == my_city:
            allowed = True
            return allowed
    return allowed


def check_time_limit_right(time, select_time_limits, start_time, end_time, creation_time):
    """check time limits for processing step."""
    current_time = datetime.now().strftime("%H:%M")
    allowed = False
    if time == "no_time_limit":
        allowed = True
        return allowed
    if time == "select":
        if select_time_limits == "within_1_hour":
            pass
        if select_time_limits == "within_8_hours":
            pass
        if select_time_limits == "within_24_hours":
            pass
        if select_time_limits == "within_3_days":
            pass
        if select_time_limits == "within_7_days":
            pass
    if time == "custom":
        pass
    return allowed


def generate_link(document_id, doc_map, doc_rights, user, process_id, role):
    print("generating document link .... \n")
    payload = {
        "product_name": "workflowai",
        "details": {
            '_id': document_id,
            'field': "document_name",
            'action': "document",
            'cluster': "Documents",
            'database': "Documentation",
            'collection': "DocumentReports",
            'document': "documentreports",
            'team_member_ID': "11689044433",
            'function_ID': "ABCDE",
            'command': "update",
            'flag': "signing",
            'authorized': user,
            'document_map': doc_map,
            'document_right': doc_rights,
            'role': role,
            'process_id': process_id,
            'update_field': {'document_name': "", 'content': "", 'page': ""},
        },
    }
    link = requests.post(editor_api, data=json.dumps(payload))
    return link


@api_view(["GET"])
def single_process(request, process_id):
    """A process"""
    try:
        process = get_process_object(process_id)
    except ConnectionError:
        return Response(
            "Failed to get a process", status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    return Response(process, status=status.HTTP_200_OK)


@api_view(["GET"])
def wf_processes(request, company_id):
    """Get all Workflow Process"""
    print("Getting WF processes... \n")
    try:
        processes = get_process_list(company_id)
    except ConnectionError:
        return Response("Something went wrong!", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    if len(processes) > 0:
        return Response(processes, status=status.HTTP_200_OK)
    return Response([], status=status.HTTP_200_OK)


@api_view(["POST"])
def mark_process_as_finalize_or_reject(request):
    # get process
    try:
        process = get_process_object(workflow_process_id=request.data['process_id'])
    except ConnectionError as e:
        print(e)
        return Response(
            'Failed to get process, Retry!',
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
        # check complete
    if check_processing_complete(process=process, step_role=request.data['role']):
        return Response(
            'Document processing is already complete', status=status.HTTP_200_OK
        )
        # check the action
    action = None
    for step in process['process_steps']:
        # find matching step for auth member
        if step['member'] == request.data['authorized']:
            if request.data['action'] == 'finalize':
                step.update({'stepProcessingState': 'complete'})
                action = 'finalized'
                break
            if request.data['action'] == 'reject':
                step.update({'stepProcessingState': 'complete'})
                step.update({'rejected': True})
                action = 'rejected'
                break
    # update the workflow
    data = {'process_id': request.data['process_id'], 'process_steps': process['process_steps']}
    t = Thread(
        target=process_update,
        args=(data,),
    )
    t.start()
    # if process is now complete change document state to `completed`
    if check_processing_complete(process=process, step_role=request.data['role']):
        doc_data = {
            'document_id': process['document_id'],
            'process_id': process['_id'],
            'state': 'completed'
        }
        dt = Thread(
            target=document_update,
            args=(doc_data,),
        )
        dt.start()
    return Response(f'Step marked as {action}', status=status.HTTP_201_CREATED)


def check_processing_complete(process, step_role):
    complete = True
    for step in process['process_steps']:
        if step['stepRole'] == step_role:
            if step['stepProcessingState'] == 'complete':
                complete = False
    return complete


@api_view(["POST"])
def trigger_process(request):
    """Get process and begin processing it."""
    print("Processing a saved process... \n")
    try:
        process = get_process_object(request.data["process_id"])
    except ConnectionError:
        return Response("Could not start processing!", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    if process["processing_state"]:
        # check user.
        if request.data["user_name"] == process["created_by"]:
            # check action.
            if request.data["action"] == "halt_process":
                # check pause state.
                if process["processing_state"] != "paused":
                    res = json.loads(
                        update_wf_process(process_id=request.data["process_id"], steps=process["processing_steps"],
                                          state="paused"))
                    if res["isSuccess"]:
                        return Response("Process has been paused until manually resumed!", status=status.HTTP_200_OK)
            if request.data["action"] == "process_draft":
                # check processing state.
                if process["processing_state"] != "processing":
                    return start_processing(process)
            return Response("Wrong action selected", status=status.HTTP_400_BAD_REQUEST)
        return Response("User not allowed to trigger processing, contact document creator!",
                        status=status.HTTP_401_UNAUTHORIZED)
    return Response("This process is not valid for processing", status=status.HTTP_403_FORBIDDEN)
