import json
from threading import Thread

import requests
import urllib.parse

from app.constants import EDITOR_API, VERIFICATION_LINK
from app.utils.checks import (
    display_right,
    location_right,
    step_processing_order,
    time_limit_right,
)
from app.utils.helpers import (
    access_editor,
    cloning_document,
    register_public_login,
    register_user_access,
)
from app.utils.mongo_db_connection import (
    authorize,
    finalize_item,
    get_document_object,
    get_process_object,
    get_template_object,
    save_process,
    save_process_links,
    save_process_qrcodes,
    update_document_clone,
    update_process,
    update_process_with_links,
)
from app.verification import Verification


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


class HandleProcess(Verification):
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
    def get_editor_link(payload) -> str:
        link = requests.post(
            EDITOR_API,
            data=json.dumps(payload),
            headers={"Content-Type": "application/json"},
        )
        return link.json()

    @staticmethod
    def prepare_document_for_step_one_users(step, parent_item_id, process_id):
        clones = []
        users = [
            m["member"]
            for m in step.get("stepTeamMembers", []) + step.get("stepUserMembers", [])
        ]
        public = [m["member"] for m in step.get("stepPublicMembers", [])]
        if users:
            clone_id = cloning_document(
                parent_item_id, users, parent_item_id, process_id
            )
            clones = [clone_id]
            for u in users:
                step.get("stepDocumentCloneMap").append({u: clone_id})
        if public:
            public_clone_ids = []
            for u in public:
                public_clone_ids.append(
                    {u: cloning_document(parent_item_id, u, parent_item_id, process_id)}
                )
            step.get("stepDocumentCloneMap").extend(public_clone_ids)
            clones.extend(public_clone_ids)
        return clones

    def start(self):
        links = []
        public_links = []
        qrcodes = []
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
                links.append({member["member"]: link})
                qrcodes.append({member["member"]: qrcode})
            for member in step.get("stepTeamMembers", []):
                link, qrcode = super().user_team_public_data(
                    member["member"],
                    step.get("stepRole"),
                    member["portfolio"],
                    "team",
                )
                links.append({member["member"]: link})
                qrcodes.append({member["member"]: qrcode})
            for member in step.get("stepUserMembers", []):
                link, qrcode = super().user_team_public_data(
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
                link, qrcode = super().public_bulk_data(
                    public_users,
                    step.get("stepRole"),
                    public_portfolio,
                    "bulk_public",
                )
                public_links.append({public_portfolio: link})
        clone_ids = HandleProcess.prepare_document_for_step_one_users(
            steps[0], self.process["parent_item_id"], process_id
        )
        save_process_links(
            links,
            process_id,
            clone_ids,
            company_id,
        )
        Thread(
            target=lambda: update_process(
                process_id,
                steps,
                "processing",
            )
        ).start()
        Thread(
            target=lambda: save_process_qrcodes(
                qrcodes,
                self.process["_id"],
                clone_ids,
                self.process["processing_action"],
                self.process["process_title"],
                self.process["company_id"],
            )
        ).start()
        return {
            "links": links,
            "public_links": public_links,
        }

    def verify_location(self, auth_role, location_data):
        for step in self.process["process_steps"]:
            if step.get("stepRole") == auth_role:
                if step.get("stepLocation"):
                    return location_right(
                        step.get("stepLocation"),
                        step.get("stepContinent"),
                        location_data["continent"],
                        step.get("stepCountry"),
                        location_data["country"],
                        step.get("stepCity"),
                        location_data["city"],
                    )

    def verify_display(self, auth_role):
        for step in self.process["process_steps"]:
            if step.get("stepRole") == auth_role:
                if step.get("stepDisplay"):
                    return display_right(step.get("stepDisplay"))

    def verify_time(self, auth_role):
        for step in self.process["process_steps"]:
            if step.get("stepRole") == auth_role:
                if step.get("stepTimeLimit"):
                    return time_limit_right(
                        step.get("stepTime"),
                        step.get("stepTimeLimit"),
                        step.get("stepStartTime"),
                        step.get("stepEndTime"),
                        self.process["created_at"],
                    )

    def verify_access(self, auth_role, user_name, user_type):
        clone_id = None
        doc_map = None
        right = None
        role = None
        item_flag = None
        field = None
        collection = None
        document = None
        team_member_id = None
        item_type = self.process["process_type"]
        for step in self.process["process_steps"]:
            if step.get("stepRole") == auth_role:
                if user_type == "public":
                    user_name = user_name[0]
                if any(user_name in map for map in step.get("stepDocumentCloneMap")):
                    for d_map in step["stepDocumentCloneMap"]:
                        if d_map.get(user_name) is not None:
                            clone_id = d_map.get(user_name)
                    doc_map = step["stepDocumentMap"]
                    right = step["stepRights"]
                    role = step["stepRole"]
        if clone_id:
            if item_type == "document":
                collection = "DocumentReports"
                document = "documentreports"
                field = "document_name"
                team_member_id = "11689044433"
                item_flag = get_document_object(clone_id)["document_state"]

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
                    "authorized": user_name,
                    "document_map": doc_map,
                    "document_right": right,
                    "document_flag": item_flag,
                    "role": role,
                    "process_id": self.process["_id"],
                    "update_field": {
                        "document_name": "",
                        "content": "",
                        "page": "",
                    },
                },
            }
        )
        if user_type == "public" and editor_link:
            Thread(
                target=lambda: register_public_login(
                    user_name[0], self.process["org_name"]
                )
            )
        return editor_link

    def verify(self, auth_step_role, location_data, user_name, user_type, org_name):
        try:
            clone_id = None
            match = False
            doc_map = None
            user = None
            right = None
            role = None
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
                            # raise Exception(
                            #     "access to this document not allowed from this location"
                            # )
                            return
                    if step.get("stepDisplay"):
                        if not display_right(step.get("stepDisplay")):
                            # raise Exception(
                            #     "display rights set do not allow access to this document"
                            # )
                            return
                    if step.get("stepTimeLimit"):
                        if not time_limit_right(
                            step.get("stepTime"),
                            step.get("stepTimeLimit"),
                            step.get("stepStartTime"),
                            step.get("stepEndTime"),
                            self.process["created_at"],
                        ):
                            # raise Exception("time limit for access has elapsed")
                            return
                    if step.get("stepProcessingOrder"):
                        if not step_processing_order(
                            order=step.get("stepProcessingOrder"),
                            process_id=process_id,
                            role=step.get("stepRole"),
                        ):
                            # raise Exception("user not yet allowed to access document")
                            return
                    if user_type == "public":
                        user_name = user_name[0]
                    if any(
                        user_name in map for map in step.get("stepDocumentCloneMap")
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
                # raise Exception("access to this document couldn't be verified")
                return
            item_type = self.process["process_type"]
            item_flag = None
            field = None
            collection = None
            document = None
            team_member_id = None
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
                        "update_field": {
                            "document_name": "",
                            "content": "",
                            "page": "",
                        },
                    },
                }
            )
            if user_type == "public" and editor_link:
                Thread(target=lambda: register_public_login(user_name[0], org_name))
            return editor_link
        except Exception as e:
            raise e


