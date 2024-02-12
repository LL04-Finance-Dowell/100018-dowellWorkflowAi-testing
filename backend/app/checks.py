from datetime import datetime, timedelta

from app.mongo_db_connection import (
    single_query_document_collection,
    single_query_links_collection,
    single_query_template_collection,
    org_wfai_setting,
    single_query_process_collection,
    single_query_clones_collection,
)


def check_items_state(items) -> list:
    return [
        single_query_document_collection({"_id": i})["document_state"] == "finalized"
        for i in items
        if isinstance(i, str)
    ]


def check_that_process_documents_are_finalized(process):
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
    for step in process_steps:
        if step["stepRole"] == authorized_role:
            for clone_map in step["stepDocumentCloneMap"]:
                if user in clone_map:
                    clone_map["accessed"] = True
                    break


def register_single_user_access(step, authorized_role, user):
    if step["stepRole"] == authorized_role:
        for clone_map in step["stepDocumentCloneMap"]:
            if user in clone_map:
                clone_map["accessed"] = True
                continue


def is_finalized(item_id, item_type):
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
        if temp_state == "saved":
            return True, temp_state
        elif temp_state == "rejected":
            return True, temp_state
        elif temp_state == "draft":
            return False, "draft"
    return False, "processing"


def display_right(display):
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
    if location == "any":
        return True
    if location == "select":
        if continent == my_continent and country == my_country and city == my_city:
            return True
    return True


def time_limit_right(time, select_time_limits, start_time, end_time, creation_time):
    current_time = datetime.utcnow().strftime("%Y-%m-%dT%H:%M")
    current_time_object = datetime.strptime(current_time, "%Y-%m-%dT%H:%M") 
    if time == "no_time_limit":
        return True
    elif time == "select":
        creation_time_object = datetime.strptime(
            creation_time, "%d:%m:%Y,%H:%M:%S"
        ) 
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
    link_info = single_query_links_collection(unique_hash=token)
    if link_info["user_name"] == user_name and link_info["auth_portfolio"] == portfolio:
        return True
    return None, link_info["process_id"], link_info["auth_role"]


def is_wf_setting_exist(comp_id, org_name, data_type):
    valid = org_wfai_setting(comp_id, org_name, data_type)
    return valid
