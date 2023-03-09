import json
import time

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from app.utils.mongo_db_connection import (
    save_wf,
    get_wf_object,
    get_wf_list,
    update_wf,
    delete_workflow,
    

)

from app.utils.thread_start import ThreadAlgolia, UpdateThreadAlgolia




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


