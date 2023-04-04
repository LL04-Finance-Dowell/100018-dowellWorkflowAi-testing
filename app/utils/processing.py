from threading import Thread
import requests
from rest_framework import status
from rest_framework.response import Response
import json
from app.utils import cloning
from app.utils.mongo_db_connection import (
    get_document_object,
    get_process_object,
    save_wf_process,
    update_document_clone,
    update_wf_process,
    authorize,
)
from . import checks, verification
from . import link_gen
from . import threads
from app.constants import NOTIFICATION_API


def new(
    workflows,
    created_by,
    company_id,
    data_type,
    item_id,
    process_choice,
    creator_portfolio,
    workflows_ids,
    process_type,
):
    """Structures a process entry to persistent storage"""

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
        item_id,
        process_choice,
        creator_portfolio,
        workflows_ids,
        process_type,
    )

    if res["isSuccess"]:
        process = {
            "process_title": process_title,
            "process_steps": process_steps,
            "processing_action": process_choice,
            "created_by": created_by,
            "company_id": company_id,
            "data_type": data_type,
            "parent_id": item_id,
            "_id": res["inserted_id"],
            "process_type": process_type,
        }
        return process


def start(process):
    """Start the processing cycle."""
    links = []
    qrcodes = []
    for step in process["process_steps"]:

        links += [
            {
                member["member"]: verification.process_links(
                    process_id=process["_id"],
                    item_id=process["parent_id"],
                    step_role=step.get("stepRole"),
                    auth_name=member["member"],
                    auth_portfolio=member["portfolio"],
                    company_id=process["company_id"],
                    process_title=process["process_title"],
                    item_type=process["process_type"]
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
                    item_id=process["parent_id"],
                    step_role=step.get("stepRole"),
                    auth_name=member["member"],
                    auth_portfolio=member["portfolio"],
                )
            }
            for member in step.get("stepTeamMembers", [])
            + step.get("stepPublicMembers", [])
            + step.get("stepUserMembers", [])
        ]

    # set auth users
    step_one = process["process_steps"][0]
    auth_users = [
        member["member"]
        for member in step_one.get("stepTeamMembers", [])
        + step_one.get("stepPublicMembers", [])
        + step_one.get("stepUserMembers", [])
    ]

    # update authorized viewers for the parent id template or document.
    doc_id = process["parent_id"]

    viewers = []
    for viewer in auth_users:
        viewers.append(viewer)

    if len(viewers) > 0:

        res = json.loads(
            authorize(doc_id, viewers, process["_id"]), process["process_type"]
        )
        if res["isSuccess"]:

            # add this users to the document clone map of step one
            for step in process["process_steps"]:
                if step.get("stepNumber") == 1:
                    for user in viewers:
                        step.get("stepDocumentCloneMap").append({user: doc_id})

            # now update the process
            update_wf_process(
                process_id=process["_id"],
                steps=process["process_steps"],
                state="processing",
            )

            # save links
            data = {
                "links": links,
                "process_id": process["_id"],
                "item_id": doc_id,
                "company_id": process["company_id"],
            }
            Thread(target=threads.save_links_v2, args=(data,)).start()

            # save qrcodes
            code_data = {
                "qrcodes": qrcodes,
                "process_id": process["_id"],
                "item_id": doc_id,
                "process_choice": process["processing_action"],
                "company_id": process["company_id"],
                "process_title": process["process_title"],
            }
            Thread(target=threads.save_qrcodes, args=(code_data,)).start()

            # return generated links
            return Response({"links": links, "qrcodes": qrcodes}, status.HTTP_200_OK)

    return Response("failed to start processing", status.HTTP_500_INTERNAL_SERVER_ERROR)


def verify(process, auth_step_role, location_data, user_name):
    doc_link = None

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
                    break

            # set access.
            doc_map = step.get("stepDocumentMap")
            right = step.get("stepRights")
            user = user_name
            role = step.get("stepRole")
            match = True

    # do we have access?
    if not match:
        return doc_link

    # is everything right,
    if clone_id and right and user and role and doc_map:

        #  generate document link.
        doc_link = link_gen.to_editor(
            document_id=clone_id,
            doc_map=doc_map,
            doc_rights=right,
            user=user,
            process_id=process["_id"],
            role=role,
            process_type=process["process_type"],
        )

        return doc_link

    return doc_link


