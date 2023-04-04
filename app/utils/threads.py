import json
import requests

from app.utils.mongo_db_connection import (
    get_document_object,
    save_process_links,
    save_process_qrcodes,
    save_uuid_hash,
    update_document,
    update_document_clone,
    update_wf_process,
    get_process_object,
)


from app.constants import NOTIFICATION_API


def notification(data):
    """post notifications for extension."""
    payload = json.dumps({
        "username": data["username"],
        "documentId": data["item_id"],
        "portfolio": data["portfolio"],
        "productName": "Workflow AI",
        "companyId": data["company_id"],
        "title": "Document to Sign",
        "orgName": "WorkflowAi",
        "message": "You have a document to sign.",
        "link": data["link"],
        "duration": "no limit",  # TODO: pass reminder time here
    })
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
            item_id=data["item_id"],
            auth_role=data["step_role"],
            user_name=data["username"],
            auth_portfolio=data["portfolio"],
            unique_hash=data["unique_hash"],
            item_type=data["item_type"]
        )
        print("Thread: Single Link!")
    except ConnectionError:
        print("Fail to save a single VF link! \n")


def save_links_v2(data):
    """saving process links"""
    # print(data["links"])
    try:
        save_process_links(
            links=data["links"],
            process_id=data["process_id"],
            item_id=data["item_id"],
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
            item_id=data["item_id"],
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


