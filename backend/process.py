from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .mongo_db_connection import (
    get_wf_object,
    update_document,
)
"""
----------------------------------------------------------------SET WORKFLOWS IN DOCUMENT--------------------------------------------------------
1.Select a document to add to a workflow.
    - user picks a document from the list 
2.Select a workflow to add to the document.
    - user picks a workflow from workflow list 
- ACTION - Add Workflow to selected document.
"""


@api_view(["POST"])
def add_workflow_to_document(request):
    if not request.data:
        return Response(
            {"message": "Unable to Create Workflow"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    document_id = request.data["document_id"]
    workflows = request.data["workflows"]  # Will be a list of wfs ids
    if len(workflows) == 1:
        workflow_id = workflows[0]
        workflow = get_wf_object(workflow_id)
        if not workflow:
            return Response(
                {"message": "Unable to Create Workflow"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        add_res = update_document(document_id=document_id, data=workflow)
        if add_res["isSuccess"]:
            return Response(
                {"message": "Added Workflows to Document"}, status=status.HTTP_200_OK
            )
    else:
        for wf in workflows:
            workflow = get_wf_object(wf)
            if not workflow:
                return Response(
                    {"message": "Unable to Create Workflow"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            add_res = update_document(document_id=document_id, data=workflow)
            if add_res["isSuccess"]:
                return Response(
                    {"message": "Added Workflows to Document"},
                    status=status.HTTP_200_OK,
                )
    return Response(
        {" message": "Failed to add workflows to document"},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )


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
ACTION - Update Workflow in document.
"""


@api_view(["POST"])
def connect_wf_to_document(request):
    if not request.data:
        return Response(
            {"message": "Unable to Create Workflow"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    document_id = request.data["document_id"]
    skip = request.data["skip"]
    member_type = request.data["member_type"]
    member_portfolio = request.data["member_portfolio"]
    rights = request.data["rights"]
    display = request.data["display"]
    location = request.data["location"]
    limit = request.data["limit"]
    period = request.data["period"]
    start_time = request.data["start_time"]
    end_time = request.data["end_time"]
    reminder = request.data["reminder"]

    payload = {
        "skip": skip,
        "member_type": member_type,
        "member_portfolio": member_portfolio,
        "rights": rights,
        "display": display,
        "location": location,
        "limit": limit,
        "period": period,
        "start_time": start_time,
        "end_time": end_time,
        "reminder": reminder,
    }

    connect_res = update_document(document_id=document_id, data=payload)
    if connect_res["isSuccess"]:
        return Response({"message": "Workflow Connected"}, status=status.HTTP_200_OK)

    return Response(
        {"message": "Failed To Connect Workflow"},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )


"""
4. Check Workflows before processing.
process: ["content_wise", "member_wise", "workflow_step_wise", "location_wise", "time_wise"] - 1st process will be set to option.
ACTION - Sort Process
5. Process Document.
- Remove Workfow from document
ACTION - Remove workflow
- document processing by choice
Choice: [ MEMBER, WORKFLOW, WORKFLOW_STEPS, DOCUMENT_CONTENT, LOCATION, TIME_LIMIT ]
ACTION - Start Processing
"""


@api_view(["POST"])
def processing(request):
    pass


"""
Check if the workflow has moved through given steps.
"""


@api_view(["POST"])
def verify_workflow(request):
    pass


"""
Remove Workflow Process from document
"""


@api_view(["POST"])
def remove_workflow(request):  # Check if the workflow has moved through given steps.
    pass