def background(process_id, item_id, item_type):

    # remove from notification
    res = requests.delete(f"{NOTIFICATION_API}/{item_id}/")
    if res.status_code == 204:
        print("deleted notification")

    if item_type == "template":
        # TODO: when template
        return

    if item_type == "workflow":
        # TODO: when workflow
        return

    # get process
    process = get_process_object(process_id)

    copies = []
    step_1_complete = False
    step_2_complete = False
    step_3_complete = False

    #  ------------------------------------------Step 1-----------------------------------
    step_one = process["process_steps"][0]
    step_one_users = [
        member["member"]
        for member in step_one.get("stepTeamMembers", [])
        + step_one.get("stepPublicMembers", [])
        + step_one.get("stepUserMembers", [])
    ]

    # check if all documents are finalized
    clones = []
    for usr in step_one_users:
        for dmap in step_one["stepDocumentCloneMap"]:
            if dmap.get(usr) is not None:
                clones.append(dmap.get(usr))

    d_states = [
        get_document_object(c_id)["document_state"] == "finalized" for c_id in clones
    ]

    if all(d_states):
        step_1_complete = True

    # --------------------------------- Now Check Step 2---------------------------------------------
    if step_1_complete:
        if len(process["process_steps"]) > 1:

            step_two = process["process_steps"][1]
            step_two_users = [
                member["member"]
                for member in step_two.get("stepTeamMembers", [])
                + step_two.get("stepPublicMembers", [])
                + step_two.get("stepUserMembers", [])
            ]

            if step_two["stepDocumentCloneMap"] != []:
                clones = []
                for usr in step_two_users:
                    for dmap in step_two["stepDocumentCloneMap"]:
                        if dmap.get(usr) is not None:
                            clones.append(dmap.get(usr))

                # check if all documents are complete in step 2
                d_states = [
                    get_document_object(c_id)["document_state"] == "finalized"
                    for c_id in clones
                ]

                if all(d_states):
                    step_2_complete = True

            else:  # if the clone map is empty we execute

                if step_two["stepTaskType"] == "assign_task":

                    for d_m in step_one["stepDocumentCloneMap"]:
                        docs = list(d_m.values())

                    # With  step 1 documents we can now authorized step 2 users
                    viewers = []

                    for docid in docs:
                        for usr in step_two_users:
                            viewers.append(usr)
                            authorize_document(docid, viewers, process["_id"])

                            # update to clone map
                            step_two["stepDocumentCloneMap"].append({usr: docid})

                if step_two["stepTaskType"] == "request_for_task":

                    # Create copies of the document from step one which is the parent document and have step
                    # two members as authorized.
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

                    for cp in copies:
                        step_two["stepDocumentCloneMap"].append(cp)

        else:
            print("No Step 2 \n")
    else:
        print("Step 2 Incomplete \n")

    #  -------------------------------- Now Check Step 3 -------------------------------
    if step_2_complete:

        # Do we have step 3 index?
        if len(process["process_steps"]) > 2:

            step_three = process["process_steps"][2]
            step_two = process["process_steps"][1]

            # get all users
            step_three_users = [
                member["member"]
                for member in step_three.get("stepTeamMembers", [])
                + step_three.get("stepPublicMembers", [])
                + step_three.get("stepUserMembers", [])
            ]

            # check if all docs for respective users are complete
            if step_three["stepDocumentCloneMap"] != []:
                clones = []
                for usr in step_3_users:
                    for dmap in step_three["stepDocumentCloneMap"]:
                        if dmap.get(usr) is not None:
                            clones.append(dmap.get(usr))

                d_states = [
                    get_document_object(c_id)["document_state"] == "finalized"
                    for c_id in clones
                ]

                if all(d_states):
                    step_3_complete = True

            else:  # if the clone map is empty we execute

                for d_m in step_two["stepDocumentCloneMap"]:
                    docs = list(d_m.values())

                if step_three["stepTaskType"] == "assign_task":

                    # With  step 2 doc ids we can now authorized step 3 users
                    viewers = []
                    for docid in docs:
                        for usr in step_three_users:
                            viewers.append(usr)
                            authorize_document(docid, viewers, process["_id"])

                            step_three["stepDocumentCloneMap"].append({usr: docid})

                if step_three["stepTaskType"] == "request_for_task":
                    print("in req 3 \n")
                    # Create copies of the document from step two and have step
                    # three members as authorized.
                    copies = []
                    for doc in docs:
                        for usr in step_three_users:
                            entry = {
                                usr: cloning.document(
                                    doc,
                                    usr,
                                    process["parent_document_id"],
                                    process["_id"],
                                )
                            }
                            copies.append(entry)

                    for cp in copies:
                        step_three["stepDocumentCloneMap"].append(cp)

        else:
            print("No Step 3 \n")
    else:
        print("No step 3 \n")

    # ------------------------------------- Now Check Step 4 --------------------
    if step_3_complete:

        # Do we have step 4 index?
        if len(process["process_steps"]) > 3:

            step_four = process["process_steps"][3]
            step_four_users = [
                member["member"]
                for member in step_four.get("stepTeamMembers", [])
                + step_four.get("stepPublicMembers", [])
                + step_four.get("stepUserMembers", [])
            ]

            # check if all docs for respective users are complete
            if step_four["stepDocumentCloneMap"] != []:
                clones = []
                for usr in step_four_users:
                    for dmap in step_four["stepDocumentCloneMap"]:
                        if dmap.get(usr) is not None:
                            clones.append(dmap.get(usr))

                document_states = [
                    get_document_object(c_id)["document_state"] == "finalized"
                    for c_id in clones
                ]

                if all(document_states):
                    step_4_complete = True

            # if the clone map is empty we execute
            else:

                # setup documents from step 3
                for d_m in step_three["stepDocumentCloneMap"]:
                    docs = list(d_m.values())

                if step_four["stepTaskType"] == "assign_task":

                    # With  step 3 doc ids we can now authorized step 4 users
                    viewers = []
                    for docid in docs:
                        for usr in step_four_users:
                            viewers.append(usr)
                            authorize_document(docid, viewers, process["_id"])

                            step_four["stepDocumentCloneMap"].append({usr: docid})

                if step_four["stepTaskType"] == "request_for_task":

                    # Create copies of the document from step two and have step
                    # three members as authorized.
                    copies = []
                    for doc in docs:
                        for usr in step_three_users:
                            entry = {
                                usr: cloning.document(
                                    doc,
                                    usr,
                                    process["parent_document_id"],
                                    process["_id"],
                                )
                            }
                            copies.append(entry)

                    for cp in copies:
                        step_four["stepDocumentCloneMap"].append(cp)

        else:
            print("No step 4")
    else:
        print("Step 4 Not done \n")

    # ---------------- Post processing Actions -------------------------------

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
    """
      TODO: After all is done we can grab all documents and update their status to finalized.

      TODO: Update all steps as complete.
    
    """
    # TODO: Update the process as complete.
    documents = []
    for step in process["process_steps"]:
        step.get("stepDocumentCloneMap")

    print("Thread: Create copies! \n")

    return True
