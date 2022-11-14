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
def create_template(request):  # Template Creation.
    # user_name = request.session["user_name"]
    # company = request.session["company_id"]
    user_name = "Maanish"
    company = "6365ee18ff915c925f3a6691"
    if request.method == "POST":
        data = ""
        old_template = None
        form = request.POST  # TODO: Shall handle form input one by one.
        company_id = company
        created_by = user_name
        if not company_id and created_by:
            return Response(
                {"message": "An Error Occurred!"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        if form.is_valid():  # TODO: This form data needs more work to sanitize
            if (
                "name" in form.cleaned_data.keys()
                and "workflow" in form.cleaned_data.keys()
            ):
                if form.cleaned_data["copy_template"]:
                    try:
                        old_template = get_template_object(
                            form.cleaned_data["copy_template"]
                        )
                        data = old_template["content"]
                    except:
                        pass
                resObj = json.loads(
                    save_template(
                        form.cleaned_data["name"],
                        form.cleaned_data["workflow"],
                        data,
                        created_by,
                        company_id,
                    )
                )
                print("Template Created---------\n", resObj)
                if resObj["isSuccess"]:
                    return Response(
                        {
                            "message": "Template Created Successfully.",
                            "template_id": resObj["inserted_id"],
                        },
                        status=status.HTTP_201_CREATED,
                    )

                return Response(
                    {"message": "Name and workflow required."},
                    status=status.HTTP_300_MULTIPLE_CHOICES,
                )
        return Response(
            {"message": "Template Creation Failed"}, status=status.HTTP_400_BAD_REQUEST
        )

    if request.method == "GET" and user_name:
        template_list = []
        template_list = [(0, "--Template Name (None)--")]
        try:
            for i in get_template_list(company):
                template_list.append((i["_id"], i["template_name"]))
        except:
            return Response(
                {"message": "An Error Occurred!"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        wf_list = []
        wf_list = [(0, "--Workflow (None)--")]
        try:
            for i in get_wf_list(company):
                if i["workflow_title"] != "execute_wf":
                    wf_list.append((i["_id"], i["workflow_title"]))
        except:
            return Response(
                {"message": "An Error Occurred!"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            {"template_list": template_list, "workflow_list": wf_list},
            status=status.HTTP_200_OK,
        )
    else:
        return Response(
            {"message": "You Need To Be LoggedIn"},
            status=status.HTTP_401_UNAUTHORIZED,
        )


@api_view(["GET"])
def approved_templates(request):  # List of Created Templates.

    pass


@api_view(["GET", "POST"])
def not_approved_templates(request):  # List of Templates to be approved.
    pass


@api_view(["GET"])
def template_list(request):  # List of Created Templates.
    pass


#
@api_view(["GET", "POST"])
def template_detail(request):  # Single Template
    pass


#
@api_view(["GET", "POST"])
def template_editor(request):  # Editor for a template.
    pass
