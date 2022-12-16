import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import requests
from .mongo_db_connection import (
    save_wf,
    get_wf_object,
    get_wf_list,
    get_user_info_by_username,
    get_user,
    update_document,
    get_document_object,
    save_wf_process,
    update_wf,
)

editorApi = "https://100058.pythonanywhere.com/api/generate-editor-link/"
# print(get_wf_object("638f29a4e28ad31e353b8d6d"))
def get_step(id,step_name):
    data=get_wf_object(id)['workflows']['steps']
    #the_step=None
    for step in data:
        if step_name == step['step_name']:
            return step

@api_view(["POST"])
def create_workflow(request):  # Document Creation.
    
    if request.method == "POST":
        form = request.data
        if not form:
            return Response(
                {"message": "Workflow Data required"},
                status=status.HTTP_404_NOT_FOUND,
            )
        else:
            created_by =    form["created_by"]
            company_id =    form['company_id']
            wf_name =       form["wf_title"]
            steps  =   form['steps']
            
            data={
                "workflow_title": wf_name,
                "steps": []
                        }
            for step in steps:
                data["steps"].append( 
                    {
                            "step_name"        : step['step_name'],
                            "role"        : step["role"],
                            "table_of_content":"",
                            "skip"            : step['skip'], # True or False,
                            "member_type"    : step['member_type'], #    values can be "TEAM_MEMBER" or "GUEST",
                            "member_portfolio": step['member_portfolio'],
                            "rights"        : step['rights'], #    values can be ["ADD/EDIT", "VIEW", "COMMENT", "APPROVE"],
                            "display_before": step['display_before'], # true or false,
                            "location"    :     "",
                            "limit"    : step["limit"],
                            "start_time": step['start_time'],
                            "end_time":    step['end_time'],
                            "reminder":step["reminder"]
                        }
                ) 
            res = json.loads(save_wf(data, created_by, company_id))
            if res["isSuccess"]:
                try:
                    return Response(
                        {"workflow":get_wf_object(res["inserted_id"]),},
                        status=status.HTTP_201_CREATED,
                        )
                except:
                    return Response(
                        {"workflow":[],"message": "Failed to Save Workflow"},
                        status=status.HTTP_200_OK,
                        )
@api_view(["POST"])
def update_workflow(request):  # Document Creation.
    if request.method == "POST":
        form = request.data
        if not form:
            return Response(
                {"workflow":[],"message": "Workflow Data is required for Update"},
                status=status.HTTP_200_OK,
            )
        else:
            workflow={
                "workflow_title": form["wf_title"],
                "workflow_id": form["workflow_id"],
                "steps": []
                        }
            for step in form['steps']:
                workflow["steps"].append( 
                    {
                            "step_name"        : step['step_name'],
                            "role"        : step["role"],
                            "table_of_content":"",
                            "skip"            : step['skip'], # True or False,
                            "member_type"    : step['member_type'], #    values can be "TEAM_MEMBER" or "GUEST",
                            "member_portfolio": step['member_portfolio'],
                            "rights"        : step['rights'], #    values can be ["ADD/EDIT", "VIEW", "COMMENT", "APPROVE"],
                            "display_before": step['display_before'], # true or false,
                            "location"    :     "",
                            "limit"    : step["limit"],
                            "start_time": step['start_time'],
                            "end_time":    step['end_time'],
                            "reminder":step["reminder"]
                        }
                ) 
            res = json.loads(update_wf(form["workflow_id"], workflow['workflow_title'], workflow['steps']))

            if res["isSuccess"]:
                try:
                    return Response(
                        {"workflow":workflow},
                        status=status.HTTP_201_CREATED,
                        )
                except:
                    return Response(
                        {"workflow":[],"message": "Failed to Update Workflow"},
                        status=status.HTTP_200_OK,
                        )

@api_view(["POST"])
def workflow_detail(request):  # Single document
    if request.method == "POST":
        workflow_id = request.data["workflow_id"]
        data = get_wf_object(workflow_id)
        if not request.data:
            return Response(
                {"workflow":[],"message": "Failed to Load Workflow."},
                status=status.HTTP_200_OK,
            )
        
       
        try:
            return Response(
            {"workflow":data},
            status=status.HTTP_201_CREATED,
            )
        except:
            return Response(
        {"workflow":[],"message": "Failed to get response"},
        status=status.HTTP_200_OK,
    )
           
    return Response(
        {"workflow":[],"message": "This Workflow is Not Loaded."}, status=status.HTTP_200_OK
    )

@api_view(["POST"])
def my_workflows(request):  # List of my documents.
    filtered_list = []
    if request.method=="POST":
        created_by=request.data['created_by']
        company_id=request.data['company_id']
        workflows = get_wf_list(company_id)
        if not workflows:
            return Response(
                {"workflow":[],"message": "There is no Workflow created by This user."},
                status=status.HTTP_200_OK,
            )
        else:
            for wf in workflows:
                    
                    if wf['created_by'] == created_by:
                        filtered_list.append(wf)

        return Response(
            {"workflow": filtered_list, "title": "My Workflows"}, status=status.HTTP_200_OK
        )

