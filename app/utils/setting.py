import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from app.utils.mongo_db_connection import (
    save_wf_setting,
    get_wf_setting_object,
    wf_setting_update,
)


def versioning(version):
    if version.startswith("New"):
        version = version.removeprefix("New ")
    else:
        version = version.removeprefix("Latest ")
    return version


def version_control(version):
    version = version.split(".")
    if version[-1] != "9":
        version[-1] = str(int(version[-1]) + 1)
    elif version[1] != "9":
        version[-1] = "0"
        version[1] = str(int(version[1]) + 1)
    elif version[-1] == "9" and version[1] != "9":
        version[-1] = "0"
        version[1] = str(int(version[1]) + 1)

    elif version[1] == "9" and version[-1] == "9":
        version[0] = str(int(version[0]) + 1)
        version[1] = "0"
        version[-1] = "0"

    else:
        version[0] = str(int(version[0]) + 1)
    latest = ".".join(version)
    return latest

