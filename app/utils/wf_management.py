from app.utils.mongo_db_connection import get_wf_object


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
