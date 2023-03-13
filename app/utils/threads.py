from threading import Thread

import requests

from app.utils.mongo_db_connection import (
    get_document_object,
    save_process_links,
    save_process_qrcodes,
    save_uuid_hash,
    update_document,
    update_document_clone,
    update_document_viewers,
    update_wf_process,
    get_process_object,
)
from . import threads

from . import cloning

from app.constants import NOTIFICATION_API


def update_document_authorize(data):
    """Updating the document with auth viewers"""
    try:
        document = get_document_object(data["document_id"])
        doc_name = document["document_name"] + " ".join(data["auth_viewers"])
        update_document_viewers(
            document_id=data["document_id"],
            auth_viewers=data["auth_viewers"],
            doc_name=doc_name,
        )
        print("Thread: Doc Authorize \n")
    except ConnectionError:
        print("Fail: doc auth thread \n")
        return


def notification(data):
    """post notifications for extension."""
    payload = {
        "username": data["username"],
        "portfolio": data["portfolio"],
        "productName": "Workflow AI",
        "companyId": data["company_id"],
        "title": "Document to Sign",
        "orgName": "WorkflowAi",
        "message": "You have a document to sign.",
        "link": data["link"],
        "duration": "no limit",  # TODO: pass reminder time here
    }
    try:
        res = requests.post(
            url=NOTIFICATION_API,
            data=payload,
            headers={"Content-Type": "application/json"},
        )
        if res.status_code == 201:
            print("Thread: Sent Notification \n")
        else:
            print("something went wrong on notification:", res.status_code)

    except ConnectionError:
        print("Fail: notification  thread! \n")
        return


def save_link_hashes(data):
    """save single link"""
    try:
        save_uuid_hash(
            link=data["link"],
            process_id=data["process_id"],
            document_id=data["document_id"],
            auth_role=data["step_role"],
            user_name=data["username"],
            auth_portfolio=data["portfolio"],
            unique_hash=data["unique_hash"],
            # company_id=data["company_id"],
            # process_title=data["process_title"],
        )
    except ConnectionError:
        print("Fail to save a single VF link! \n")


def save_links_v2(data):
    """saving process links"""
    # print(data["links"])
    try:
        save_process_links(
            links=data["links"],
            process_id=data["process_id"],
            document_id=data["document_id"],
            company_id=data["company_id"],
        )
        print("Thread: Process Link Save! \n")
    except ConnectionError:
        print("Fail: link saving thread! \n")
        return


def save_qrcodes(data):
    """saving process qrcodes........"""
    try:
        save_process_qrcodes(
            qrcodes=data["qrcodes"],
            process_id=data["process_id"],
            document_id=data["document_id"],
            processing_choice=data["process_choice"],
            process_title=data["process_title"],
            company_id=data["company_id"],
        )
        print("Thread: Process QR Save! \n")
    except ConnectionError:
        print("Fail: QR saving thread! \n")
        return


# Thread to update a doc
def document_update(doc_data):
    """Updating document with new state"""
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


def clone_update(data):
    """add a clone id to a documents clone list"""
    document = get_document_object(document_id=data["doc_id"])
    clone_list = document["clone_list"].extend(data["clone_ids"])
    update_document_clone(document_id=data["doc_id"], clone_list=clone_list)
    print("Thread: Clone Update!")
    return


def process_update(data):
    # add this users to the document clone map
    process = get_process_object(workflow_process_id=data["process_id"])
    doc_id = process["parent_document_id"]
    for step in process["process_steps"]:
        if step.get("stepNumber") == 1:
            for user in data["auth_viewers"]:
                mp = [{user: doc_id}]
                step.get("stepDocumentCloneMap").extend(mp)

    update_wf_process(
        process_id=process["_id"],
        steps=process["process_steps"],
        state=data["processing_state"],
    )

    print("Thread: Process Update! \n")
    return


