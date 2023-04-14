import json

from app.utils.mongo_db_connection import (
    get_document_object,
    save_document,
    save_wf_process,
    get_process_object,
)


def process(process_id):
    try:
        process = get_process_object(process_id)
        process_kind = "clone"
        save_res = json.loads(
            save_wf_process(
                process["process_title"],
                process["process_steps"],
                process["created_by"],
                process["company_id"],
                process["data_type"],
                process["parent_document_id"],
                process["processing_action"],
                process["creator_portfolio"],
                process["workflow_construct_ids"],
                process["process_type"],
                process_kind,
            )
        )
    except:
        print("Failed to create clone \n")
        return

    return save_res["inserted_id"]


def document(document_id, auth_viewer, parent_id, process_id):
    """Creates a copy of a document"""
    try:
        viewers = []
        document = get_document_object(document_id)
        if auth_viewer is not None:
            viewers.append(auth_viewer)
        else:
            viewers = []

        # create new doc
        save_res = json.loads(
            save_document(
                name=document["document_name"],
                data=document["content"],
                page=document["page"],
                created_by=document["created_by"],
                company_id=document["company_id"],
                data_type=document["data_type"],
                state="processing",
                auth_viewers=viewers,
                document_type="clone",
                parent_id=parent_id,
                process_id=process_id,
            )
        )
    except RuntimeError:
        print("Failed to create clone \n")
        return

    return save_res["inserted_id"]
