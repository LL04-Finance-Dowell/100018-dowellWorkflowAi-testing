import qrcode
from PIL import Image
from cryptography.fernet import Fernet


def encode(key, text):
    cipher_suite = Fernet(key.encode())
    encoded_text = cipher_suite.encrypt(text.encode())
    return encoded_text


# For Product --------------------------------------------------------------
def qrgen(brand_logo, link, brand_name, brand_product_name, outimg, logoname):

    # taking image which user wants in the QR code center
    Logo_link = brand_logo

    brand_logo = Image.open(Logo_link)

    # taking base width
    basewidth = 100

    # adjust image size
    wpercent = basewidth / float(brand_logo.size[0])
    hsize = int((float(brand_logo.size[1]) * float(wpercent)))
    brand_logo = brand_logo.resize((basewidth, hsize), Image.ANTIALIAS)
    QRcode = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H)

    # taking url or text
    url = f"{link}?brand={brand_name}&product={brand_product_name}&logo={logoname}"

    # adding URL or text to QRcode
    QRcode.add_data(url)

    # generating QR code
    QRcode.make()

    # taking color name from user
    QRcolor = "black"

    # adding color to QR code
    QRimg = QRcode.make_image(fill_color=QRcolor, back_color="#DCDCDC").convert("RGB")

    # set size of QR code
    pos = (
        (QRimg.size[0] - brand_logo.size[0]) // 2,
        (QRimg.size[1] - brand_logo.size[1]) // 2,
    )
    QRimg.paste(brand_logo, pos)

    # save the QR code generated
    QRimg.save(outimg)


# For User --------------------------------------------------------------
def qrgen1(userid, imgout):
    # Data to be encoded
    # Encoding data using make() function
    img = qrcode.make(userid)

    # Saving as an image file
    img.save(imgout)


# For User Data ----------------------------------------------------
def qrgen2(username, link, password, imgout):
    # Encode and gen QR

    loginURL = f"{link}?username={username}&key={password}"

    img = qrcode.make(loginURL)

    img.save(imgout)