def background(data):
    # check if doc is complete
    document = get_document_object(document_id=data["document_id"])
    if document["document_state"] != "finalized":
        return

    # get process
    process = get_process_object(workflow_process_id=data["process_id"])
    user_name = data["authorized"]
    copies = []
    step_two_done = False
    incomplete = True
    changed = False

    # check if the second process is done or not
    complete = False

    # Set Second Step.
    step_two = process["process_steps"][1]

    # check if all docs for respective users are complete
    if step_two["stepDocumentCloneMap"]:
        print("In step 2")
        print("checking clone", step_two["stepDocumentCloneMap"])
        users = [
            member["member"]
            for member in step_two.get("stepTeamMembers", [])
            + step_two.get("stepPublicMembers", [])
            + step_two.get("stepUserMembers", [])
        ]
        print(users)
        for usr in users:
            document_states = [
                get_document_object(d_map.get(usr))["document_state"] == "complete"
                for d_map in step_two["stepDocumentCloneMap"]
            ]
            print(document_states)
            if all(document_states):
                complete = True
                return

    # if the clone map is empty we execute
    else:
        if step_two["stepTaskType"] == "assign_task":
            print("in assign task 2")
            for d_m in step_two["stepDocumentCloneMap"]:
                docs = list(d_m.values())
                for d in docs:
                    data = {
                        "document_id": d,
                        "auth_viewers": user_name,
                    }
                    Thread(
                        target=threads.update_document_authorize, args=(data,)
                    ).start()

        if step_two["stepTaskType"] == "request_for_task":
            print("in req 2", step_two["stepTaskType"])
            copies += [
                {
                    member["member"]: cloning.document(
                        document_id=data["document_id"],
                        auth_viewer=member["member"],
                        parent_id=process["document_id"],
                        process_id=process["_id"],
                    )
                }
                for member in step_two.get("stepTeamMembers", [])
                + step_two.get("stepPublicMembers", [])
                + step_two.get("stepUserMembers", [])
            ]
            step_two["stepDocumentCloneMap"].extend(copies)
            changed = True

    # for step 3 , step 2 should be done
    if complete:
        print("In step 3")
        step_three = process["process_steps"][2]
        # get all users
        users = (
            member["member"]
            for member in step_three.get("stepTeamMembers", [])
            + step_three.get("stepPublicMembers", [])
            + step_three.get("stepUserMembers", [])
        )

        # check if all docs for respective users are complete
        if step_three["stepDocumentCloneMap"]:
            for usr in users:
                document_states = [
                    get_document_object(d_map.get(usr))["document_state"] == "complete"
                    for d_map in step_three["stepDocumentCloneMap"]
                ]
                if all(document_states):
                    complete = True

        # if the clone map is empty we execute
        else:
            if step_three["stepTaskType"] == "assign_task":
                print("in assign task 3")
                for d_m in step_three["stepDocumentCloneMap"]:
                    docs = list(d_m.values())
                    for d in docs:
                        data = {
                            "document_id": d,
                            "auth_viewers": user_name,
                        }
                        Thread(
                            target=threads.update_document_authorize, args=(data,)
                        ).start()

            if step_three["stepTaskType"] == "request_for_task":
                print("in req 3")
                copies += [
                    {
                        member["member"]: cloning.document(
                            document_id=data["document_id"],
                            auth_viewer=member["member"],
                            parent_id=process["document_id"],
                            process_id=process["_id"],
                        )
                    }
                    for member in step_three.get("stepTeamMembers", [])
                    + step_three.get("stepPublicMembers", [])
                    + step_three.get("stepUserMembers", [])
                ]
                changed = True
                step_three["stepDocumentCloneMap"].extend(copies)
                

    # for step in process["process_steps"]:
    #     if step[1]:
    #         if step.get("stepNumber") == 2:
    #             if step.get("stepTaskType") == "assign_task":
    #                 for st in process["process_steps"]:
    #                     if st.get("stepNumber") == 2:
    #                         for d_m in st["stepDocumentCloneMap"]:
    #                             docs = list(d_m.values())

    #                 for d in docs:
    #                     data = {
    #                         "document_id": d,
    #                         "auth_viewers": user_name,
    #                     }
    #                     Thread(
    #                         target=threads.update_document_authorize, args=(data,)
    #                     ).start()

    #             if step.get("stepTaskType") == "request_for_task":
    #                 copies += [
    #                     {
    #                         member["member"]: cloning.document(
    #                             document_id=data["document_id"],
    #                             auth_viewer=member["member"],
    #                             parent_id=process["document_id"],
    #                             process_id=process["_id"],
    #                         )
    #                     }
    #                     for member in step.get("stepTeamMembers", [])
    #                     + step.get("stepPublicMembers", [])
    #                     + step.get("stepUserMembers", [])
    #                 ]
    #                 step["stepDocumentCloneMap"].extend(copies)

    # if step[2]:
    # check if the documents members documents are complete
    # if step["stepDocumentCloneMap"]:
    #     for d_map in step["stepDocumentCloneMap"]:
    #         if (
    #             get_document_object(d_map.get(user_name))["document_state"] != "complete"
    #         ):
    #             print("two not done")
    #             return
    #         else:
    #             print("two_done")
    #             step_two_done = True

    # else:
    #     # TODO: Testing
    #     if step.get("stepTaskType") == "assign_task":
    #         # just find documents from step 1 and update their auth_viewers
    #         for st in process["process_steps"]:
    #             if st.get("stepNumber") == 2:
    #                 for d_m in st["stepDocumentCloneMap"]:
    #                     docs = list(d_m.values())

    #         for d in docs:
    #             data = {
    #                 "document_id": d,
    #                 "auth_viewers": user_name,
    #             }
    #             Thread(
    #                 target=threads.update_document_authorize, args=(data,)
    #             ).start()

    #     if step.get("stepTaskType") == "request_for_task":
    #         copies += [
    #             {
    #                 member["member"]: cloning.document(
    #                     document_id=data["document_id"],
    #                     auth_viewer=member["member"],
    #                     parent_id=process["parent_document_id"],
    #                     process_id=process["_id"],
    #                 )
    #             }
    #             for member in step.get("stepTeamMembers", [])
    #             + step.get("stepPublicMembers", [])
    #             + step.get("stepUserMembers", [])
    #         ]
    #         step["stepDocumentCloneMap"].extend(copies)
    # For 3rd step
    # if step_two_done:
    #     for step in process["process_steps"]:
    #         if step.get("stepNumber") == 3:
    #             # check if the documents members documents are complete
    #             if step["stepDocumentCloneMap"]:
    #                 for d_map in step["stepDocumentCloneMap"]:
    #                     if (
    #                         get_document_object(d_map.get(user_name))["document_state"]
    #                         != "complete"
    #                     ):
    #                         return
    #                     else:
    #                         print("three not done")

    #             else:
    #                 if step.get("stepTaskType") == "assign_task":
    #                     # just find documents from step 2 and update their auth_viewers
    #                     for st in process["process_steps"]:
    #                         if st.get("stepNumber") == 2:
    #                             for d_m in step["stepDocumentCloneMap"]:
    #                                 docs = list(d_m.values())

    #                     for d in docs:
    #                         data = {
    #                             "document_id": d,
    #                             "auth_viewers": user_name,
    #                         }
    #                         Thread(
    #                             target=threads.update_document_authorize, args=(data,)
    #                         ).start()

    #                         step_three_done = True

    #                 if step.get("stepTaskType") == "request_for_task":
    #                     # get all members in step
    #                     copies += [
    #                         {
    #                             member["member"]: cloning.document(
    #                                 document_id=data["document_id"],
    #                                 auth_viewer=member["member"],
    #                                 parent_id=process["parent_document_id"],
    #                                 process_id=process["_id"],
    #                             )
    #                         }
    #                         for member in step.get("stepTeamMembers", [])
    #                         + step.get("stepPublicMembers", [])
    #                         + step.get("stepUserMembers", [])
    #                     ]
    #                     step["stepDocumentCloneMap"].extend(copies)

    # updating the document clone list
    if changed:
        clone_ids = [d["member"] for d in copies if "member" in d]
        if clone_ids:
            data = {
                "doc_id": process["parent_document_id"],
                "clone_ids": clone_ids,
            }
            Thread(
                target=threads.clone_update,
                args=(data,),
            ).start()
        # update the process
        update_wf_process(
            process_id=process["_id"],
            steps=process["process_steps"],
            state=process["processing_state"],
        )
        print("Thread: Create copies! \n")

    return
