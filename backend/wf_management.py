import json
import requests

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .mongo_db_connection import (
    save_wf,
    save_wf_new,
    get_wf_object,
    get_wf_list,
    get_user_info_by_username,
    get_members,
    get_user,
    update_document,
)


editorApi = "https://100058.pythonanywhere.com/api/generate-editor-link/"

# print(get_template_object("6365f9c2ff915c925f3a67f4"))
@api_view(["GET", "POST"])
def create_workflow(request):  # Document Creation.

    if request.method == "POST":
        data = ""
        form = request.data  # TODO: We will get the data from form 1 by 1 - Dont Worry.
        if not form:
            return Response(
                {"message": "Failed to process Workflow creation."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        else:
            created_by = request.data["created_by"]
            company_id = request.data["company_id"]
            wf_name = request.data["wf_name"]
            step_name = request.data["step_name"]
            rights = request.data["rights"]
            display_before = request.data["display_before"]
            skip = request.data["skip"]
            limit = request.data["limit"]
            start_time = request.data["start_time"]
            end_time = request.dat["end_time"]
            user = get_user_info_by_username(created_by)[""]
            member_portfolio = request.data["member_portfolio"]
            member_type = request.data["member_type"]
            data = {
                "workflow_title": wf_name,
                "workflows": [
                    {
                        "step_name": step_name,
                        "skip": skip,  # True or False,
                        "member_type": member_type,  #    values can be "TEAM_MEMBER" or "GUEST",
                        "member_portfolio": member_portfolio,
                        "rights": rights,  #    values can be ["ADD/EDIT", "VIEW", "COMMENT", "APPROVE"],
                        "display_before": display_before,  # true or false,
                        "location": "",
                        "limit": limit,
                        "start_time": start_time,
                        "end_time": end_time,
                        "reminder": "",
                    }
                ],
            }

            # data = get_content_from_template_collection_with_that_template_id
            res = json.loads(save_wf_new(data, created_by, company_id))

            if res["isSuccess"]:

                payload = json.dumps(
                    {
                        "product_name": "workflowai",
                        "details": {
                            "_id": res["inserted_id"],
                            "field": "wf_name",
                            "cluster": "Documents",
                            "database": "Documentation",
                            "collection": "WorkflowReports",
                            "document": "workflowreports",
                            "team_member_ID": "33689044433",
                            "function_ID": "ABCDE",
                            "command": "update",
                            "content": data,
                            "update_field": {"workflow_title": wf_name},
                        },
                    }
                )
                headers = {"Content-Type": "application/json"}

                editor_link = requests.request(
                    "POST", editorApi, headers=headers, data=payload
                )
                try:
                    return Response(
                        editor_link.json(),
                        status=status.HTTP_201_CREATED,
                    )
                except:
                    return Response(
                        {"message": "Failed to call editorApi"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )
            return Response(
                {"message": "Unable to Create Workflow"},
                status=status.HTTP_405_METHOD_NOT_ALLOWED,
            )

    return Response(
        {"message": "You Need To Be LoggedIn"}, status=status.HTTP_400_BAD_REQUEST
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
