import qrcode
import json
import uuid
import jwt
from threading import Thread
from .threads import notification, save_link_hashes
from app.constants import VERIFICATION_LINK


def process_links(
    process_id,
    document_id,
    step_role,
    auth_name,
    auth_portfolio,
    company_id,
    process_title,
):
    """
    Create a JWT encoded unique verification link

    Args:
        process_id (str): the object id of the process
        document_id(str): the object id of the document
        step_role(str): the authorized step role.
        auth_name(str): the authorized username.
        auth_portfolio(str): the authorized user portfolio
        company_id (str): the object id of the company
        process_title (str): the name of the process title

    Returns:
        A unique verification link with the jwt hash
    """

    # create a jwt token
    # hash_token = jwt.encode(
    #     json.loads(
    #         json.dumps(
    #             {
    #                 "process_id": process_id,
    #                 "document_id": document_id,
    #                 "step_role": step_role,
    #                 "auth_name": auth_name,
    #                 "auth_portfolio": auth_portfolio,
    #             }
    #         )
    #     ),
    #     "secret",
    #     algorithm="HS256",
    # )
    hash = uuid.uuid4().hex
    data = {
        "username": auth_name,
        "portfolio": auth_portfolio,
        "process_id": process_id,
        "step_role": step_role,
        "document_id": document_id,
        # "company_id": company_id,
        "unique_hash": hash,
        "process_title": process_title,
        "link": f"{VERIFICATION_LINK}/{hash}/",
    }
    # save link
    Thread(target=save_link_hashes, args=(data,)).start()

    ddata = {
        "username": auth_name,
        "portfolio": auth_portfolio,
        "process_id": process_id,
        "step_role": step_role,
        "document_id": document_id,
        "company_id": company_id,
        "process_title": process_title,
        "link": f"{VERIFICATION_LINK}/{hash}/",
    }
    # setup notification
    Thread(target=notification, args=(ddata,)).start()

    return f"{VERIFICATION_LINK}/{hash}/"


def process_qrcode(process_id, document_id, step_role, auth_name, auth_portfolio):
    """
    Generates a qrcode for the data provided and stores the qrcodes

    Args:
        process_id (str): the object id of the process
        document_id(str): the object id of the document
        step_role(str): the authorized step role.
        auth_name(str): the authorized username.
        auth_portfolio(str): the authorized user portfolio

    Returns:
        qrcode link based on that data.
    """
    # create a jwt token
    hash_token = jwt.encode(
        json.loads(
            json.dumps(
                {
                    "process_id": process_id,
                    "document_id": document_id,
                    "step_role": step_role,
                    "auth_name": auth_name,
                    "auth_portfolio": auth_portfolio,
                }
            )
        ),
        "secret",
        algorithm="HS256",
    )
    # qr_path = f"100094.pythonanywhere.com/media/qrcodes/{uuid.uuid4().hex}.png"
    # qr_url = f"https://{qr_path}"
    qr_path = f"media/qrcodes/{uuid.uuid4().hex}.png"
    qr_url = f"https://100094.pythonanywhere.com/{qr_path}"
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
