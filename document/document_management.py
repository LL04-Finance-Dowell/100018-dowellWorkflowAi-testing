import json
import requests
import ast
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from database.mongo_db_connection import (
    get_document_list,
    save_document,
    get_document_object,
    get_template_object,
    get_links_object_by_process_id,
)

editorApi = "https://100058.pythonanywhere.com/api/generate-editor-link/"


@api_view(["POST"])
def get_documents(request):  # List of Created Templates.
    document_list = get_document_list(request.data["company_id"])

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


@api_view(["GET", "POST"])
def create_document(request):  # Document Creation.

    if request.method == "POST":

        if not request.data:
            return Response(
                {"documents": [], "message": "Failed to process document creation."},
                status=status.HTTP_200_OK,
            )
        else:
            res = json.loads(
                save_document(
                    "Untitled Document",
                    request.data["content"],
                    request.data["created_by"],
                    request.data["company_id"],
                    request.data["page"],
                    request.data["data_type"],
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
                    return Response(
                        editor_link.json(),
                        status=status.HTTP_201_CREATED,
                    )
                except:
                    return Response(
                        {"document": [], "message": "Failed to call editorApi"},
                        status=status.HTTP_200_OK,
                    )

            return Response(
                {"document": [], "message": "Unable to Create Document"},
                status=status.HTTP_200_OK,
            )

    return Response(
        {"document": [], "message": "You Need To Be LoggedIn"},
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
def get_document_content(request):
    content = []
    myDict = ast.literal_eval(
        get_document_object(request.data["document_id"])["content"]
    )[0][0]
    allKeys = [i for i in myDict.keys()]
    for i in allKeys:
        tempList = []
        for j in range(0, len(myDict[i])):
            tempList.append({"id": myDict[i][j]["id"], "data": myDict[i][j]["data"]})
        content.append(
            {
                i: tempList,
            }
        )
    return Response(content, status=status.HTTP_200_OK)


@api_view(["POST"])
def document_detail(request):  # Single document

    if request.method == "POST":
        if not request.data:
            return Response(
                {"document": [], "message": "Failed to Load Document."},
                status=status.HTTP_200_OK,
            )
        document_id = request.data["document_id"]
        data = get_document_object(document_id)
        document_name = data["document_name"]
        page = ""
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

        editor_link = requests.request("POST", editorApi, headers=headers, data=payload)
        try:
            return Response(
                editor_link.json(),
                status=status.HTTP_201_CREATED,
            )
        except:
            return Response(
                {"document": [], "message": "Failed to call editorApi"},
                status=status.HTTP_200_OK,
            )

    return Response(
        {"document": [], "message": "This Document is Not Loaded."},
        status=status.HTTP_200_OK,
    )


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
    except:
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
    except:
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
            []
            for doc in documents:
                try:
                    if (
                        doc["created_by"] == created_by
                        and doc["data_type"] == data_type
                    ):
                        filtered_list.append(doc)
                except:

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
