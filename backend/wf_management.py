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
    get_members,
    get_user,
    update_document,
    get_document_object,
    save_wf_process,
    update_wf,
)
editorApi = "https://100058.pythonanywhere.com/api/generate-editor-link/"
# print(get_wf_list("6365ee18ff915c925f3a6691"))
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
                step_name= step['step_name']
                rights      =   step['rights']
                display_before = step['display_before']
                skip    =        step['skip']   
                limit   = step["limit"]
                start_time =  step['start_time']
                end_time =step['end_time']
                member_portfolio = step['member_portfolio']
                member_type = step['member_type']
                reminder = step["reminder"]
                data["steps"].append( 
                    {
                            "step_name"        : step_name,
                            "skip"            : skip, # True or False,
                            "member_type"    : member_type, #    values can be "TEAM_MEMBER" or "GUEST",
                            "member_portfolio": member_portfolio,
                            "rights"        : rights, #    values can be ["ADD/EDIT", "VIEW", "COMMENT", "APPROVE"],
                            "display_before": display_before, # true or false,
                            "location"    :     "",
                            "limit"    : limit,
                            "start_time": start_time,
                            "end_time":    end_time,
                            "reminder":reminder
                        }
                ) 
            res = json.loads(save_wf(data, created_by, company_id))
            if res["isSuccess"]:
                try:
                    return Response(
                        {"workflow":get_wf_object(res["inserted_id"])},
                        status=status.HTTP_201_CREATED,
                        )
                except:
                    return Response(
                        {"message": "Failed to Save Workflow"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        )
@api_view(["POST"])
def update_workflow(request):  # Document Creation.
    if request.method == "POST":
        form = request.data
        if not form:
            return Response(
                {"message": "Workflow Data is required for Update"},
                status=status.HTTP_404_NOT_FOUND,
            )
        else:

            wf_title =       form["workflow_title"]
            workflow_id =    form["workflow_id"]
            steps  =   form['steps']
            old_data = get_wf_object(workflow_id)
            
            workflows={
                "workflow_title": wf_title,
                "steps": []
                     }
            
            
            for (step,old_step) in zip(steps,old_data['workflows']['steps']):
                step_name= step['step_name']
                
                workflows["steps"].append( 
                    {
                            "step_name"        : step_name,
                            "skip"            : old_step['skip'], # True or False,
                            "member_type"    : old_step['member_type'], #    values can be "TEAM_MEMBER" or "GUEST",
                            "member_portfolio": old_step['member_portfolio'],
                            "rights"        : old_step['rights'], #    values can be ["ADD/EDIT", "VIEW", "COMMENT", "APPROVE"],
                            "display_before": old_step['display_before'], # true or false,
                            "location"    :     "",
                            "limit"    : old_step['limit'],
                            "start_time": old_step['start_time'],
                            "end_time":    old_step['end_time'],
                            "reminder": old_step['reminder']
                            
                        }
                ) 
            res = json.loads(update_wf(workflow_id, workflows['workflow_title'], workflows['steps']))

            if res["isSuccess"]:
                try:
                    return Response(
                        {"workflow":get_wf_object(workflow_id)},
                        status=status.HTTP_201_CREATED,
                        )
                except:
                    return Response(
                        {"message": "Failed to Update Workflow"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        )

@api_view(["POST"])
def workflow_detail(request):  # Single document
    if request.method == "POST":
        workflow_id = request.data["workflow_id"]
        data = get_wf_object(workflow_id)
        if not request.data:
            return Response(
                {"message": "Failed to Load Workflow."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
       
        try:
            return Response(
            {"workflow":data},
            status=status.HTTP_201_CREATED,
            )
        except:
            return Response(
        {"message": "Failed to get response"},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
           
    return Response(
        {"message": "This Workflow is Not Loaded."}, status=status.HTTP_400_BAD_REQUEST
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
                {"message": "There is no Workflow created by This user."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        else:
            for wf in workflows:
                    
                    if wf['created_by'] == created_by:
                        filtered_list.append(wf)

        return Response(
            {"Workflows": filtered_list, "title": "My Workflows"}, status=status.HTTP_200_OK
        )

