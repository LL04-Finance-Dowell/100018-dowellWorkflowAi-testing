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
)

@api_view(["POST"])
def create_workflow(request):  # Document Creation.
    if request.method == "POST":
        data = ""
        form = request.data  # TODO: We will get the data from form 1 by 1 - Dont Worry.
        if not form:
            return Response(
                {"message": "Workflow Data required"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        else:
            created_by =    form["created_by"]
            company_id =    form["company_id"]
            wf_name =       form["wf_name"]
            step_name   =   form['step_name']
            rights      =   form['rights']
            display_before = form['display_before']
            skip    =        form['skip']   
            limit   = form["limit"]
            start_time =  form['start_time']
            end_time =form['end_time']
            member_portfolio = form['member_portfolio']
            member_type = form['member_type']
            data={
                "workflow_title": wf_name,
                "steps": [{
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
                            "reminder": "",
                        }]
                        }

            
            res = json.loads(
                save_wf(data, created_by, company_id)
            )
            
            if res["isSuccess"]:
                try:
                    return Response(
                        get_wf_object(res["inserted_id"]),
                        status=status.HTTP_201_CREATED,
                        )
                except:
                    return Response(
                        {"message": "Failed to call Save Workflow"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
            

    
