import json
from threading import Thread

from rest_framework import status
from rest_framework.response import Response

from app.utils.helpers import cloning_document
from app.utils.mongo_db_connection import (
    save_process_links,
    save_process_qrcodes,
    save_wf_process,
    update_wf_process,
)


class Process:
    process_kind = "original"

    def __init__(
        self,
        workflows,
        created_by,
        portfolio,
        company_id,
        process_type,
        org_name,
        workflow_ids,
        parent_id,
        data_type,
    ):
        self.workflows = workflows
        self.created_by = created_by
        self.portfolio = portfolio
        self.company_id = company_id
        self.process_type = process_type
        self.org_name = org_name
        self.workflow_ids = workflow_ids
        self.data_type = data_type
        self.parent_id = parent_id
        self.process_steps = [
            step for workflow in workflows for step in workflow["workflows"]["steps"]
        ]
        self.process_title = " - ".join(
            [workflow["workflows"]["workflow_title"] for workflow in workflows]
        )

    def normal_process(self, action):
        res = json.loads(
            save_wf_process(
                self.process_title,
                self.process_steps,
                self.created_by,
                self.company_id,
                self.data_type,
                self.parent_id,
                action,
                self.portfolio,
                self.workflow_ids,
                self.process_type,
                Process.process_kind,
            )
        )
        if res["isSuccess"]:
            return {
                "process_title": self.process_title,
                "process_steps": self.process_steps,
                "processing_action": action,
                "created_by": self.created_by,
                "company_id": self.company_id,
                "data_type": self.data_type,
                "parent_item_id": self.parent_id,
                "_id": res["inserted_id"],
                "process_type": self.process_type,
                "process_kind": Process.process_kind,
                "org_name": self.org_name,
            }

    def test_process(self, action):
        data_type = "Testing_Data"
        res = json.loads(
            save_wf_process(
                self.process_title,
                self.process_steps,
                self.created_by,
                self.company_id,
                data_type,
                self.parent_id,
                action,
                self.portfolio,
                self.workflow_ids,
                self.process_type,
                Process.process_kind,
            )
        )
        if res["isSuccess"]:
            return {
                "process_title": self.process_title,
                "process_steps": self.process_steps,
                "processing_action": action,
                "created_by": self.created_by,
                "company_id": self.company_id,
                "data_type": data_type,
                "parent_item_id": self.parent_id,
                "_id": res["inserted_id"],
                "process_type": self.process_type,
                "process_kind": Process.process_kind,
                "org_name": self.org_name,
            }

        if res["isSuccess"]:
            return {
                "process_title": self.process_title,
                "process_steps": self.process_steps,
                "processing_action": action,
                "created_by": self.created_by,
                "company_id": self.company_id,
                "data_type": self.data_type,
                "parent_item_id": self.parent_id,
                "_id": res["inserted_id"],
                "process_type": self.process_type,
                "process_kind": Process.process_kind,
                "org_name": self.org_name,
            }
        return


def start_process(process):
    """Start the processing cycle."""
    verification = Verification(
        process["_id"],
        process["parent_item_id"],
        process["company_id"],
        process["process_type"],
        process["org_name"],
    )
    links = []
    public_links = []
    qrcodes = []

    for step in process["process_steps"]:
        for member in step.get("stepPublicMembers", []):
            link, qrcode = verification.user_team_public_data(
                member["member"],
                step.get("stepRole"),
                member["portfolio"],
                "public",
            )
            links.append({member["member"]: link})
            qrcodes.append({member["member"]: qrcode})

        for member in step.get("stepTeamMembers", []):
            link, qrcode = verification.user_team_public_data(
                member["member"],
                step.get("stepRole"),
                member["portfolio"],
                "team",
            )
            links.append({member["member"]: link})
            qrcodes.append({member["member"]: qrcode})

        for member in step.get("stepUserMembers", []):
            link, qrcode = verification.user_team_public_data(
                member["member"],
                step.get("stepRole"),
                member["portfolio"],
                "user",
            )
            links.append({member["member"]: link})
            qrcodes.append({member["member"]: qrcode})

        public_users = [m["member"] for m in step.get("stepPublicMembers", [])]
        if public_users:
            public_portfolio = step.get("stepPublicMembers", [])[0].get("portfolio")
            link, qrcode = verification.public_bulk_data(
                public_users,
                step.get("stepRole"),
                public_portfolio,
                "bulk_public",
            )
            public_links.append({public_portfolio: link})

    viewers = [
        member["member"]
        for member in process["process_steps"][0].get("stepTeamMembers", [])
        + process["process_steps"][0].get("stepPublicMembers", [])
        + process["process_steps"][0].get("stepUserMembers", [])
    ]
    doc_id = process["parent_item_id"]
    if len(viewers) > 0:
        clone_id = cloning_document(doc_id, viewers, doc_id, process["_id"])
        for user in viewers:
            process["process_steps"][0].get("stepDocumentCloneMap").append(
                {user: clone_id}
            )
        Thread(
            target=lambda: update_wf_process(
                process_id=process["_id"],
                steps=process["process_steps"],
                state="processing",
            )
        ).start()

        Thread(
            target=lambda: save_process_links(
                links=links,
                process_id=process["_id"],
                item_id=clone_id,
                company_id=process["company_id"],
            )
        ).start()

        Thread(
            target=lambda: save_process_qrcodes(
                qrcodes,
                process["_id"],
                clone_id,
                process["processing_action"],
                process["process_title"],
                process["company_id"],
            )
        ).start()

        return Response(
            {"links": links, "qrcodes": qrcodes, "public_links": public_links},
            status.HTTP_200_OK,
        )

    return Response("processing failed!", status.HTTP_500_INTERNAL_SERVER_ERROR)
