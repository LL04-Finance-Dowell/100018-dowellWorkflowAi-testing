import json
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .mongo_db_connection import (
    get_template_list,
    save_template,
    update_template_approval,
    get_template_object,
)


editorApi = "https://100058.pythonanywhere.com/api/generate-editor-link/"


@api_view(["POST"])
def create_template(request):
    if request.method == "POST":
        data = ""
        template_name = ""
        if not request.data:
            return Response(
                {"message": "Failed to process template creation."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        created_by = request.data["created_by"]
        company_id = request.data["company_id"]
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
                "product_name": "workflowai",
                "details": {
                    "_id": "638704a077be2e78175e70c4",
                    "field": "template_name",
                    "cluster": "Documents",
                    "database": "Documentation",
                    "collection": "editor",
                    "document": "editor",
                    "team_member_ID": "100084006",
                    "function_ID": "ABCDE",
                    "command": "update",
                    "update_field": {"template_name": "", "content": ""},
                },
            }
            editor_link = requests.post(
                editorApi,
                data=json.dumps(payload),
            )
            if editor_link.status_code != 200:
                return Response(
                    {"message": "Failed to go to editor."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            return Response(
                editor_link,
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
def template_detail(request):
    if request.method == "POST":
        if not request.data:
            return Response(
                {"message": "Failed to fetch template."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        template_id = request.data["template_id"]
        template_name = request.data["template_name"]
        data = get_template_object(template_id)
        if not data:
            return Response(
                {"message": "Template Not Found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        payload = {
            "product_name": "workflow_ai",
            "details": {
                "cluster": "Documents",
                "database": "Documentation",
                "collection": "TemplateReports",
                "document": "templatereports",
                "team_member_ID": "22689044433",
                "function_ID": "ABCDE",
                "document_id": template_id,
                "fields": template_name,
                "command": "update",
                "update_field": {"template_name": template_name, "content": data},
            },
        }
        editor_link = requests.post(
            editorApi,
            data=json.dumps(payload),
        )
        if editor_link.status_code != 200:
            return Response(
                {"message": "Failed to go to editor."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        return Response(
            editor_link,
            status=status.HTTP_200_OK,
        )
    return Response(
        {"message": "Failed to fetch template."}, status=status.HTTP_400_BAD_REQUEST
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
