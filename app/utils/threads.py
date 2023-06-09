import json

import requests

from app.constants import NOTIFICATION_API
from app.utils.mongo_db_connection import (
    get_document_object,
    get_process_object,
    save_process_links,
    save_process_qrcodes,
    save_uuid_hash,
    update_document,
    update_document_clone,
    update_process,
    reminder_func,
)



def save_link_hashes(data):
    """Save single link"""
    try:
        save_uuid_hash(
            link=data["link"],
            process_id=data["process_id"],
            item_id=data["item_id"],
            auth_role=data["step_role"],
            user_name=data["username"],
            auth_portfolio=data["portfolio"],
            unique_hash=data["unique_hash"],
            item_type=data["item_type"],
        )
        print("Thread: Single Link!")
    except ConnectionError:
        print("Fail to save a single VF link! \n")


def save_links_v2(data):
    """Saving process links"""
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
    """saving process qrcodes"""
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
    """add this users to the document clone map"""

    process = get_process_object(workflow_process_id=data["process_id"])
    doc_id = process["parent_document_id"]
    for step in process["process_steps"]:
        if step.get("stepNumber") == 1:
            for user in data["auth_viewers"]:
                mp = [{user: doc_id}]
                step.get("stepDocumentCloneMap").extend(mp)

    update_process(
        process_id=process["_id"],
        steps=process["process_steps"],
        state=data["processing_state"],
    )

    print("Thread: Process Update! \n")
    return


# def hourly_reminder(reminder_status="send_reminder_every_hour"):
#     daily_reminder_list = reminder_func(reminder_status)

#     for reminder in daily_reminder_list:
#         notification(reminder)


# def daily_reminder(reminder_status="send_reminder_every_day"):
#     daily_reminder_list = reminder_func(reminder_status)

#     for reminder in daily_reminder_list:
#         notification(reminder)
