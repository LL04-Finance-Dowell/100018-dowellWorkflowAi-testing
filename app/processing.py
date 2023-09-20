import json
import urllib.parse
import uuid
from threading import Thread
import os

# from dotenv import load_dotenv

# load_dotenv()
import qrcode
import requests

from app.checks import (
    check_items_state,
    check_that_process_documents_are_finalized,
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
    check_items_state,
    check_all_finalized_true,
    check_step_items_state,
    check_user_in_auth_viewers,
    get_metadata_id,
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
    single_query_clones_collection,
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
                    "process_kind": "original",
                }
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
                    "process_kind": "original",
                }
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
        current_env = os.environ.get("ENV")
        staging_path = os.environ.get("STAGING_PATH")
        production_path = os.environ.get("PRODUCTION_PATH")
        if current_env == "PRODUCTION":
            qr_path = f"{production_path}/qrcodes/{uuid.uuid4().hex}.png"
        elif current_env == "STAGING":
            qr_path = f"{staging_path}/qrcodes/{uuid.uuid4().hex}.png"
        else:
            qr_path = f"media/qrcodes/{uuid.uuid4().hex}.png"  # On dev
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
        current_env = os.environ.get("ENV")
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
        HandleProcess.notify(
            auth_name, item_id, portfolio, company_id, utp_link, org_name
        )
        # utp_code = HandleProcess.generate_qrcode(utp_link)
        utp_code = "coming_soon"
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
        users = []
        for m in step.get("stepTeamMembers", []) + step.get("stepUserMembers", []):
            users.append(m)
        public = [m for m in step.get("stepPublicMembers", [])]
        if users:
            clone_id = cloning_document(
                parent_item_id, users, parent_item_id, process_id
            )
            clones = [clone_id]
            for u in users:
                step.get("stepDocumentCloneMap").append({u["member"]: clone_id})
        if public:
            public_clone_ids = []
            for u in public:
                public_clone_ids.append(
                    {
                        u["member"]: cloning_document(
                            parent_item_id, [u], parent_item_id, process_id
                        )
                    }
                )
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
        public_api_key = None
        m_link = None
        link_string = "link"
    
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
        if public_links:
            document_id = self.process["parent_item_id"]
            res = single_query_document_collection({"_id": document_id})
            document_name = res["document_name"]
            m_link, m_code = HandleProcess.generate_public_qrcode(
                public_links, self.process["company_id"], document_name
            )
            links.append({"master_link": m_link})
            qrcodes.append({"master_qrcode": m_code})
        save_to_links_collection(
            {
                "links": links,
                "process_id": process_id,
                "clone_ids": clone_ids,
                "company_id ": company_id,
                "public_api_key": public_api_key,
            }
        )
        update_process(
            process_id,
            steps,
            "processing",
        )
        Thread(
            target=lambda: save_to_qrcode_collection(
                {
                    "qrcodes": qrcodes,
                    "process_id": self.process["_id"],
                    "item_id": clone_ids,
                    "processing_action": self.process["processing_action"],
                    "process_title": self.process["process_title"],
                    "company_id": self.process["company_id"],
                }
            )
        ).start()
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
                    print(user_name)
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
    def verify_access_v2(self, auth_role, user_name, user_type, document_id):
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
                    print(user_name)
                    user_name = user_name[0]
                if any(user_name in map for map in step.get("stepDocumentCloneMap")):
                    for d_map in step["stepDocumentCloneMap"]:
                        if d_map.get(user_name) is not None:
                            print("doc_map: ", d_map)
                            if d_map.get(user_name) == document_id:
                                clone_id = d_map.get(user_name)
                            # clone_id = d_map.get(user_name)
                    doc_map = step["stepDocumentMap"]
                    right = step["stepRights"]
                    role = step["stepRole"]
        if clone_id:
            print("clone_id: ", clone_id)
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


