import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import dpath

from .mongo_db_connection import save_wf_setting,get_wf_setting_object,wf_setting_update

def versioning(version):
    if version.startswith("New"):
        version=version.removeprefix("New ")
    else:
        version=version.removeprefix("Latest ")
    return version
def version_control(version):
    status=version.split(" ")[0]
    version=version.split(" ")[-1].split(".")
    
    if version[1] != '9':
        version[1] = str(int(version[1])+1)
    
    elif version[1] == '9' and version[-1] != '9':
        version[-1]=str(int(version[-1])+1)
        
    elif version[1]=='9' and version[-1]=='9':
        version[0]=str(int(version[0])+1)
        version[1]='0' 
        version[-1]='0'
    
    else:
        version[0]=str(int(version[0])+1)
    latest= "Latest "+".".join(version)
    return latest
@api_view(["POST"])
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
            version="New 1.0.0"
            username= form["username"]
            portfolio_name=form["portfolio_name"]
            process=form["proccess"]

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
            




@api_view(["POST"])
def get_wf_ai_setting(request):
    if request.method == "POST":
        form = request.data
        if not form:
            return Response(
                {"message": "Workflow AI Setting ID required"},
                status=status.HTTP_200_OK,
            )
        try:
            return Response(
            {"workflow_ai_setting":get_wf_setting_object(form["wf_setting_id"])},
            status=status.HTTP_200_OK,
            )
        except:
            return Response(
        {"workflow_ai_setting":[],"message": "Failed to get response"},
        status=status.HTTP_200_OK,
    )

@api_view(["POST"])
def update_WFAI_setting(request):  # Document Creation.
    if request.method == "POST":
        form = request.data
        if not form:
            return Response(
                {"workflow":[],"message": "Workflow Data is required for Update"},
                status=status.HTTP_200_OK,
            )
        else:
            old_wf_setting=get_wf_setting_object(form["wf_setting_id"])
            # print(old_wf_setting)
            arch_wf=json.loads(save_wf_setting(old_wf_setting['company_id'], 
                                                old_wf_setting['owner_name'], 
                                                versioning(old_wf_setting['version']),
                                                old_wf_setting['username'],
                                                old_wf_setting['portfolio_name'],
                                                old_wf_setting['process']))

            old_wf_setting['process']=form["proccess"]
            old_wf_setting['version']= version_control(old_wf_setting['version'])
            
            

            
            updt_wf = json.loads(wf_setting_update(form["wf_setting_id"],old_wf_setting)
                                                    )
            
           
            if updt_wf["isSuccess"]:
                try:
                    return Response(
                        {
                        "WF_Setting_Updated":get_wf_setting_object(form["wf_setting_id"])
                        # ,"WF_Setting_Archived":get_wf_setting_object(arch_wf['inserted_id'])
                        },

                        status=status.HTTP_201_CREATED,
                        )
                except:
                    return Response(
                        {"workflow":[],"message": "Failed to Update Workflow"},
                        status=status.HTTP_200_OK,
                        )