class Background:
    def __init__(self, process, item_type, item_id, role, username):
        self.process = process
        self.item_type = item_type
        self.item_id = item_id
        self.role = role
        self.username = username

    @staticmethod
    def check_items_state(items) -> list:
        return [get_document_object(i)["document_state"] == "finalized" for i in items]

    @staticmethod
    def assign_task_to_users(clone_map, users, process_id, item_type):
        docs = []
        viewers = []
        for cm in clone_map:
            docs = list(cm.values())
        for docid in docs:
            for usr in users:
                viewers.append(usr)
                authorize(docid, viewers, process_id, item_type)
                clone_map.append({usr: docid})
        return

    @staticmethod
    def request_task_for_users(
        item_id, parent_item_id, process_id, users, clonemap
    ) -> list:
        copies = []
        try:
            copies += [
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
            for cp in copies:
                clonemap.append(cp)
            return copies
        except Exception as e:
            raise e

    @staticmethod
    def check_first_step_state(process):
        d_states = False
        clones = []
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
                        clones.append(dmap.get(usr))
            d_states = all(Background.check_items_state(clones))
        if public and users == []:
            for usr in public:
                for dmap in step["stepDocumentCloneMap"]:
                    if dmap.get(usr) is not None:
                        clones.append(dmap.get(usr))
            d_states = all(Background.check_items_state(clones))
        return d_states

    @staticmethod
    def update_parent_item_clone_list(parent_item_id, clone_ids):
        document = get_document_object(parent_item_id)
        clone_list = document["clone_list"]
        for c in clone_ids:
            clone_list.append(c)
        update_document_clone(parent_item_id, clone_list)
        return

    def processing(self):
        d_states = False
        clones = []
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
                if no_of_steps == 1:
                    print("finalized")
                    update_process(
                        process_id=self.process["_id"],
                        steps=self.process["process_steps"],
                        state="finalized",
                    )
                if no_of_steps >= 2:
                    copies = []
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
                                    clones.append(dmap.get(usr))

                        d_states = all(Background.check_items_state(clones))
                    else:
                        if step["stepTaskType"] == "assign_task":
                            docs = []
                            viewers = []
                            for cm in step["stepDocumentCloneMap"]:
                                docs = list(cm.values())
                            for docid in docs:
                                for usr in users:
                                    viewers.append(usr)
                                    authorize(
                                        docid,
                                        viewers,
                                        self.process["_id"],
                                        self.item_type,
                                    )
                                    step["stepDocumentCloneMap"].append({usr: docid})
                        if step["stepTaskType"] == "request_for_task":
                            copies = []
                            copies += [
                                {
                                    u: cloning_document(
                                        self.item_id,
                                        u,
                                        self.process["parent_item_id"],
                                        self.process["process_id"],
                                    )
                                }
                                for u in users
                            ]
                            for cp in copies:
                                step["stepDocumentCloneMap"].append(cp)
                            if copies is not None:
                                Background.update_parent_item_clone_list(
                                    self.process["parent_item_id"],
                                    [d["member"] for d in copies if "member" in d],
                                )
                    if not d_states:
                        if no_of_steps >= 3:
                            copies = []
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
                                            clones.append(dmap.get(usr))

                                d_states = all(Background.check_items_state(clones))
                            else:
                                if step["stepTaskType"] == "assign_task":
                                    docs = []
                                    viewers = []
                                    for cm in step["stepDocumentCloneMap"]:
                                        docs = list(cm.values())
                                    for docid in docs:
                                        for usr in users:
                                            viewers.append(usr)
                                            authorize(
                                                docid,
                                                viewers,
                                                self.process["_id"],
                                                self.item_type,
                                            )
                                            step["stepDocumentCloneMap"].append(
                                                {usr: docid}
                                            )
                                if step["stepTaskType"] == "request_for_task":
                                    copies = []
                                    copies += [
                                        {
                                            u: cloning_document(
                                                self.item_id,
                                                u,
                                                self.process["parent_item_id"],
                                                self.process["process_id"],
                                            )
                                        }
                                        for u in users
                                    ]
                                    for cp in copies:
                                        step["stepDocumentCloneMap"].append(cp)
                                    if copies is not None:
                                        Background.update_parent_item_clone_list(
                                            self.process["parent_item_id"],
                                            [
                                                d["member"]
                                                for d in copies
                                                if "member" in d
                                            ],
                                        )
                        else:
                            print("finalized")
                            update_process(
                                process_id=self.process["_id"],
                                steps=self.process["process_steps"],
                                state="finalized",
                            )
                else:
                    print("finalized")
                    update_process(
                        process_id=self.process["_id"],
                        steps=self.process["process_steps"],
                        state="finalized",
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


def verification_link(username, role, portfolio, user_type, org_name, process_id):
    params = {
        "org": "WorkflowAI",
        "username": username,
        "auth_role": role,
        "portfolio": portfolio,
        "user_type": user_type,
        "org_name": org_name,
        "process_id": process_id,
    }
    encoded_param = urllib.parse.urlencode(params)
    return f"{VERIFICATION_LINK}/?{encoded_param}"


def begin_process(process):
    links = []
    process["links"] = []
    for step in process["process_steps"]:
        for user in step.get("stepTeamMembers"):
            link = verification_link(
                user["member"],
                step.get("stepRole"),
                user["portfolio"],
                "team",
                process["org_name"],
                process["_id"],
            )
            links.append({user["member"]: link})
            process["links"].append({user["member"]: link})
        for user in step.get("stepUserMembers"):
            link = verification_link(
                user["member"],
                step.get("stepRole"),
                user["portfolio"],
                "user",
                process["org_name"],
                process["_id"],
            )
            links.append({user["member"]: link})
            process["links"].append({user["member"]: link})
        for user in step.get("stepPublicMembers"):
            link = verification_link(
                user["member"],
                step.get("stepRole"),
                user["portfolio"],
                "team",
                process["org_name"],
                process["_id"],
            )
            links.append({user["member"]: link})
            process["links"].append({user["member"]: link})
    step1users = []
    for user in process["process_steps"][0].get("stepTeamMembers"):
        step1users.append(user["member"])
    for user in process["process_steps"][0].get("stepUserMembers"):
        step1users.append(user["member"])

    single_document = cloning_document(
        process["parent_item_id"], step1users, process["parent_item_id"], process["_id"]
    )
    for user in step1users:
        process["process_steps"][0].get("stepDocumentCloneMap").append(
            {user: single_document}
        )

    for user in process["process_steps"][0].get("stepPublicMembers"):
        public_document = cloning_document(
            process["parent_item_id"], user, process["parent_item_id"], process["_id"]
        )
        process["process_steps"][0].get("stepDocumentCloneMap").append(
            {user: public_document}
        )
    update_process_with_links(
        process["_id"], process["process_steps"], "processing", process["links"]
    )
    return {"links": links}


def give_access(process_id, role, username, user_type):
    process = get_process_object(process_id)
    if not any(username in link for link in process["links"]):
        return

    for step in process["process_steps"]:
        if step.get("stepRole") == role:
            if user_type == "public":
                username = username[0]
            if any(
                username in document_map
                for document_map in step.get("stepDocumentCloneMap")
            ):
                for document_map in step.get("stepDocumentCloneMap"):
                    document_id = document_map.get(username)
    editor_link = access_editor(document_id, "document")
    return editor_link


def multistep(document_id, process):
    no_of_steps = sum(isinstance(e, dict) for e in process["process_steps"])
    for document_map in process["process_steps"][0].get("stepDocumentCloneMap"):
        for _, v in document_map.items():
            if get_document_object(v).get("document_state") != "finalized":
                return
    if no_of_steps > 1:
        if process["process_steps"][1]:
            print("2")
            for document_map in process["process_steps"][1].get("stepDocumentCloneMap"):
                for _, v in document_map.items():
                    if get_document_object(v).get("document_state") != "finalized":
                        return
            if process["process_steps"][1].get("stepTaskType") == "request_for_task":
                for user in process["process_steps"][1].get("stepTeamMembers"):
                    clone_id = cloning_document(
                        document_id, user, process["parent_item_id"], process["_id"]
                    )
                    process["process_steps"].get("stepDocumentCloneMap").append(
                        {user: clone_id}
                    )
                for user in process["process_steps"][1].get("stepPublicMembers"):
                    clone_id = (
                        document_id,
                        user,
                        process["parent_item_id"],
                        process["_id"],
                    )
                    process["process_steps"].get("stepDocumentCloneMap").append(
                        {user: clone_id}
                    )
                for user in process["process_steps"][1].get("stepUserMembers"):
                    clone_id = cloning_document(
                        document_id, user, process["parent_item_id"], process["_id"]
                    )
                    process["process_steps"].get("stepDocumentCloneMap").append(
                        {user: clone_id}
                    )
            if process["process_steps"][1].get("stepTaskType") == "assign_task":
                step1_documents = []
                for _, v in process["process_steps"][0].get("stepDocumentCloneMap"):
                    step1_documents.append(v)

                for document in step1_documents:
                    for user in process["process_steps"][1].get("stepTeamMembers"):
                        authorize(
                            document, user, process["_id"], process["process_type"]
                        )
                        process["process_steps"][1].get("stepDocumentCloneMap").append(
                            {user: document}
                        )
                    for user in process["process_steps"][1].get("stepPublicMembers"):
                        authorize(
                            document, user, process["_id"], process["process_type"]
                        )
                        process["process_steps"][1].get("stepDocumentCloneMap").append(
                            {user: document}
                        )
                    for user in process["process_steps"][1].get("stepUserMembers"):
                        authorize(
                            document, user, process["_id"], process["process_type"]
                        )
                        process["process_steps"][1].get("stepDocumentCloneMap").append(
                            {user: document}
                        )
            if process["process_steps"][2]:
                print("3")
                for document_map in process["process_steps"][2].get("stepDocumentCloneMap"):
                    for _, v in document_map.items():
                        if get_document_object(v).get("document_state") != "finalized":
                            return
                if process["process_steps"][2].get("stepTaskType") == "request_for_task":
                    for user in process["process_steps"][2].get("stepTeamMembers"):
                        clone_id = cloning_document(
                            document_id, user, process["parent_item_id"], process["_id"]
                        )
                        process["process_steps"].get("stepDocumentCloneMap").append(
                            {user: clone_id}
                        )
                    for user in process["process_steps"][2].get("stepPublicMembers"):
                        clone_id = (
                            document_id,
                            user,
                            process["parent_item_id"],
                            process["_id"],
                        )
                        process["process_steps"].get("stepDocumentCloneMap").append(
                            {user: clone_id}
                        )
                    for user in process["process_steps"][2].get("stepUserMembers"):
                        clone_id = cloning_document(
                            document_id, user, process["parent_item_id"], process["_id"]
                        )
                        process["process_steps"].get("stepDocumentCloneMap").append(
                            {user: clone_id}
                        )
                if process["process_steps"][2].get("stepTaskType") == "assign_task":
                    step2_documents = []
                    for _, v in process["process_steps"][1].get("stepDocumentCloneMap"):
                        step2_documents.append(v)

                    for document in step2_documents:
                        for user in process["process_steps"][2].get("stepTeamMembers"):
                            authorize(document, user, process["_id"], process["process_type"])
                            process["process_steps"][2].get("stepDocumentCloneMap").append(
                                {user: document}
                            )
                        for user in process["process_steps"][2].get("stepPublicMembers"):
                            authorize(document, user, process["_id"], process["process_type"])
                            process["process_steps"][2].get("stepDocumentCloneMap").append(
                                {user: document}
                            )
                        for user in process["process_steps"][2].get("stepUserMembers"):
                            authorize(document, user, process["_id"], process["process_type"])
                            process["process_steps"][2].get("stepDocumentCloneMap").append(
                                {user: document}
                            )
    update_process(
        process["_id"], process["process_steps"], process["processing_state"]
    )
