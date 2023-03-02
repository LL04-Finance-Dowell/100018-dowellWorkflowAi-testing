import ast
import json

import requests
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from database.mongo_db_connection import (
    get_document_object,
    get_document_list,
    get_links_object_by_process_id, delete_document
)
from database.mongo_db_connection_v2 import save_document
from .thread_start import ThreadAlgolia,UpdateThreadAlgolia

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
            {"documents": [], "message": "Failed to process document creation."},
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
                parent_id=None
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
    my_dict = ast.literal_eval(
        get_document_object(document_id)["content"]
    )[0][0]
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
        return Response("Document Added to trash", status=status.HTTP_200_OK, )
    except ConnectionError:
        return Response("Failed to add to trash", status=status.HTTP_200_OK)


# ------------------------@deprecated-------------------
@api_view(["POST"])
def documents_to_be_signed(
        request,
):  # List of `to be signed` documents. State being processing.
    try:
        filtered_documents = []
        for d in get_document_list(request.data["company_id"]):
            if (
                    d.get("state") == "processing"
                    and d.get("company_id") == request.data["company_id"]
                    and check_allowed(
                process_id=d.get("workflow_process"),
                user_name=request.data["user_name"],
            )
            ):
                filtered_documents.append(d)

        if len(filtered_documents) > 0:
            return Response(filtered_documents, status=status.HTTP_200_OK)
        return Response([], status=status.HTTP_200_OK)
    except ConnectionError:
        return Response([], status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def documents_to_be_signed(request):  # List of `to be signed` documents.
    try:
        filtered_documents = []
        for d in get_document_list(request.data["company_id"]):
            if "workflow_process" in d:
                if d.get("company_id") == request.data["company_id"] and check_allowed(
                        process_id=d.get("workflow_process"),
                        user_name=request.data["user_name"],
                ):
                    filtered_documents.append(d)
        if len(filtered_documents) > 0:
            return Response(filtered_documents, status=status.HTTP_200_OK)
        return Response([], status=status.HTTP_200_OK)
    except ConnectionError:
        print("got error...... \n")
        return Response([], status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# check presence
def check_allowed(process_id, user_name):
    print("checking allowed... \n")
    processing_links_info = get_links_object_by_process_id(process_id)
    if processing_links_info:
        for link in processing_links_info["links"]:
            if user_name in link:
                flag = True
                return flag
    return False


@api_view(["POST"])
def my_documents(request):  # List of my documents.
    filtered_list = []
    if request.method == "POST":
        created_by = request.data["created_by"]
        company_id = request.data["company_id"]
        data_type = request.data["data_type"]
        documents = get_document_list(company_id)
        if not documents:
            return Response(
                {
                    "documents": [],
                    "message": "There is no document created by This user.",
                },
                status=status.HTTP_200_OK,
            )
        else:
            for doc in documents:
                try:
                    if (
                            doc["created_by"] == created_by
                            and doc["data_type"] == data_type
                    ):
                        filtered_list.append(doc)
                except ConnectionError:

                    filtered_list = []

        return Response(
            {"documents": filtered_list, "title": "My Documents"},
            status=status.HTTP_200_OK,
        )


@api_view(["GET", "POST"])
def rejected_documents(request):  # List of `to be signed` documents.
    filtered_list = []
    created_by = request.data["created_by"]
    company_id = request.data["company_id"]
    documents = get_document_list(company_id)

    for doc in documents:

        if len(doc["reject_message"]) != 0 and len(doc["rejected_by"]) != 0:
            filtered_list.append(doc)

    return Response(
        {
            "documents": filtered_list,
        },
        status=status.HTTP_200_OK,
    )


# return Response(
#     {
#         "documents": [],
#         "message": "These document is not in Rejected Document list.",
#     },
#     status=status.HTTP_200_OK,
# )


@api_view(["POST"])
def draft_documents(request):  # List of `to be signed` documents.

    try:
        return Response(
            {"documents": get_document_list(request.data["company_id"])},
            status=status.HTTP_200_OK,
        )
    except:
        return Response(
            {"documents": [], "title": "No Document Found"},
            status=status.HTTP_200_OK,
        )


# --------------------------- HELPERS ----------------------------------------
def get_auth_roles(document_obj):
    role_list = list()
    content = document_obj["content"]
    res_content_obj = json.loads(content)
    for i in res_content_obj[0]:
        role_list.append(i["auth_user"])
    return role_list

def document_index_update(payload):
    try:
        UpdateThreadAlgolia(payload).start()
    except:
        ThreadAlgolia(payload["_id"], get_document_object).start()
