from datetime import datetime

from app.utils.mongo_db_connection import get_link_object


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
    """- check the location selection - verify matching geo information."""
    if location == "any":
        allowed = True
        return allowed
    if location == "select":
        if continent == my_continent and country == my_country and city == my_city:
            allowed = True
            return allowed


def time_limit_right(time, select_time_limits, start_time, end_time, creation_time):
    """check time limits for processing step."""
    current_time = datetime.now().strftime("%H:%M")
    allowed = False
    if time == "no_time_limit":
        allowed = True
        return allowed
    if time == "select":
        if select_time_limits == "within_1_hour":
            pass
        if select_time_limits == "within_8_hours":
            pass
        if select_time_limits == "within_24_hours":
            pass
        if select_time_limits == "within_3_days":
            pass
        if select_time_limits == "within_7_days":
            pass
    if time == "custom":
        pass
    return allowed


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
    # decode token
    # decoded = jwt.decode(token, "secret", algorithms="HS256")
    link_info = get_link_object(unique_hash=token)
    user_allowed = False
    if link_info["user_name"] == user_name and link_info["auth_portfolio"] == portfolio:
        user_allowed = True
    return user_allowed, link_info["process_id"], link_info["auth_role"]
