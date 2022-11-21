import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .mongo_db_connection import (
    get_template_list,
    save_template,
    get_template_object,
    update_template,
    update_template_approval,
    get_wf_object,
    get_user_info_by_username,
)

#
@api_view(["GET", "POST"])
def template_editor(request, template_id):  # Editor for a template.
    # user_name = request.session["user_name"]  # TODO: We need a way to get this.
    user_name = "Maanish"
    if request.method == "POST":  # Save Template.
        body = json.loads(request.body)
        if not body:
            return Response(
                {"message": "An Error Occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        template_id = body["file_id"]
        data = body["content"]
        resObj = update_template(template_id, json.dumps(data))
        print("Templated Saved----------------- \n")
        try:
            if resObj["isSuccess"]:
                return Response(
                    {"message": "Template saved!"}, status=status.HTTP_200_OK
                )
        except:
            return Response(
                {"message": "Template Save Failed"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    if request.method == "GET":  # Data for the Template Editor.
        template_obj = get_template_object(template_id=template_id)
        if not template_obj:
            return Response(
                {"message": "Failed to Get template."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        workflow_obj = get_wf_object(template_obj["workflow_id"])
        if not workflow_obj:
            return Response(
                {"message": "An Error Occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        user = get_user_info_by_username(user_name)  # TODO:  Info to probe
        if not user:
            return Response(
                {"message": "An Error Occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        template_data = {
            "id": template_obj["_id"],
            "name": template_obj["template_name"],
            "created_by": template_obj["created_by"],
            "file": template_obj["content"],
            "verify": False,
            "template": True,
            "doc_viewer": False,
            "company_id": template_obj["company_id"],
            "user_email": user["Email"],
        }
        return Response({"template_data": template_data}, status=status.HTTP_200_OK)
    return Response(
        {"message": "You Not To Be Logged In"}, status=status.HTTP_401_UNAUTHORIZED
    )


@api_view(["POST"])
def create_template(request):
    # TODO: confirmation on the below variables
    user_name = "Maanish"
    company = "6365ee18ff915c925f3a6691"
    if request.method == "POST":
        data = ""
        old_template = None
        if not request.data:
            return Response(
                {"message": "Input is Required!"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        template_name = request.data["template_name"]
        copy_template = request.data["copy_template"]
        company_id = company
        created_by = user_name
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
                {"message": "Name is required."},
                status=status.HTTP_300_MULTIPLE_CHOICES,
            )
    return Response(
        {"message": "Template Creation Failed"},
        status=status.HTTP_405_METHOD_NOT_ALLOWED,
    )


@api_view(["GET"])
def approved_templates(request):
    # company = request.session["company_id"]  # TODO: In review
    company = "6365ee18ff915c925f3a6691"
    if request.method == "POST":  # Template Approval.
        template_id = request.POST["template_id"]
        approval = True
        response = json.loads(
            update_template_approval(template_id, approval)
        )  # TODO: Check this response.
        if response["isSuccess"]:
            return Response(
                {"message": "Template Approved."}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"message": "Template Could not be Approved."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    if request.method == "GET":  # List of Created Templates.
        template_list = get_template_list(company_id=company)
        if not template_list:
            return Response(
                {"message": "An Error Occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        templates = [t for t in template_list if t.get("approved") == True]
        return Response(templates, status=status.HTTP_200_OK)


@api_view(["GET", "POST"])
def not_approved_templates(request):  # List of Templates to be approved.
    template_list = get_template_list(company_id=request.session["company_id"])
    if not template_list:
        return Response(
            {"message": "An Error Occurred."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    templates = [t for t in template_list if t.get("approved") == False]
    return Response(templates, status=status.HTTP_200_OK)


@api_view(["GET"])
def template_list(request):  # List of Created Templates.
    # company = request.session["company_id"]
    company = "6365ee18ff915c925f3a6691"
    template_list = get_template_list(company_id=company)
    if not template_list:
        return Response(
            {"message": "An Error Occurred."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    return Response(
        {
            "message": "Template Listing Success",
            "templates": template_list,
        },
        status=status.HTTP_200_OK,
    )
