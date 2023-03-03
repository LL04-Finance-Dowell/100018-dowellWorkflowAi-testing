import json
import uuid
import jwt
import qrcode
import requests
from concurrent.futures import ThreadPoolExecutor
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
    update_document_clone,
    document_finalize,
    update_document_viewers,
    save_process_qrcodes
)

editor_api = "https://100058.pythonanywhere.com/api/generate-editor-link/"
notification_api = "https://100092.pythonanywhere.com/api/get-notification/"


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
                auth_viewer=None,
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
            created_by=request.data["created_by"],
            company_id=request.data["company_id"],
            data_type=request.data["data_type"],
            document_id=clone_document(
                document_id=request.data["parent_document_id"],
                auth_viewer=None,
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
            created_by=request.data["created_by"],
            company_id=request.data["company_id"],
            data_type=request.data["data_type"],
            document_id=clone_document(
                document_id=request.data["parent_document_id"],
                auth_viewer=None,
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
            created_by=request.data["created_by"],
            company_id=request.data["company_id"],
            data_type=request.data["data_type"],
            document_id=clone_document(
                document_id=request.data["parent_document_id"],
                auth_viewer=None,
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
            created_by=request.data["created_by"],
            company_id=request.data["company_id"],
            data_type=data_type,
            document_id=clone_document(
                document_id=request.data["parent_document_id"],
                auth_viewer=None,
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
            created_by=request.data["created_by"],
            company_id=request.data["company_id"],
            data_type=data_type,
            document_id=clone_document(
                document_id=request.data["parent_document_id"],
                auth_viewer=None,
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
            created_by=request.data["created_by"],
            company_id=request.data["parent_company_id"],
            data_type=data_type,
            document_id=clone_document(
                document_id=request.data["parent_document_id"],
                auth_viewer=None,
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


def clone_document(document_id, auth_viewer, parent_id):
    print("Creating a document clone... \n")
    try:
        document = get_document_object(document_id)
        # create new doc
        if auth_viewer is None:
            auth = ""
        else:
            auth = auth_viewer
        save_res = json.loads(
            save_document(
                name=document["document_name"] + "-" + auth,
                data=document["content"],
                page=document["page"],
                created_by=document["created_by"],
                company_id=document["company_id"],
                data_type=document["data_type"],
                state="processing",
                auth_viewers=[auth],
                document_type="clone",
                parent_id=parent_id
            )
        )
        return save_res["inserted_id"]
    except RuntimeError:
        print("Failed to create clone \n")
        return


def new_process(
        workflows, created_by, company_id, data_type, document_id, process_choice, creator_portfolio
):
    """
    Structures a process entry to persistent storage

    Args:
        workflows (dict): a dictionary containing workflow info
        company_id (str): org object id where the process belongs
        data_type (str): env of accessing the wfAI app
        process_choice (str): selected choice to process
        creator_portfolio (str): portfolio of the process creator
        created_by (str): process username
        document_id (str): parent document object id

    Returns:
        a structured process.
    """
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
    """
    Generate links and qrcodes for each member in the process steps, update the auth viewer of the process document
    with first step users in the process steps, and update the processing state of the process.

    Args:
        process (dict): A dictionary containing information about the process.

    Returns:
        Response: A JSON response containing the generated links, or an error message.
    """
    links = []
    qrcodes = []
    auth_viewers_set = set()

    # generate links for each member in each step
    for step in process["process_steps"]:
        if step.get("stepNumber") == 1:
            members = step.get("stepTeamMembers", []) + step.get("stepPublicMembers", []) + step.get("stepUserMembers",
                                                                                                     [])
            auth_viewers_set.update([member["member"] for member in members])

        links += [{member["member"]: verification_link(process_id=process["_id"],
                                                       document_id=process["parent_document_id"],
                                                       step_role=step.get("stepRole"),
                                                       auth_name=member["member"],
                                                       auth_portfolio=member["portfolio"]
                                                       )} for member in step.get("stepTeamMembers", [])
                  + step.get("stepPublicMembers", []) + step.get("stepUserMembers", [])]

        qrcodes += [{member["member"]: process_qrcode(process_id=process["_id"],
                                                      document_id=process["parent_document_id"],
                                                      step_role=step.get("stepRole"),
                                                      auth_name=member["member"],
                                                      auth_portfolio=member["portfolio"]
                                                      )} for member in step.get("stepTeamMembers", [])
                    + step.get("stepPublicMembers", []) + step.get("stepUserMembers", [])]

    # update authorized viewers for the parent document
    auth_data = {"document_id": process["parent_document_id"], "auth_viewers": list(auth_viewers_set)}
    at = ThreadPoolExecutor().submit(update_document_authorize, auth_data)

    # save links
    data = {
        "links": links,
        "process_id": process["_id"],
        "document_id": process["parent_document_id"],
        "process_choice": process["company_id"],
        "process_title": process["process_title"]
    }
    t = ThreadPoolExecutor().submit(save_links_v2, data)

    # save qrcodes
    code_data = {
        "qrcodes": qrcodes,
        "process_id": process["_id"],
        "document_id": process["parent_document_id"],
        "process_choice": process["company_id"],
        "process_title": process["process_title"]
    }
    c = ThreadPoolExecutor().submit(save_qrcodes, code_data)

    # update processing state of the process
    if get_process_object(workflow_process_id=process["_id"])["processing_state"] == "draft":
        process_data = {
            "process_id": process["_id"],
            "process_steps": process["process_steps"],
            "processing_state": "processing"
        }
        pt = ThreadPoolExecutor().submit(process_update, process_data)

    # return generated links
    if links and qrcodes:
        return Response({"links": links, "qrcodes": qrcodes}, status=status.HTTP_200_OK)
    else:
        raise Exception("Failed to generate links for the given process.")


def update_document_authorize(data):
    print("Updating the document with auth viewers \n")
    try:
        update_document_viewers(document_id=data["document_id"], auth_viewers=data["auth_viewers"])
        print("Thread: Doc Authorize \n")
    except ConnectionError:
        print("Fail: doc auth thread \n")
        return


def verification_link(process_id, document_id, step_role, auth_name, auth_portfolio):
    """
    Create a JWT encoded unique verification link

    Args:
        process_id (str): the object id of the process
        document_id(str): the object id of the document
        step_role(str): the authorized step role.
        auth_name(str): the authorized username.
        auth_portfolio(str): the authorized user portfolio

    Returns:
        A unique verification link with the jwt hash
    """
    print("creating verification links........... \n")

    # create a jwt token
    hash_token = jwt.encode(
        json.loads(json.dumps({
            "process_id": process_id,
            "document_id": document_id,
            "step_role": step_role,
            "auth_name": auth_name,
            "auth_portfolio": auth_portfolio
        })), "secret", algorithm="HS256"
    )

    # setup notification
    data = {"username": auth_name}
    nt = ThreadPoolExecutor().submit(notification, data)
    return f"https://ll04-finance-dowell.github.io/100018-dowellWorkflowAi-testing/#/verify/{hash_token}/"


def process_qrcode(process_id, document_id, step_role, auth_name, auth_portfolio):
    """
    Generates a qrcode for the data provided and stores the qrcodes

    Args:
        process_id (str): the object id of the process
        document_id(str): the object id of the document
        step_role(str): the authorized step role.
        auth_name(str): the authorized username.
        auth_portfolio(str): the authorized user portfolio

    Returns:
        qrcode link based on that data.
    """
    print("generating qrcodes .... \n")
    # create a jwt token
    hash_token = jwt.encode(
        json.loads(json.dumps({
            "process_id": process_id,
            "document_id": document_id,
            "step_role": step_role,
            "auth_name": auth_name,
            "auth_portfolio": auth_portfolio
        })), "secret", algorithm="HS256"
    )
    qr_path = f"100094.pythonanywhere.com/media/qrcodes/{uuid.uuid4().hex}.png"
    qr_url = f"https://{qr_path}"
    qr_code = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H)

    # taking url or text
    url = f"https://ll04-finance-dowell.github.io/100018-dowellWorkflowAi-testing/#/verify/{hash_token}/"

    # adding URL or text to QRcode
    qr_code.add_data(url)

    # generating QR code
    qr_code.make()

    # taking color name from user
    qr_color = "black"

    # adding color to QR code
    qr_img = qr_code.make_image(fill_color=qr_color, back_color="#DCDCDC")

    qr_img.save(qr_path)

    return qr_url


def notification(data):
    """post notifications for extension."""
    print("creating a notification.......  \n")
    try:
        res = requests.post(url=notification_api, data=json.dumps({
            "product_id": "99",
            "username": data["auth_name"],
            "product_name": "Workflow AI",
            "title": "Document to Sign",
            "message": "You have a document to sign"
        }), headers={"Content-Type": "application/json"})
        if res.status_code == 201:
            print("Thread: Sent Notification \n")
        else:
            print("something went wrong on notification:", res.status_code)
    except ConnectionError:
        print("Fail: doc update thread! \n")
        return


# thread process.
def save_links_v2(data):
    print("saving process links........ \n")
    try:
        save_process_links(
            links=data["links"],
            process_id=data["process_id"],
            document_id=data["document_id"],
            processing_choice=data["process_choice"],
            process_title=data["process_title"],
            company_id=data["company_id"]
        )
        print("Thread: Process Link Save! \n")
    except ConnectionError:
        print("Fail: link saving thread! \n")
        return


def save_qrcodes(data):
    print("saving process qrcodes........ \n")
    try:
        save_process_qrcodes(
            qrcodes=data["qrcodes"],
            process_id=data["process_id"],
            document_id=data["document_id"],
            processing_choice=data["process_choice"],
            process_title=data["process_title"],
            company_id=data["company_id"]
        )
        print("Thread: Process QR Save! \n")
    except ConnectionError:
        print("Fail: QR saving thread! \n")
        return


# Thread to update a doc
def document_update(doc_data):
    print("Updating document with new state \n")
    try:
        update_document(
            document_id=doc_data["document_id"],
            process_id=doc_data["process_id"],
            state=doc_data["state"],
        )
        print("Thread: Document Updated! \n")
    except ConnectionError:
        print("Fail: doc update thread! \n")
        return


def check_user_presence(token, user_name, portfolio):
    print("Checking user presence in process links map \n")
    # decode token
    decoded = jwt.decode(token, "secret", algorithms="HS256")
    user_allowed = False
    if decoded["auth_name"] == user_name and decoded["auth_portfolio"] == portfolio:
        user_allowed = True
    return user_allowed, decoded["process_id"], decoded["step_role"]


@api_view(["POST"])
def verification(request):
    """verification of a process step access and checks that duplicate document based on a step."""
    print("Performing process verification.. \n")
    if not request.data["portfolio"] and request.data["user_name"] \
            and request.data["continent"] and request.data["country"] and request.data["city"]:
        return Response('You are missing something!', status=status.HTTP_400_BAD_REQUEST)
    # check user
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
    # check states
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
    process_changed = False
    for step in process['process_steps']:
        # check for step completeness
        if step.get("stepProcessingState"):
            if step.get("stepProcessingState") != "complete":
                print("Step state", step.get("stepProcessingState"), "\n")
        # step role matching auth process
        if step.get("stepRole") == auth_step_role:
            print("Matched step role:", step["stepRole"], "\n")
            # find step number
            if step.get("stepNumber"):
                print("step number is", step.get("stepNumber"), "\n")
            # location check
            if step.get("stepLocation"):
                print("Got location ... \n")
                if not check_location_right(location=step.get("stepLocation"), continent=step.get("stepContinent"),
                                            my_continent=request.data["continent"],
                                            country=step.get("stepCountry"), my_country=request.data["country"],
                                            city=step.get("stepCity"), my_city=request.data["city"]):
                    return Response("Signing not permitted from your current location!",
                                    status=status.HTTP_401_UNAUTHORIZED)
            # display check
            if step.get("stepDisplay"):
                print("Got display right... \n")
                if not check_display_right(step.get("stepDisplay")):
                    return Response(
                        "Missing display rights!", status=status.HTTP_401_UNAUTHORIZED
                    )
            # time limit check
            if step.get("stepTimeLimit"):
                print("Got step limit ... \n")
                if not check_time_limit_right(time=step.get("stepTime"), select_time_limits=step.get("stepTimeLimit"),
                                              start_time=step.get("stepStartTime"), end_time=step.get("stepEndTime"),
                                              creation_time=process["created_at"]):
                    return Response("Time limit for processing document has elapsed!", status=status.HTTP_403_FORBIDDEN)
            # check step activity
            if step.get("stepTaskType"):
                print("Got task type \n")
                if step.get("stepTaskType") == "request_for_task":
                    print("Task Type is :", step["stepTaskType"], "\n")
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
                                    document_id=process["parent_document_id"], auth_viewer=user_name,
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
                                    'clone_id': clone_id,
                                }
                                ct = Thread(
                                    target=clone_update,
                                    args=(data,),
                                )
                                ct.start()
                                process_changed = True
                        else:
                            # what if this step role has no clone
                            clone_id = process["parent_document_id"]
                if step.get("stepTaskType") == "assign_task":
                    print("Task Type", step.get("stepTaskType"), "\n")
                    clone_id = process["parent_document_id"]

            # Display check
            doc_map = step.get("stepDocumentMap")
            right = step.get("stepRights")
            user = user_name
            role = step.get('stepRole')
            match = True

    if not match:
        return Response("Document Access forbidden!", status=status.HTTP_403_FORBIDDEN)
    if clone_id and right and user and role and doc_map:
        if process_changed is True:
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
        if doc_link:
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
    if location == "any":
        allowed = True
        return allowed
    if location == "select":
        if continent == my_continent and country == my_country and city == my_city:
            allowed = True
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
    try:
        link = requests.post(editor_api, data=json.dumps(payload))
        return link
    except ConnectionError:
        print("link generation failed")
        return


@api_view(["POST"])
def mark_process_as_finalize_or_reject(request):
    """After access is granted and the user has made changes on a document."""
    print("finalize or reject.. \n")
    # check if the doc is in completed state or not.
    if not request.data["company_id"] and request.data["action"] \
            and request.data["document_id"] and request.data["process_id"] and request.data["authorized"]:
        return Response("You are missing something", status=status.HTTP_400_BAD_REQUEST)
    try:
        document = get_document_object(document_id=request.data["document_id"])
    except ConnectionError:
        return Response("Something went wrong!", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    # check if the document is old
    if document["workflow_process"]:
        return Response("Use a new version of this document", status=status.HTTP_200_OK)
    # check state.
    if document["document_state"] == "completed":
        # say it is complete
        return Response("Document has already been finalized", status=status.HTTP_200_OK)
    # for processing, now we act.
    if document["document_state"] == "processing":
        # mark the doc as complete
        state = None
        if request.data["action"] == "finalize":
            state = "complete"
        elif request.data["action"] == "reject":
            state = "rejected"
        res = document_finalize(document_id=request.data["document_id"], state=state)
        if res["isSuccess"]:
            # get process
            try:
                process = get_process_object(workflow_process_id=request.data['process_id'])
            except ConnectionError:
                return Response(
                    'Failed to get process, Retry!',
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            # check if the process step is complete
            if process["processing_state"] == "complete":
                return Response("Document has been finalized", status=status.HTTP_200_OK)
            if process["processing_state"] == "processing":
                # check if the process_step for auth_role is complete
                done = None
                for step in process["process_steps"]:
                    if step.get("stepRole") == request.data['authorized']:
                        step.update({'stepProcessingState': 'complete'})
                        # update the workflow
                        res = update_wf_process(process_id=request.data['process_id'], steps=process['process_steps'],
                                                state="processing")
                        if res["isSuccess"]:
                            # check the state of the other docs
                            if check_processing_complete(step.get("stepDocumentCloneMap").keys()):
                                done = True
                # update the process step state as complete
                if done:
                    data = {'process_id': request.data['process_id'], 'process_steps': process['process_steps'],
                            'processing_state': "completed"}
                    t = Thread(
                        target=process_update,
                        args=(data,),
                    )
                    t.start()
                    # check if all the docs are marked as completed
                return Response("document processed successfully", status=status.HTTP_200_OK)

        else:
            return Response("Error finalizing document", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response("Error finalizing document", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def check_processing_complete(process):
    complete = True
    document_clones = list(process["stepDocumentCloneMap"].keys())
    # for every clone find the document state.
    for clone in document_clones:
        document = get_document_object(clone)
        if document["document_state"] == "processing":
            complete = False
            return complete
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
                        update_wf_process(process_id=request.data["process_id"], steps=process["process_steps"],
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
