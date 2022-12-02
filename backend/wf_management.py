import json
import timeit
import itertools
import requests
import jwt

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
)


editorApi = "https://100058.pythonanywhere.com/api/generate-editor-link/"
    
# print(get_template_object("6365f9c2ff915c925f3a67f4")) 
@api_view(["GET","POST"])
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
            created_by =    request.data["created_by"]
            company_id =    request.data["company_id"]
            wf_name =       request.data["wf_name"]
            step_name   =   request.data['step_name']
            rights      =   request.data['rights']
            display_before = request.data['display_before']
            skip    =        request.data['skip']   
            limit   = request.data["limit"]
            start_time =  request.data['start_time']
            end_time =request.data['end_time']
            # user=get_user_info_by_username(created_by)['']
            member_portfolio = request.data['member_portfolio']
            member_type = request.data['member_type']
            data={
                
                "workflow_title": wf_name,
                "steps": [
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
                            "reminder": "",
                }
                    ]
                        }

            
            res = json.loads(
                save_wf_new(data, created_by, company_id)
            )
            
            if res["isSuccess"]:

                # payload=json.dumps({
                #         "product_name": "workflowai",
                #         "details":{
                #             "_id":res["inserted_id"],
                #             "field":"wf_name",
                #             "cluster": "Documents",
                #             "database": "Documentation",
                #             "collection": "WorkflowReports",
                #             "document": "workflowreports",
                #             "team_member_ID": "33689044433",
                #             "function_ID": "ABCDE",
                #             "command": "update",
                #             "content":data,
                #             "update_field": {
                #                             "workflow_title":wf_name
                #                             }
                #         }
                #         })
                # headers = {
                #             'Content-Type': 'application/json'
                #             }
                        
                # editor_link = requests.request("POST", editorApi, headers=headers, data=payload)  
                try:
                    return Response(
                   data,
                    status=status.HTTP_201_CREATED,
                    )
                except:
                    return Response(
                {"message": "Failed to call Save Workflow"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
            return Response(
                {"message": "Unable to Create Workflow"},
                status=status.HTTP_405_METHOD_NOT_ALLOWED,
            )

    return Response(
        {"message": "You Need To Be LoggedIn"}, status=status.HTTP_400_BAD_REQUEST
    )
