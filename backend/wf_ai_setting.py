import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import dpath

from mongo_db_connection import save_wf_setting,get_wf_setting_object


@api_view(["GET", "POST"])
def create_workflow_setting(request):  # Document Creation.
    if request.method == "POST":
        form = request.data
        if not form:
            return Response(
                {"message": "Workflow AI Setting Data required"},
                status=status.HTTP_404_NOT_FOUND,
            )
        else:
            
            company_id= form["company_id"]
            owner_name=form["owner_name"]
            version=form["version"]
            username= form["username"]
            portfolio_name=form["portfolio_name"]
            process=form["process"]

            wf_set=json.loads(save_wf_setting(company_id,owner_name,version,username,portfolio_name,process))

            if wf_set["isSuccess"]:
                try:
                    return Response(
                        {"workflow setting":get_wf_setting_object(wf_set["inserted_id"]),},
                        status=status.HTTP_201_CREATED,
                        )
                except:
                    return Response(
                        {"workflow setting":[],"message": "Failed to Save Workflow setting data"},
                        status=status.HTTP_200_OK,
                        )
            
            



