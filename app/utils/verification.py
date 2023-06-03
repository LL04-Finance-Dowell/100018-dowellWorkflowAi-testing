import json
import urllib.parse
import uuid

import qrcode
import requests

from app.constants import NOTIFICATION_API, VERIFICATION_LINK
from app.utils.mongo_db_connection import save_uuid_hash


class Verification:
    product = "Workflow AI"

    def __init__(
        self,
        process_id,
        item_id,
        company_id,
        item_type,
        org_name,
    ):
        self.process_id = process_id
        self.item_id = item_id
        self.company_id = company_id
        self.item_type = item_type
        self.org_name = org_name
        self.params = {
            "org": self.org_name,
            "product": Verification.product,
        }

    @staticmethod
    def parse_url(params):
        return urllib.parse.urlencode(params)

    @staticmethod
    def generate_qrcode(link):
        qr_path = f"100094.pythonanywhere.com/media/qrcodes/{uuid.uuid4().hex}.png"
        # qr_path = f"media/qrcodes/{uuid.uuid4().hex}.png"  # On dev
        qr_code = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H)
        qr_code.add_data(link)
        qr_code.make()
        qr_color = "black"
        qr_img = qr_code.make_image(fill_color=qr_color, back_color="#DCDCDC")
        qr_img.save(qr_path)
        return f"https://{qr_path}"

    @staticmethod
    def notify(auth_name, doc_id, portfolio, company_id, link):
        requests.post(
            NOTIFICATION_API,
            json.dumps(
                {
                    "username": auth_name,
                    "documentId": doc_id,
                    "portfolio": portfolio,
                    "companyId": company_id,
                    "link": link,
                    "productName": "Workflow AI",
                    "title": "Document to Sign",
                    "orgName": "WorkflowAi",
                    "message": "You have a document to sign.",
                    "duration": "no limit",
                }
            ),
            {"Content-Type": "application/json"},
        )
        return

    def public_bulk_data(self, auth_name, step_role, portfolio, user_type):
        hash = uuid.uuid4().hex
        link = f"{VERIFICATION_LINK}/{hash}/"
        for i in range(0, len(auth_name)):
            field = auth_name[i]
            self.params[f"username[{i}]"] = field
        self.params["auth_role"] = step_role
        self.params["user_type"] = user_type
        self.params["portfolio"] = portfolio
        encoded_params = Verification.parse_url(self.params)
        new_link = f"{link}?{encoded_params}"
        save_uuid_hash(
            new_link,
            self.process_id,
            self.item_id,
            step_role,
            auth_name,
            portfolio,
            hash,
            self.item_type,
        )
        Verification.notify(
            auth_name, self.item_id, portfolio, self.company_id, new_link
        )
        return new_link, Verification.generate_qrcode(new_link)

    def user_team_public_data(self, auth_name, step_role, portfolio, user_type):
        hash = uuid.uuid4().hex
        link = f"{VERIFICATION_LINK}/{hash}/"
        params = self.params
        params["username"] = auth_name
        params["auth_role"] = step_role
        params["user_type"] = user_type
        params["portfolio"] = portfolio
        encoded_param = Verification.parse_url(params)
        utp_link = f"{link}?{encoded_param}"
        save_uuid_hash(
            utp_link,
            self.process_id,
            self.item_id,
            step_role,
            auth_name,
            portfolio,
            hash,
            self.item_type,
        )
        Verification.notify(
            auth_name, self.item_id, portfolio, self.company_id, utp_link
        )
        return utp_link, Verification.generate_qrcode(utp_link)
