import json
import requests
from django import forms
from django.views import View
from django.shortcuts import render, redirect, reverse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .dowellconnection import dowellconnection
from rest_framework import status
from .mongo_db_connection import (
    get_all_wf_list,
    save_wf,
    get_wf_list,
    get_user_list,
    get_template_list,
    get_document_list,
    save_template,
    get_template_object,
    update_template,
    save_document,
    update_wf,
    get_uuid,
)
from .mongo_db_connection import (
    get_document_object,
    update_document,
    get_wf_object,
    get_user_info_by_username,
)
from .members import get_members


@api_view(["GET", "POST"])
def create_document(request):  # Document Creation.
    pass


@api_view(["GET", "POST"])
def document_editor(request):  # Document Editor.
    pass


@api_view(["GET", "POST"])
def document_detail(request):  # Single document
    pass


@api_view(["GET"])
def documents_to_be_signed(
    request, *args, **kwargs
):  # List of `to be signed` documents.
    rejected = False
    signing = True
    filtered_list = []
    # user = request.session["user_name"]
    user = "Maanish"
    if not user:
        return Response(
            {"message": "You Must Be LoggedIn"}, status=status.HTTP_401_UNAUTHORIZED
        )
    # documents = get_document_list(request.session["company_id"])
    documents = get_document_list("6365ee18ff915c925f3a6691")
    if not documents:
        return Response(
            {"message": "An Error Occurred."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    try:
        for doc in documents:
            workflow = get_wf_object(doc["workflow_id"])
            if not workflow:
                return Response(
                    {"message": "An Error Occurred."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            for obj in workflow["int_wf_string"]:
                if str(obj[0]) == str(doc["int_wf_position"]) and str(obj[-1]) == user:
                    print("Part of Internal Workflow signatures------------ \n")
                    filtered_list.append(doc)
            for obj in workflow["ext_wf_string"]:
                if str(obj[0]) == str(doc["ext_wf_position"]) and str(obj[-1]) == user:
                    print("Part of External Workflow signatures------------ \n")
                    filtered_list.append(doc)
    except:
        return Response(
            {"message": "An Error Occurred."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    return Response(
        {
            "documents": filtered_list,
            # "Role": request.session["Role"],
            "Role": "Admin",
            "signing": signing,
            "rejected": rejected,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
def my_documents(request, *args, **kwargs):  # List of my documents.
    executed = True
    title = "Created By Me"
    # user = request.session["user_name"]
    user = "Maanish"
    # documents = get_document_list(request.session["company_id"])
    documents = get_document_list("6365ee18ff915c925f3a6691")
    if not documents:
        return Response(
            {"message": "An Error Occurred."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    filtered_list = []
    try:
        for doc in documents:
            workflow = get_wf_object(doc["workflow_id"])
            if not workflow:
                return Response(
                    {"message": "An Error Occurred."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            for obj in workflow["int_wf_string"]:
                if str(obj[0]) == str(doc["int_wf_position"]) and str(obj[-1]) == user:
                    print("ur time for internal workflow")
                if (
                    workflow["ext_wf_string"][0] == doc["ext_wf_position"]
                    and workflow["ext_wf_string"][-1] == user
                ):
                    print("ur time for external workflow")
                doc["document_id"] = doc["_id"]
                if doc["created_by"] == user:
                    if executed:
                        if doc["int_wf_position"] > 0 or doc["ext_wf_position"] > 0:
                            filtered_list.append(doc)
                    else:
                        filtered_list.append(doc)
    except:
        return Response(
            {"message": "An Error Occurred."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    return Response(
        {"documents": filtered_list, "title": title}, status=status.HTTP_200_OK
    )


@api_view(["GET"])
def draft_documents(request, *args, **kwargs):  # List of Draft Documents.
    executed = False
    title = "Draft Documents."
    # user = request.session["user_name"]
    user = "Maanish"
    # documents = get_document_list(request.session["company_id"])
    documents = get_document_list("6365ee18ff915c925f3a6691")
    if not documents:
        return Response(
            {"message": "An Error Occurred."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    filtered_list = []
    try:
        for doc in documents:
            workflow = get_wf_object(doc["workflow_id"])
            if not workflow:
                return Response(
                    {"message": "An Error Occurred."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            for obj in workflow["int_wf_string"]:
                if str(obj[0]) == str(doc["int_wf_position"]) and str(obj[-1]) == user:
                    print("ur time for internal workflow")
                if (
                    workflow["ext_wf_string"][0] == doc["ext_wf_position"]
                    and workflow["ext_wf_string"][-1] == user
                ):
                    print("ur time for external workflow")
                doc["document_id"] = doc["_id"]
                if doc["created_by"] == user:
                    if executed:
                        if doc["int_wf_position"] > 0 or doc["ext_wf_position"] > 0:
                            filtered_list.append(doc)
                        else:
                            filtered_list.append(doc)
    except:
        return Response(
            {"message": "An Error Occurred."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    return Response(
        {"documents": filtered_list, "title": title}, status=status.HTTP_200_OK
    )


@api_view(["GET"])
def rejected_documents(request):  # List of rejected documents.
    rejected = True
    signing = True
    title = "Rejected Documents"
    filtered_list = []
    # user = request.session["user_name"]
    user = "Maanish"
    if not user:
        return Response(
            {"message": "You Must Be LoggedIn"}, status=status.HTTP_401_UNAUTHORIZED
        )
    # documents = get_document_list(request.session["company_id"])
    documents = get_document_list("6365ee18ff915c925f3a6691")
    if not documents:
        return Response(
            {"message": "An Error Occurred."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    try:
        for doc in documents:
            workflow = get_wf_object(doc["workflow_id"])
            for obj in workflow["int_wf_string"]:
                if str(obj[0]) == str(doc["int_wf_position"]) and str(obj[-1]) == user:
                    print("Part of Internal Workflow signatures------------ \n")
                    filtered_list.append(doc)
            for obj in workflow["ext_wf_string"]:
                if str(obj[0]) == str(doc["ext_wf_position"]) and str(obj[-1]) == user:
                    print("Part of External Workflow signatures------------ \n")
                    filtered_list.append(doc)
    except:
        return Response(
            {"message": "An Error Occurred."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    return Response(
        {
            "documents": filtered_list,
            # "Role": request.session["Role"],
            "Role": "Admin",
            "signing": signing,
            "rejected": rejected,
            "title": title,
        },
        status=status.HTTP_200_OK,
    )
