import json
import timeit
import itertools
import requests
import jwt

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .mongo_db_connection import (
    get_template_list,
    get_document_list,
    save_document,
    get_document_object,
    get_template_object,
    update_document,
    get_wf_object,
    get_wf_list,
    get_user_info_by_username,
    get_members,
)

# print(get_template_object("6365f9c2ff915c925f3a67f4"))
@api_view(["GET", "POST"])
def create_document(request):  # Document Creation.
    editorApi = "https://100058.pythonanywhere.com/dowelleditor/editor/"

    if request.method == "POST":
        data = ""
        form = request.data  # TODO: We will get the data from form 1 by 1 - Dont Worry.
        if not form:
            return Response(
                {"message": "Failed to process document creation."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        else:
            template_id = request.data["template_id"]
            document_name = ""
            created_by = request.data["created_by"]
            company_id = request.data["company_id"]
            # data = get_content_from_template_collection_with_that_template_id
            data = get_template_object(template_id)
            res = json.loads(
                save_document(document_name, template_id, data, created_by, company_id)
            )

            if res["isSuccess"]:

                payload = {
                    "product_name": "workflowai",
                    # "details":{
                    "id": res["inserted_id"],
                    "fields": "document_name",
                    "cluster": "Documents",
                    "database": "Documentation",
                    "collection": "DocumentReports",
                    "document": "documentreports",
                    "team_member_ID": "11689044433",
                    "function_ID": "ABCDE",
                    "document_name": document_name,
                    "content": data
                    # }
                }

                editor_link = requests.post(
                    editorApi,
                    data=payload,
                )
                return Response(
                    editor_link.json(),
                    status=status.HTTP_201_CREATED,
                )
            return Response(
                {"message": "Unable to Create Document"},
                status=status.HTTP_405_METHOD_NOT_ALLOWED,
            )

    return Response(
        {"message": "You Need To Be LoggedIn"}, status=status.HTTP_400_BAD_REQUEST
    )


@api_view(["POST"])
def document_detail(request):  # Single document
    editorApi = "https://100058.pythonanywhere.com/dowelleditor/editor/"

    if request.method == "POST":
        if not request.data:
            return Response(
                {"message": "Failed to Load Document."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        document_id = request.data["document_id"]
        document_name = request.data["document_name"]

        payload = {
            "product_name": "workflowai",
            # "details": {
            "fields": "document_name",
            "cluster": "Documents",
            "database": "Documentation",
            "collection": "DocumentReports",
            "document": "documentreports",
            "team_member_ID": "11689044433",
            "function_ID": "ABCDE",
            "document_name": document_name,
            "document_id": document_id,
            # }
        }
        editor_link = requests.post(
            editorApi,
            data=payload,
        )
        return Response(
            editor_link.json(),
            status=status.HTTP_200_OK,
        )

    return Response(
        {"message": "This Document is Not Loaded."}, status=status.HTTP_400_BAD_REQUEST
    )


@api_view(["GET", "POST"])
def documents_to_be_signed(request):  # List of `to be signed` documents.
    editorApi = "https://100058.pythonanywhere.com/dowelleditor/editor/"
    filtered_list = []

    if request.method == "POST":
        company_id = request.data["company_id"]

        documents = get_document_list(company_id)

        try:
            for doc in documents:
                if len(doc["reject_message"]) == 0 and len(doc["rejected_by"]) == 0:

                    filtered_list.append(doc)

            # for doc in documents:
            #     workflow = get_wf_object(doc["workflow_id"])
            #     if not workflow:
            #         rejected =True

            #     else:
            #         rejected=False
            #         for obj in workflow["int_wf_string"]:
            #             if str(obj[0]) == str(doc["int_wf_position"]) and str(obj[-1]):
            #                 # Internal Workflow signatures
            #                 filtered_list.append(doc)
            #         for obj in workflow["ext_wf_string"]:
            #             if str(obj[0]) == str(doc["ext_wf_position"]) and str(obj[-1]):
            #                 # External Workflow signatures
            #                 filtered_list.append(doc)
        except:
            return Response(
                {"message": "An Error Occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            {
                "documents": filtered_list,
            },
            status=status.HTTP_200_OK,
        )
    return Response(
        {"message": "These document is Rejected Document."},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )


@api_view(["POST"])
def my_documents(request):  # List of my documents.
    filtered_list = []
    if request.method == "POST":
        created_by = request.data["created_by"]
        company_id = request.data["company_id"]
        documents = get_document_list(company_id)
        if not documents:
            return Response(
                {"message": "There is no document created by This user."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        else:
            for doc in documents:

                if doc["created_by"] == created_by:
                    filtered_list.append(doc)

        return Response(
            {"documents": filtered_list, "title": "My Documents"},
            status=status.HTTP_200_OK,
        )


# @api_view(["GET"])
# def draft_documents(request):  # List of Draft Documents.
#     executed = False
#     title = "Draft Documents."
#     filtered_list = []

#     if request.method=="POST":
#         company_id=request.data['company_id']
#         user=request.data['created_by']
#         documents = get_document_list(company_id)
#         if not documents:
#             return Response(
#                 {"message": "An Error Occurred."},
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             )
#         else:
#             for doc in documents:
#                 workflow = get_wf_object(doc["workflow_id"])
#                 if not workflow:
#                     return Response(
#                         {"message": "An Error Occurred."},
#                         status=status.HTTP_500_INTERNAL_SERVER_ERROR,
#                     )
#                 for obj in workflow["int_wf_string"]:
#                     if str(obj[0]) == str(doc["int_wf_position"]) and str(obj[-1]) == user:
#                         print("ur time for internal workflow")
#                     if (
#                         workflow["ext_wf_string"][0] == doc["ext_wf_position"]
#                         and workflow["ext_wf_string"][-1] == user
#                     ):
#                         print("ur time for external workflow")
#                     doc["document_id"] = doc["_id"]
#                     if doc["created_by"] == user:
#                         filtered_list.append(doc)

#     return Response(
#         {"documents": filtered_list, "title": title}, status=status.HTTP_200_OK)


# @api_view(["GET"])
# def rejected_documents(request,company_id="6365ee18ff915c925f3a6691"):  # List of rejected documents.
#     rejected = True
#     signing = True
#     title = "Rejected Documents"
#     filtered_list = []
#     user = request.user
#     if not user:
#         return Response(
#             {"message": "You Must Be LoggedIn"}, status=status.HTTP_401_UNAUTHORIZED
#         )
#     # documents = get_document_list(request.session["company_id"])
#     documents = get_document_list("6365ee18ff915c925f3a6691")
#     if not documents:
#         return Response(
#             {"message": "An Error Occurred."},
#             status=status.HTTP_500_INTERNAL_SERVER_ERROR,
#         )
#     try:
#         for doc in documents:
#             workflow = get_wf_object(doc["workflow_id"])
#             for obj in workflow["int_wf_string"]:
#                 if str(obj[0]) == str(doc["int_wf_position"]) and str(obj[-1]) == user:
#                     print("Part of Internal Workflow signatures------------ \n")
#                     filtered_list.append(doc)
#             for obj in workflow["ext_wf_string"]:
#                 if str(obj[0]) == str(doc["ext_wf_position"]) and str(obj[-1]) == user:
#                     print("Part of External Workflow signatures------------ \n")
#                     filtered_list.append(doc)
#     except:
#         return Response(
#             {"message": "An Error Occurred."},
#             status=status.HTTP_500_INTERNAL_SERVER_ERROR,
#         )
#     return Response(
#         {
#             "documents": filtered_list,
#             # "Role": request.session["Role"],
#             "Role": "Admin",
#             "signing": signing,
#             "rejected": rejected,
#             "title": title,
#         },
#         status=status.HTTP_200_OK,
#     )


@api_view(["GET", "POST"])
def rejected_documents(request):  # List of `to be signed` documents.
    filtered_list = []
    if request.method == "POST":
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
    return Response(
        {"message": "These document is not in Rejected Document list."},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )


@api_view(["GET", "POST"])
def draft_documents(request):  # List of `to be signed` documents.
    title = "Draft Documents."
    filtered_list = []
    if request.method == "POST":
        company_id = request.data["company_id"]
        documents = get_document_list(company_id)
        try:
            for doc in documents:
                if (
                    doc["int_wf_step"] != "complete"
                    and doc["ext_wf_step"] != "complete"
                ):
                    filtered_list.append(doc)
            return Response(
                {
                    "documents": filtered_list,
                },
                status=status.HTTP_200_OK,
            )
        except:
            return Response(
                {"message": "An Error Occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
    return Response(
        {"message": "No Document in Drafts"},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )


@api_view(["POST"])
def reject_document(request, *args, **kwargs):  # Reject a reqeust to sign a document.
    if request.method == "POST" and request.user:
        body = json.loads(request.body)
        doc = get_document_object(body["file_id"])
        wf = get_wf_object(doc["workflow_id"])
        if not doc:
            return Response(
                {"message": "An Error Occurred!"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        if not wf:
            return Response(
                {"message": "An Error Occurred!"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # if doc and wf:
        int_wf_steps = wf["int_wf_string"]
        ext_wf_steps = wf["ext_wf_string"]
        user = get_user_info_by_username(request.session["user_name"])
        if not user:
            return Response(
                {"message": "You Need To Be LoggedIn"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if get_user_in_workflow(user, wf["int_wf_string"]) or get_user_in_workflow(
            user, wf["ext_wf_string"]
        ):
            # Intenal Workflow.
            if wf["int_wf_string"] != [] and doc["int_wf_step"] != "complete":
                if doc["int_wf_position"] > 0:
                    doc = json.loads(
                        update_document(
                            doc["_id"],
                            {
                                "int_wf_position": doc["int_wf_position"] - 1,
                                "int_wf_step": int_wf_steps[doc["int_wf_position"] - 1][
                                    0
                                ],
                                "reject_message": body["reason"],
                                "rejected_by": request.session["user_name"],
                            },
                        )
                    )
                else:
                    doc = json.loads(
                        update_document(
                            doc["_id"],
                            {
                                "int_wf_position": 0,
                                "int_wf_step": "",
                                "reject_message": body["reason"],
                                "rejected_by": request.session["user_name"],
                            },
                        )
                    )
                    # External Workflow.
            if wf["ext_wf_string"] != "" and doc["ext_wf_step"] != "complete":
                if doc["ext_wf_position"] > 0:
                    doc = json.loads(
                        update_document(
                            doc["_id"],
                            {
                                "ext_wf_position": doc["ext_wf_position"] - 1,
                                "ext_wf_step": ext_wf_steps[doc["ext_wf_position"] - 1][
                                    0
                                ],
                                "reject_message": body["reason"],
                                "rejected_by": request.session["user_name"],
                            },
                        )
                    )
            else:
                return Response(
                    {"message": "Unable to Reject Document."},
                    status=status.HTTP_300_MULTIPLE_CHOICES,
                )

            return Response(
                {"message": "Document Rejection Success"},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"message": "Workflow Authority is Missing for this user."},
                status=status.HTTP_403_FORBIDDEN,
            )
    else:
        return Response(
            {"message": "An Error Occurred!"}, status=status.HTTP_400_BAD_REQUEST
        )


# --------------------------- HELPERS ----------------------------------------
def get_auth_roles(document_obj):
    role_list = list()
    content = document_obj["content"]
    res_content_obj = json.loads(content)
    for i in res_content_obj[0]:
        role_list.append(i["auth_user"])
    return role_list

# user in a given workflow.
def get_user_in_workflow(user, wf):
    status = False
    for step in wf:
        if user["Email"] == step[1]:
            status = True
    return status
