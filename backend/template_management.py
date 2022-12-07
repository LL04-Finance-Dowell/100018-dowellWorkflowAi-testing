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
    # get_user_info_by_username,
)

editorApi = "https://100058.pythonanywhere.com/api/generate-editor-link/"


@api_view(["POST"])
def create_template(request):
    data = ""
    template_name = ""
    res = json.loads(
        save_template(
            template_name,
            data,
            request.data["created_by"],
            request.data["company_id"],
            # get_user_info_by_username(request.data["created_by"])["company_id"],
        )
    )
    print(res)
    if res["isSuccess"]:
        payload = {
            "product_name": "workflowai",
            "details": {
                "_id": res["inserted_id"],
                "field": "",
                "cluster": "Documents",
                "database": "Documentation",
                "collection": "TemplateReports",
                "document": "templatereports",
                "team_member_ID": "22689044433",
                "function_ID": "ABCDE",
                "command": "update",
                "update_field": {"template_name": "", "content": ""},
            },
        }
        try:
            editor_link = requests.post(
                editorApi,
                data=json.dumps(payload),
            )
        except:
            return Response(
                {"message": "Template Creation Failed"},
                status=status.is_server_error,
            )
        return Response(
            editor_link.json(),
            status=status.HTTP_201_CREATED,
        )
    return Response(
        {"message": "Template creation failed."},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )


@api_view(["POST"])
def template_detail(request):
    data = get_template_object(template_id=request.data["template_id"])
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
            "document_id": request.data["template_id"],
            "fields": request.data["template_name"],
            "command": "update",
            "update_field": {
                "template_name": request.data["template_name"],
                "content": data,
            },
        },
    }
    try:
        editor_link = requests.post(
            editorApi,
            data=json.dumps(payload),
        )
    except:
        return Response(
            {"message": "Failed to go to editor."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    return Response(
        editor_link.json(),
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
def approve(request):
    response = json.loads(
        update_template_approval(template_id=request.data["template_id"], approval=True)
    )
    if not response["isSuccess"]:
        return Response(
            {"message": "Template Could not be Approved."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    return Response({"message": "Template Approved."}, status=status.HTTP_200_OK)


@api_view(["GET", "POST"])
def approved(request):
    template_list = get_template_list(company_id=request.data["company_id"])
    if not template_list:
        return Response(
            {"message": "Could not fetch your approved templates at this time"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    templates = [t for t in template_list if t.get("approved") == True]
    if not templates:
        return Response(
            {"message": "You have no approved templates"},
            status=status.HTTP_404_NOT_FOUND,
        )
    return Response(templates, status=status.HTTP_200_OK)


@api_view(["POST"])
def not_approved_templates(request):  # List of Templates to be approved.
    template_list = get_template_list(company_id=request.data["company_id"])
    if not template_list:
        return Response(
            {"message": "Could not fetch templates at this time."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    templates = [t for t in template_list if t.get("approved") == False]
    if not templates:
        return Response(
            {"message": "You have no pending templates to approved"},
            status=status.HTTP_404_NOT_FOUND,
        )
    return Response(templates, status=status.HTTP_200_OK)


@api_view(["POST"])
def template_list(request):  # List of Created Templates.
    template_list = get_template_list(company_id=request.data["company_id"])
    if not template_list:
        return Response(
            {"message": "Could not fetch templates at this time."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    if not template_list:
        return Response(
            {"message": "You have not created any templates"},
            status=status.HTTP_404_NOT_FOUND,
        )
    return Response(
        template_list,
        status=status.HTTP_200_OK,
    )
