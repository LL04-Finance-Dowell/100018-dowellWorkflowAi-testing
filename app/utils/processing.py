import json
from threading import Thread

from rest_framework import status
from rest_framework.response import Response

from app.utils.helpers import cloning_document, register_user_access
from app.utils.mongo_db_connection import (
    authorize,
    finalize,
    get_document_object,
    save_process_links,
    save_process_qrcodes,
    save_wf_process,
    update_document_clone,
    update_wf_process,
)
from app.utils.verification import Verification

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
            public_portfolio = step.get("stepPublicMembers", [])[
                0].get("portfolio")
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
        + process["process_steps"][0].get("stepUserMembers", [])


    ]
    public_viewers = [m["member"]
                      for m in process["process_steps"][0].get("stepPublicMembers", [])]
   
    doc_id = process["parent_item_id"]
    if len(viewers) or len(public_viewers) > 0:
        clone_id = cloning_document(doc_id, viewers, doc_id, process["_id"])
        clone_ids = [clone_id]

        for user in viewers:
            process["process_steps"][0].get("stepDocumentCloneMap").append(
                {user: clone_id}
            )
        public_clone_ids = []

        for public_user in public_viewers:
            public_clone_ids.append({public_user: cloning_document(
                doc_id, public_user, doc_id, process["_id"])})

        process["process_steps"][0].get(
            "stepDocumentCloneMap").extend(public_clone_ids)
        clone_ids.extend(public_clone_ids)
        Thread(
            target=lambda: save_process_links(
                links=links,
                process_id=process["_id"],
                item_id=clone_ids,
                company_id=process["company_id"],
            )
        ).start()

        Thread(
            target=lambda: update_wf_process(
                process_id=process["_id"],
                steps=process["process_steps"],
                state="processing",
            )
        ).start()

        Thread(
            target=lambda: save_process_qrcodes(
                qrcodes,
                process["_id"],
                clone_ids,
                process["processing_action"],
                process["process_title"],
                process["company_id"],
            )
        ).start()
        return Response(
            {"links": links, "qrcodes": qrcodes,  "public_links": public_links},
            status.HTTP_200_OK,
        )
    return Response("processing failed!", status.HTTP_500_INTERNAL_SERVER_ERROR)


class Background:
    viewers = []
    copies = []
    clones = []

    def __init__(self, process, item_type, item_id, role, username):
        self.process = process
        self.item_type = item_type
        self.item_id = item_id
        self.role = role
        self.username = username

    @staticmethod
    def check_state(items):
        return [get_document_object(i)["document_state"] == "finalized" for i in items]

    @classmethod
    def assign_task(cls, clone_map, users, process_id, item_type):
        for cm in clone_map:
            docs = list(cm.values())

        for docid in docs:
            for usr in users:
                cls.viewers.append(usr)
                authorize(docid, cls.viewers, process_id, item_type)
                clone_map.append({usr: docid})

        return

    @classmethod
    def request_task(cls, item_id, parent_item_id, process_id, users, clone_map):
        cls.copies += [
            {
                u["member"]: cloning_document(
                    item_id,
                    u["member"],
                    parent_item_id,
                    process_id,
                )
            }
            for u in users
        ]
        for cp in cls.copies:
            clone_map["stepDocumentCloneMap"].append(cp)

        return cls.copies

    @classmethod
    def first_step_state(cls, process):
        step = process["process_steps"][0]
        public = [m["member"] for m in step.get("stepPublicMembers", [])]
        users = [
            m["member"]
            for m in step.get("stepTeamMembers", []) + step.get("stepUserMembers", [])
        ]

        if users:
            for usr in users:
                for dmap in step["stepDocumentCloneMap"]:
                    if dmap.get(usr) is not None:
                        cls.clones.append(dmap.get(usr))

            d_states = all(cls.check_state(cls.clones))

        if public and users == []:
            for usr in public:
                for dmap in step["stepDocumentCloneMap"]:
                    if dmap.get(usr) is not None:
                        cls.clones.append(dmap.get(usr))

            d_states = all(cls.check_state(cls.clones))

        return d_states

    def update_clone_list(parent_item_id, clone_ids):
        document = get_document_object(parent_item_id)
        clone_list = document["clone_list"]
        for c in clone_ids:
            clone_list.append(c)

        update_document_clone(parent_item_id, clone_list)
        return

    def processing(self):
        Thread(
            target=lambda: register_user_access(
                self.process["process_steps"], self.role, self.username
            )
        ).start()
        try:
            no_of_steps = sum(
                isinstance(e, dict) for e in self.process["process_steps"]
            )
            if not Background.first_step_state(self.process):
                return

            else:
                if no_of_steps == 2:
                    step = self.process["process_steps"][1]
                    users = [
                        m["member"]
                        for m in step.get("stepTeamMembers", [])
                        + step.get("stepPublicMembers", [])
                        + step.get("stepUserMembers", [])
                    ]

                    if step["stepDocumentCloneMap"]:
                        for usr in users:
                            for dmap in step["stepDocumentCloneMap"]:
                                if dmap.get(usr) is not None:
                                    Background.clones.append(dmap.get(usr))

                        d_states = all(Background.check_state(Background.clones))

                    else:
                        if step["stepTaskType"] == "assign_task":
                            Background.assign_task(
                                step["stepDocumentCloneMap"],
                                users,
                                self.process["_id"],
                                self.item_type,
                            )

                        if step["stepTaskType"] == "request_for_task":
                            copies = Background.request_task(
                                self.item_id,
                                self.process["parent_item_id"],
                                self.process["_id"],
                                step["stepDocumentCloneMap"],
                            )

                            Background.update_clone_list(
                                self.process["parent_item_id"],
                                [d["member"] for d in copies if "member" in d],
                            )

                    update_wf_process(
                        process_id=self.process["_id"],
                        steps=self.process["process_steps"],
                        state=self.process["processing_state"],
                    )

                    if not d_states:
                        if no_of_steps == 3:
                            step = self.process["process_steps"][2]
                            users = [
                                m["member"]
                                for m in step.get("stepTeamMembers", [])
                                + step.get("stepPublicMembers", [])
                                + step.get("stepUserMembers", [])
                            ]

                            if step["stepDocumentCloneMap"]:
                                for usr in users:
                                    for dmap in step["stepDocumentCloneMap"]:
                                        if dmap.get(usr) is not None:
                                            Background.clones.append(dmap.get(usr))

                                d_states = all(
                                    Background.check_state(Background.clones)
                                )

                            else:
                                if step["stepTaskType"] == "assign_task":
                                    Background.assign_task(
                                        step["stepDocumentCloneMap"],
                                        users,
                                        self.process["_id"],
                                        self.item_type,
                                    )

                                if step["stepTaskType"] == "request_for_task":
                                    copies = Background.request_task(
                                        self.item_id,
                                        self.process["parent_id"],
                                        self.process["_id"],
                                        step["stepDocumentCloneMap"],
                                    )

                                Background.update_clone_list(
                                    self.process["parent_item_id"],
                                    [d["member"] for d in copies if "member" in d],
                                )

                            update_wf_process(
                                process_id=self.process["_id"],
                                steps=self.process["process_steps"],
                                state=self.process["processing_state"],
                            )
        except:
            finalize(self.item_id, "processing", self.item_type)
            return

        return
