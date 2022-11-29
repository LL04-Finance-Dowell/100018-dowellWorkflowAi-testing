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


@api_view(["GET","POST"])
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
            template_id = ""
            document_name = ""
            created_by = request.data["created_by"]
            company_id = request.data["company_id"]
            
            res = json.loads(
                save_document(document_name, template_id, data, created_by, company_id)
            )
            
            if res["isSuccess"]:

                payload={
                    "product_name": "workflowai",
                    "details":{
                        "_id":res["inserted_id"],
                        "field":"document_name",
                        "cluster": "Documents",
                        "database": "Documentation",
                        "collection": "DocumentReports",
                        "document": "documentreports",
                        "team_member_ID": "11689044433",
                        "function_ID": "ABCDE",
                        "document_name":document_name,
                        "content":""
                                }
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
       
        payload={
                    "product_name": "workflowai",
                    "details": {
                        "fields":"document_name",
                        "cluster": "Documents",
                        "database": "Documentation",
                        "collection": "DocumentReports",
                        "document": "documentreports",
                        "team_member_ID": "11689044433",
                        "function_ID": "ABCDE",
                        "document_name":document_name,
                        "document_id":document_id,
                    }
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

@api_view(["GET","POST"])
def documents_to_be_signed(request):  # List of `to be signed` documents.
    editorApi = "https://100058.pythonanywhere.com/dowelleditor/editor/"
    filtered_list = []

    if request.method=="POST":
        company_id=request.data['company_id']

        documents = get_document_list(company_id)
   
        try:
            for doc in documents:
                payload={
                    "product_name": "workflowai",
                    "details":{
                        "_id":doc["_id"],
                        "field":"document_name",
                        "cluster": "Documents",
                        "database": "Documentation",
                        "collection": "DocumentReports",
                        "document": "documentreports",
                        "team_member_ID": "11689044433",
                        "function_ID": "ABCDE",
                        "document_name":doc["document_name"],
                        "content":""
                                }
                    }
                if len(doc["reject_message"])==0 and len(doc["rejected_by"])==0:
                   
                    filtered_list.append(requests.post(
                    editorApi,
                    data=payload,
                ).json())
                
                    
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
      
        return Response({
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
    editorApi = "https://100058.pythonanywhere.com/dowelleditor/editor/"
    filtered_list = []
    if request.method=="POST":
        created_by=request.data['created_by']
        company_id=request.data['company_id']
        documents = get_document_list(company_id)
        if not documents:
            return Response(
                {"message": "There is no document with this ID."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        else:
            for doc in documents:
                    payload={
                            "product_name": "workflowai",
                            "details":{
                                "_id":doc["_id"],
                                "field":"document_name",
                                "cluster": "Documents",
                                "database": "Documentation",
                                "collection": "DocumentReports",
                                "document": "documentreports",
                                "team_member_ID": "11689044433",
                                "function_ID": "ABCDE",
                                "document_name":doc["document_name"],
                                "content":""
                                        }
                            }
                    if doc['created_by'] == created_by:
                        filtered_list.append(requests.post(
                            editorApi,
                            data=payload,
                        ).json())

        return Response(
            {"documents": filtered_list, "title": "My Documents"}, status=status.HTTP_200_OK
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

@api_view(["GET","POST"])
def rejected_documents(request):  # List of `to be signed` documents.
    editorApi = "https://100058.pythonanywhere.com/dowelleditor/editor/"
    filtered_list = []
    if request.method=="POST":
        company_id=request.data['company_id']

        documents = get_document_list(company_id)
   
        for doc in documents:
            payload={
                "product_name": "workflowai",
                "details":{
                    "_id":doc["_id"],
                    "field":"document_name",
                    "cluster": "Documents",
                    "database": "Documentation",
                    "collection": "DocumentReports",
                    "document": "documentreports",
                    "team_member_ID": "11689044433",
                    "function_ID": "ABCDE",
                    "document_name":doc["document_name"],
                    "content":""
                            }
                }
            if len(doc["reject_message"])!=0 and len(doc["rejected_by"])!=0:
                
                filtered_list.append(requests.post(
                editorApi,
                data=payload,
            ).json())
                
      
        return Response({
                "documents": filtered_list,
            },
            status=status.HTTP_200_OK,
        )
    return Response(
                    {"message": "These document is not in Rejected Document list."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
    
@api_view(["GET","POST"])
def draft_documents(request):  # List of `to be signed` documents.
    editorApi = "https://100058.pythonanywhere.com/dowelleditor/editor/"
    title = "Draft Documents."
    filtered_list = []
    if request.method=="POST":
        company_id=request.data['company_id']
        documents = get_document_list(company_id)
   
        for doc in documents:
            payload={
                "product_name": "workflowai",
                "details":{
                    "_id":doc["_id"],
                    "field":"document_name",
                    "cluster": "Documents",
                    "database": "Documentation",
                    "collection": "DocumentReports",
                    "document": "documentreports",
                    "team_member_ID": "11689044433",
                    "function_ID": "ABCDE",
                    "document_name":doc["document_name"],
                    "content":""
                            }
                }
            if doc["int_wf_step"] != "complete" and doc["ext_wf_step"] != "complete":
                
                filtered_list.append(requests.post(
                editorApi,
                data=payload,
            ).json())
                
      
        return Response({
                "documents": filtered_list,
            },
            status=status.HTTP_200_OK,
        )
    return Response(
                    {"message": "These document is not in Rejected Document list."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
    

# --------------------------- HELPERS ----------------------------------------
def get_auth_roles(document_obj):
    role_list = list()
    content = document_obj["content"]
    res_content_obj = json.loads(content)
    for i in res_content_obj[0]:
        role_list.append(i["auth_user"])
    return role_list