from datetime import datetime, timedelta

import requests
from app.constants import CREDITS_API, WORKFLOW_AI
from app.mongo_db_connection import (
    single_query_document_collection,
    single_query_links_collection,
    single_query_template_collection,
    org_wfai_setting,
    single_query_process_collection,
    single_query_clones_collection,
)


def check_workflow_credits_authorization(organization_id):
    url = f"{CREDITS_API}/user/?type=get_api_key&workspace_id={organization_id}"
    res = requests.get(url)
    if res.status_code == 200 and res.json()["success"] == True:
        response = res.json()
        services = response["data"]["services"]
        for sv in services:
            if sv["name"] == WORKFLOW_AI:
                for sub in sv["sub_service"]:
                    if sub["sub_service_name"] == "PROCESS":
                        print(sub)
                        if (
                            sub["sub_service_credits"] >= 0
                            and sub["sub_service_credits"] != None
                        ):
                            return True
    return

def check_process_credits_authorization(organization_id):
    url = f"{CREDITS_API}/user/?type=get_api_key&workspace_id={organization_id}"
    res = requests.get(url)
    if res.status_code == 200 and res.json()["success"] == True:
        response = res.json()
        services = response["data"]["services"]
        for sv in services:
            if sv["name"] == WORKFLOW_AI:
                for sub in sv["sub_service"]:
                    if sub["sub_service_name"] == "PROCESS":
                        print(sub)
                        if (
                            sub["sub_service_credits"] >= 0
                            and sub["sub_service_credits"] != None
                        ):
                            return True
    return

def check_document_credits_authorization(organization_id):
    url = f"{CREDITS_API}/user/?type=get_api_key&workspace_id={organization_id}"
    res = requests.get(url)
    if res.status_code == 200 and res.json()["success"] == True:
        response = res.json()
        services = response["data"]["services"]
        for sv in services:
            if sv["name"] == WORKFLOW_AI:
                for sub in sv["sub_service"]:
                    if sub["sub_service_name"] == "DOCUMENT":
                        print(sub)
                        if (
                            sub["sub_service_credits"] >= 0
                            and sub["sub_service_credits"] != None
                        ):
                            return True
    return


def check_template_credits_authorization(organization_id):
    url = f"{CREDITS_API}/user/?type=get_api_key&workspace_id={organization_id}"
    res = requests.get(url)
    if res.status_code == 200 and res.json()["success"] == True:
        response = res.json()
        services = response["data"]["services"]
        for sv in services:
            if sv["name"] == WORKFLOW_AI:
                for sub in sv["sub_service"]:
                    if sub["sub_service_name"] == "TEMPLATE":
                        print(sub)
                        if (
                            sub["sub_service_credits"] >= 0
                            and sub["sub_service_credits"] != None
                        ):
                            return True
    return

def check_credits_authorization(organization_id):
    """Finds the API key for a given workspace"""
    url = f"{CREDITS_API}/user/?type=get_api_key&workspace_id={organization_id}"
    response = requests.get(url)
    if response.status_code == 200:
        api_key = response["data"]["api_key"]
        return api_key


def check_product_usage_credits(organization_id):
    """Checks if the given workspace has enough credits to access services"""
    url = f"{CREDITS_API}/user/?type=get_api_key&workspace_id={organization_id}"
    response = requests.get(url)
    if response.status_code == 200:
        services = response["data"]["services"]
        for sv in services:
            if sv["name"] == WORKFLOW_AI:
                return sv


def check_items_state(items) -> list:
    """Checks if item state is finalized"""
    return [
        single_query_document_collection({"_id": i})["document_state"] == "finalized"
        for i in items
        if isinstance(i, str)
    ]


def check_that_process_documents_are_finalized(process):
    """Checks if all process documents are finalized"""
    docs = []
    for step in process["process_steps"]:
        if not step["stepDocumentCloneMap"]:
            return
        else:
            docs.extend(
                [k for dict in step["stepDocumentCloneMap"] for k in dict.keys()]
            )
    return all(check_items_state(docs)), docs


def register_user_access(process_steps, authorized_role, user):
    """Once someone has made changes to their docs"""
    for step in process_steps:
        if step["stepRole"] == authorized_role:
            for clone_map in step["stepDocumentCloneMap"]:
                if user in clone_map:
                    clone_map["accessed"] = True
                    break


def register_single_user_access(step, authorized_role, user):
    """Once someone has made changes to their docs"""
    if step["stepRole"] == authorized_role:
        for clone_map in step["stepDocumentCloneMap"]:
            if user in clone_map:
                clone_map["accessed"] = True
                continue


def is_finalized(item_id, item_type):
    """Check for a process item's state"""
    if item_type == "document":
        document = single_query_document_collection({"_id": item_id})
        doc_state = document["document_state"]
        if doc_state == "finalized":
            return True, doc_state
        if doc_state == "rejected":
            return True, doc_state
    if item_type == "clone":
        document = single_query_clones_collection({"_id": item_id})
        doc_state = document["document_state"]
        if doc_state == "finalized":
            return True, doc_state
        if doc_state == "rejected":
            return True, doc_state
    if item_type == "template":
        template = single_query_template_collection({"_id": item_id})
        temp_state = template["template_state"]
        if temp_state == "finalized":
            return True, temp_state
        if temp_state == "rejected":
            return True, temp_state
    return False, "processing"


def display_right(display):
    """Check for the right document display rights."""
    display_allowed = {
        "before_this_step": True,
        "after_this_step": False,
        "in_all_steps": True,
        "only_this_step": True,
    }
    return display_allowed.get(display)


def location_right(
    location, continent, my_continent, country, my_country, city, my_city
):
    """Check the location selection - verify matching geo information."""
    if location == "any":
        # print("location", location)
        return True
    if location == "select":
        if continent == my_continent and country == my_country and city == my_city:
            return True
    # print(location)
    return True


