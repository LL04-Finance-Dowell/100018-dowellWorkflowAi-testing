import json
from threading import Thread

import requests
from rest_framework import status
from rest_framework.response import Response

from app.constants import EDITOR_API

from . import checks
from .helpers import cloning_document, register_public_login, register_user_access

from .mongo_db_connection import (
    authorize,
    get_document_object,
    get_process_object,
    get_template_object,
    update_document_clone,
    update_process,
)

def verify(process, auth_step_role, location_data, user_name, user_type, org_name):
    clone_id = None
    for step in process["process_steps"]:
        if step.get("stepRole") == auth_step_role:
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
            if step.get("stepDisplay"):
                if not checks.display_right(step.get("stepDisplay")):
                    return Response(
                        "Missing display rights!", status.HTTP_401_UNAUTHORIZED
                    )
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
            if step.get("stepProcessingOrder"):
                if not checks.step_processing_order(
                    order=step.get("stepProcessingOrder"),
                    process_id=process.get("_id"),
                    role=step.get("stepRole"),
                ):
                    return Response(
                        "You do not have permission to process this document just yet!",
                        status.HTTP_401_UNAUTHORIZED,
                    )
            if user_type == "public":
                user_name = user_name[0]
            if any(user_name in d_map for d_map in step.get("stepDocumentCloneMap")):
                for d_map in step["stepDocumentCloneMap"]:
                    if d_map.get(user_name) is not None:
                        clone_id = d_map.get(user_name)

            doc_map = step["stepDocumentMap"]
            right = step["stepRights"]
            role = step["stepRole"]
            user = user_name
            match = True

    if not match:
        return Response("access could not be set for user", status.HTTP_403_FORBIDDEN)
    if not clone_id:
        return Response("document not ready for access!", status.HTTP_403_FORBIDDEN)
    if not right:
        return Response("missing step access rights!", status.HTTP_403_FORBIDDEN)
    if not role:
        return Response("authorized role not found!", status.HTTP_403_FORBIDDEN)
    if not doc_map:
        return Response("document access map not found!", status.HTTP_403_FORBIDDEN)

    item_type = process["process_type"]
    item_flag = None
    if item_type == "document":
        collection = "DocumentReports"
        document = "documentreports"
        field = "document_name"
        team_member_id = "11689044433"
        item_flag = get_document_object(clone_id)["document_state"]


    if item_type == "template":
        collection = "TemplateReports"
        document = "templatereports"
        field = "template_name"
        team_member_id = "22689044433"
        item_flag = get_template_object(clone_id)["document_state"]

    payload = {
        "product_name": "Workflow AI",
        "details": {
            "field": field,
            "cluster": "Documents",
            "database": "Documentation",
            "collection": collection,
            "document": document,
            "team_member_ID": team_member_id,
            "function_ID": "ABCDE",
            "command": "update",
            "flag": "signing",
            "_id": clone_id,
            "action": item_type,
            "authorized": user,
            "document_map": doc_map,
            "document_right": right,
            "document_flag": item_flag,
            "role": role,
            "process_id": process["_id"],
            "update_field": {"document_name": "", "content": "", "page": ""},
        },
    }
    try:
        link = requests.post(
            EDITOR_API,
            data=json.dumps(payload),
            headers={"Content-Type": "application/json"},
        )
        if user_type == "public":
            Thread(target= lambda: register_public_login(user_name[0], org_name))
            
        return Response(link.json(), status.HTTP_200_OK)
    
    except ConnectionError:
        return Response( status.HTTP_500_INTERNAL_SERVER_ERROR)
    


def background(process_id, item_id, item_type, authorized_role, user):
    process = get_process_object(process_id)
    Thread(
        target=lambda: register_user_access(
            process["process_steps"], authorized_role, user
        )
    ).start()
    copies = []
    step_1_complete = False
    step_2_complete = False
    step_3_complete = False
    step_one = process["process_steps"][0]
    step_one_users = [
        member["member"]
        for member in step_one.get("stepTeamMembers", [])
        + step_one.get("stepPublicMembers", [])
        + step_one.get("stepUserMembers", [])
    ]
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
                d_states = [
                    get_document_object(c_id)["document_state"] == "finalized"
                    for c_id in clones
                ]
                if all(d_states):
                    step_2_complete = True
            else:
                if step_two["stepTaskType"] == "assign_task":
                    for d_m in step_one["stepDocumentCloneMap"]:
                        docs = list(d_m.values())
                    viewers = []
                    for docid in docs:
                        for usr in step_two_users:
                            viewers.append(usr)
                            authorize(docid, viewers, process["_id"], item_type)
                            step_two["stepDocumentCloneMap"].append({usr: docid})
                if step_two["stepTaskType"] == "request_for_task":
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

    if step_2_complete:
        if len(process["process_steps"]) > 2:
            step_three = process["process_steps"][2]
            step_two = process["process_steps"][1]
            step_three_users = [
                member["member"]
                for member in step_three.get("stepTeamMembers", [])
                + step_three.get("stepPublicMembers", [])
                + step_three.get("stepUserMembers", [])
            ]
            if step_three["stepDocumentCloneMap"] != []:
                clones = []
                for usr in step_three_users:
                    for dmap in step_three["stepDocumentCloneMap"]:
                        if dmap.get(usr) is not None:
                            clones.append(dmap.get(usr))
                d_states = [
                    get_document_object(c_id)["document_state"] == "finalized"
                    for c_id in clones
                ]
                if all(d_states):
                    step_3_complete = True
            else:
                for d_m in step_two["stepDocumentCloneMap"]:
                    docs = list(d_m.values())
                if step_three["stepTaskType"] == "assign_task":
                    viewers = []
                    for docid in docs:
                        for usr in step_three_users:
                            viewers.append(usr)
                            authorize(docid, viewers, process["_id"], item_type)

                            step_three["stepDocumentCloneMap"].append({usr: docid})
                if step_three["stepTaskType"] == "request_for_task":
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
    if step_3_complete:
        if len(process["process_steps"]) > 3:
            step_four = process["process_steps"][3]
            step_four_users = [
                member["member"]
                for member in step_four.get("stepTeamMembers", [])
                + step_four.get("stepPublicMembers", [])
                + step_four.get("stepUserMembers", [])
            ]
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
            else:
                for d_m in step_three["stepDocumentCloneMap"]:
                    docs = list(d_m.values())
                if step_four["stepTaskType"] == "assign_task":
                    viewers = []
                    for docid in docs:
                        for usr in step_four_users:
                            viewers.append(usr)
                            authorize(docid, viewers, process["_id"], item_type)
                            step_four["stepDocumentCloneMap"].append({usr: docid})
                if step_four["stepTaskType"] == "request_for_task":
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
    clone_ids = [d["member"] for d in copies if "member" in d]
    if clone_ids:
        document = get_document_object(document_id=process["parent_item_id"])
        data = document["clone_list"]
        for cid in clone_ids:
            data.append(cid)
        update_document_clone(document_id=process["parent_item_id"], clone_list=data)
    update_process(
        process_id=process["_id"],
        steps=process["process_steps"],
        state=process["processing_state"],
    )
    return True

