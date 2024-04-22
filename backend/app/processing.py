import json
import urllib.parse
import uuid
from threading import Thread
import qrcode
import requests
from django.conf import settings

from app.checks import (
    display_right,
    location_right,
    time_limit_right,
    register_single_user_access,
)
from app.constants import (
    EDITOR_API,
    NOTIFICATION_API,
    QRCODE_URL,
    VERIFICATION_LINK,
    PRODUCTION_VERIFICATION_LINK,
)
from app.helpers import (
    cloning_document,
    cloning_clone,
    register_public_login,
    check_all_finalized_true,
    check_step_items_state,
    check_user_in_auth_viewers,
    get_metadata_id,
    set_reminder,
)
from app.mongo_db_connection import (
    authorize,
    authorize_metadata,
    finalize_item,
    save_to_links_collection,
    save_to_process_collection,
    save_to_qrcode_collection,
    single_query_clones_metadata_collection,
    single_query_document_collection,
    single_query_template_collection,
    single_query_clones_collection,
    single_query_process_collection,
    single_query_template_metadata_collection,
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
        email,
        *args,
        **kwargs,
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
        self.email = email

        parent_process = kwargs.get("parent_process")
        self.parent_process = parent_process

    def normal_process(self, action):
        res = json.loads(
            save_to_process_collection(
                {
                    "process_title": self.process_title,
                    "process_steps": self.process_steps,
                    "created_by": self.created_by,
                    "company_id": self.company_id,
                    "data_type": self.data_type,
                    "parent_item_id": self.parent_id,
                    "processing_action": action,
                    "creator_portfolio": self.portfolio,
                    "workflow_construct_ids": self.workflow_ids,
                    "process_type": self.process_type,
                    "org_name": self.org_name,
                    "process_kind": "original",
                    "parent_process": self.parent_process,
                    "email": self.email,
                }
            )
        )
        if res["isSuccess"]:
            if(res["inserted_id"]):
                for step in self.process_steps:
                    reminder = step.get("stepReminder", [])
                    if reminder:
                        set_reminder(reminder, step, res["inserted_id"], self.created_by)

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
                "parent_process": self.parent_process,
                "email": self.email,
            }

    def test_process(self, action):
        data_type = "Testing_Data"
        res = json.loads(
            save_to_process_collection(
                {
                    "process_title": self.process_title,
                    "process_steps": self.process_steps,
                    "created_by": self.created_by,
                    "company_id": self.company_id,
                    "data_type": data_type,
                    "parent_item_id": self.parent_id,
                    "processing_action": action,
                    "creator_portfolio": self.portfolio,
                    "workflow_construct_ids": self.workflow_ids,
                    "process_type": self.process_type,
                    "org_name": self.org_name,
                    "process_kind": "original",
                    "email": self.email

                }
            )
        )
        if res["isSuccess"]:
            if(res["inserted_id"]):
                for step in self.process_steps:
                    reminder = step.get("stepReminder", [])
                    if reminder:
                        set_reminder(reminder, step, res["inserted_id"], self.created_by)


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
                "email": self.email,
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
        # When working locally change to this.
        # We have to do this manually as pythonanywhere has issues resolving our environmental variables.
        # qr_path = f"media/qrcodes/{uuid.uuid4().hex}.png"
        # In production the below works ok
        qr_path = f"100094.pythonanywhere.com/media/qrcodes/{uuid.uuid4().hex}.png"
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
        return

    def user_team_public_data(process_data, auth_name, step_role, portfolio, user_type):
        hash = uuid.uuid4().hex
        link = None
        current_env = settings.ENV
        if current_env == "PRODUCTION":
            link = f"{PRODUCTION_VERIFICATION_LINK}/{hash}/"
        else:
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
        save_to_qrcode_collection(
            {
                "link": utp_link,
                "process_id": process_id,
                "item_id": item_id,
                "auth_role": step_role,
                "user_name": auth_name,
                "auth_portfolio": portfolio,
                "unique_hash": hash,
                "item_type": item_type,
            }
        )
        # --------- Not used so I will scrap soon - Edwin ------
        # HandleProcess.notify(
        #     auth_name, item_id, portfolio, company_id, utp_link, org_name
        # )
        # utp_code = HandleProcess.generate_qrcode(utp_link)
        return utp_link
        # return utp_link

    def get_editor_link(payload):
        link = requests.post(
            EDITOR_API,
            data=json.dumps(payload),
            headers={"Content-Type": "application/json"},
        )
        return link.json()

    def prepare_document_for_step_one_users(step, parent_item_id, process_id):
        process_type = single_query_process_collection({"_id": process_id}).get(
            "process_type"
        )
        clones = []
        users = []
        for m in step.get("stepTeamMembers", []) + step.get("stepUserMembers", []):
            users.append(m)
        public = [m for m in step.get("stepPublicMembers", [])]
        if users:
            if process_type == "document":
                clone_id = cloning_document(
                    parent_item_id, users, parent_item_id, process_id
                )
            elif process_type == "internal":
                authorize(parent_item_id, users, process_id, "document")
                clone_id = parent_item_id
            elif process_type == "template":
                authorize(parent_item_id, users, process_id, process_type)
                clone_id = parent_item_id
            clones = [clone_id]
            for u in users:
                step.get("stepDocumentCloneMap").append({u["member"]: clone_id})
        if public:
            public_clone_ids = []
            pub_users = []

            if step.get("stepActivityType") == "team_task":
                if process_type == "document":
                    pub_team_clone = cloning_document(
                        parent_item_id, public, parent_item_id, process_id
                    )
                    for u in public:
                        public_clone_ids.append({u["member"]: pub_team_clone})
                if process_type == "internal":
                    authorize(parent_item_id, public, process_id, "document")
                    pub_team_clone = parent_item_id
                    for u in public:
                        public_clone_ids.append({u["member"]: pub_team_clone})
            else:
                for u in public:
                    if process_type == "document":
                        public_clone_ids.append(
                            {
                                u["member"]: cloning_document(
                                    parent_item_id, [u], parent_item_id, process_id
                                )
                            }
                        )
                    elif process_type == "internal":
                        pub_users.append(u)
                        public_clone_ids.append({u["member"]: parent_item_id})
                    elif process_type == "template":
                        pub_users.append(u)
                        public_clone_ids.append({u["member"]: parent_item_id})
            if pub_users != []:
                # authorize() is only handled for "tdocument" and "template" process_types for now
                if process_type == "internal":
                    authorize(parent_item_id, pub_users, process_id, "document")
                else:
                    authorize(parent_item_id, pub_users, process_id, process_type)
            step.get("stepDocumentCloneMap").extend(public_clone_ids)
            clones.extend(public_clone_ids)
        return clones

    def generate_public_qrcode(links, company_id, document_name):
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
        link_string = "link"
        for step in steps:
            for member in step.get("stepPublicMembers", []):
                link = HandleProcess.user_team_public_data(
                    self.process,
                    member["member"],
                    step.get("stepRole"),
                    member["portfolio"],
                    "public",
                )
                links.append({member["member"]: link})
                public_links.append({link_string: link})
                # qrcodes.append({member["member"]: qrcode})

            for member in step.get("stepTeamMembers", []):
                link = HandleProcess.user_team_public_data(
                    self.process,
                    member["member"],
                    step.get("stepRole"),
                    member["portfolio"],
                    "team",
                )
                links.append({member["member"]: link})
                # qrcodes.append({member["member"]: qrcode})
            for member in step.get("stepUserMembers", []):
                link = HandleProcess.user_team_public_data(
                    self.process,
                    member["member"],
                    step.get("stepRole"),
                    member["portfolio"],
                    "user",
                )
                links.append({member["member"]: link})
                # qrcodes.append({member["member"]: qrcode})

            for step in step.get("stepGroupMembers", []):
                for member in step.get("public", []):
                    link  = HandleProcess.user_team_public_data(
                        self.process,
                        member["member"],
                        step.get("stepRole"),
                        member["portfolio"],
                        "public",
                    )
                    links.append({member["member"]: link})
                    public_links.append({link_string: link})
                    # qrcodes.append({member["member"]: qrcode})

                for member in step.get("team_members", []):
                    link  = HandleProcess.user_team_public_data(
                        self.process,
                        member["member"],
                        step.get("stepRole"),
                        member["portfolio"],
                        "team",
                    )
                    links.append({member["member"]: link})
                    public_links.append({link_string: link})
                    # qrcodes.append({member["member"]: qrcode})

                for member in step.get("user_members", []):
                    link = HandleProcess.user_team_public_data(
                        self.process,
                        member["member"],
                        step.get("stepRole"),
                        member["portfolio"],
                        "user",
                    )
                    links.append({member["member"]: link})
                    public_links.append({link_string: link})
                    # qrcodes.append({member["member"]: qrcode})
                    
        clone_ids = HandleProcess.prepare_document_for_step_one_users(
            steps[0], self.process["parent_item_id"], process_id
        )

        if public_links and self.process["process_type"] == "document":
            document_id = self.process["parent_item_id"]
            res = single_query_document_collection({"_id": document_id})
            document_name = res["document_name"]
            m_link, m_code = HandleProcess.generate_public_qrcode(
                public_links, self.process["company_id"], document_name
            )
            links.append({"master_link": m_link})
            qrcodes.append({"master_qrcode": m_code})

        elif public_links and self.process["process_type"] == "internal":
            document_id = self.process["parent_item_id"]
            res = single_query_clones_collection({"_id": document_id})
            document_name = res["document_name"]
            m_link, m_code = HandleProcess.generate_public_qrcode(
                public_links, self.process["company_id"], document_name
            )
            links.append({"master_link": m_link})
            qrcodes.append({"master_qrcode": m_code})

        elif public_links and self.process["process_type"] == "template":
            template_id = self.process["parent_item_id"]
            res = single_query_template_collection({"_id": template_id})
            template_name = res["template_name"]
            m_link, m_code = HandleProcess.generate_public_qrcode(
                public_links, self.process["company_id"], template_name
            )
            links.append({"master_link": m_link})
            qrcodes.append({"master_qrcode": m_code})
        save_to_links_collection(
            {
                "links": links,
                "process_id": process_id,
                "clone_ids": clone_ids,
                "company_id ": company_id,
            }
        )
        update_process(
            process_id,
            steps,
            "processing",
        )
        # Nobody use this feature so I turn it off - @Edwin
        # Thread(
        #     target=lambda: save_to_qrcode_collection(
        #         {
        #             "qrcodes": qrcodes,
        #             "process_id": self.process["_id"],
        #             "item_id": clone_ids,
        #             "processing_action": self.process["processing_action"],
        #             "process_title": self.process["process_title"],
        #             "company_id": self.process["company_id"],
        #         }
        #     )
        # ).start()
        if len(public_links) > 10:
            links = links[:10]
        return {
            "process_id": process_id,
            "links": links,
            "master_link": m_link,
            "master_code": m_code,
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
                        self.process["created_on"],
                    )
                else:
                    return True  # If the steptimeLimit key does not exist

    # Verify Access Original
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
                collection = "CloneReports"
                document = "CloneReports"
                field = "document_name"
                team_member_id = "1212001"
                document_object = single_query_clones_collection({"_id": clone_id})
                metadata = single_query_clones_metadata_collection(
                    {"collection_id": clone_id}
                )
                item_flag = document_object["document_state"]
                document_name = document_object["document_name"]
                metadata_id = metadata.get("_id")
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
                            "metadata_id": metadata_id,
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

    # Verify_Access V2
    def verify_access_v2(
        self,
        auth_role,
        user_name,
        user_type,
        collection_id=None,
        prev_viewers=None,
        next_viewers=None,
        user_email="",
    ):
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
                            # Check if the collection_id is passed as an argument
                            if collection_id is not None:
                                if d_map.get(user_name) == collection_id:
                                    clone_id = d_map.get(user_name)
                            else:
                                clone_id = d_map.get(user_name)
                    doc_map = step["stepDocumentMap"]
                    right = step["stepRights"]
                    role = step["stepRole"]
        if clone_id:
            if item_type == "document":
                collection = "CloneReports"
                document = "CloneReports"
                field = "document_name"
                team_member_id = "1212001"
                document_object = single_query_clones_collection({"_id": clone_id})
                metadata = single_query_clones_metadata_collection(
                    {"collection_id": clone_id}
                )
                item_flag = document_object["document_state"]
                document_name = document_object["document_name"]
                metadata_id = metadata.get("_id")
            elif item_type == "template":
                collection = "TemplateReports"
                document = "templatereports"
                team_member_id = "22689044433"
                field = "template_name"
                template_object = single_query_template_collection({"_id": clone_id})
                metadata = single_query_template_metadata_collection(
                    {"collection_id": clone_id}
                )
                item_flag = template_object["template_state"]
                document_name = template_object["template_name"]
                metadata_id = metadata.get("_id")
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
                        "user_email": user_email,
                        "user_type": user_type,
                        "document_map": doc_map,
                        "document_right": right,
                        "document_flag": item_flag,
                        "role": role,
                        "previous_viewers": prev_viewers,
                        "next_viewers": next_viewers,
                        "metadata_id": metadata_id,
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
    def __init__(self, process, item_type, item_id, role, username, message):
        self.process = process
        self.item_type = item_type
        self.item_id = item_id
        self.role = role
        self.username = username
        self.message = message

    def request_task_helper(
        self, step: dict, document_id: str, parent_id: str, process_id: str
    ):
        """_summary_

        Args:
            step (dict): the current process step
            document_id (str): id of the current document set for processing
            parent_id (str): parent id of the current document set for processing (useful when you want to create clones)
            process_id (str): id of the current process
        """
        users = [
            user
            for user in step.get("stepTeamMembers", [])
            + step.get("stepPublicMembers", [])
            + step.get("stepUserMembers", [])
        ]
        if step.get("stepActivityType") == "team_task":
            # TEAM_TASK: create one single clone and append it to each user in the step
            clone_id = cloning_clone(document_id, users, parent_id, process_id)
            for user in users:
                step.get("stepDocumentCloneMap").append({user["member"]: clone_id})
        else:
            # INDIVIDUAL_TASK: create individual clones for each user and append the clone ids to each user
            for user in users:
                clone_id = cloning_clone(document_id, [user], parent_id, process_id)
                step.get("stepDocumentCloneMap").append({user["member"]: clone_id})

    def assign_task_helper(self, step: dict, process_id: str, process_steps: list):
        """_summary_

        Args:
            step (dict): The current execution step
            process_id (str): The process_id of the current process
            process_steps (list): the process_steps array of the current process
        """
        step1_documents = []
        for i in range(1, len(process_steps)):
            current_idx = i
            prev_docs = process_steps[current_idx - 1].get("stepDocumentCloneMap")
            if prev_docs:
                for item in prev_docs:
                    key = next(iter(item))
                    my_key = item[key]
                    if (
                        "accessed" in item
                        and single_query_clones_collection({"_id": my_key}).get(
                            "document_state"
                        )
                        == "finalized"
                    ):
                        step1_documents.append(my_key)
            assign_users = [
                user
                for user in step.get("stepTeamMembers", [])
                + step.get("stepPublicMembers", [])
                + step.get("stepUserMembers", [])
            ]
            if step.get("stepActivityType") == "team_task":
                for document in step1_documents:
                    authorize(document, assign_users, process_id, "document")
                    for user in assign_users:
                        step.get("stepDocumentCloneMap").append(
                            {user["member"]: document}
                        )
                        # Change auth viewers in the metadata as well
                        metadata_id = get_metadata_id(document, "clone")
                        authorize_metadata(metadata_id, user, process_id, "document")
            else:
                for document in step1_documents:
                    for user in step.get("stepTeamMembers"):
                        authorize(
                            document,
                            user,
                            process_id,
                            "document",
                        )
                        step.get("stepDocumentCloneMap").append(
                            {user["member"]: document}
                        )
                        # Change auth viewers in the metadata as well
                        metadata_id = get_metadata_id(document, "clone")
                        authorize_metadata(metadata_id, user, process_id, "document")
                    for user in step.get("stepPublicMembers"):
                        authorize(
                            document,
                            user,
                            process_id,
                            "document",
                        )
                        step.get("stepDocumentCloneMap").append(
                            {user["member"]: document}
                        )
                        # Change auth viewers in the metadata as well
                        metadata_id = get_metadata_id(document, "clone")
                        authorize_metadata(metadata_id, user, process_id, "document")
                    for user in step.get("stepUserMembers"):
                        authorize(
                            document,
                            user,
                            process_id,
                            "document",
                        )
                        step.get("stepDocumentCloneMap").append(
                            {user["member"]: document}
                        )
                        # Change auth viewers in the metadata as well
                        metadata_id = get_metadata_id(document, "clone")
                        authorize_metadata(metadata_id, user, process_id, "document")

    def register_user_access(process_steps, authorized_role, user):
        """Once someone has made changes to their docs"""
        for step in process_steps:
            if step["stepRole"] == authorized_role:
                for clone_map in step["stepDocumentCloneMap"]:
                    if user in clone_map:
                        clone_map["accessed"] = True
                        continue

    def document_processing(self):
        steps = self.process["process_steps"]
        parent_id = self.process["parent_item_id"]
        process_id = self.process["_id"]
        process_type = self.process["process_type"]
        document_id = self.item_id
        processing_state = self.process["processing_state"]
        created_by = self.process["created_by"]
        finalized = []
        try:
            no_of_steps = sum(isinstance(e, dict) for e in steps)
            if no_of_steps > 0:
                for index, step in enumerate(steps):
                    # Check if the current step should be skipped
                    if step.get("skipStep") == True:
                        continue
                    if step["stepDocumentCloneMap"]:
                        current_doc_map = [
                            v
                            for document_map in step["stepDocumentCloneMap"]
                            for k, v in document_map.items()
                            if isinstance(v, str)
                        ]
                        user_in_viewers = check_user_in_auth_viewers(
                            user=self.username, item=document_id, item_type="document"
                        )
                        if not user_in_viewers:
                            continue
                        elif document_id in current_doc_map:
                            if (
                                step.get("permitInternalWorkflow") == True
                                and step.get("workflows") != None
                            ):
                                if step.get("internal_process_details") == None:
                                    internal_process_workflows = step.get("workflows")

                                    internal_process = Process(
                                        workflows=internal_process_workflows,
                                        created_by=self.username,
                                        portfolio=step["stepTeamMembers"][0][
                                            "portfolio"
                                        ],
                                        company_id=self.process["company_id"],
                                        process_type="internal",
                                        org_name=self.process["org_name"],
                                        workflow_ids=self.process[
                                            "workflow_construct_ids"
                                        ],
                                        parent_id=document_id,
                                        data_type=self.process["data_type"],
                                        process_title=f'{self.process["process_title"]} - {created_by} - Internal Process',
                                        parent_process=self.process["_id"],
                                    )
                                    internal_process_res = (
                                        internal_process.normal_process(
                                            self.process["processing_action"]
                                        )
                                    )
                                    internal_process_details = HandleProcess(
                                        internal_process_res
                                    ).start()

                                    step["internal_process_details"] = (
                                        internal_process_details
                                    )
                                    break
                                else:
                                    internal_process_id = step.get(
                                        "internal_process_details"
                                    ).get("process_id")
                                    internal_process_state = (
                                        single_query_process_collection(
                                            {"_id": internal_process_id}
                                        ).get("processing_state")
                                    )
                                    if internal_process_state != "finalized":
                                        raise Exception(
                                            f"Internal process for this step ({index}) is yet to be finalized"
                                        )
                                    else:
                                        pass
                            for document_map in step.get("stepDocumentCloneMap"):
                                for k, v in list(document_map.items()):
                                    if (
                                        isinstance(v, str)
                                        and single_query_clones_collection(
                                            {"_id": v}
                                        ).get("document_state")
                                        == "processing"
                                    ):
                                        continue
                                    elif (
                                        isinstance(v, str)
                                        and single_query_clones_collection(
                                            {"_id": v}
                                        ).get("document_state")
                                        == "finalized"
                                        and k
                                        in [
                                            mem["member"]
                                            for mem in (
                                                single_query_clones_collection(
                                                    {"_id": v}
                                                ).get("auth_viewers", [])
                                            )
                                        ]
                                    ):
                                        register_single_user_access(
                                            step, step.get("stepRole"), k
                                        )
                                        finalized.append(v)
                                    else:
                                        continue
                        else:
                            if (
                                document_id not in current_doc_map
                            ) and not check_step_items_state(current_doc_map):
                                if step.get("stepTaskType") == "request_for_task":
                                    self.request_task_helper(
                                        step=step,
                                        document_id=document_id,
                                        parent_id=parent_id,
                                        process_id=process_id,
                                    )

                                if step.get("stepTaskType") == "assign_task":
                                    self.assign_task_helper(
                                        step=step,
                                        process_id=process_id,
                                        process_steps=steps,
                                    )
                    else:
                        if step.get("stepTaskType") == "request_for_task":
                            self.request_task_helper(
                                step=step,
                                document_id=document_id,
                                parent_id=parent_id,
                                process_id=process_id,
                            )

                        if step.get("stepTaskType") == "assign_task":
                            self.assign_task_helper(
                                step=step, process_id=process_id, process_steps=steps
                            )

                        # update_process(process_id, steps, processing_state)
                # Check that all documents are finalized
                all_accessed_true = check_all_finalized_true(steps, process_type)
                if all_accessed_true:
                    update_process(process_id, steps, "finalized")
                else:
                    update_process(process_id, steps, "processing")
        except Exception as e:
            print("----exception----", e)
            finalize_item(self.item_id, "processing", self.item_type, self.message)
            return

    def template_processing(self):
        steps = self.process["process_steps"]
        parent_id = self.process["parent_item_id"]
        process_id = self.process["_id"]
        process_type = self.process["process_type"]
        template_id = self.item_id
        processing_state = self.process["processing_state"]
        finalized = []
        try:
            no_of_steps = sum(isinstance(e, dict) for e in steps)
            if no_of_steps > 0:
                for step in steps:
                    if step["stepDocumentCloneMap"]:
                        current_temp_map = [
                            v
                            for template_map in step["stepDocumentCloneMap"]
                            for k, v in template_map.items()
                            if isinstance(v, str)
                        ]
                        user_in_viewers = check_user_in_auth_viewers(
                            self.username, template_id, "template"
                        )
                        if not user_in_viewers:
                            pass
                        elif template_id in current_temp_map:
                            for template_map in step.get("stepDocumentCloneMap"):
                                for k, v in list(template_map.items()):
                                    if (
                                        isinstance(v, str)
                                        and single_query_template_collection(
                                            {"_id": v}
                                        ).get("template_state")
                                        == "saved"
                                        and k
                                        in [
                                            mem["member"]
                                            for mem in (
                                                single_query_template_collection(
                                                    {"_id": v}
                                                ).get("auth_viewers", [])[0]
                                            )
                                        ]
                                    ):
                                        register_single_user_access(
                                            step, step.get("stepRole"), k
                                        )
                                        finalized.append(v)
                                    else:
                                        continue

                        else:
                            if (
                                template_id not in current_temp_map
                            ) and not check_step_items_state(current_temp_map):
                                if step.get("stepTaskType") == "assign_task":
                                    step1_templates = []
                                    for i in range(1, len(steps)):
                                        current_idx = i
                                        prev_temps = steps[current_idx - 1].get(
                                            "stepDocumentCloneMap"
                                        )
                                        if prev_temps:
                                            for item in prev_temps:
                                                key = next(iter(item))
                                                my_key = item[key]

                                                if (
                                                    "accessed" in item
                                                    and single_query_template_collection(
                                                        {"_id": my_key}
                                                    ).get(
                                                        "template_state"
                                                    )
                                                    == "saved"
                                                ):
                                                    step1_templates.append(my_key)

                                        for template in step1_templates:
                                            for user in step.get("stepTeamMembers"):
                                                authorize(
                                                    template,
                                                    user,
                                                    process_id,
                                                    process_type,
                                                )
                                                step.get("stepDocumentCloneMap").append(
                                                    {user["member"]: template}
                                                )
                                                # Change auth viewers in the metadata as well
                                                metadata_id = get_metadata_id(
                                                    template, process_type
                                                )

                                                authorize_metadata(
                                                    metadata_id,
                                                    user,
                                                    process_id,
                                                    process_type,
                                                )
                                            for user in step.get("stepPublicMembers"):
                                                authorize(
                                                    template,
                                                    user,
                                                    process_id,
                                                    process_type,
                                                )
                                                step.get("stepDocumentCloneMap").append(
                                                    {user["member"]: template}
                                                )
                                                # Change auth viewers in the metadata as well
                                                metadata_id = get_metadata_id(
                                                    template, process_type
                                                )
                                                authorize_metadata(
                                                    metadata_id,
                                                    user,
                                                    process_id,
                                                    process_type,
                                                )
                                            for user in step.get("stepUserMembers"):
                                                authorize(
                                                    template,
                                                    user,
                                                    process_id,
                                                    process_type,
                                                )
                                                step.get("stepDocumentCloneMap").append(
                                                    {user["member"]: template}
                                                )
                                                # Change auth viewers in the metadata as well
                                                metadata_id = get_metadata_id(
                                                    template, process_type
                                                )
                                                authorize_metadata(
                                                    metadata_id,
                                                    user,
                                                    process_id,
                                                    process_type,
                                                )
                    else:
                        if step.get("stepTaskType") == "assign_task":
                            step1_templates = []
                            for i in range(1, len((steps))):
                                current_idx = i
                                prev_templates = steps[current_idx - 1].get(
                                    "stepDocumentCloneMap"
                                )
                                if prev_templates:
                                    for item in prev_templates:
                                        key = next(iter(item))
                                        my_key = item[key]

                                        if (
                                            "accessed" in item
                                            and single_query_template_collection(
                                                {"_id": my_key}
                                            ).get("template_state")
                                            == "saved"
                                        ):
                                            step1_templates.append(my_key)
                                for template in step1_templates:
                                    for user in step.get("stepTeamMembers"):
                                        authorize(
                                            template, user, process_id, process_type
                                        )
                                        step.get("stepDocumentCloneMap").append(
                                            {user["member"]: template}
                                        )
                                        # Change auth viewers in the metadata as well
                                        metadata_id = get_metadata_id(
                                            template, process_type
                                        )
                                        authorize_metadata(
                                            metadata_id, user, process_id, process_type
                                        )
                                    for user in step.get("stepPublicMembers"):
                                        authorize(
                                            template, user, process_id, process_type
                                        )
                                        step.get("stepDocumentCloneMap").append(
                                            {user["member"]: template}
                                        )
                                        # Change auth viewers in the metadata as well
                                        metadata_id = get_metadata_id(
                                            template, process_type
                                        )
                                        authorize_metadata(
                                            metadata_id, user, process_id, process_type
                                        )
                                    for user in step.get("stepUserMembers"):
                                        authorize(
                                            template, user, process_id, process_type
                                        )
                                        step.get("stepDocumentCloneMap").append(
                                            {user["member"]: template}
                                        )
                                        # Change auth viewers in the metadata as well
                                        metadata_id = get_metadata_id(
                                            template, process_type
                                        )
                                        authorize_metadata(
                                            metadata_id, user, process_id, process_type
                                        )

                        update_process(process_id, steps, processing_state)
                # Check that all documents are finalized
                all_accessed_true = check_all_finalized_true(steps, process_type)
                if all_accessed_true == True:
                    update_process(process_id, steps, "finalized")
                else:
                    update_process(process_id, steps, "processing")
        except Exception as e:
            print(e)
            finalize_item(self.item_id, "saved", self.item_type, self.message)
            return
