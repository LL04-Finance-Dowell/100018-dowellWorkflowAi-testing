import json
from app.utils.mongo_db_connection import (
    get_document_object,
    get_process_object,
    get_template_object,
    get_wf_object,
    save_document,
    save_template,
    save_workflow,
    save_process,
)


class Clone:
    clone_type = "clone"

    def __init__(self, created_by, portfolio, process_id, company_id):
        self.created_by = created_by
        self.portfolio = portfolio
        self.process_id = process_id
        self.company_id = company_id

    def workflow(self, workflow_id):
        workflow = get_wf_object(workflow_id)
        save_res = json.loads(
            save_workflow(
                workflow["workflows"],
                self.company_id,
                self.created_by,
                self.portfolio,
                workflow["data_type"],
                Clone.clone_type,
            )
        )
        return save_res["inserted_id"]

    def template(self, template_id):
        template = get_template_object(template_id)
        save_res = json.loads(
            save_template(
                template["template_name"],
                template["content"],
                template["page"],
                self.created_by,
                self.company_id,
                template["data_type"],
                Clone.clone_type,
            )
        )
        return save_res["inserted_id"]

    def process(self):
        process = get_process_object(self.process_id)
        save_res = json.loads(
            save_process(
                process["process_title"],
                process["process_steps"],
                self.created_by,
                self.company_id,
                process["data_type"],
                "no_parent_id",
                process["processing_action"],
                self.portfolio,
                process["workflow_construct_ids"],
                process["process_type"],
                Clone.clone_type,
            )
        )
        return save_res["inserted_id"]

    def document(self, document_id, viewers, parent_id, process_id):
        viewers = []
        viewers = (
            [i for i in set(viewers)]
            if viewers is not None and isinstance(viewers, list)
            else []
        )
        document = get_document_object(document_id)
        document_name = "~" + document["document_name"] + "~"
        save_res = json.loads(
            save_document(
                name=document_name,
                data=document["content"],
                page=document["page"],
                created_by=self.created_by,
                company_id=self.company_id,
                data_type=document["data_type"],
                state="processing",
                auth_viewers=viewers,
                document_type=Clone.clone_type,
                parent_id=parent_id,
                process_id=process_id,
            )
        )
        return save_res["inserted_id"]
