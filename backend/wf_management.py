import json
import uuid
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib import messages
from .mongo_db_connection import (
    save_wf,
    update_wf,
    get_wf_object,
    get_document_object,
    update_document,
    save_uuid_hash,
    get_uuid_object,
    get_wf_list,
    get_user_info_by_username,
    update_wf_approval,
)
from .members import get_members
from datetime import datetime
from django.core.mail import send_mail
from django.urls import reverse
from django.contrib.sites.models import Site
from .mail_format import formated_mail


@api_view(["GET", "POST"])
def workflow(request):  # create workflow, list workflows.
    # company = request.session["company_id"]
    company = "6365ee18ff915c925f3a6691"
    if request.method == "GET":
        workflow_list = get_wf_list(company)
        if workflow_list:
            wfs_to_display = []
            for wf in workflow_list:
                if wf.get("workflow_title") and (
                    wf.get("workflow_title") != "execute_wf"
                ):
                    wfs_to_display.append(wf)
            return Response(wfs_to_display, status=status.HTTP_200_OK)
        else:
            return Response(
                {"message": "An Error Occurred!"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    if (
        request.method == "POST"
    ):  # TODO: Check on the introduction of the draft True to workflow
        body = None
        draft = True
        try:
            body = json.loads(request.body)
        except:
            body = None
        if not body or not body["title"]:
            return Response(
                {
                    "message": "Title is Required",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        int_wf_string = []
        ext_wf_string = []
        if len(body["internal"]):
            for step in body["internal"]:
                int_wf_string.append([step["name"], step["roleID"]])
        if len(body["external"]):
            for step in body["external"]:
                ext_wf_string.append([step["name"], step["roleID"]])
        workflow = save_wf(
            wf_name=body["title"],
            int_wf_string=int_wf_string,
            ext_wf_string=ext_wf_string,
            user=request.session["user_name"],
            company_id=company,
        )
        print("Workflow Created ---------\n", workflow)
        return Response(
            {"message": "workflow added.", "workflow": workflow},
            status=status.HTTP_201_CREATED,
        )


@api_view(["GET", "POST"])
def approved_workflows(request):  # List and Approval
    if request.method == "GET":
        # workflow_list = get_wf_list(request.session["company_id"])
        approved = True
        workflow_list = get_wf_list("6365ee18ff915c925f3a6691")
        if workflow_list:
            wfs_to_display = []
            for wf in workflow_list:
                if (
                    wf.get("workflow_title")
                    and (wf.get("workflow_title") != "execute_wf")
                    and wf.get("approved") == True
                ):
                    wfs_to_display.append(wf)
            return Response(wfs_to_display, status=status.HTTP_200_OK)
        else:
            return Response(
                {"message": "An Error Occurred!"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    if request.method == "POST":
        workflow_id = request.POST["workflow_id"]
        approval = True
        response = update_wf_approval(workflow_id, approval)
        if response:
            return Response(
                {"message": "Workflow Approved."}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"message": "Workflow Could not be Approved."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


@api_view(["GET"])
def rejected_workflows(request):  # List and Approval
    if request.method == "GET":
        # workflow_list = get_wf_list(request.session["company_id"])
        workflow_list = get_wf_list("6365ee18ff915c925f3a6691")
        if workflow_list:
            wfs_to_display = []
            for wf in workflow_list:
                if (
                    wf.get("workflow_title")
                    and (wf.get("workflow_title") != "execute_wf")
                    and wf.get("approved") == False
                ):
                    wfs_to_display.append(wf)
            return Response(wfs_to_display, status=status.HTTP_200_OK)
        else:
            return Response(
                {"message": "An Error Occurred!"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


@api_view(["GET"])
def draft_workflows(request):  # List of drafts workflows.
    if request.method == "GET":
        # workflow_list = get_wf_list(request.session["company_id"])
        workflow_list = get_wf_list("6365ee18ff915c925f3a6691")
        if workflow_list:
            wfs_to_display = []
            for wf in workflow_list:
                if (
                    wf.get("workflow_title")
                    and (wf.get("workflow_title") != "execute_wf")
                    and wf.get("draft") == True
                ):
                    wfs_to_display.append(wf)
            return Response(wfs_to_display, status=status.HTTP_200_OK)
        else:
            return Response(
                {"message": "An Error Occurred!"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


@api_view(["GET", "POST"])
def assign_emails(request):
    body = None
    try:
        body = json.loads(request.body)
        print("----------check Before assign Body----------- \n", body)
    except:
        body = None
    update_wf(
        workflow_id=body["workflow_id"],
        int_wf_string=body["internal"],
        ext_wf_string=body["external"],
    )
    updated_workflow = get_wf_object(body["workflow_id"])
    print("Workflow Updated----------- \n", updated_workflow)
    return Response(
        {"message": "Emails Assigned to workflow."}, status=status.HTTP_200_OK
    )


@api_view(["GET", "POST"])
def internal_signature(request, *args, **kwargs):  # internal signature
    verify = True
    is_template = False
    doc_viewer = False

    if request.method == "GET":
        if request.session["user_name"]:
            document_obj = get_document_object(document_id=kwargs["document_id"])
            user = get_user_info_by_username(request.session["user_name"])
            workflow_id = document_obj["workflow_id"]
            wf_single = get_wf_object(workflow_id)
            member_list = get_members(str(request.session["session_id"]))
            document_data = {
                "id": document_obj["_id"],
                "name": document_obj["document_name"],
                "created_by": document_obj["created_by"],
                "auth_role_list": get_auth_roles(document_obj),
                "file": document_obj["content"],
                "username": request.session["user_name"],
                "verify": verify,
                "template": is_template,
                "doc_viewer": doc_viewer,
                "company_id": document_obj["company_id"],
                "user_email": user["Email"],
                "wf_list": wf_single,
                "member_list": member_list,
            }
            return Response(
                {
                    "current_user_role": user["Role"],
                    "document": document_data,
                    "members_list": member_list,
                    "workflow_id": workflow_id,
                },
                status=status.HTTP_200_OK,
            )
        else:
            if verify:
                return Response(
                    {"message": "You Must Be Logged In"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
    if request.method == "POST" and request.session["user_name"]:
        document_data = request.POST.get("documentData", False)
        document_id = request.POST.get("document_id", False)
        if not document_id and document_data:
            return Response(
                {"message": "An Error Occurred!"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        doc = get_document_object(document_id)
        doc, doc_status, step_name = workflow_verification(request, doc)
        if doc_status and step_name != "":
            data = json.loads(request.POST["documentData"])
            doc = json.loads(
                update_document(
                    request.POST["document_id"],
                    {"content": json.dumps(data)},
                )
            )
            return Response(
                {"message": "Document Signing Success"},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {
                    "message": "Failed to Sign Document.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
    else:
        return Response(
            {"message": "You Need to Be Logged In"},
            status=status.HTTP_401_UNAUTHORIZED,
        )


@api_view(["GET", "POST"])
def signature(request, *args, **kwargs):  # Signature from email link.
    verify = True
    is_template = False
    doc_viewer = False
    if request.method == "GET":
        if kwargs.get("uuid_hash", None):
            uuid_obj = get_uuid_object(uuid_hash=kwargs["uuid_hash"])
            document_obj = get_document_object(document_id=kwargs["document_id"])
            if not uuid_obj:
                return Response(
                    {"message": "An Error Occurred!"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            if not document_obj:
                return Response(
                    {"message": "An Error Occurred!"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            document_data = {
                "id": document_obj["_id"],
                "name": document_obj["document_name"],
                "created_by": document_obj["created_by"],
                "auth_role_list": get_auth_roles(document_obj),
                "file": document_obj["content"],
                "verify": verify,
                "username": kwargs.get("user_name"),
                "template": is_template,
                "doc_viewer": doc_viewer,
                "company_id": document_obj["company_id"],
                "user_email": uuid_obj["email"],
            }
            return Response(
                {"message": "Ready for signature", "document": document_data},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"message": "An Error Occured while loading Document!"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
    # Finalize document for next workflow
    if request.method == "POST":
        doc = get_document_object(request.POST["document_id"])
        doc, doc_status, step_name = workflow_verification(request, doc)
        if doc_status and step_name != "":
            data = json.loads(request.POST["documentData"])
            doc = json.loads(
                update_document(
                    request.POST["document_id"], {"content": json.dumps(data)}
                )
            )
            if doc:
                return Response(
                    {"message": "Document Signed Success"}, status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"message": "An Error Occurred"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        else:
            return Response(
                {"message": "Signing Document Failed"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@api_view(["POST"])
def generate_link(request):  # generate link for the workflow to be shared.
    try:
        print("Link Generation Started------------ \n")
        role = request.POST.get("role", "User")
        document_id = request.POST.get("document_id")
        uuid_hash = uuid.uuid4().hex
        route = reverse(  # TODO: This is gonna change how we do the routes.
            "documentation:verify-document",
            kwargs={
                "document_id": document_id,
                "uuid_hash": uuid_hash,
                "user_name": "null",
            },
        )
        save_uuid_hash(uuid_hash, role, document_id)
        link = Site.objects.get_current().domain + route

        if not link:
            return Response(
                {"message": "Link Generation Failed"}, status=status.HTTP_204_NO_CONTENT
            )
        return Response(
            {"message": "Link Genereted Successfully", "link": link},
            status=status.HTTP_201_CREATED,
        )

    except:
        return Response(
            {"message": "An Error Occurred."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
def process_document(request, *args, **kwargs):  # Add to workflow.
    if request.method == "POST" and request.session["user_name"]:
        body = None
        print("Start workflow------------ \n")
        body = json.loads(request.body)
        doc = get_document_object(body["file_id"])
        user = get_user_info_by_username(request.session["user_name"])
        if not doc:
            return Response(
                {"message": "Failed to process document"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        new_step = ["Last", user["Email"]]
        workflow = get_wf_object(doc["workflow_id"])
        if not workflow:
            return Response(
                {"message": "Failed to process document"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        res_wf = json.loads(
            save_wf(
                "execute_wf",
                workflow["int_wf_string"],
                [*workflow["ext_wf_string"], new_step],
                request.session["user_name"],
                request.session["company_id"],
            )
        )
        print("Changes made to workflow------------------- \n", res_wf)
        dd = datetime.now()
        time = dd.strftime("%d:%m:%Y,%H:%M:%S")
        new_workflow = get_wf_object(res_wf["inserted_id"])
        print("New Workflow:-------------------------- \n", new_workflow)
        if new_workflow["ext_wf_string"] != []:
            res = json.loads(
                update_document(
                    body["file_id"],
                    {
                        #   'content': body['content'],
                        "workflow_id": new_workflow["_id"],
                        "ext_wf_position": 0,
                        "ext_wf_step": new_workflow["ext_wf_string"][0][0],
                        "update_time": time,
                    },
                )
            )
            print("Response of External workflow---------- \n", res)
            print(
                "-----------Email for External------------ \n",
                new_workflow["ext_wf_string"][0][2],
            )
            if res["isSuccess"]:
                print("Operation for external workflow Done------ \n")
            else:
                print("Operation Failed--------------------- \n")

        if new_workflow["int_wf_string"] != []:
            res = json.loads(
                update_document(
                    body["file_id"],
                    {
                        "workflow_id": new_workflow["_id"],
                        #   'content': body['content'],
                        "int_wf_position": 1,
                        "int_wf_step": new_workflow["int_wf_string"][0][0],
                        "update_time": time,
                    },
                )
            )
            print("Response of Internal workflow---------- \n", res)
            if res["isSuccess"]:
                mail_status = send_notification_mail(
                    new_workflow["int_wf_string"][0][2],
                    body["file_id"],
                    doc["document_name"],
                )
                print("Internal Operation Done----------- \n", mail_status)
            else:
                print("Operation Failed------------------- \n")
        return Response(
            {"message": "Workflow Started and Document Processed."},
            status=status.HTTP_201_CREATED,
        )
    else:
        return Response(
            {"message": "You Need To Be LoggedIn"}, status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(["GET", "POST"])
def finalize_document(request):  # Finalize document for next workflow
    pass


@api_view(["POST"])
def reject_document(request, *args, **kwargs):  # Reject a reqeust to sign a document.
    if request.method == "POST" and request.session["user_name"]:
        body = json.loads(request.body)
        doc = get_document_object(body["file_id"])
        wf = get_wf_object(doc["workflow_id"])
        if not doc:
            return Response(
                {"message": "An Error Occurred!"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        if not wf:
            return Response(
                {"message": "An Error Occurred!"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # if doc and wf:
        int_wf_steps = wf["int_wf_string"]
        ext_wf_steps = wf["ext_wf_string"]
        user = get_user_info_by_username(request.session["user_name"])
        if not user:
            return Response(
                {"message": "You Need To Be LoggedIn"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if get_user_in_workflow(user, wf["int_wf_string"]) or get_user_in_workflow(
            user, wf["ext_wf_string"]
        ):
            # Intenal Workflow.
            if wf["int_wf_string"] != [] and doc["int_wf_step"] != "complete":
                if doc["int_wf_position"] > 0:
                    doc = json.loads(
                        update_document(
                            doc["_id"],
                            {
                                "int_wf_position": doc["int_wf_position"] - 1,
                                "int_wf_step": int_wf_steps[doc["int_wf_position"] - 1][
                                    0
                                ],
                                "reject_message": body["reason"],
                                "rejected_by": request.session["user_name"],
                            },
                        )
                    )
                else:
                    doc = json.loads(
                        update_document(
                            doc["_id"],
                            {
                                "int_wf_position": 0,
                                "int_wf_step": "",
                                "reject_message": body["reason"],
                                "rejected_by": request.session["user_name"],
                            },
                        )
                    )
                    # External Workflow.
            if wf["ext_wf_string"] != "" and doc["ext_wf_step"] != "complete":
                if doc["ext_wf_position"] > 0:
                    doc = json.loads(
                        update_document(
                            doc["_id"],
                            {
                                "ext_wf_position": doc["ext_wf_position"] - 1,
                                "ext_wf_step": ext_wf_steps[doc["ext_wf_position"] - 1][
                                    0
                                ],
                                "reject_message": body["reason"],
                                "rejected_by": request.session["user_name"],
                            },
                        )
                    )
            else:
                return Response(
                    {"message": "Unable to Reject Document."},
                    status=status.HTTP_300_MULTIPLE_CHOICES,
                )

            return Response(
                {"message": "Document Rejection Success"},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"message": "Workflow Authority is Missing for this user."},
                status=status.HTTP_403_FORBIDDEN,
            )
    else:
        return Response(
            {"message": "An Error Occurred!"}, status=status.HTTP_400_BAD_REQUEST
        )


# ----------------------------------------- HELPER FUNCTIONS ----------------------------------
# get auth roles
def get_auth_roles(document_obj):
    role_list = list()
    content = document_obj["content"]
    res_content_obj = json.loads(content)
    for i in res_content_obj[0]:
        role_list.append(i["auth_user"])
    return role_list


# user in a given workflow.
def get_user_in_workflow(user, wf):
    status = False
    for step in wf:
        if user["Email"] == step[1]:
            status = True
    return status


# sending mail after every workflow execution.
def send_notification_mail(user_name, document_id, document_name, *args, **kwargs):
    response = get_user_info_by_username(user_name)
    email = ""
    if response != []:
        email = response["Email"]
    else:
        email = user_name
    uuid_hash = uuid.uuid4().hex
    print("Sending Mail to ------------------- \n", email)
    route = reverse(
        "documentation:verify-document",  # TODO: we have ro refactor this.
        kwargs={
            "document_id": document_id,
            "uuid_hash": uuid_hash,
            "user_name": user_name,
        },
    )
    save_uuid_hash(uuid_hash, email, document_id)
    link = Site.objects.get_current().domain + route
    html_content = formated_mail(email, link)
    send_mail(
        "Sign Document : " + document_name,
        "",
        "",
        [
            email,
        ],
        fail_silently=False,
        html_message=html_content,
    )
    return uuid_hash


# verification of workflow completion.
def workflow_verification(request, doc):
    status = 0
    step_name = ""
    res = None
    print("Begin Verification for -------------- \n", doc["document_name"])
    wf = get_wf_object(doc["workflow_id"])
    if wf:
        int_wf_steps = wf["int_wf_string"]
        ext_wf_steps = wf["ext_wf_string"]
        if ((wf["int_wf_string"] != []) and (doc["int_wf_step"] != "complete")) and (
            doc["int_wf_position"] <= len(int_wf_steps)
        ):
            print(
                "Checking internal workflow for----------------  \n",
                doc["document_name"],
            )
            status, step_name = execute_workflow(
                request,
                doc["_id"],
                doc["document_name"],
                doc["int_wf_position"],
                int_wf_steps,
            )
            res = json.loads(
                update_document(
                    doc["_id"],
                    {
                        "int_wf_position": status,
                        "int_wf_step": step_name,
                    },
                )
            )
            doc = get_document_object(doc["_id"])
            if (doc["int_wf_step"] == "complete") and (wf["ext_wf_string"] != []):
                print(
                    "Do we reach here first for ------------? \n",
                    doc["document_name"],
                )
                res = json.loads(
                    update_document(
                        doc["_id"],
                        {
                            "ex_wf_position": 1,
                            "ex_wf_step": "1",
                        },
                    )
                )
                doc = get_document_object(doc["_id"])
                # End of test case scenario
        if ((wf["ext_wf_string"] != []) and (doc["ext_wf_step"] != "complete")) and (
            doc["ext_wf_position"] <= len(ext_wf_steps)
            and (doc["int_wf_step"] == "complete")
        ):
            print("Checking External Workflow----------- \n")
            status, step_name = execute_workflow(
                request,
                doc["_id"],
                doc["document_name"],
                doc["ext_wf_position"],
                ext_wf_steps,
            )
            if status and status != doc["ext_wf_position"]:
                res = json.loads(
                    update_document(
                        doc["_id"],
                        {
                            "ext_wf_position": status,
                            "ext_wf_step": step_name,
                        },
                    )
                )
                print("Response for External Workflow----------- \n", res)
                doc = get_document_object(doc["_id"])
                if doc["ext_wf_position"] == "complete":
                    print("External Workflow Complete-------------- \n")
        if doc["int_wf_step"] == "complete" and doc["ext_wf_step"] == "complete":
            status = 1
            step_name = "complete"
            owner_email = ext_wf_steps[-1][1]
            mail_status = send_notification_mail(
                owner_email, doc["_id"], doc["document_name"]
            )
            print("External and Internal Workflows complete--------- \n", mail_status)
        print("Looks like we have no workflows------------------ \n")
        return doc, status, step_name


# check workflow for step execution.
def check_workflow(status, wf):
    current = status - 1
    current_length = -1
    if current < len(wf):
        current_length = len(wf[current])
    if current_length == 2:
        return True
    if current_length == 3:
        return False
    if current_length == 0:
        return True
    if current_length == -1:
        return False
    return False


# execute workflow every time it is processed.
def execute_workflow(request, document_id, document_name, status, wf):
    step_name = ""
    status += 1
    cross_check = check_workflow(status, wf)
    if status >= len(wf) or cross_check:
        step_name = "complete"
        status = len(wf)
        messages.success(
            request, document_name.title() + " document Signed at all stages."
        )
    else:
        step_name = wf[status - 1][0]
        print("Step name is---- \n", step_name)
        print("The Email now is------------- \n", wf[status - 1][2])
        mail_status = send_notification_mail(
            wf[status - 1][2], document_id, document_name
        )
        if mail_status:
            print("---------mail_sent------------ \n")
        else:
            print("--------mail_not_sent----------- \n")
        messages.info(
            request, document_name.title() + " document Signed at :" + step_name
        )
    return status, step_name


# ------------------------------------- End: Helpers----------------------------------------------

# class DocumentCreatedListView(View):
#     executed = False
#     title = "Draft Documents"

#     def get(self, request, *args, **kwargs):

#         documents = get_document_list(request.session["company_id"])
#         # documents = get_document_list("6365ee18ff915c925f3a6691")
#         # print("---------Documents---------------- \n :", documents)

#         filtered_list = []
#         try:
#             for doc in documents:
#                 # print("===================User in Question is ================== \n :", request.session["user_name"])
#                 # print("---------Document workflow Id---------------- \n :", doc["workflow_id"])
#                 # print("---------Document Name---------------- \n :", doc["document_name"])
#                 # print("---------Document int_wf_position---------------- \n :", doc["int_wf_position"])
#                 # print("---------Document ext_wf_position---------------- \n :", doc["ext_wf_position"])

#                 workflow_objec = get_wf_object(doc["workflow_id"])
#                 # print("---------Document workflow_objec---------------- \n :", workflow_objec)
#                 # print("---------Document workflow_objec int_wf_string---------------- \n :", workflow_objec["int_wf_string"])
#                 # print("---------Document workflow_objec ext_wf_string---------------- \n :", workflow_objec["ext_wf_string"])
#                 for obj in workflow_objec["int_wf_string"]:
#                     if (
#                         str(obj[0]) == str(doc["int_wf_position"])
#                         and str(obj[-1]) == request.session["user_name"]
#                     ):
#                         print("ur time for internal workflow")
#                 if (
#                     workflow_objec["ext_wf_string"][0] == doc["ext_wf_position"]
#                     and workflow_objec["ext_wf_string"][-1]
#                     == request.session["user_name"]
#                 ):
#                     print("ur time for external workflow")
#                 doc["document_id"] = doc["_id"]
#                 if doc["created_by"] == request.session["user_name"]:
#                     if self.executed:
#                         if doc["int_wf_position"] > 0 or doc["ext_wf_position"] > 0:
#                             filtered_list.append(doc)
#                     else:
#                         filtered_list.append(doc)
#         except:
#             pass
#         return render(
#             request,
#             "requested_documents.html",
#             {"filtered_list": filtered_list, "title": self.title},
#         )


# class DocumentCreatedInExecutionListView(DocumentCreatedListView):
#     executed = True
#     title = "Created By Me"


# class DocumentExecutionListView(View):
#     rejected = False
#     signing = True
#     title = "Documents to Sign"
#     template_name = "requested_documents.html"

#     def get(self, request, *args, **kwargs):
#         filtered_list = []
#         documents = get_document_list(request.session["company_id"])
#         # documents = get_document_list("6365ee18ff915c925f3a6691")
#         get_user_info_by_username(request.session["user_name"])
#         # print("Documents in List view  DOcuments to Sign--------- \n", documents)
#         # print("My role is--------------- \n", request.session["Role"])
#         for doc in documents:
#             doc["document_id"] = doc["_id"]
#             print(
#                 "===================User in Question is DOcuments to Sign ================== \n :",
#                 request.session["user_name"],
#             )
#             print(
#                 "---------Document workflow Id DOcuments to Sign---------------- \n :",
#                 doc["workflow_id"],
#             )
#             print(
#                 "---------Document Name DOcuments to Sign---------------- \n :",
#                 doc["document_name"],
#             )
#             print(
#                 "---------Document int_wf_position DOcuments to Sign---------------- \n :",
#                 doc["int_wf_position"],
#             )
#             print(
#                 "---------Document ext_wf_position DOcuments to Sign---------------- \n :",
#                 doc["ext_wf_position"],
#             )

#             workflow_objec = get_wf_object(doc["workflow_id"])
#             print(
#                 "---------Document workflow_objec DOcuments to Sign---------------- \n :",
#                 workflow_objec,
#             )
#             print(
#                 "---------Document workflow_objec int_wf_string DOcuments to Sign---------------- \n :",
#                 workflow_objec["int_wf_string"],
#             )
#             print(
#                 "---------Document workflow_objec ext_wf_string DOcuments to Sign---------------- \n :",
#                 workflow_objec["ext_wf_string"],
#             )
#             for obj in workflow_objec["int_wf_string"]:
#                 if (
#                     str(obj[0]) == str(doc["int_wf_position"])
#                     and str(obj[-1]) == request.session["user_name"]
#                 ):
#                     print("ur time for internal workflow DOcuments to Sign")
#                     filtered_list.append(doc)
#             # if workflow_objec["ext_wf_string"][0] == doc["ext_wf_position"] and workflow_objec["ext_wf_string"][-1] ==request.session["user_name"] :
#             #     print("ur time for external workflow")
#             for obj in workflow_objec["ext_wf_string"]:
#                 if (
#                     str(obj[0]) == str(doc["ext_wf_position"])
#                     and str(obj[-1]) == request.session["user_name"]
#                 ):
#                     print("ur time for externa; workflow DOcuments to Sign")
#                     filtered_list.append(doc)

#             # doc["document_id"] = doc["_id"]
#             # try:
#             #     wf = get_wf_object(doc["workflow_id"])
#             #     int_wf_steps = wf["int_wf_string"]
#             #     ext_wf_steps = wf["ext_wf_string"]

#             #     if doc["workflow_id"]:
#             #         if wf["int_wf_string"] != "" and doc["int_wf_step"] != "complete":
#             #             for step in int_wf_steps:
#             #                 if (step[0] == doc["int_wf_step"]) and (
#             #                     step[2] == user["Email"]
#             #                 ):
#             #                     if not self.rejected:
#             #                         if doc["rejected_by"] == "":
#             #                             filtered_list.append(doc)
#             #                     else:
#             #                         if doc["rejected_by"] != "":
#             #                             filtered_list.append(doc)

#             #         elif wf["ext_wf_string"] != [] and (
#             #             doc["ext_wf_step"] != "complete"
#             #         ):
#             #             for step in ext_wf_steps:
#             #                 if (step[0] == doc["ext_wf_step"]) and (
#             #                     step[2] == user["Email"]
#             #                 ):
#             #                     if not self.rejected:
#             #                         if doc["rejected_by"] == "":
#             #                             filtered_list.append(doc)
#             #                     else:
#             #                         if doc["rejected_by"] != "":
#             #                             filtered_list.append(doc)
#             # except:
#             #     pass
#         return render(
#             request,
#             self.template_name,
#             {
#                 "filtered_list": filtered_list,
#                 "Role": request.session["Role"],
#                 "signing": self.signing,
#                 "rejected": self.rejected,
#                 "title": self.title,
#             },
#         )


# class RejectedDocumentListView(DocumentExecutionListView):
#     rejected = True
#     title = "Rejected Documents"
#     template_name = "reject_list.html"
