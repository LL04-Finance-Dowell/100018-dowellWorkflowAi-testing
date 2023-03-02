import json
import requests
from .thread_start import ThreadAlgolia,UpdateThreadAlgolia
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .algolia import get_algolia_data
from database.mongo_db_connection import (
    get_template_list,
    save_template,
    update_template_approval,
    get_template_object,
    delete_template,
)

editorApi = "https://100058.pythonanywhere.com/api/generate-editor-link/"


@api_view(["GET"])
def get_templates(request, company_id):
    """List of Created Templates."""
    templates = get_template_list(company_id)
    if not templates:
        return Response({"templates": []}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    if len(templates) > 0:
        return Response(
            {"templates": templates},
            status=status.HTTP_200_OK,
        )
    return Response(
        {"templates": []},
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
def create_template(request):
    data = ""
    page = ""
    template_name = "Untitled Template"
    res = json.loads(
        save_template(
            template_name,
            data,
            page,
            request.data["created_by"],
            request.data["company_id"],
            request.data["data_type"],
        )
    )
    if res["isSuccess"]:
        payload = {
            "product_name": "workflowai",
            "details": {
                "_id": res["inserted_id"],
                "field": "template_name",
                "action": "template",
                "cluster": "Documents",
                "database": "Documentation",
                "collection": "TemplateReports",
                "document": "templatereports",
                "team_member_ID": "22689044433",
                "function_ID": "ABCDE",
                "command": "update",
                "flag": "editing",
                "update_field": {"template_name": "", "content": "", "page": ""},
            },
        }
        try:
            ThreadAlgolia(res["inserted_id"], get_template_object).start()
            editor_link = requests.post(
                editorApi,
                data=json.dumps(payload),
            )
        except ConnectionError:
            return Response(
                {"message": "Template Creation Failed"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        return Response(
            editor_link.json(),
            status=status.HTTP_201_CREATED,
        )
    return Response(
        {"message": "Template creation failed."},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )


@api_view(["GET"])
def template_detail(request, template_id):
    payload = {
        "product_name": "workflow_ai",
        "details": {
            "cluster": "Documents",
            "database": "Documentation",
            "collection": "TemplateReports",
            "document": "templatereports",
            "team_member_ID": "22689044433",
            "function_ID": "ABCDE",
            "_id": template_id,
            "field": "template_name",
            "action": "template",
            "flag": "editing",
            "command": "update",
            "update_field": {"template_name": "", "content": "", "page": ""},
        },
    }
    try:
        editor_link = requests.post(
            editorApi,
            data=json.dumps(payload),
        )
    except ConnectionError:
        return Response(
            {"message": "Failed to go to editor."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    return Response(
        editor_link.json(),
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
def archive_template(request, template_id):
    try:
        delete_template(template_id)
        return Response("Template added to trash", status=status.HTTP_200_OK)
    except ConnectionError:
        return Response("Failed to add template to trash", status=status.HTTP_200_OK)


@api_view(["GET"])
def approve(request, template_id):
    response = json.loads(
        update_template_approval(template_id, approval=True)
    )
    if not response["isSuccess"]:
        return Response(
            "Template Could not be Approved.", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({"message": "Template Approved."}, status=status.HTTP_200_OK)


# -------------- @deprecated -----------------------
@api_view(["GET", "POST"])
def approved(request):
    templates = get_template_list(company_id=request.data["company_id"])
    if not template_list:
        return Response(
            {"message": "Could not fetch your approved templates at this time"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    templates = [
        t
        for t in template_list
        if t.get("approved") == True
           and t.get("created_by") == request.data["created_by"]
           and t.get("data_type") == request.data["data_type"]
    ]
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
    templates = [
        t
        for t in template_list
        if t.get("approved") == False
           and t.get("created_by") == request.data["created_by"]
           and t.get("data_type") == request.data["data_type"]
    ]
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
    templates = [
        t
        for t in template_list
        if t.get("created_by") == request.data["created_by"]
           and t.get("data_type") == request.data["data_type"]
    ]
    if not templates:
        return Response(
            {"message": "You have not created any templates"},
            status=status.HTTP_404_NOT_FOUND,
        )
    return Response(
        templates,
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
def org_templates(request):  # List of Created Templates.
    template_list = get_template_list(company_id=request.data["company_id"])
    if not template_list:
        return Response(
            {"message": "Could not fetch templates at this time."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    templates = [
        t
        for t in template_list
        if t.get("company_id") == request.data["company_id"]
        # and t.get("data_type") == request.data["data_type"]
    ]
    if not templates:
        return Response(
            {"message": "No created templates in organization"},
            status=status.HTTP_404_NOT_FOUND,
        )
    return Response(
        templates,
        status=status.HTTP_200_OK,
    )
@api_view(["POST"])
def template_index_update(request):
    payload=request.data["data"]
    try:
        UpdateThreadAlgolia(payload).start()
    except:
        ThreadAlgolia(payload["_id"], get_template_object).start()
    return Response(
            {
            "search_keyword": payload["_id"],
            "search_result": get_algolia_data(payload['_id'], payload["company_id"]),
        },
            status=status.HTTP_200_OK,
        )