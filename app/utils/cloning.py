import json

from app.utils.mongo_db_connection import (
    get_document_object,
    save_document,
)


def document(document_id, auth_viewer, parent_id, process_id):
    """
    Creates a copy of a document

    Args:
        document_id (str): the object id of the document to be replicated.
        auth_viewer (str | None): the username to be authorized.
        parent_id (str): thr parent document object id.
        process_id (str | None): object id of a process

    Returns:
        inserted_id (str):
    """
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
        print("Success Cloning \n")
        return save_res["inserted_id"]
    except RuntimeError:
        print("Failed to create clone \n")
        return
