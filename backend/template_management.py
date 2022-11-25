import json
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .mongo_db_connection import (
    get_template_list,
    save_template,
    get_template_object,
    update_template_approval,
)


@api_view(["POST"])
def create_template(request):
    editorApi = "https://100058.pythonanywhere.com/dowelleditor/editor/"
    if request.method == "POST":
        data = ""
        old_template = None
        if not request.data:
            return Response(
                {"message": "Input is Required!"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        created_by = request.data["created_by"]
        company_id = request.data["company_id"]
        template_name = request.data["template_name"]
        copy_template = request.data["copy_template"]
        if not company_id and created_by:
            return Response(
                {"message": "An Error Occurred!"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        if template_name:
            if copy_template:
                try:
                    old_template = get_template_object(copy_template)
                    data = old_template["content"]
                except:
                    pass
            resObj = json.loads(
                save_template(
                    template_name,
                    data,
                    created_by,
                    company_id,
                )
            )
            if resObj["isSuccess"]:
                payload = {
                    "database": "Documentation",
                    "collection": "TemplateReports",
                    "fields": template_name,
                    "document_id": resObj["inserted_id"],
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
            {"message": "Name is required."},
            status=status.HTTP_300_MULTIPLE_CHOICES,
        )
    return Response(
        {"message": "Template Creation Failed"},
        status=status.HTTP_405_METHOD_NOT_ALLOWED,
    )


@api_view(["POST"])
def approve(request):
    if not request.data:
        return Response(
            {"message": "Approval Request Could not be processed."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    template_id = request.data["template_id"]
    approval = True
    response = json.loads(update_template_approval(template_id, approval))
    if response["isSuccess"]:
        return Response({"message": "Template Approved."}, status=status.HTTP_200_OK)

    return Response(
        {"message": "Template Could not be Approved."},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )


@api_view(["GET", "POST"])
def approved(request):
    if not request.data:
        return Response(
            {"message": "Approval Request Could not be processed."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    template_list = get_template_list(company_id=request.data["company_id"])
    if not template_list:
        return Response(
            {"message": "Could not fetch your approved templates at this time"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    templates = [t for t in template_list if t.get("approved") == True]
    if len(templates) < 1:
        return Response(
            {"message": "You have no approved templates"},
            status=status.HTTP_404_NOT_FOUND,
        )
    return Response(templates, status=status.HTTP_200_OK)


@api_view(["POST"])
def not_approved_templates(request):  # List of Templates to be approved.
    if not request.data:
        return Response(
            {"message": "Request Could not be processed."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    template_list = get_template_list(company_id=request.data["company_id"])
    if not template_list:
        return Response(
            {"message": "Could not fetch templates at this time."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    templates = [t for t in template_list if t.get("approved") == False]
    if len(templates) < 1:
        return Response(
            {"message": "You have no pending templates to approved"},
            status=status.HTTP_404_NOT_FOUND,
        )
    return Response(templates, status=status.HTTP_200_OK)


@api_view(["POST"])
def template_list(request):  # List of Created Templates.
    if not request.data:
        return Response(
            {"message": "Request Could not be processed."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    template_list = get_template_list(company_id=request.data["company_id"])
    if not template_list:
        return Response(
            {"message": "Could not fetch templates at this time."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    if len(template_list) < 1:
        return Response(
            {"message": "You have not created any templates"},
            status=status.HTTP_404_NOT_FOUND,
        )
    return Response(
        template_list,
        status=status.HTTP_200_OK,
    )
