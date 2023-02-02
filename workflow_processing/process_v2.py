import json
from .process import new_process
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from database.mongo_db_connection import (
    save_wf_process,
    get_process_object,
    get_document_object,
    save_document,
    update_document,
    save_process_links,
    get_links_object_by_process_id,
    get_process_list,
    update_wf_process,
)

# data model processing

# the process
process_model = {"baseDocumentId": "doc_id", "processTitle": "workflow_title + -"}

# steps
steps = [
    {
        "stepNumber": 1,
        "permitInternalWorkflow": "True|False",
        # location
        "stepLocation": "any|select",
        "continent": "the_continent",
        "country": "the_country",
        "city": "the_city",
        # time
        "stepTime": "no_time_limit|select|custom",
        "timeLimit": "no_time_limit|within_1_hour|within_8_hours|within_24_hours|within_3_days|within_7_days",
        "start_time": "the_time",
        "end_time": "the_time",
        # reminder
        "reminder": "no_reminder|every_hour|every_day|decide_later",
        # document
        "documentClone": "clone_count",
        # display_options
        "documentDisplay": "display_document_before_processing_this_step|display_document_after_processing_this_step|display_document_only_this_step|display_document_in_all_steps",
        # task
        "membersAssignedTask": "team|users|public",
        "publicMembers": ["list_of_assigned_usernames+portfolio"],
        "teamMembers": ["list_of_assigned_usernames+portfolio"],
        "userMembers": ["list_of_assigned_usernames+portfolio"],
        "taskType": "request_for_task|assign_task",
        "rights": "add_edit|view|comment|approve",
        "activityType": "team_task|individual_task",
        "taskLimitation": "portfolios_assigned_on_or_before_step_start_date_and_time|",
        "processingOrder": "no_order|team_member->user->public|team_member->public->user|user->team_member->public|user->public->team_member|public->team_member->user|public->user->team_member",
    }
]

# document processing.
processing_options = [
    "save_workflow_to_document_and_save_to_drafts",
    "cancel_process_before_completion",
    "pause_processing_after_completing_ongoing_step",
    "resume_processing_from_next_step",
    "test_document_processing_wf_wise",
    "test_document_processing_wf_steps_wise",
    "test_document_processing_content_wise",
    "start_document_processing_wf_wise",
    "start_document_processing_wf_steps_wise",
    "start_document_processing_content_wise",
    "close_processing_and_mark_as_completed",
]

"""
processing is determined by action 
"""


@api_view(["POST"])
def document_processing(request):
    if request.data["action"] == "save_workflow_to_document_and_save_to_drafts":
        return save_wf_to_document(
            workflows=request.data["workflows"],
            created_by=request.data["created_by"],
            company_id=request.data["company_id"],
            data_type=request.data["data_type"],
            document_id=request.data["document_id"],
        )
    if request.data["action"] == "close_processing_and_mark_as_completed":
        pass

    if request.data["action"] == "start_document_processing_content_wise":
        pass

    if request.data["action"] == "start_document_processing_wf_steps_wise":
        pass

    if request.data["action"] == "start_document_processing_wf_wise":
        pass

    if request.data["action"] == "test_document_processing_content_wise":
        pass

    if request.data["action"] == "test_document_processing_wf_steps_wise":
        pass

    if request.data["action"] == "test_document_processing_wf_wise":
        pass

    if request.data["action"] == "resume_processing_from_next_step":
        pass

    if request.data["action"] == "pause_processing_after_completing_ongoing_step":
        pass

    if request.data["action"] == "cancel_process_before_completion":
        pass

    return Response(
        "something went wrong!", status=status.HTTP_500_INTERNAL_SERVER_ERROR
    )


def save_wf_to_document(workflows, created_by, company_id, data_type, document_id):
    # create a new document instance with process info.
    # find doc by id
    try:
        document = get_document_object(document_id)
    except:
        return Response(
            "something went wrong!", status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    # create new doc
    save_res = json.loads(
        save_document(
            name=document["document_name"],
            data=document["content"],
            created_by=created_by,
            page=document["page"],
            data_type=document["data_type"],
        )
    )
    # create process with new id->
    process = new_process(
        workflows=workflows,
        created_by=created_by,
        company_id=company_id,
        data_type=data_type,
        document_id=save_res["inserted_id"],
    )
    # update doc with process.
    update_res = json.loads(
        update_document(
            document_id=process["document_id"],
            workflow_process_id=process["process_id"],
        )
    )
    if update_res["isSuccess"]:
        return Response(status=status.HTTP_201_CREATED)
    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
