from app.utils.mongo_db_connection import get_wf_object
import json
from app.models import WorkflowAiSetting
from app.serializers import (
    WorkflowAiSettingSerializer
)
def processing_complete(process):
    """
    complete document and mark as complete
    """
    # check if all process steps are marked finalized
    complete = False
    if process["isSuccess"]:
        complete = process["isSuccess"]
    return complete


def get_step(sid, step_name):
    data = get_wf_object(sid)["workflows"]["steps"]
    # the_step=None
    for step in data:
        if step_name == step["step_name"]:
            return step

def CREATE_WF_AI_SETTING(data):
    """
    Save Workflow Setting

    Args:
        data(dict): the details of the setting
        

    Returns:
        msg(str): response success
    """
    msg = "WF_Setting Saved"
    
    # wf_setting = {
        
    #     "company_id": data["company_id"],
    #     "created_by": data["created_by"],
    #     "Process" : data["Process"],
    #     "Documents" : data["Documents"],
    #     "Templates" : data["Templates"],
    #     "Workflows" : data["Workflows"],
    #     "Notarisation" : data["Notarisation"],
    #     "Folders" : data["Folders"],
    #     "Records" : data["Records"],
    #     "References" : data["References"],
    #     "Approval_Process" : data["Approval_Process"],
    #     "Evaluation_Process" : data["Evaluation_Process"],
    #     "Reports" : data["Reports"],
    #     "Management" : data["Management"],
    # }
    serializer = WorkflowAiSettingSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return WorkflowAiSettingSerializer(serializer).data
    


    return None

