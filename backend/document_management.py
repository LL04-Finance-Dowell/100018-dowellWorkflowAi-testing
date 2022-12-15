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
    get_user_list,
    get_user_info_by_username,
)
editorApi = "https://100058.pythonanywhere.com/api/generate-editor-link/"
    
@api_view(["GET","POST"])
def create_document(request):  # Document Creation.
    
    if request.method == "POST":
        data = ""
        pages = ""
        form = request.data  # TODO: We will get the data from form 1 by 1 - Dont Worry.
        if not form:
            return Response(
                {"documents":[],"message": "Failed to process document creation."},
                status=status.HTTP_200_OK,
            )
        else:
            template_id = request.data["template_id"]
            document_name = "Untitled Document"
            created_by = request.data["created_by"]
            company_id=request.data['company_id']
            #data = get_content_from_template_collection_with_that_template_id
            data = get_template_object(template_id)["content"]
            try:
                pages = get_template_object(template_id)["pages"]
            except:
                pages
            res = json.loads(
                save_document(document_name, data, created_by, company_id,pages)
            )
            
            if res["isSuccess"]:

                payload=json.dumps({
                        "product_name": "workflowai",
                        "details":{
                             "_id":res["inserted_id"],
                            "field":"document_name",
                            "action":"document",
                            "cluster": "Documents",
                            "database": "Documentation",
                            "collection": "DocumentReports",
                            "document": "documentreports",
                            "team_member_ID": "11689044433",
                            "function_ID": "ABCDE",
                            "command": "update",
                            "update_field": {
                                "document_name":"",
                                "content":"",
                                "pages":pages,
                                }
                        }
                        })
                headers = {
                            'Content-Type': 'application/json'
                            }
                        
                editor_link = requests.request("POST", editorApi, headers=headers, data=payload)  
                try:
                    return Response(
                    editor_link.json(),
                    status=status.HTTP_201_CREATED,
                    )
                except:
                    return Response(
                {"document":[],"message": "Failed to call editorApi"},
                status=status.HTTP_200_OK,
            )
            return Response(
                {"document":[],"message": "Unable to Create Document"},
                status=status.HTTP_200_OK,
            )

    return Response(
        {"document":[],"message": "You Need To Be LoggedIn"}, status=status.HTTP_200_OK
    )



@api_view(["POST"])
def document_detail(request):  # Single document

    if request.method == "POST":
        if not request.data:
            return Response(
                {"document":[],"message": "Failed to Load Document."},
                status=status.HTTP_200_OK,
            )
        document_id = request.data["document_id"]
        data=get_document_object(document_id)
        pages= ""
        try:
            pages = get_template_object(template_id)["pages"]
        except:
            pages
        document_name = data["document_name"]
        payload=json.dumps({
                "product_name": "workflowai",
                "details": {
                    "cluster": "Documents",
                    "database": "Documentation",
                    "collection": "DocumentReports",
                    "document": "documentreports",
                    "team_member_ID": "11689044433",
                    "function_ID": "ABCDE",
                    "_id":document_id,
                    "field":"document_name",
                    "action":"document",
                    "command": "update",
                    "update_field": {
                                    "content": "",
                                    "document_name":"",
                                    "pages":pages,
                                    }
                            
        }
        })
        headers = {
                            'Content-Type': 'application/json'
                            }
                         
        editor_link = requests.request("POST", editorApi, headers=headers, data=payload)  
        try:
            return Response(
            editor_link.json(),
            status=status.HTTP_201_CREATED,
            )
        except:
            return Response(
        {"document":[],"message": "Failed to call editorApi"},
        status=status.HTTP_200_OK,
    )
           
    return Response(
        {"document":[],"message": "This Document is Not Loaded."}, status=status.HTTP_200_OK
    )
@api_view(["GET","POST"])
def documents_to_be_signed(request):  # List of `to be signed` documents.
    filtered_list = []

    if request.method=="POST":
        created_by=request.data['created_by']
        company_id=request.data['company_id']

        documents = get_document_list(company_id)
   
        try:
            for doc in documents:
                if len(doc["reject_message"])==0 and len(doc["rejected_by"])==0:
                   
                    filtered_list.append(doc)
                
        except:
            return Response(
                {"documents":[],"message": "An Error Occurred."},
                status=status.HTTP_200_OK,
            )
      
        return Response({
                "documents": filtered_list,
            },
            status=status.HTTP_200_OK,
        )
    return Response(
                    {"documents": [],"message": "These document is Rejected Document."},
                    status=status.HTTP_200_OK,
                )
    


@api_view(["POST"])
def my_documents(request):  # List of my documents.
    filtered_list = []
    if request.method=="POST":
        created_by=request.data['created_by']
        company_id=request.data['company_id']
        documents = get_document_list(company_id)
        if not documents:
            return Response(
                {"documents": [],"message": "There is no document created by This user."},
                status=status.HTTP_200_OK,
            )
        else:
            for doc in documents:
                    
                    if doc['created_by'] == created_by:
                        filtered_list.append(doc)

        return Response(
            {"documents": filtered_list, "title": "My Documents"}, status=status.HTTP_200_OK
        )

@api_view(["GET","POST"])
def rejected_documents(request):  # List of `to be signed` documents.
    filtered_list = []
    if request.method=="POST":
        created_by=request.data['created_by']
        company_id=request.data['company_id']
        documents = get_document_list(company_id)
   
        for doc in documents:
           
            if len(doc["reject_message"])!=0 and len(doc["rejected_by"])!=0:
                
                filtered_list.append(doc)
                
      
        return Response({
                "documents": filtered_list,
            },
            status=status.HTTP_200_OK,
        )
    return Response(
                    {"documents": [],"message": "These document is not in Rejected Document list."},
                    status=status.HTTP_200_OK,
                )
    
@api_view(["GET","POST"])
def draft_documents(request):  # List of `to be signed` documents.
    title = "Draft Documents."
    filtered_list = []
    if request.method=="POST":
        created_by = request.data['created_by']
        company_id=request.data['company_id']
        documents = get_document_list(company_id)
        try:
            for doc in documents:
                if doc["int_wf_step"] != "complete" and doc["ext_wf_step"] != "complete":   
                    filtered_list.append(doc)
            return Response({
                    "documents": filtered_list,
                },
                status=status.HTTP_200_OK,
            )
        except:
            return Response(
                {"documents": [],"message": "An Error Occurred."},
                status=status.HTTP_200_OK,
            )
    return Response(
                    {"documents": [],"message": "No Document in Drafts"},
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
