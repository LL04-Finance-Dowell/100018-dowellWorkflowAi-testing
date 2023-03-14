from app.utils import cloning
from . import checks, verification
from . import threads
from threading import Thread
from rest_framework import status
from rest_framework.response import Response
from app.utils.mongo_db_connection import (
    get_document_object,
    get_process_object,
    save_wf_process,
    update_document_clone,
    update_document_viewers,
    update_wf_process,
)

from . import link_gen


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

    # step_one = process["process_steps"][0]
    # members = [
    #     member["member"]
    #     for member in step_one.get("stepTeamMembers", [])
    #     + step_one.get("stepPublicMembers", [])
    #     + step_one.get("stepUserMembers", [])
    # ]
    # auth_viewers_set.update(members)

    # links = [
    #     {
    #         member: verification.process_links(
    #             process_id=process["_id"],
    #             document_id=process["parent_document_id"],
    #             step_role=step_one.get("stepRole"),
    #             auth_name=member["member"],
    #             auth_portfolio=member["portfolio"],
    #             company_id=process["company_id"],
    #             process_title=process["process_title"],
    #         )
    #     }
    #     for member in members
    # ]

    # qrcodes += [
    #     {
    #         member: verification.process_qrcode(
    #             process_id=process["_id"],
    #             document_id=process["parent_document_id"],
    #             step_role=step_one.get("stepRole"),
    #             auth_name=member["member"],
    #             auth_portfolio=member["portfolio"],
    #         )
    #     }
    #     for member in members
    # ]

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
                    process_title=process["process_title"],
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
    print("the auth_viewers", list(auth_viewers_set))
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
    process_data = {
        "process_id": process["_id"],
        "document_id": process["parent_document_id"],
        "process_steps": process["process_steps"],
        "auth_viewers": list(auth_viewers_set),
        "processing_state": "processing",
    }
    Thread(target=threads.process_update, args=(process_data,)).start()

    # return generated links
    if links and qrcodes:
        return Response({"links": links, "qrcodes": qrcodes}, status=status.HTTP_200_OK)
    else:
        raise Exception("Failed to generate links for the given process.")


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

            # find the clone id
            if any(user_name in d_map for d_map in step["stepDocumentCloneMap"]):
                for d_map in step["stepDocumentCloneMap"]:
                    clone_id = d_map.get(user_name)

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
        print("something missing")
        doc_link = link_gen.document(
            document_id=clone_id,
            doc_map=doc_map,
            doc_rights=right,
            user=user,
            process_id=process["_id"],
            role=role,
        )

        return doc_link.json()


def background(process_id, document_id):
    # get process
    process = get_process_object(workflow_process_id=process_id)
    step_one = process["process_steps"][0]
    copies = []

    # check if the second process is done or not
    complete = False

    # Set Second Step.
    step_two = process["process_steps"][1]

    # check if all docs for respective users are complete
    if step_two["stepDocumentCloneMap"] != []:
        print("In step 2 \n")
        print("checking clone", step_two["stepDocumentCloneMap"])
        users = [
            member["member"]
            for member in step_two.get("stepTeamMembers", [])
            + step_two.get("stepPublicMembers", [])
            + step_two.get("stepUserMembers", [])
        ]
        print("the users", users)
        for usr in users:
            document_states = [
                get_document_object(d_map.get(usr))["document_state"] == "finalized"
                for d_map in step_two["stepDocumentCloneMap"]
            ]
            print(document_states)
            if all(document_states):
                complete = True

    # if the clone map is empty we execute
    else:
        if step_two["stepTaskType"] == "assign_task":
            print("in assign task 2 \n")
            for d_m in step_one["stepDocumentCloneMap"]:
                docs = list(d_m.values())
                for doc_id in docs:
                    for usr in users:
                        document = get_document_object(doc_id)
                        doc_name = document["document_name"] + " ".join(usr)
                        viewers = document["auth_viewers"]
                        viewers.append(usr)
                        print("the viewers", viewers)
                        update_document_viewers(
                            document_id=doc_id,
                            auth_viewers=usr,
                            doc_name=doc_name,
                        )
                        step_two["stepDocumentCloneMap"].append({usr: d})
                # doc clone map update

        if step_two["stepTaskType"] == "request_for_task":
            print("in req 2", step_two["stepTaskType"], "\n")
            copies += [
                {
                    member["member"]: cloning.document(
                        document_id=document_id,
                        auth_viewer=member["member"],
                        parent_id=process["parent_document_id"],
                        process_id=process["_id"],
                    )
                }
                for member in step_two.get("stepTeamMembers", [])
                + step_two.get("stepPublicMembers", [])
                + step_two.get("stepUserMembers", [])
            ]
            print("the copies", copies)
            for cp in copies:
                step_two["stepDocumentCloneMap"].append(cp)

    # for step 3 , step 2 should be done
    step_three = process["process_steps"][2]
    if complete:
        print("In step 3 \n")

        # get all users
        users = [
            member["member"]
            for member in step_three.get("stepTeamMembers", [])
            + step_three.get("stepPublicMembers", [])
            + step_three.get("stepUserMembers", [])
        ]

        # check if all docs for respective users are complete
        if step_three["stepDocumentCloneMap"] != []:
            for usr in users:
                document_states = [
                    get_document_object(d_map.get(usr))["document_state"] == "finalized"
                    for d_map in step_three["stepDocumentCloneMap"]
                ]
                if all(document_states):
                    complete = True

        # if the clone map is empty we execute
        else:
            if step_three["stepTaskType"] == "assign_task":
                print("in assign task 3 \n")
                for d_m in step_two["stepDocumentCloneMap"]:
                    # find all doc id from step 2
                    docs = list(d_m.values())
                    # authorize all user in step three all docs in step 2
                    for d in docs:
                        for usr in users:
                            document = get_document_object(doc_id)
                            doc_name = document["document_name"] + " ".join(usr)
                            viewers = document["auth_viewers"]
                            viewers.append(usr)
                            print("the viewers", viewers)
                            update_document_viewers(
                                document_id=doc_id,
                                auth_viewers=usr,
                                doc_name=doc_name,
                            )
                            step_three["stepDocumentCloneMap"].append({usr: d})

            if step_three["stepTaskType"] == "request_for_task":
                print("in req 3 \n")
                copies += [
                    {
                        member["member"]: cloning.document(
                            document_id=document_id,
                            auth_viewer=member["member"],
                            parent_id=process["parent_document_id"],
                            process_id=process["_id"],
                        )
                    }
                    for member in step_three.get("stepTeamMembers", [])
                    + step_three.get("stepPublicMembers", [])
                    + step_three.get("stepUserMembers", [])
                ]
                print("the copies", copies)
                for cp in copies:
                    step_three["stepDocumentCloneMap"].append(cp)

    # updating the document clone list

    clone_ids = [d["member"] for d in copies if "member" in d]
    if clone_ids:
        document = get_document_object(document_id=process["parent_document_id"])
        data = document["clone_list"]
        for cid in clone_ids:
            data.append(cid)

        update_document_clone(
            document_id=process["parent_document_id"], clone_list=data
        )
    # update the process
    update_wf_process(
        process_id=process["_id"],
        steps=process["process_steps"],
        state=process["processing_state"],
    )
    print("Thread: Create copies! \n")

    return True
