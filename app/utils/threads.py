from threading import Thread

import requests

from app.utils.mongo_db_connection_v2 import (
    get_document_object,
    save_process_links,
    save_process_qrcodes,
    update_document,
    update_document_clone,
    update_document_viewers,
    update_wf_process,
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
    try:
        res = requests.post(
            url=NOTIFICATION_API,
            data={
                "username": data["username"],
                "portfolio": data["portfolio"],
                "productName": "Workflow AI",
                "companyId": data["company_id"],
                "title": "Document to Sign",
                "orgName": "Workflow AI",
                "message": "You have a document to sign.",
                "link": data["link"],
                "duration": "no limit",
            },
            headers={"Content-Type": "application/json"},
        )
        if res.status_code == 201:
            print("Thread: Sent Notification \n")
        else:
            print("something went wrong on notification:", res.status_code)
    except ConnectionError:
        print("Fail: doc update thread! \n")
        return


# thread process.
def save_links_v2(data):
    """saving process links"""
    try:
        save_process_links(
            links=data["links"],
            process_id=data["process_id"],
            document_id=data["document_id"],
            processing_choice=data["process_choice"],
            process_title=data["process_title"],
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
    update_wf_process(
        process_id=data["process_id"],
        steps=data["process_steps"],
        state=data["processing_state"],
    )
    print("Thread: Process Update! \n")
    return


def create_copies(data):
    document = get_document_object(document_id=data["doc_id"])
    if document["document_state"] == "complete":
        return

    # if doc has not been finalized.
    process = data["process"]
    copies = []
    for step in process["process_steps"]:
        if step.get("stepNumber") == 2:
            copies += [
                {
                    member["member"]: cloning.document(
                        document_id=data["doc_id"],
                        auth_viewer=member["member"],
                        parent_id=process["parent_document_id"],
                        process_id=process["_id"],
                    )
                }
                for member in step.get("stepTeamMembers", [])
                + step.get("stepPublicMembers", [])
                + step.get("stepUserMembers", [])
            ]
            step["stepDocumentCloneMap"].extend(copies)

        # if step.get("stepNumber") == 3:
        #     copies += [{member["member"]: clone_document(document_id=data["doc_id"],
        #                                                  auth_viewer=member["member"],
        #                                                  parent_id=process["parent_document_id"])} for member in
        #                step.get("stepTeamMembers", []) + step.get("stepPublicMembers", []) + step.get("stepUserMembers",
        #                                                                                               [])]
        #     step["stepDocumentCloneMap"].extend(copies)

    # updating the document clone list
    data = {
        "doc_id": process["parent_document_id"],
        "clone_ids": [d["member"] for d in copies if "member" in d],
    }
    ct = Thread(
        target=threads.clone_update,
        args=(data,),
    )
    ct.start()

    # thread work to update the process
    process_data = {
        "process_id": process["_id"],
        "process_steps": process["process_steps"],
        "processing_state": process["processing_state"],
    }
    Thread(target=threads.process_update, args=(process_data,)).start()
    print("Thread: Create copies! \n")
    return
