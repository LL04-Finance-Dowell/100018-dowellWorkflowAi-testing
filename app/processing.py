import json
from threading import Thread

import requests

from app.constants import EDITOR_API
from app.utils.checks import (
    display_right,
    location_right,
    step_processing_order,
    time_limit_right,
)
from app.utils.helpers import (
    cloning_document,
    register_public_login,
    register_user_access,
)
from app.utils.mongo_db_connection import (
    authorize,
    finalize_item,
    get_document_object,
    get_template_object,
    save_process,
    save_process_links,
    save_process_qrcodes,
    update_document_clone,
    update_process,
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
            save_process(
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
            save_process(
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


class HandleProcess(Verification):
    links = []
    public_links = []
    qrcodes = []

    def __init__(self, process):
        self.process = process
        super().__init__(
            process["_id"],
            process["parent_item_id"],
            process["company_id"],
            process["process_type"],
            process["org_name"],
        )

    @staticmethod
    def get_editor_link(payload):
        link = requests.post(
            EDITOR_API,
            data=json.dumps(payload),
            headers={"Content-Type": "application/json"},
        )
        return link.json()

    @staticmethod
    def prepare_document_for_step_one_users(step, parent_item_id, process_id):
        users = [
            m["member"]
            for m in step.get("stepTeamMembers", []) + step.get("stepUserMembers", [])
        ]
        public = [m["member"] for m in step.get("stepPublicMembers", [])]
        if users:
            clone_id = cloning_document(
                parent_item_id, users, parent_item_id, process_id
            )
            clone_ids = [clone_id]

            for u in users:
                step.get("stepDocumentCloneMap").append({u: clone_id})

        if public:
            public_clone_ids = []
            for u in public:
                public_clone_ids.append(
                    {u: cloning_document(parent_item_id, u, parent_item_id, process_id)}
                )

            step.get("stepDocumentCloneMap").extend(public_clone_ids)
            clone_ids.extend(public_clone_ids)

        return clone_ids

    def start(self):
        process_id = self.process["_id"]
        company_id = self.process["company_id"]
        steps = self.process["process_steps"]
        for step in steps:
            for member in step.get("stepPublicMembers", []):
                link, qrcode = super().user_team_public_data(
                    member["member"],
                    step.get("stepRole"),
                    member["portfolio"],
                    "public",
                )
                HandleProcess.links.append({member["member"]: link})
                HandleProcess.qrcodes.append({member["member"]: qrcode})

            for member in step.get("stepTeamMembers", []):
                link, qrcode = super().user_team_public_data(
                    member["member"],
                    step.get("stepRole"),
                    member["portfolio"],
                    "team",
                )
                HandleProcess.links.append({member["member"]: link})
                HandleProcess.qrcodes.append({member["member"]: qrcode})

            for member in step.get("stepUserMembers", []):
                link, qrcode = super().user_team_public_data(
                    member["member"],
                    step.get("stepRole"),
                    member["portfolio"],
                    "user",
                )
                HandleProcess.links.append({member["member"]: link})
                HandleProcess.qrcodes.append({member["member"]: qrcode})

            public_users = [m["member"] for m in step.get("stepPublicMembers", [])]
            if public_users:
                public_portfolio = step.get("stepPublicMembers", [])[0].get("portfolio")
                link, qrcode = super().public_bulk_data(
                    public_users,
                    step.get("stepRole"),
                    public_portfolio,
                    "bulk_public",
                )
                HandleProcess.public_links.append({public_portfolio: link})

            clone_ids = HandleProcess.prepare_document_for_step_one_users(
                steps[0], self.process["parent_item_id"], process_id
            )
            Thread(
                target=lambda: save_process_links(
                    HandleProcess.links,
                    process_id,
                    clone_ids,
                    company_id,
                )
            ).start()

            Thread(
                target=lambda: update_process(
                    process_id,
                    steps,
                    "processing",
                )
            ).start()

            Thread(
                target=lambda: save_process_qrcodes(
                    HandleProcess.qrcodes,
                    self.process["_id"],
                    clone_ids,
                    self.process["processing_action"],
                    self.process["process_title"],
                    self.process["company_id"],
                )
            ).start()

            return (
                {
                    "links": HandleProcess.links,
                    "qrcodes": HandleProcess.qrcodes,
                    "public_links": HandleProcess.public_links,
                },
            )

        return

    def verify(self, auth_step_role, location_data, user_name, user_type, org_name):
        clone_id = None
        process_id = self.process["_id"]
        for step in self.process["process_steps"]:
            if step.get("stepRole") == auth_step_role:
                if step.get("stepLocation"):
                    if not location_right(
                        step.get("stepLocation"),
                        step.get("stepContinent"),
                        location_data["continent"],
                        step.get("stepCountry"),
                        location_data["country"],
                        step.get("stepCity"),
                        location_data["city"],
                    ):
                        return
                if step.get("stepDisplay"):
                    if not display_right(step.get("stepDisplay")):
                        return
                if step.get("stepTimeLimit"):
                    if not time_limit_right(
                        step.get("stepTime"),
                        step.get("stepTimeLimit"),
                        step.get("stepStartTime"),
                        step.get("stepEndTime"),
                        self.process["created_at"],
                    ):
                        return
                if step.get("stepProcessingOrder"):
                    if not step_processing_order(
                        step.get("stepProcessingOrder"),
                        process_id,
                        step.get("stepRole"),
                    ):
                        return
                if user_type == "public":
                    user_name = user_name[0]
                if any(
                    user_name in d_map for d_map in step.get("stepDocumentCloneMap")
                ):
                    for d_map in step["stepDocumentCloneMap"]:
                        if d_map.get(user_name) is not None:
                            clone_id = d_map.get(user_name)

                doc_map = step["stepDocumentMap"]
                right = step["stepRights"]
                role = step["stepRole"]
                user = user_name
                match = True

        if not match:
            return
        item_type = self.process["process_type"]
        item_flag = None
        if item_type == "document":
            collection = "DocumentReports"
            document = "documentreports"
            field = "document_name"
            team_member_id = "11689044433"
            item_flag = get_document_object(clone_id)["document_state"]

        if item_type == "template":
            collection = "TemplateReports"
            document = "templatereports"
            field = "template_name"
            team_member_id = "22689044433"
            item_flag = get_template_object(clone_id)["document_state"]

        editor_link = HandleProcess.get_editor_link(
            {
                "product_name": "Workflow AI",
                "details": {
                    "field": field,
                    "cluster": "Documents",
                    "database": "Documentation",
                    "collection": collection,
                    "document": document,
                    "team_member_ID": team_member_id,
                    "function_ID": "ABCDE",
                    "command": "update",
                    "flag": "signing",
                    "_id": clone_id,
                    "action": item_type,
                    "authorized": user,
                    "document_map": doc_map,
                    "document_right": right,
                    "document_flag": item_flag,
                    "role": role,
                    "process_id": process_id,
                    "update_field": {"document_name": "", "content": "", "page": ""},
                },
            }
        )
        if user_type == "public" and editor_link:
            Thread(target=lambda: register_public_login(user_name[0], org_name))

        return editor_link


class Background:
    viewers = []
    copies = []
    clones = []
    d_states = False

    def __init__(self, process, item_type, item_id, role, username):
        self.process = process
        self.item_type = item_type
        self.item_id = item_id
        self.role = role
        self.username = username

    @staticmethod
    def check_items_state(items):
        return [get_document_object(i)["document_state"] == "finalized" for i in items]

    @classmethod
    def assign_task_to_users(cls, clone_map, users, process_id, item_type):
        for cm in clone_map:
            docs = list(cm.values())

        for docid in docs:
            for usr in users:
                cls.viewers.append(usr)
                authorize(docid, cls.viewers, process_id, item_type)
                clone_map.append({usr: docid})

        return

    @classmethod
    def request_task_for_users(
        cls, item_id, parent_item_id, process_id, users, clonemap
    ):
        try:
            cls.copies += [
                {
                    u: cloning_document(
                        item_id,
                        u,
                        parent_item_id,
                        process_id,
                    )
                }
                for u in users
            ]
            for cp in cls.copies:
                clonemap.append(cp)
            return cls.copies
        except Exception as e:
            print(e)
            return

    @classmethod
    def check_first_step_state(cls, process):
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

            Background.d_states = all(cls.check_items_state(cls.clones))

        if public and users == []:
            for usr in public:
                for dmap in step["stepDocumentCloneMap"]:
                    if dmap.get(usr) is not None:
                        cls.clones.append(dmap.get(usr))

            Background.d_states = all(cls.check_items_state(cls.clones))

        return Background.d_states

    @staticmethod
    def update_parent_item_clone_list(parent_item_id, clone_ids):
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
            if not Background.check_first_step_state(self.process):
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

                        Background.d_states = all(
                            Background.check_items_state(Background.clones)
                        )

                    else:
                        if step["stepTaskType"] == "assign_task":
                            Background.assign_task_to_users(
                                step["stepDocumentCloneMap"],
                                users,
                                self.process["_id"],
                                self.item_type,
                            )

                        if step["stepTaskType"] == "request_for_task":
                            copies = Background.request_task_for_users(
                                self.item_id,
                                self.process["parent_item_id"],
                                self.process["_id"],
                                users,
                                step["stepDocumentCloneMap"],
                            )
                            Background.update_parent_item_clone_list(
                                self.process["parent_item_id"],
                                [d["member"] for d in copies if "member" in d],
                            )

                    update_process(
                        process_id=self.process["_id"],
                        steps=self.process["process_steps"],
                        state=self.process["processing_state"],
                    )

                    if not Background.d_states:
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

                                Background.d_states = all(
                                    Background.check_items_state(Background.clones)
                                )

                            else:
                                if step["stepTaskType"] == "assign_task":
                                    Background.assign_task_to_users(
                                        step["stepDocumentCloneMap"],
                                        users,
                                        self.process["_id"],
                                        self.item_type,
                                    )

                                if step["stepTaskType"] == "request_for_task":
                                    copies = Background.request_task_for_users(
                                        self.item_id,
                                        self.process["parent_id"],
                                        self.process["_id"],
                                        step["stepDocumentCloneMap"],
                                    )

                                Background.update_parent_item_clone_list(
                                    self.process["parent_item_id"],
                                    [d["member"] for d in copies if "member" in d],
                                )

                            update_process(
                                process_id=self.process["_id"],
                                steps=self.process["process_steps"],
                                state=self.process["processing_state"],
                            )
        except Exception as e:
            print("got error", e)
            finalize_item(self.item_id, "processing", self.item_type)
            return

        return
