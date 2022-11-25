import json
import timeit
import itertools
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .mongo_db_connection import (
    get_template_list,
    get_document_list,
    save_document,
    get_document_object,
    update_document,
    get_wf_object,
    get_user_info_by_username,
)
from .members import get_members
from .forms import CreateDocumentForm

@api_view(["GET", "POST"])
def create_document(request,company='6365ee18ff915c925f3a6691',user_name="Manish"):  # Document Creation.
    if request.method == "GET":
        document_list = [(0, "__Document Name__"),itertools.chain((i["_id"], i["document_name"]) for i in get_document_list(company_id=company))]
        return Response({"template_list": document_list}, status=status.HTTP_200_OK)

    if request.method == "POST":
        data = ""
        company_id = company
        created_by = user_name
        form = request.data  # TODO: We will get the data from form 1 by 1 - Dont Worry.
        if form:
            template_id = form["copy_template"]
            name = form["name"]
            res = json.loads(
                save_document(name, template_id, data, created_by, company_id)
            )
            print("Looks Like Documented is created----------\n", res)
            if res["isSuccess"]:
                return Response(
                    {
                        "message": "Document Created Successfully",
                        "document_id": res["inserted_id"],
                    },
                    status=status.HTTP_201_CREATED,
                )
            return Response(
                {"message": "Unable to Create Document"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        return Response({"status": 420, "message": "invalid form"})

    return Response(
        {"message": "You Need To Be LoggedIn"}, status=status.HTTP_400_BAD_REQUEST
    )


@api_view(["GET", "POST"])
def document_editor(request):  # Document Editor.
    pass


@api_view(["GET", "POST"])
def document_detail(request, *args, **kwargs):  # Single document
    verify = False
    template = False
    doc_viewer = False
    user_name = "Manish"
    if request.method == "GET":
        document_obj = get_document_object(document_id=kwargs["document_id"])
        if not document_obj:
            return Response(
                {"message": "An Error Occurred!"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        user = get_user_info_by_username(user_name)
        if not user:
            return Response(
                {"message": "An Error Occurred!"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        workflow_id = document_obj["workflow_id"]
        wf_single = get_wf_object(workflow_id)
        if not wf_single:
            return Response(
                {"message": "An Error Occurred!"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        # member_list = get_members(user_name)
        # member_list = get_members(str(request.session["session_id"]))

        # if not member_list:
        #     return Response(
        #         {"message": "An Error Occurred!"},
        #         status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        #     )
        document_data = {
            "id": document_obj["_id"],
            "name": document_obj["document_name"],
            "created_by": document_obj["created_by"],
            "auth_role_list": get_auth_roles(document_obj),
            "file": document_obj["content"],
            "username": user_name,
            "verify": verify,
            "template": template,
            "doc_viewer": doc_viewer,
            "company_id": document_obj["company_id"],
            "user_email": user["Email"],
            "wf_list": wf_single,
            "member_list": "member_list",
            "workflow_id": workflow_id,
        }
        return Response(
            {
                "curr_user_role": user["Role"],
                "document": document_data,
                "member_list": "member_list",
                "workflow_id": workflow_id,
            },
            status=status.HTTP_200_OK,
        )
    else:
        if verify:
            return Response(
                {"message": "You need to be logged In"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

    # Save Document.
    if request.method == "POST" and user_name:
        body_unicode = request.body.decode("utf-8")
        body = json.loads(body_unicode)
        if not body:
            return Response(
                {"message": "An Error Occurred!"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        res = update_document(body["file_id"], {"content": json.dumps(body["content"])})
        if not res:
            return Response(
                {"message": "An Error Occurred!"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        res_obj = json.loads(res)
        if res_obj["isSuccess"]:
            return Response(
                {"message": "Document Saved"}, status=status.HTTP_201_CREATED
            )
        else:
            return Response(
                {"message": "Document Could Not be Saved."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
    else:
        return Response(
            {"message": "You Need To Be Logged In"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["GET"])
def documents_to_be_signed(
    request, *args, **kwargs
):  # List of `to be signed` documents.
    rejected = False
    signing = True
    filtered_list = []
    user = request.user
    if not user:
        return Response(
            {"message": "You Must Be LoggedIn"}, status=status.HTTP_401_UNAUTHORIZED
        )
    # documents = get_document_list(request.session["company_id"])
    documents = get_document_list(company_id="6365ee18ff915c925f3a6691")
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

    user = "Manish"
    # documents = get_document_list(request.session["company_id"])
    documents = get_document_list(company_id="6365ee18ff915c925f3a6691")
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
            doc["document_id"] = doc["_id"]
            # if doc["created_by"] == user:
            #     filtered_list.append(doc)
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
    user = request.user
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
                    filtered_list.append(doc)
                    # if executed:
                    #     if doc["int_wf_position"] > 0 or doc["ext_wf_position"] > 0:
                    #         filtered_list.append(doc)
                    #     else:
                    #         filtered_list.append(doc)
    except:
        return Response(
            {"message": "An Error Occurred."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    return Response(
        {"documents": filtered_list, "title": title}, status=status.HTTP_200_OK
    )


@api_view(["GET"])
def rejected_documents(request,company_id="6365ee18ff915c925f3a6691"):  # List of rejected documents.
    rejected = True
    signing = True
    title = "Rejected Documents"
    filtered_list = []
    user = request.user
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


# --------------------------- HELPERS ----------------------------------------
def get_auth_roles(document_obj):
    role_list = list()
    content = document_obj["content"]
    res_content_obj = json.loads(content)
    for i in res_content_obj[0]:
        role_list.append(i["auth_user"])
    return role_list
