import json
from threading import Thread

import requests
from rest_framework import status
from rest_framework.response import Response

from app.constants import NOTIFICATION_API

from . import checks, threads
from .helpers import cloning_document, link_to_editor, verification_data
from .mongo_db_connection import (
    authorize,
    get_document_object,
    get_process_object,
    save_process_links,
    save_wf_process,
    update_document_clone,
    update_wf_process,
)


def new(
    workflows,
    created_by,
    company_id,
    data_type,
    parent_item_id,
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

    process_kind = "original"

    # save to collection.
    res = json.loads(
        save_wf_process(
            process_title,
            process_steps,
            created_by,
            company_id,
            data_type,
            parent_item_id,
            process_choice,
            creator_portfolio,
            workflows_ids,
            process_type,
            process_kind,
        )
    )

    if res["isSuccess"]:
        process = {
            "process_title": process_title,
            "process_steps": process_steps,
            "processing_action": process_choice,
            "created_by": created_by,
            "company_id": company_id,
            "data_type": data_type,
            "parent_item_id": parent_item_id,
            "_id": res["inserted_id"],
            "process_type": process_type,
            "process_kind": process_kind,
        }
        return process


def start(process):
    """Start the processing cycle."""
    links = []
    qrcodes = []

    for step in process["process_steps"]:
        # we need a single link for the public
        public_users = [m["member"] for m in step.get("stepPublicMembers", [])]
        if public_users:
            public_portfolio = step.get("stepPublicMembers", [])[0].get("portfolio")
            link, qrcode = verification_data(
                process_id=process["_id"],
                item_id=process["parent_item_id"],
                step_role=step.get("stepRole"),
                auth_name=public_users,
                auth_portfolio=public_portfolio,
                company_id=process["company_id"],
                process_title=process["process_title"],
                item_type=process["process_type"],
                user_type="public",
            )

            links.append({public_portfolio: link})
            qrcodes.append({public_portfolio: qrcode})

        # for member in step.get("stepPublicMembers", []):
        #     # construct the portfolio list

        #     link, qrcode = verification_data(
        #         process_id=process["_id"],
        #         item_id=process["parent_item_id"],
        #         step_role=step.get("stepRole"),
        #         auth_name=member["member"],
        #         auth_portfolio=member["portfolio"],
        #         company_id=process["company_id"],
        #         process_title=process["process_title"],
        #         item_type=process["process_type"],
        #         user_type="public",
        #     )

        #     links.append({member["member"]: link})
        #     qrcodes.append({member["member"]: qrcode})

        for member in step.get("stepTeamMembers", []):
            link, qrcode = verification_data(
                process_id=process["_id"],
                item_id=process["parent_item_id"],
                step_role=step.get("stepRole"),
                auth_name=member["member"],
                auth_portfolio=member["portfolio"],
                company_id=process["company_id"],
                process_title=process["process_title"],
                item_type=process["process_type"],
                user_type="team",
            )

            links.append({member["member"]: link})
            qrcodes.append({member["member"]: qrcode})

        for member in step.get("stepUserMembers", []):
            link, qrcode = verification_data(
                process_id=process["_id"],
                item_id=process["parent_item_id"],
                step_role=step.get("stepRole"),
                auth_name=member["member"],
                auth_portfolio=member["portfolio"],
                company_id=process["company_id"],
                process_title=process["process_title"],
                item_type=process["process_type"],
                user_type="user",
            )

            links.append({member["member"]: link})
            qrcodes.append({member["member"]: qrcode})

    # document viewers
    viewers = [
        member["member"]
        for member in process["process_steps"][0].get("stepTeamMembers", [])
        + process["process_steps"][0].get("stepPublicMembers", [])
        + process["process_steps"][0].get("stepUserMembers", [])
    ]

    # update authorized viewers for the parent id template or document.
    doc_id = process["parent_item_id"]

    if len(viewers) > 0:
        # create doc copy
        clone_id = cloning_document(doc_id, viewers, doc_id, process["_id"])

        for user in viewers:
            process["process_steps"][0].get("stepDocumentCloneMap").append(
                {user: clone_id}
            )

        # now update the process
        update_wf_process(
            process_id=process["_id"],
            steps=process["process_steps"],
            state="processing",
        )

        # save links
        res = json.loads(
            save_process_links(
                links=links,
                process_id=process["_id"],
                item_id=clone_id,
                company_id=process["company_id"],
            )
        )
        if res["isSuccess"]:
            # save qrcodes
            code_data = {
                "qrcodes": qrcodes,
                "process_id": process["_id"],
                "item_id": clone_id,
                "process_choice": process["processing_action"],
                "company_id": process["company_id"],
                "process_title": process["process_title"],
            }
            Thread(target=threads.save_qrcodes, args=(code_data,)).start()

            # return generated links
            return Response({"links": links, "qrcodes": qrcodes}, status.HTTP_200_OK)

    return Response("failed to start processing", status.HTTP_500_INTERNAL_SERVER_ERROR)


def verify(
    process,
    auth_step_role,
    location_data,
    user_name,
    user_type,
    org_name,
    user_portfolio,
):
    # check if the prev step is done or not
    # is public valid
    # if user_type == "public":
    #     if not checks.is_public_person_valid(user_portfolio, org_name):
    #         return Response(
    #             "You have already accessed this document", status.HTTP_200_OK
    #         )
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
                        status.HTTP_401_UNAUTHORIZED,
                    )

            # display check
            if step.get("stepDisplay"):
                if not checks.display_right(step.get("stepDisplay")):
                    return Response(
                        "Missing display rights!", status.HTTP_401_UNAUTHORIZED
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
                        status.HTTP_403_FORBIDDEN,
                    )

            # find the clone id
            if any(user_name in d_map for d_map in step["stepDocumentCloneMap"]):
                for d_map in step["stepDocumentCloneMap"]:
                    if d_map.get(user_name) is not None:
                        clone_id = d_map.get(user_name)

            # set access.
            doc_map = step["stepDocumentMap"]
            right = step["stepRights"]
            role = step["stepRole"]
            user = user_name
            match = True
            # break

    # do we have access?
    if not match:
        return Response(
            "Access could not be set for this user",
            status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    # is everything right,
    if not clone_id:
        return Response(
            "No document to provide access to!", status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    if not right:
        return Response(
            "Missing step access rights!", status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    if not role:
        return Response(
            "Authorized role for this step not found!",
            status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    if not doc_map:
        return Response(
            "Document access map for this user not found!",
            status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

        #  generate document link.
    doc_link = link_to_editor(
        item_id=clone_id,
        item_map=doc_map,
        item_rights=right,
        user=user,
        process_id=process["_id"],
        user_role=role,
        item_type=process["process_type"],
    )
    return Response(doc_link, status.HTTP_200_OK)


def background(process_id, item_id, item_type):
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
                            authorize(docid, viewers, process["_id"], item_type)

                            # update to clone map
                            step_two["stepDocumentCloneMap"].append({usr: docid})

                if step_two["stepTaskType"] == "request_for_task":
                    # Create copies of the document from step one which is the parent document and have step
                    # two members as authorized.
                    copies += [
                        {
                            member["member"]: cloning_document(
                                item_id,
                                member["member"],
                                process["parent_item_id"],
                                process["_id"],
                            )
                        }
                        for member in step_two.get("stepTeamMembers", [])
                        + step_two.get("stepPublicMembers", [])
                        + step_two.get("stepUserMembers", [])
                    ]

                    for cp in copies:
                        step_two["stepDocumentCloneMap"].append(cp)

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
                            authorize(docid, viewers, process["_id"], item_type)

                            step_three["stepDocumentCloneMap"].append({usr: docid})

                if step_three["stepTaskType"] == "request_for_task":
                    print("in req 3 \n")
                    # Create copies of the document from step two and have step
                    # three members as authorized.
                    copies = []
                    for doc in docs:
                        for usr in step_three_users:
                            entry = {
                                usr: cloning_document(
                                    doc,
                                    usr,
                                    process["parent_item_id"],
                                    process["_id"],
                                )
                            }
                            copies.append(entry)

                    for cp in copies:
                        step_three["stepDocumentCloneMap"].append(cp)

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
                            authorize(docid, viewers, process["_id"], item_type)

                            step_four["stepDocumentCloneMap"].append({usr: docid})

                if step_four["stepTaskType"] == "request_for_task":
                    # Create copies of the document from step two and have step
                    # three members as authorized.
                    copies = []
                    for doc in docs:
                        for usr in step_three_users:
                            entry = {
                                usr: cloning_document(
                                    doc,
                                    usr,
                                    process["parent_item_id"],
                                    process["_id"],
                                )
                            }
                            copies.append(entry)

                    for cp in copies:
                        step_four["stepDocumentCloneMap"].append(cp)

    # ---------------- Post processing Actions -------------------------------

    # updating the document clone list
    clone_ids = [d["member"] for d in copies if "member" in d]
    print(clone_ids)
    if clone_ids:
        document = get_document_object(document_id=process["parent_item_id"])
        data = document["clone_list"]
        for cid in clone_ids:
            data.append(cid)

        update_document_clone(document_id=process["parent_item_id"], clone_list=data)
    # update the process
    update_wf_process(
        process_id=process["_id"],
        steps=process["process_steps"],
        state=process["processing_state"],
    )
    return True


# Determine whether a given step's documents are all finalized?
def check_step_done(step_index, process):
    step = process["process_steps"][step_index - 1]
    step_users = [
        member["member"]
        for member in step.get("stepTeamMembers", [])
        + step.get("stepPublicMembers", [])
        + step.get("stepUserMembers", [])
    ]

    clones = []
    for usr in step_users:
        for dmap in step["stepDocumentCloneMap"]:
            if dmap.get(usr) is not None:
                clones.append(dmap.get(usr))

        # check if all documents are complete in step 2
        d_states = [
            get_document_object(c_id)["document_state"] == "finalized"
            for c_id in clones
        ]

        if all(d_states):
            step["stepState"] = "complete"
            return True

    return False


# Now Authorize users with te current document
def authorize_next_step_users(step_index, process):
    prev_step = step_index - 1
    for doc_map in process["process_steps"][prev_step]:
        docs = list(doc_map.values())

    step = process["process_steps"][step_index]
    step_users = [
        member["member"]
        for member in step.get("stepTeamMembers", [])
        + step.get("stepPublicMembers", [])
        + step.get("stepUserMembers", [])
    ]

    viewers = []
    for docid in docs:
        for usr in step_users:
            viewers.append(usr)
            authorize(docid, viewers, process["_id"], item_type)

            # update to clone map
            process["process_steps"][step_index]["stepDocumentCloneMap"].append(
                {usr: docid}
            )


def derive_document_copies_for_step_users(step_index, process, item_id):
    step = process["process_steps"][step_index]
    print(step)
    copies = [
        {
            member["member"]: cloning_document(
                item_id,
                member["member"],
                process["parent_item_id"],
                process["_id"],
            )
        }
        for member in step.get("stepTeamMembers", [])
        + step.get("stepPublicMembers", [])
        + step.get("stepUserMembers", [])
    ]

    for cp in copies:
        step["stepDocumentCloneMap"].append(cp)

    return copies


def background2(process_id, item_id, item_type):
    try:
        process = get_process_object(process_id)
        num_process_steps = sum(
            isinstance(element, dict) for element in process["process_steps"]
        )
        if num_process_steps == 1:
            if check_step_done(num_process_steps, process):
                return True

        if num_process_steps >= 2:
            if check_step_done(num_process_steps, process):
                if check_step_done(num_process_steps, process):
                    return True

                else:
                    print("got here")
                    if step["stepTaskType"] == "assign_task":
                        authorize_next_step_users(num_process_steps, process)

                    if step["stepTaskType"] == "request_for_task":
                        document_copies = derive_document_copies_for_step_users(
                            num_process_steps, process, item_id
                        )
    except:
        return False

    # updating the document clone list
    clone_ids = [d["member"] for d in document_copies if "member" in d]
    if clone_ids:
        document = get_document_object(document_id=process["parent_item_id"])
        data = [cid for cid in document["clone_list"]]
        update_document_clone(document_id=process["parent_item_id"], clone_list=data)

    # mark process as finalized
    step_doc_states = [check_step_done(i, process) for i in num_process_steps]
    if all(step_doc_states):
        print("All Done \n")
        pass

    # update the process
    res = json.loads(
        update_wf_process(
            process_id=process["_id"],
            steps=process["process_steps"],
            state=process["processing_state"],
        )
    )

    if res["isSuccess"]:
        return True

    return False
