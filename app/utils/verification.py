import qrcode
import json
import uuid
import jwt
from threading import Thread
from .threads import notification, save_link_hashes
from app.constants import VERIFICATION_LINK
from app.utils.mongo_db_connection import save_uuid_hash


def process_links(
    process_id,
    item_id,
    step_role,
    auth_name,
    auth_portfolio,
    company_id,
    process_title,
    item_type,
):
    """Create a JWT encoded unique verification link"""

    hash = uuid.uuid4().hex
    link = f"{VERIFICATION_LINK}/{hash}/?auth_user={auth_name}&auth_portfolio={auth_portfolio}&auth_role={step_role}"
    data = {
        "link": link,
        "process_id": process_id,
        "item_id": item_id,
        "step_role": step_role,
        "username": auth_name,
        "portfolio": auth_portfolio,
        "unique_hash": hash,
        "item_type": item_type,
    }
    # save link
    res = save_uuid_hash(
        link=data["link"],
        process_id=data["process_id"],
        item_id=data["item_id"],
        auth_role=data["step_role"],
        user_name=data["username"],
        auth_portfolio=data["portfolio"],
        unique_hash=data["unique_hash"],
        item_type=data["item_type"],
    )

    if res["isSuccess"]:
        # Thread(target=save_link_hashes, args=(data,)).start()
        ddata = {
            "username": auth_name,
            "portfolio": auth_portfolio,
            "process_id": process_id,
            "step_role": step_role,
            "item_id": item_id,
            "company_id": company_id,
            "process_title": process_title,
            "link": link,
        }
        # setup notification
        Thread(target=notification, args=(ddata,)).start()

    return link


def process_qrcode(process_id, item_id, step_role, auth_name, auth_portfolio):
    """Generates a qrcode for the data provided and stores the qrcodes"""

    # create a jwt token
    hash_token = jwt.encode(
        json.loads(
            json.dumps(
                {
                    "process_id": process_id,
                    "item_id": item_id,
                    "step_role": step_role,
                    "auth_user": auth_name,
                    "auth_portfolio": auth_portfolio,
                }
            )
        ),
        "secret",
        algorithm="HS256",
    )
    qr_path = f"100094.pythonanywhere.com/media/qrcodes/{uuid.uuid4().hex}.png"
    qr_url = f"https://{qr_path}"
    # qr_path = f"media/qrcodes/{uuid.uuid4().hex}.png"
    # qr_url = f"https://100094.pythonanywhere.com/{qr_path}"
    qr_code = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H)

    # taking url or text
    url = f"{VERIFICATION_LINK}/{hash_token}/"

    # adding URL or text to QRcode
    qr_code.add_data(url)

    # generating QR code
    qr_code.make()

    # taking color name from user
    qr_color = "black"

    # adding color to QR code
    qr_img = qr_code.make_image(fill_color=qr_color, back_color="#DCDCDC")

    qr_img.save(qr_path)

    return qr_url
