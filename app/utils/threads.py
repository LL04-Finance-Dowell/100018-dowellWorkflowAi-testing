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
    print("Doc Auth")
    try:
        document = get_document_object(data["document_id"])
        doc_name = document["document_name"] + " ".join(data["auth_viewers"])

        viewers = document["auth_viewers"]
        for viewer in data["auth_viewers"]:
            viewers.append(viewer)

        print("the viewers", viewers)
        update_document_viewers(
            document_id=data["document_id"],
            auth_viewers=viewers,
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
    step_one = process["process_steps"][0]
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
    if step_two["stepDocumentCloneMap"] != []:
        print("In step 2 \n")
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
                for d in docs:
                    for usr in users:
                        data = {
                            "document_id": d,
                            "auth_viewers": usr,
                        }
                        Thread(
                            target=threads.update_document_authorize, args=(data,)
                        ).start()
                        step_two["stepDocumentCloneMap"].append({usr: d})
                # doc clone map update

        if step_two["stepTaskType"] == "request_for_task":
            print("in req 2", step_two["stepTaskType"], "\n")
            copies += [
                {
                    member["member"]: cloning.document(
                        document_id=data["document_id"],
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
                            data = {
                                "document_id": d,
                                "auth_viewers": usr,
                            }
                            Thread(
                                target=threads.update_document_authorize, args=(data,)
                            ).start()
                            step_three["stepDocumentCloneMap"].append({usr: d})

            if step_three["stepTaskType"] == "request_for_task":
                print("in req 3 \n")
                copies += [
                    {
                        member["member"]: cloning.document(
                            document_id=data["document_id"],
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
