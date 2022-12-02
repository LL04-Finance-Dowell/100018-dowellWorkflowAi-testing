import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .mongo_db_connection import (
    save_wf,
    get_wf_object,
    get_wf_list,
    get_user_info_by_username,
    get_members,
    get_user,
    update_document,
)

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
            company_id =    form["company_id"]
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
            

    
