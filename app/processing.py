import json
import urllib.parse
import uuid
from threading import Thread

import qrcode
import requests

from app.checks import display_right, location_right, time_limit_right
from app.constants import EDITOR_API, MASTERLINK_URL, NOTIFICATION_API, QRCODE_URL, VERIFICATION_LINK
from app.helpers import cloning_document, register_public_login, check_items_state
from app.mongo_db_connection import (
    authorize,
    finalize_item,
    get_document_object,
    save_process,
    save_process_links,
    save_process_qrcodes,
    save_uuid_hash,
    update_process,
)


class Process:
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
        process_title,
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
        self.process_title = process_title
        # self.process_title = " - ".join(
        #     [workflow["workflows"]["workflow_title"] for workflow in workflows]
        # )

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
                "original",
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
                "process_kind": "original",
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
                "original",
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
                "process_kind": "original",
                "org_name": self.org_name,
            }

class HandleProcess:
    def __init__(self, process):
        self.process = process
        self.params = {
            "org": process["org_name"],
            "product": "Workflow AI",
        }


    def parse_url(params):
        return urllib.parse.urlencode(params)

    def generate_qrcode(link):
        """Revert back to prod qr_path before push"""
        qr_path = f"100094.pythonanywhere.com/media/qrcodes/{uuid.uuid4().hex}.png"  # Production
        # qr_path = f"media/qrcodes/{uuid.uuid4().hex}.png"  # On dev
        qr_code = qrcode.QRCode()
        qr_code.add_data(link)
        qr_code.make()
        qr_color = "black"
        qr_img = qr_code.make_image(fill_color=qr_color, back_color="#DCDCDC")
        qr_img.save(qr_path)
        return f"https://{qr_path}"

    def notify(auth_name, doc_id, portfolio, company_id, link, org_name):
        response = requests.post(
            NOTIFICATION_API,
            json.dumps(
                {
                    "created_by": auth_name,
                    "documentId": doc_id,
                    "portfolio": portfolio,
                    "company_id": company_id,
                    "link": link,
                    "org_name": org_name,
                    "product_name": "Workflow AI",
                    "title": "Document to Sign",
                    "message": "You have a document to sign.",
                    "duration": "no limit",
                    "button_status": "",
                }
            ),
            {"Content-Type": "application/json"},
        )
        if response.status_code == 201:
            print("notification sent")
        return

    def user_team_public_data(process_data, auth_name, step_role, portfolio, user_type):
        hash = uuid.uuid4().hex
        link = f"{VERIFICATION_LINK}/{hash}/"
        params = process_data["params"]
        process_id = process_data["_id"]
        item_id = process_data["parent_item_id"]
        org_name = process_data["org_name"]
        item_type = process_data["process_kind"]
        company_id = process_data["company_id"]
        params["username"] = auth_name
        params["auth_role"] = step_role
        params["user_type"] = user_type
        params["portfolio"] = portfolio
        encoded_param = HandleProcess.parse_url(params)
        utp_link = f"{link}?{encoded_param}"
        save_uuid_hash(
            utp_link,
            process_id,
            item_id,
            step_role,
            auth_name,
            portfolio,
            hash,
            item_type,
        )
        HandleProcess.notify(
            auth_name, item_id, portfolio, company_id, utp_link, org_name
        )
        utp_code = HandleProcess.generate_qrcode(utp_link)
        return utp_link, utp_code

    def get_editor_link(payload):
        link = requests.post(
            EDITOR_API,
            data=json.dumps(payload),
            headers={"Content-Type": "application/json"},
        )
        return link.json()

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

    def generate_public_qrcode(links, company_id, document_name):
        print(document_name)
        master_link = None
        master_qrcode = None
        payload = json.dumps(
            {
                "qrcode_type": "Link",
                "quantity": 1,
                "company_id": company_id,
                "links": links,
                "document_name": document_name,
            }
        )
        response = requests.post(
            QRCODE_URL, data=payload, headers={"Content-Type": "application/json"}
        )
        if response.status_code == 201:
            print("success")
            response = json.loads(response.text)
            master_link = response["qrcodes"][0]["masterlink"]
            master_qrcode = response["qrcodes"][0]["qrcode_image_url"]
        return master_link, master_qrcode

    def start(self):
        links = []
        public_links = []
        qrcodes = []
        process_id = self.process["_id"]
        company_id = self.process["company_id"]
        steps = self.process["process_steps"]
        process_data = self.process
        process_data["params"] = self.params
        m_code = None
        m_link = None
        link_string  = "link"
        for step in steps:
            for member in step.get("stepPublicMembers", []):
                link, qrcode = HandleProcess.user_team_public_data(
                    self.process,
                    member["member"],
                    step.get("stepRole"),
                    member["portfolio"],
                    "public",
                )
                links.append({member["member"]: link})
                public_links.append({link_string: link})
                qrcodes.append({member["member"]: qrcode})
            for member in step.get("stepTeamMembers", []):
                link, qrcode = HandleProcess.user_team_public_data(
                    self.process,
                    member["member"],
                    step.get("stepRole"),
                    member["portfolio"],
                    "team",
                )
                links.append({member["member"]: link})
                qrcodes.append({member["member"]: qrcode})
            for member in step.get("stepUserMembers", []):
                link, qrcode = HandleProcess.user_team_public_data(
                    self.process,
                    member["member"],
                    step.get("stepRole"),
                    member["portfolio"],
                    "user",
                )
                links.append({member["member"]: link})
                qrcodes.append({member["member"]: qrcode})
        clone_ids = HandleProcess.prepare_document_for_step_one_users(
            steps[0], self.process["parent_item_id"], process_id
        )
        save_process_links(
            links,
            process_id,
            clone_ids,
            company_id,
        )
        update_process(
            process_id,
            steps,
            "processing",
        )
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
        if public_links:
            document_id = self.process['parent_item_id']
            res = get_document_object(document_id)
            # print(res)
            document_name = res["document_name"]
            m_link, m_code = HandleProcess.generate_public_qrcode(
                public_links, self.process["company_id"], document_name
            )
        return {"links": links, "master_link": m_link, "master_code": m_code}

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
                else:
                    return True

    def verify_display(self, auth_role):
        for step in self.process["process_steps"]:
            if step.get("stepRole") == auth_role:
                if step.get("stepDisplay"):
                    return display_right(step.get("stepDisplay"))
                else:
                    return True

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
                else:
                    return True  # If the steptimeLimit key does not exist

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
                document_object = get_document_object(clone_id)
                item_flag = document_object["document_state"]
                document_name = document_object["document_name"]
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
                            "user_type": user_type,
                            "document_map": doc_map,
                            "document_right": right,
                            "document_flag": item_flag,
                            "role": role,
                            "process_id": self.process["_id"],
                            "update_field": {
                                "document_name": document_name,
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


class Background:
    def __init__(self, process, item_type, item_id, role, username):
        self.process = process
        self.item_type = item_type
        self.item_id = item_id
        self.role = role
        self.username = username

    def register_finalized(link_id):
        """Master single link as finalized"""
        response = requests.put(
            f"{MASTERLINK_URL}?link_id={link_id}",
            data={"is_finalized": True},
            headers={"Content-Type": "application/json"},
        )
        if response.status_code == 200:
            print("finalized")
        else:
            print("failed")
        return

    def register_user_access(process_steps, authorized_role, user):
        """Once someone has made changes to their docs"""
        for step in process_steps:
            if step["stepRole"] == authorized_role:
                for clone_map in step["stepDocumentCloneMap"]:
                    if user in clone_map:
                        # print("user:", user)
                        clone_map["accessed"] = True
                        continue

    def processing(self):
        steps = self.process["process_steps"]
        parent_id = self.process["parent_item_id"]
        process_id = self.process["_id"]
        process_type = self.process["process_type"]
        document_id = self.item_id
        processing_state = self.process["processing_state"]
        Background.register_user_access(
            self.process["process_steps"], self.role, self.username
        )
        finalized = []
        try:
            no_of_steps = sum(isinstance(e, dict) for e in steps)
            if no_of_steps > 0:
                for index, step in enumerate(steps):
                    if step["stepDocumentCloneMap"]:
                        for document_map in step.get("stepDocumentCloneMap"):
                            print(document_map)
                            for _, v in document_map.items():
                                print(_, v)
                                if (
                                    isinstance(v, str) and
                                    get_document_object(v).get("document_state")
                                    == "processing" or v is None
                                ):
                                    continue 
                                else:
                                    finalized.append(v)
                    else:
                        if step.get("stepTaskType") == "request_for_task":
                            for user in step.get("stepTeamMembers"):
                                clone_id = cloning_document(
                                    document_id, user, parent_id, process_id
                                )
                                step.get("stepDocumentCloneMap").append(
                                    {user["member"]: clone_id}
                                )
                            for user in step.get("stepPublicMembers"):
                                clone_id = cloning_document(
                                    document_id, user, parent_id, process_id,
                                )
                                step.get("stepDocumentCloneMap").append(
                                    {user["member"]: clone_id}
                                )
                            for user in step.get("stepUserMembers"):
                                clone_id = cloning_document(
                                    document_id, user, parent_id, process_id
                                )
                                step.get("stepDocumentCloneMap").append(
                                    {user["member"]: clone_id}
                                )
                        if step.get("stepTaskType") == "assign_task":
                            step1_documents = []
                            for i in range(1, len((steps))):
                                current_idx = i
                                prev_docs = steps[current_idx - 1].get("stepDocumentCloneMap")
                                for item in prev_docs:
                                    key = next(iter(item))
                                    my_key = item[key]
                                    if my_key != "accessed":
                                        step1_documents.append(my_key)
                                for document in step1_documents:
                                    for user in step.get("stepTeamMembers"):
                                        authorize(document, user, process_id, process_type)
                                        step.get("stepDocumentCloneMap").append(
                                            {user["member"]: document}
                                        )
                                    for user in step.get("stepPublicMembers"):
                                        authorize(document, user, process_id, process_type)
                                        step.get("stepDocumentCloneMap").append(
                                            {user["member"]: document}
                                        )
                                    for user in step.get("stepUserMembers"):
                                        authorize(document, user, process_id, process_type)
                                        step.get("stepDocumentCloneMap").append(
                                            {user["member"]: document}
                                    )
                        update_process(process_id, steps, processing_state)
                # Check that all documents are finalized
                if all(check_items_state(finalized)):
                    update_process(process_id, steps, "finalized")
                                        
        except Exception as e:
            print("got error", e)
            finalize_item(self.item_id, "processing", self.item_type)
            return
