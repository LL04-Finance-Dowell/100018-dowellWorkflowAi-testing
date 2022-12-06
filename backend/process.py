from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .mongo_db_connection import (
    get_wf_object,
    update_wf_process,
    save_wf_process,
    get_document_object,
)

"""
---------------------------------------SET WORKFLOWS IN DOCUMENT------------------------------------------
1.Select a document to add to a workflow.
    - user picks a document from the list 
2.Select a workflow to add to the document.
    - user picks a workflow from workflow list 
- ACTION - Add Workflow to selected document.
"""


def add_wf_instance(workflows, document_id):
    try:
        document = get_document_object(document_id)
        if not document:
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        for wf in workflows:
            workflow = get_wf_object(wf)
            if not workflow:
                return Response(
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            save_wf_process(workflow, document)
            return Response(
                status=status.HTTP_200_OK,
            )
    except:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def workflow_process(request):
    res = add_wf_instance(
        workflows=request.data["workflows"], document_id=request.data["document_id"]
    )
    return res


"""
3.Connect selected workflow to selected document.
"workflow_title": "workflow_1",
"steps": [{
        "step_name"        : "Step_1",
        "skip": True or False,
        "member_type": "",  ["TEAM_MEMBER", "GUEST", "PUBLIC"]
        "member_portfolio": member_portfolio,
        "rights": ["ADD/EDIT", "VIEW", "COMMENT", "APPROVE"],
        "display": ["before_processing_this_step", "after_processing_this_step", "only_in_this_step", "in_all_steps"],
        "location": ["Mumbai", "Bombay"]
        "limit": "" ["1hour", "2hour", "12hours", "24hours"],
        "period": "" [ start_time-end_time]
        "start_time": "START_DATE_AND_TIME",
        "end_time":    "END_DATE_AND_TIME",
        "reminder": ["EVERY_HOUR", "EVERY_DAY"],
    },{
        "step_name"        : "Step_2",
        "skip": True or False,
        "member_type": "",  ["TEAM_MEMBER", "GUEST", "PUBLIC"]
        "member_portfolio": member_portfolio,
        "rights": ["ADD/EDIT", "VIEW", "COMMENT", "APPROVE"],
        "display": ["before_processing_this_step", "after_processing_this_step", "only_in_this_step", "in_all_steps"],
        "location": ["Mumbai", "Bombay"]
        "limit": "" ["1hour", "2hour", "12hours", "24hours"],
        "period": "" [ start_time-end_time]
        "start_time": "START_DATE_AND_TIME",
        "end_time":    "END_DATE_AND_TIME",
        "reminder": ["EVERY_HOUR", "EVERY_DAY"],
    },{
    }]}
ACTION - Update Workflow Process. 
"""


@api_view(["POST"])
def connect_wf_to_document(request):
    connect_res = update_wf_process(
        workflow_id=request.data["workflow_id"], workflow=request.data["workflow"]
    )
    if not connect_res:
        return Response(
            {"message": "Failed To Connect Workflow"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    return Response({"message": "Workflow Connected"}, status=status.HTTP_200_OK)


"""
4. Check Workflows before processing.
process: ["content_wise", "member_wise", "workflow_step_wise", "location_wise", "time_wise"] - 1st process will be set to option.
ACTION - Sort Process

"""


def sort_steps(steps, criteria):
    # Sort the steps according to the specified criteria
    if criteria == "time":
        return sorted(steps, key=lambda x: x["time"])

    elif criteria == "location":
        return sorted(steps, key=lambda x: x["location"])

    elif criteria == "location":
        return sorted(steps, key=lambda x: x["location"])
    else:
        # Return the steps in their original order if no criteria is specified or if the specified criteria is invalid
        return steps


@api_view(["POST"])
def sort_processing(request):
    pass


"""
5. Process Document.
- Remove Workfow from document
ACTION - Remove workflow
- document processing by choice
Choice: [ MEMBER, WORKFLOW, WORKFLOW_STEPS, DOCUMENT_CONTENT, LOCATION, TIME_LIMIT ]
ACTION - Start Processing
"""


def process_document(workflow, document):
    # Iterate over the workflow steps
    for step in workflow["steps"]:
        # Check if the current step should be skipped
        if step["skip"]:
            continue

        # Check if the current step applies to the current user
        if not check_user_permissions(step):
            continue

        # Check if the current step is within the allowed time period
        if not check_time_period(step):
            continue

        # Check if the current step is within the allowed location
        if not check_location(step):
            continue

        # Apply the current step to the document
        document = apply_step(step, document)

    # Return the final version of the document
    return document


"""
Check if the workflow has moved through given steps.
"""


def check_time_period(step):
    pass


def check_user_permissions(step):
    pass


def apply_step(step):
    pass


def check_location(step):
    pass


"""
Remove Workflow Process from document
I- workflows id
O - response
"""


@api_view(["POST"])
def remove_workflow(request):  # Check if the workflow has moved through given steps.
    pass


# -------------------------helpers-----------------