class Background:
    def __init__(self, process, item_type, item_id, role, username):
        self.process = process
        self.item_type = item_type
        self.item_id = item_id
        self.role = role
        self.username = username

    def register_user_access(process_steps, authorized_role, user):
        """Once someone has made changes to their docs"""
        for step in process_steps:
            if step["stepRole"] == authorized_role:
                for clone_map in step["stepDocumentCloneMap"]:
                    if user in clone_map:
                        clone_map["accessed"] = True
                        continue

    def processing(self):
        steps = self.process["process_steps"]
        parent_id = self.process["parent_item_id"]
        process_id = self.process["_id"]
        process_type = self.process["process_type"]
        document_id = self.item_id
        processing_state = self.process["processing_state"]
        created_by = self.process["created_by"]
        # Background.register_user_access(
        #     self.process["process_steps"], self.role, self.username
        # )

        finalized = []
        try:
            no_of_steps = sum(isinstance(e, dict) for e in steps)
            if no_of_steps > 0:
                for index, step in enumerate(steps):
                    if step["stepDocumentCloneMap"]:
                        current_doc_map = [v for document_map in step["stepDocumentCloneMap"] for k, v in document_map.items() if isinstance(v, str)]
                        print(f"current_step_documents (step-{index}): ", current_doc_map)
                        
                        user_in_viewers = check_user_in_auth_viewers(user=self.username, item=document_id)
                        # print("user_in_viewers: ", user_in_viewers)

                        if (not user_in_viewers):
                            # print("all finalized", check_step_items_state(current_doc_map))
                            # print("user_in_viewers: ", user_in_viewers)
                            pass
                        elif document_id in current_doc_map:
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
                                    users = [
                                        user
                                        for user in step.get("stepTeamMembers", [])
                                        + step.get("stepPublicMembers", [])
                                        + step.get("stepUserMembers", [])
                                    ]
                                    for user in users:
                                        clone_id = cloning_clone(
                                            document_id, [user], parent_id, process_id
                                        )
                                        step.get("stepDocumentCloneMap").append(
                                            {user["member"]: clone_id}
                                        )
                                if step.get("stepTaskType") == "assign_task":
                                    step1_documents = []
                                    for i in range(1, len(steps)):
                                        current_idx = i
                                        prev_docs = steps[current_idx - 1].get(
                                            "stepDocumentCloneMap"
                                        )
                                        if prev_docs:
                                            for item in prev_docs:
                                                key = next(iter(item))
                                                my_key = item[key]
                                                if (
                                                    "accessed" in item
                                                    and single_query_clones_collection(
                                                        {"_id": my_key}
                                                    ).get("document_state")
                                                    == "finalized"
                                                ):
                                                    step1_documents.append(my_key)
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
                                                metadata_id = get_metadata_id(
                                                    document, "document"
                                                )
                                                authorize_metadata(
                                                    metadata_id, user, process_id, "document"
                                                )
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
                                                metadata_id = get_metadata_id(
                                                    document, "document"
                                                )
                                                authorize_metadata(
                                                    metadata_id, user, process_id, "document"
                                                )
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
                                                metadata_id = get_metadata_id(
                                                    document, "document"
                                                )
                                                authorize_metadata(
                                                    metadata_id, user, process_id, "document"
                                                )
                    else:
                        if step.get("stepTaskType") == "request_for_task":
                            users = [
                                user
                                for user in step.get("stepTeamMembers", [])
                                + step.get("stepPublicMembers", [])
                                + step.get("stepUserMembers", [])
                            ]
                            for user in users:
                                clone_id = cloning_clone(
                                    document_id, [user], parent_id, process_id
                                )
                                step.get("stepDocumentCloneMap").append(
                                    {user["member"]: clone_id}
                                )
                        if step.get("stepTaskType") == "assign_task":
                            step1_documents = []
                            for i in range(1, len(steps)):
                                current_idx = i
                                prev_docs = steps[current_idx - 1].get(
                                    "stepDocumentCloneMap"
                                )
                                if prev_docs:
                                    for item in prev_docs:
                                        key = next(iter(item))
                                        my_key = item[key]
                                        if (
                                            "accessed" in item
                                            and single_query_clones_collection(
                                                {"_id": my_key}
                                            ).get("document_state")
                                            == "finalized"
                                        ):
                                            step1_documents.append(my_key)
                                for document in step1_documents:
                                    for user in step.get("stepTeamMembers"):
                                        authorize(
                                            document, user, process_id, "document"
                                        )
                                        step.get("stepDocumentCloneMap").append(
                                            {user["member"]: document}
                                        )
                                        # Change auth viewers in the metadata as well
                                        metadata_id = get_metadata_id(
                                            document, "document"
                                        )
                                        authorize_metadata(
                                            metadata_id, user, process_id, "document"
                                        )
                                    for user in step.get("stepPublicMembers"):
                                        authorize(
                                            document, user, process_id, "document"
                                        )
                                        step.get("stepDocumentCloneMap").append(
                                            {user["member"]: document}
                                        )
                                        # Change auth viewers in the metadata as well
                                        metadata_id = get_metadata_id(
                                            document, "document"
                                        )
                                        authorize_metadata(
                                            metadata_id, user, process_id, "document"
                                        )
                                    for user in step.get("stepUserMembers"):
                                        authorize(
                                            document, user, process_id, "document"
                                        )
                                        step.get("stepDocumentCloneMap").append(
                                            {user["member"]: document}
                                        )
                                        # Change auth viewers in the metadata as well
                                        metadata_id = get_metadata_id(
                                            document, "document"
                                        )
                                        authorize_metadata(
                                            metadata_id, user, process_id, "document"
                                        )
                        update_process(process_id, steps, processing_state)
                # Check that all documents are finalized
                all_accessed_true = check_all_finalized_true(steps)
                if all_accessed_true:
                    update_process(process_id, steps, "finalized")
                else:
                    update_process(process_id, steps, "processing")
        except Exception as e:
            print("got error", e)
            finalize_item(self.item_id, "processing", self.item_type)
            return