def time_limit_right(time, select_time_limits, start_time, end_time, creation_time):
    """check time limits for processing step."""
    current_time = datetime.now().strftime("%Y-%m-%dT%H:%M")
    current_time_object = datetime.strptime(current_time, "%Y-%m-%dT%H:%M")
    if time == "no_time_limit":
        return True
    elif time == "select":
        creation_time_object = datetime.strptime(
            creation_time, "%d:%m:%Y,%H:%M:%S"
        )  # first convert to datetime object
        created_at = creation_time_object.strftime("%Y-%m-%dT%H:%M")
        if select_time_limits == "within_1_hour":
            time_limit = creation_time_object + timedelta(hours=1)
            return current_time_object <= time_limit
        elif select_time_limits == "within_8_hours":
            time_limit = creation_time_object + timedelta(hours=8)
            return current_time_object <= time_limit
        elif select_time_limits == "within_24_hours":
            time_limit = creation_time_object + timedelta(hours=24)
            return current_time_object <= time_limit
        elif select_time_limits == "within_3_days":
            time_limit = creation_time_object + timedelta(hours=72)
            return current_time_object <= time_limit
        elif select_time_limits == "within_7_days":
            time_limit = creation_time_object + timedelta(hours=168)
            return current_time_object <= time_limit
    elif time == "custom":
        if start_time and end_time:
            start_time_object = datetime.strptime(start_time, "%Y-%m-%dT%H:%M")
            end_time_object = datetime.strptime(end_time, "%Y-%m-%dT%H:%M")
            time_limit = end_time_object - start_time_object
            select_time_limits = f"within {time_limit.total_seconds() // 3600} hours"
            return (
                start_time_object <= end_time_object
                and current_time_object <= end_time_object
            )
        else:
            return False


def step_processing_order(order, process_id, role):
    """Check members step processing sequence"""
    process = single_query_process_collection({"_id": process_id})
    process_steps = process["process_steps"]
    for step in process_steps:
        public_members = step.get("stepPublicMembers")
        team_members = step.get("stepTeamMembers")
        user_members = step.get("stepUserMembers")
        if order == "no_order":
            return True
        elif order == "team_user_public":
            try:
                if len(team_members) > 0:
                    for member_obj in team_members:
                        member = member_obj["member"]
                        register_user_access(process_steps, role, member)
                if len(user_members) > 0:
                    for member_obj in user_members:
                        member = member_obj["member"]
                        register_user_access(process_steps, role, member)
                if len(public_members) > 0:
                    for member_obj in public_members:
                        member = member_obj["member"]
                        register_user_access(process_steps, role, member)
            except Exception as e:
                print(e)
                return
        elif order == "team_public_user":
            try:
                if len(team_members) > 0:
                    for member_obj in team_members:
                        member = member_obj["member"]
                        register_user_access(process_steps, role, member)
                if len(public_members) > 0:
                    for member_obj in public_members:
                        member = member_obj["member"]
                        register_user_access(process_steps, role, member)
                if len(user_members) > 0:
                    for member_obj in user_members:
                        member = member_obj["member"]
                        register_user_access(process_steps, role, member)
            except Exception as e:
                print(e)
                return
        elif order == "user_team_public":
            try:
                if len(user_members) > 0:
                    for member_obj in user_members:
                        member = member_obj["member"]
                        register_user_access(process_steps, role, member)
                if len(team_members) > 0:
                    for member_obj in team_members:
                        member = member_obj["member"]
                        register_user_access(process_steps, role, member)
                if len(public_members) > 0:
                    for member_obj in public_members:
                        member = member_obj["member"]
                        register_user_access(process_steps, role, member)
            except Exception as e:
                print(e)
                return
        elif order == "user_public_team":
            try:
                if len(user_members) > 0:
                    for member_obj in user_members:
                        member = member_obj["member"]
                        register_user_access(process_steps, role, member)
                if len(public_members) > 0:
                    for member_obj in public_members:
                        member = member_obj["member"]
                        register_user_access(process_steps, role, member)
                if len(team_members) > 0:
                    for member_obj in team_members:
                        member = member_obj["member"]
                        register_user_access(process_steps, role, member)
            except Exception as e:
                print(e)
                return
        elif order == "public_user_team":
            try:
                if len(public_members) > 0:
                    for member_obj in public_members:
                        member = member_obj["member"]
                        register_user_access(process_steps, role, member)
                if len(user_members) > 0:
                    for member_obj in user_members:
                        member = member_obj["member"]
                        register_user_access(process_steps, role, member)
                if len(team_members) > 0:
                    for member_obj in team_members:
                        member = member_obj["member"]
                        register_user_access(process_steps, role, member)
            except Exception as e:
                print(e)
                return
        elif order == "public_team_user":
            try:
                if len(public_members) > 0:
                    for member_obj in public_members:
                        member = member_obj["member"]
                        register_user_access(process_steps, role, member)
                if len(team_members) > 0:
                    for member_obj in team_members:
                        member = member_obj["member"]
                        register_user_access(process_steps, role, member)
                if len(user_members) > 0:
                    for member_obj in user_members:
                        member = member_obj["member"]
                        register_user_access(process_steps, role, member)
            except Exception as e:
                print(e)
                return


def user_presence(token, user_name, portfolio):
    """Checking user presence in process links map"""
    link_info = single_query_links_collection(unique_hash=token)
    if link_info["user_name"] == user_name and link_info["auth_portfolio"] == portfolio:
        return True
    return None, link_info["process_id"], link_info["auth_role"]


def is_wf_setting_exist(comp_id, org_name, data_type):
    valid = org_wfai_setting(comp_id, org_name, data_type)
    return valid
