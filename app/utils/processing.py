from . import checks, verification
from . import threads
from threading import Thread
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from app.utils.mongo_db_connection_v2 import (
    get_process_object,
    save_wf_process,
)
from . import link_gen


def start(process):
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
            members = (
                step.get("stepTeamMembers", [])
                + step.get("stepPublicMembers", [])
                + step.get("stepUserMembers", [])
            )
            auth_viewers_set.update([member["member"] for member in members])

        links += [
            {
                member["member"]: verification.process_links(
                    process_id=process["_id"],
                    document_id=process["parent_document_id"],
                    step_role=step.get("stepRole"),
                    auth_name=member["member"],
                    auth_portfolio=member["portfolio"],
                    company_id=process["company_id"],
                )
            }
            for member in step.get("stepTeamMembers", [])
            + step.get("stepPublicMembers", [])
            + step.get("stepUserMembers", [])
        ]

        qrcodes += [
            {
                member["member"]: verification.process_qrcode(
                    process_id=process["_id"],
                    document_id=process["parent_document_id"],
                    step_role=step.get("stepRole"),
                    auth_name=member["member"],
                    auth_portfolio=member["portfolio"],
                )
            }
            for member in step.get("stepTeamMembers", [])
            + step.get("stepPublicMembers", [])
            + step.get("stepUserMembers", [])
        ]

    # update authorized viewers for the parent document
    auth_data = {
        "document_id": process["parent_document_id"],
        "auth_viewers": list(auth_viewers_set),
    }
    Thread(target=threads.update_document_authorize, args=(auth_data,)).start()

    # save links
    data = {
        "links": links,
        "process_id": process["_id"],
        "document_id": process["parent_document_id"],
        "company_id": process["company_id"],
        "process_choice": process["processing_action"],
        "process_title": process["process_title"],
    }
    Thread(target=threads.save_links_v2, args=(data,)).start()

    # save qrcodes
    code_data = {
        "qrcodes": qrcodes,
        "process_id": process["_id"],
        "document_id": process["parent_document_id"],
        "process_choice": process["processing_action"],
        "company_id": process["company_id"],
        "process_title": process["process_title"],
    }
    Thread(target=threads.save_qrcodes, args=(code_data,)).start()

    # update processing state of the process
    if (
        get_process_object(workflow_process_id=process["_id"])["processing_state"]
        == "draft"
    ):
        process_data = {
            "process_id": process["_id"],
            "process_steps": process["process_steps"],
            "processing_state": "processing",
        }
        Thread(target=threads.process_update, args=(process_data,)).start()

    # return generated links
    if links and qrcodes:
        return Response({"links": links, "qrcodes": qrcodes}, status=status.HTTP_200_OK)
    else:
        raise Exception("Failed to generate links for the given process.")


def new(
    workflows,
    created_by,
    company_id,
    data_type,
    document_id,
    process_choice,
    creator_portfolio,
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
        creator_portfolio,
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


def verify(process, auth_step_role, location_data, user_name):

    doc_map = None
    right = None
    role = None
    user = None
    match = False
    clone_id = None

    # find step the user belongs
    for step in process["process_steps"]:
        if step.get("stepRole") == auth_step_role:
            # location check
            if step.get("stepLocation"):
                if not checks.location_right(
                    location=step.get("stepLocation"),
                    continent=step.get("stepContinent"),
                    my_continent=location_data["continent"],
                    country=step.get("stepCountry"),
                    my_country=location_data["country"],
                    city=step.get("stepCity"),
                    my_city=location_data["city"],
                ):
                    return Response(
                        "Signing not permitted from your current location!",
                        status=status.HTTP_401_UNAUTHORIZED,
                    )

            # display check
            if step.get("stepDisplay"):
                if not checks.display_right(step.get("stepDisplay")):
                    return Response(
                        "Missing display rights!", status=status.HTTP_401_UNAUTHORIZED
                    )

            # time limit check
            if step.get("stepTimeLimit"):
                if not checks.time_limit_right(
                    time=step.get("stepTime"),
                    select_time_limits=step.get("stepTimeLimit"),
                    start_time=step.get("stepStartTime"),
                    end_time=step.get("stepEndTime"),
                    creation_time=process["created_at"],
                ):
                    return Response(
                        "Time limit for processing document has elapsed!",
                        status=status.HTTP_403_FORBIDDEN,
                    )

            # find step 1 and clone documents
            if step.get("stepNumber") == 1:
                clone_id = process["parent_document_id"]
                data = {"process": process, "doc_id": clone_id}
                Thread(target=threads.create_copies, args=(data,)).start()

            # check if user in the document clone map and grab their clone id.
            if step.get("stepNumber") > 1:
                if any(user_name in d_map for d_map in step["stepDocumentCloneMap"]):
                    for d_map in step["stepDocumentCloneMap"]:
                        clone_id = d_map.get("user_name")
                else:
                    data = {"process": process, "doc_id": process["parent_document_id"]}
                    Thread(target=threads.create_copies, args=(data,)).start()

            # set access.
            doc_map = step.get("stepDocumentMap")
            right = step.get("stepRights")
            user = user_name
            role = step.get("stepRole")
            match = True

    # do we have access?
    if not match:
        return Response("Document Access forbidden!", status=status.HTTP_403_FORBIDDEN)

    # is everything right, generate document link.
    if clone_id and right and user and role and doc_map:
        doc_link = link_gen.document(
            document_id=clone_id,
            doc_map=doc_map,
            doc_rights=right,
            user=user,
            process_id=process["_id"],
            role=role,
        )

        return doc_link.json()
