import ast
import json

import requests
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from database.mongo_db_connection import (
    get_document_object,
    get_document_list,
    get_links_object_by_process_id,
    delete_document,
)
from database.mongo_db_connection_v2 import save_document
from .thread_start import ThreadAlgolia, UpdateThreadAlgolia
from .algolia import get_algolia_data

editorApi = "https://100058.pythonanywhere.com/api/generate-editor-link/"


@api_view(["GET"])
def get_documents(request, company_id):  # List of Created Templates.
    print("Getting documents \n")
    document_list = get_document_list(company_id)
    if not document_list:
        return Response({"documents": []}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if len(document_list) > 0:
        return Response(
            {"documents": document_list},
            status=status.HTTP_200_OK,
        )

    return Response(
        {"documents": []},
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
def create_document(request):  # Document Creation.
    print("Creating document \n")
    if not request.data:
        return Response(
            {"message": "Failed to process document creation."},
            status=status.HTTP_200_OK,
        )
    else:
        viewers = [request.data["created_by"]]
        res = json.loads(
            save_document(
                name="Untitled Document",
                data=request.data["content"],
                created_by=request.data["created_by"],
                company_id=request.data["company_id"],
                page=request.data["page"],
                data_type=request.data["data_type"],
                state="draft",
                auth_viewers=viewers,
                document_type="original",
                parent_id=None,
            )
        )
        if res["isSuccess"]:
            payload = json.dumps(
                {
                    "product_name": "workflowai",
                    "details": {
                        "_id": res["inserted_id"],
                        "field": "document_name",
                        "action": "document",
                        "cluster": "Documents",
                        "database": "Documentation",
                        "collection": "DocumentReports",
                        "document": "documentreports",
                        "team_member_ID": "11689044433",
                        "function_ID": "ABCDE",
                        "command": "update",
                        "flag": "editing",
                        "update_field": {
                            "document_name": "",
                            "content": "",
                            "page": "",
                        },
                    },
                }
            )
            headers = {"Content-Type": "application/json"}
            editor_link = requests.request(
                "POST", editorApi, headers=headers, data=payload
            )
            try:
                ThreadAlgolia(res["inserted_id"], get_document_object).start()
                return Response(
                    editor_link.json(),
                    status=status.HTTP_201_CREATED,
                )
            except ConnectionError:
                return Response(
                    {"document": [], "message": "Failed to call editorApi"},
                    status=status.HTTP_200_OK,
                )

        return Response(
            {"document": [], "message": "Unable to Create Document"},
            status=status.HTTP_200_OK,
        )


@api_view(["GET"])
def get_document_content(request, document_id):
    print("Getting document content \n")
    content = []
    my_dict = ast.literal_eval(get_document_object(document_id)["content"])[0][0]
    all_keys = [i for i in my_dict.keys()]
    for i in all_keys:
        temp_list = []
        for j in range(0, len(my_dict[i])):
            temp_list.append({"id": my_dict[i][j]["id"], "data": my_dict[i][j]["data"]})
        content.append(
            {
                i: temp_list,
            }
        )
    return Response(content, status=status.HTTP_200_OK)


@api_view(["GET"])
def document_detail(request, document_id):  # Single document
    print("Get document link \n")
    payload = json.dumps(
        {
            "product_name": "workflowai",
            "details": {
                "cluster": "Documents",
                "database": "Documentation",
                "collection": "DocumentReports",
                "document": "documentreports",
                "team_member_ID": "11689044433",
                "function_ID": "ABCDE",
                "_id": document_id,
                "field": "document_name",
                "action": "document",
                "flag": "editing",
                "command": "update",
                "update_field": {"content": "", "document_name": "", "page": ""},
            },
        }
    )
    headers = {"Content-Type": "application/json"}
    try:
        editor_link = requests.post(editorApi, headers=headers, data=payload)
    except ConnectionError:
        return Response(
            {"document": [], "message": "Failed to call editorApi"},
            status=status.HTTP_200_OK,
        )
    return Response(
        editor_link.json(),
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET"])
def archive_document(request, document_id):
    try:
        delete_document(document_id)
        return Response(
            "Document Added to trash",
            status=status.HTTP_200_OK,
        )
    except ConnectionError:
        return Response("Failed to add to trash", status=status.HTTP_200_OK)
