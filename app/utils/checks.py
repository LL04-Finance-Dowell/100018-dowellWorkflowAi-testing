from datetime import datetime, timedelta
from app.utils.mongo_db_connection import (
    get_document_object,
    get_link_object,
    get_template_object,
    org_wfai_setting,
    get_process_object,
)

from .helpers import public_login, register_user_access


def is_finalized(item_id, item_type):
    """Check for a process item's state"""

    if item_type == "document":
        document = get_document_object(item_id)
        if document["document_state"] == "finalized":
            return True, document["document_state"]

        if document["document_state"] == "rejected":
            return True, document["document_state"]

    if item_type == "template":
        template = get_template_object(item_id)
        if template["template_state"] == "finalized":
            return True, template["template_state"]

        if template["template_state"] == "rejected":
            return True, template["template_state"]

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
        return True

    if location == "select":
        if continent == my_continent and country == my_country and city == my_city:
            return True

    return None


def time_limit_right(time, select_time_limits, start_time, end_time, creation_time):
    """check time limits for processing step."""

    current_time = datetime.now().strftime("%Y-%m-%dT%H:%M")
    current_time_object = datetime.strptime(current_time, "%Y-%m-%dT%H:%M")
    
    if time == "no_time_limit":
        return True

    elif time == "select":
        creation_time_object = datetime.strptime(creation_time, "%d:%m:%Y,%H:%M:%S") #first convert to datetime object
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

            time_limit = (end_time_object - start_time_object)
            select_time_limits = f"within {time_limit.total_seconds() // 3600} hours"

            return start_time_object <= end_time_object and current_time_object <= end_time_object
        else:
            return False


def step_processing_order(order, process_id, role):
    """Check members step processing sequence"""
    
    process = get_process_object(process_id)

    process_steps = process['process_steps']
    public_members = process_steps[0].get("stepPublicMembers")
    team_members = process_steps[0].get("stepTeamMembers")
    user_members = process_steps[0].get("stepUserMembers")


    if order == "no_order":
        return True
    
    elif order == 'team_user_public':
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
        except ValueError:
            raise ValueError('Sorry! You cannot access this document just yet!')

    elif order == 'team_public_user':
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
        except ValueError:
            raise ValueError('Sorry! You cannot access this document just yet!')
    
    elif order == 'user_team_public':
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
        except ValueError:
            raise ValueError('Sorry! You cannot access this document just yet!')

    elif order == 'user_public_team':
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
        except ValueError:
            raise ValueError('Sorry! You cannot access this document just yet!')
    
    elif order == 'public_user_team':
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
        except ValueError:
            raise ValueError('Sorry! You cannot access this document just yet!')

    elif order == 'public_team_user':
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
        except ValueError:
            raise ValueError('Sorry! You cannot access this document just yet!')



# def user_presence(token, user_name, portfolio):
#     """Checking user presence in process links map"""
#     # decode token
#     decoded = jwt.decode(token, "secret", algorithms="HS256")
#     user_allowed = False
#     if decoded["auth_name"] == user_name and decoded["auth_portfolio"] == portfolio:
#         user_allowed = True
#     return user_allowed, decoded["process_id"], decoded["step_role"]


def user_presence(token, user_name, portfolio):
    """Checking user presence in process links map"""

    link_info = get_link_object(unique_hash=token)
    if link_info["user_name"] == user_name and link_info["auth_portfolio"] == portfolio:
        return True

    return None, link_info["process_id"], link_info["auth_role"]


def is_public_person_valid(qrid, org_name):
    valid = public_login(qrid, org_name)
    return valid


def is_wf_setting_exist(comp_id, org_name,data_type):
    valid = org_wfai_setting(comp_id, org_name,data_type)
    return valid
