import json
import re
from django.views import View

from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.clickjacking import (
    xframe_options_exempt,
    xframe_options_deny,
    xframe_options_sameorigin,
)
from django.http import JsonResponse
from django.contrib import messages
from .mongo_db_connection import (
    save_wf,
    get_wf_object,
    get_document_object,
    update_document,
    get_document_list,
    save_uuid_hash,
    get_uuid_object,
)
from .views import DocumentEditor, get_auth_roles
import uuid
from django.shortcuts import render, redirect
from .members import get_members

# from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from django.core.mail import send_mail
from django.urls import reverse
from django.contrib.sites.models import Site
from .mail_format import formated_mail

#   from django.core.mail import EmailMultiAlternatives
from .mongo_db_connection import get_user_info_by_username

regex = "^[a-z0-9]+[._]?[a-z0-9]+[@]\w+[.]\w{2,3}$"


SESSION_ARGS = ["login", "bangalore", "login", "login", "login", "6752828281", "ABCDE"]
REGISTRATION_ARGS = [
    "login",
    "bangalore",
    "login",
    "registration",
    "registration",
    "10004545",
    "ABCDE",
]


# generates the links to be shared for link flow
def generateWorkflowLink(request, role, document_id, *args, **kwargs):
    if request.method == "POST" and request.session["user_name"]:
        uuid_hash = uuid.uuid4().hex
        route = reverse(
            "documentation:verify-document",
            kwargs={
                "document_id": document_id,
                "uuid_hash": uuid_hash,
                "user_name": "null",
            },
        )
        save_uuid_hash(uuid_hash, role, document_id)
        link = Site.objects.get_current().domain + route

        if link:
            return JsonResponse({"status": 200, "link": link})
        else:
            return JsonResponse({"status": 204, "message": "Link creation failed"})
    else:
        return JsonResponse(
            {"status": "ERROR", "message": "A User must be related with company"}
        )


# Role-Email assignment is supposed to happen here as suggested, have to check how the data is going to be sent for processing.
# @csrf_exempt
class GenFlowLink(View):
    def get(self, request, *args, **kwargs):
        return JsonResponse({"message": "Working..."})

    @csrf_exempt
    def post(self, request, *args, **kwargs):
        try:
            print("Posted succesfully------------>")
            role = request.POST.get("role", "User")
            document_id = request.POST.get("document_id", "636650ef5fad2c8fa1cc53d4")
            # role = request.POST.get("role", False)
            uuid_hash = uuid.uuid4().hex
            route = reverse(
                "documentation:verify-document",
                kwargs={
                    "document_id": document_id,
                    "uuid_hash": uuid_hash,
                    "user_name": "null",
                },
            )
            save_uuid_hash(uuid_hash, role, document_id)
            link = Site.objects.get_current().domain + route

            if link:
                return JsonResponse({"status": 200, "link": link})
            else:
                return JsonResponse({"status": 204, "message": "Link creation failed"})
        except:

            return JsonResponse({"status": 200, "message": "Nothing updated."})


def send_notificationVia_mail(user_name, document_id, document_name, *args, **kwargs):
    res_obj = get_user_info_by_username(user_name)
    email = ""
    if res_obj != []:
        email = res_obj["Email"]
    else:
        email = user_name
    uuid_hash = uuid.uuid4().hex
    print("---------Sending Mail to --------- \n", email)
    route = reverse(
        "documentation:verify-document",
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
        "",  # You got document '+ instance.document_name +' to sign on DocEdit. Go at '+ link + ' to sign it ',
        "",
        [
            email,
        ],
        fail_silently=False,
        html_message=html_content,
    )
    return uuid_hash


def documentWorkFlowAddView(request, *args, **kwargs):
    if request.method == "POST" and request.session["user_name"]:
        body = None
        print("---------Start workflow------------ \n")
        #   try:
        body = json.loads(request.body)
        doc = get_document_object(body["file_id"])
        user = get_user_info_by_username(request.session["user_name"])
        new_step = ["Last", user["Email"]]
        wf_obj = get_wf_object(doc["workflow_id"])
        new_wf = json.loads(
            save_wf(
                "execute_wf",
                wf_obj["int_wf_string"],
                [*wf_obj["ext_wf_string"], new_step],
                request.session["user_name"],
                request.session["company_id"],
            )
        )
        dd = datetime.now()
        time = dd.strftime("%d:%m:%Y,%H:%M:%S")
        new_wf = get_wf_object(new_wf["inserted_id"])
        print("--------------New Workflow:-------------------------- \n", new_wf)
        if new_wf["ext_wf_string"] != []:
            res = json.loads(
                update_document(
                    body["file_id"],
                    {
                        #   'content': body['content'],
                        "workflow_id": new_wf["_id"],
                        "ext_wf_position": 0,
                        "ext_wf_step": new_wf["ext_wf_string"][0][0],
                        "update_time": time,
                    },
                )
            )
            print("-------Response of External workflow---------- \n", res)
            print(
                "-----------Email for External------------ \n",
                new_wf["ext_wf_string"][0][2],
            )
            if res["isSuccess"]:
                print("------Happened for EXt------ \n")
                # mail_status = send_notificationVia_mail(
                #     new_wf["ext_wf_string"][0][2], body["file_id"], doc["document_name"]
                # )
                # print("--------doc db updated---------- \n", mail_status)
            else:
                print("doc db updated error")

        if new_wf["int_wf_string"] != []:
            res = json.loads(
                update_document(
                    body["file_id"],
                    {
                        "workflow_id": new_wf["_id"],
                        #   'content': body['content'],
                        "int_wf_position": 1,
                        "int_wf_step": new_wf["int_wf_string"][0][0],
                        "update_time": time,
                    },
                )
            )
            print("-------Response of Internal workflow---------- \n", res)
            print("-------Document doc in process document---------- \n", doc)
            if res["isSuccess"]:
                mail_status = send_notificationVia_mail(
                    new_wf["int_wf_string"][0][2], body["file_id"], doc["document_name"]
                )
                print("doc db updated", mail_status)
            else:
                print("doc db updated error")
        return JsonResponse(
            {"status": 200, "url": reverse("documentation:documents-to-sign")}
        )
        #   except:           return JsonResponse({ 'status': 'ERROR' , 'message': 'Error placing document in workflow.'})
    else:
        return JsonResponse(
            {"status": "ERROR", "message": "A User must be related with company"}
        )


def check_if_two(status, wf):
    curr = status - 1
    curr_len = -1
    if curr < len(wf):
        curr_len = len(wf[curr])
    if curr_len == 2:
        return True
    if curr_len == 3:
        return False
    if curr_len == 0:
        return True
    if curr_len == -1:
        return False
    return False


def execute_wf(request, document_id, document_name, status, wf):
    step_name = ""
    status += 1
    print("-------length of wf--------", len(wf))
    print("-------contenr of wf--------", wf)
    print("-------status--------", status)
    cross_check = check_if_two(status, wf)
    if status >= len(wf) or cross_check:
        step_name = "complete"
        status = len(wf)
        messages.success(
            request, document_name.title() + " document Signed at all stages."
        )
    else:
        step_name = wf[status - 1][
            0
        ]  #   step_user = get_user(re.split('-', wf[status - 1])[1][:-1])
        print("step name is---- \n", step_name)
        print("The Email now is------------- \n", wf[status - 1][2])
        mail_status = send_notificationVia_mail(
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


def workflowVerification(request, doc):
    print("Begining of verification for doc name ------? \n", doc["document_name"])
    status = 0
    step_name = ""
    res = None
    wf = get_wf_object(doc["workflow_id"])
    print("--------What is the Workflow id------- \n", doc["workflow_id"])
    print("--------What is the Workflow------- \n", wf)
    int_wf_steps = wf[
        "int_wf_string"
    ]  # int_wf_steps = re.findall("\w*\-\w*\*", wf['int_wf_string'])
    ext_wf_steps = wf[
        "ext_wf_string"
    ]  # ext_wf_steps = re.findall("\w*\-\w*\*", wf['ext_wf_string'])

    if ((wf["int_wf_string"] != []) and (doc["int_wf_step"] != "complete")) and (
        doc["int_wf_position"] <= len(int_wf_steps)
    ):
        print("Got in internal workflow for doc name \n", doc["document_name"])
        #   if ((wf['int_wf_string'] != '') or (wf['int_wf_step'] != 'complete')) and (doc['int_wf_position'] <= len(int_wf_steps)):
        status, step_name = execute_wf(
            request,
            doc["_id"],
            doc["document_name"],
            doc["int_wf_position"],
            int_wf_steps,
        )
        # if status and status != doc["int_wf_position"]:
        #     res = json.loads(
        #         update_document(
        #             doc["_id"],
        #             {
        #                 "int_wf_position": status,
        #                 "int_wf_step": step_name,
        #             },
        #         )
        #     )
        #     doc = get_document_object(doc["_id"])
        #     if (doc["int_wf_step"] == "complete") and (wf["ext_wf_string"] != []):
        #         print(" Do we reach here first for doc name ------------? \n", doc["document_name"])
        #         res = json.loads(
        #             update_document(
        #                 doc["_id"],
        #                 {
        #                     "ex_wf_position": 1,
        #                     "ex_wf_step": "1",
        #                 },
        #             )
        #         )
        #         doc = get_document_object(doc["_id"])
        # if status and status != doc["int_wf_position"]:
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
                " Do we reach here first for doc name ------------? \n",
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
            # print("----------New Doc-------- \n", doc)
    if ((wf["ext_wf_string"] != []) and (doc["ext_wf_step"] != "complete")) and (
        doc["ext_wf_position"] <= len(ext_wf_steps)
        and (doc["int_wf_step"] == "complete")
    ):
        print(" Do we reach here- Ext-----------? \n")
        status, step_name = execute_wf(
            request,
            doc["_id"],
            doc["document_name"],
            doc["ext_wf_position"],
            ext_wf_steps,
        )
        # print("------External Status------- \n", status)
        # print("-------External Step Name---------- \n", step_name)
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
            print("The Re for ext_wf_string----------- \n", res)

            doc = get_document_object(doc["_id"])
            if doc["ext_wf_position"] == "complete":
                messages.info(request, "Document completed External WorkFlow.")
    if doc["int_wf_step"] == "complete" and doc["ext_wf_step"] == "complete":
        status = 1
        step_name = "complete"
        owner_email = ext_wf_steps[-1][1]
        mail_status = send_notificationVia_mail(
            owner_email, doc["_id"], doc["document_name"]
        )
        print("------Ext and Int WF complete--------- \n", mail_status)

    messages.error(request, "No WorkFlow Available")
    # print("Update response------------ \n :", res)
    return doc, status, step_name


class DocumentVerificationView(DocumentEditor):
    verify = True
    is_template = False
    doc_viewer = False

    def get(self, request, *args, **kwargs):
        if kwargs.get("uuid_hash", None):
            uuid_obj = get_uuid_object(uuid_hash=kwargs["uuid_hash"])
            # print(
            #     "-------------UUID object in Editor-------------\n", uuid_obj["email"]
            # )
            document_obj = get_document_object(document_id=kwargs["document_id"])
            # print("step document is at ------", document_obj["int_wf_step"])
            # print("----------List of Roles------------", document_obj["auth_role_list"])
            # print("-----AuthList----------- \n", get_auth_roles(document_obj))
            ctx = {
                "id": document_obj["_id"],
                "name": document_obj["document_name"],
                "created_by": document_obj["created_by"],
                "auth_role_list": get_auth_roles(document_obj),
                "file": document_obj["content"],
                "verify": self.verify,
                "username": kwargs.get("user_name"),
                "template": self.template,
                "doc_viewer": self.doc_viewer,
                "company_id": document_obj["company_id"],
                "user_email": uuid_obj["email"],
            }
            return render(request, "editor.html", context={"document": ctx})
        else:
            return redirect("https://100014.pythonanywhere.com/logout")

    def post(self, request, **kwargs):
        doc = get_document_object(request.POST["document_id"])
        # print(
        #     "-----Document in wf-----:  \n",
        #     doc["int_wf_step"],
        #     doc["ext_wf_step"],
        #     doc["int_wf_position"],
        # )
        # print("-----------Doc--------- \n", doc)
        doc, status, step_name = workflowVerification(request, doc)
        if status and step_name != "":
            data = json.loads(request.POST["documentData"])
            doc = json.loads(
                update_document(
                    request.POST["document_id"], {"content": json.dumps(data)}
                )
            )
            # print("----------Document after updating step---------- : \n", doc)
            # return JsonResponse(
            #     {"status": 200, "message": f"Document updated! - {doc}"}
            # )  # return redirect('editor:documents-in-workflow', company_id=kwargs['company_id'])
            return redirect("documentation:thank-you")
        else:
            print("Unauthorize access to document 403")
            return JsonResponse(
                {"status": 403, "url": "/", "error": "Unauthorize access to document."}
            )


class DocumentInternalSign(DocumentEditor):
    verify = True
    is_template = False
    doc_viewer = False

    def get(self, request, *args, **kwargs):
        if request.session["user_name"]:
            document_obj = get_document_object(document_id=kwargs["document_id"])
            user = get_user_info_by_username(request.session["user_name"])
            # print("Document object in Editor", document_obj["int_wf_step"])
            workflow_id = document_obj["workflow_id"]
            # workflow_id = "63664fec5fad2c8fa1cc5396"

            wf_single = get_wf_object(workflow_id)
            # print("User ---------llll", user)
            member_list = get_members(str(request.session["session_id"]))
            # print("Members are-----------", member_list)
            ctx = {
                "id": document_obj["_id"],
                "name": document_obj["document_name"],
                "created_by": document_obj["created_by"],
                "auth_role_list": get_auth_roles(document_obj),
                "file": document_obj["content"],
                "username": request.session["user_name"],
                "verify": self.verify,
                "template": self.template,
                "doc_viewer": self.doc_viewer,
                "company_id": document_obj["company_id"],
                # "company_id": "6365ee18ff915c925f3a6691",
                "user_email": user["Email"],
                "wf_list": wf_single,
                "member_list": member_list,
                # "workflow_id": workflow_id,  # eric to send this with the form
            }
            # print("ctx---------------------")
            # print(ctx)
            return render(
                request,
                "editor.html",
                context={
                    "curr_user_role": user["Role"],
                    "document": ctx,
                    "member_list": member_list,
                    "workflow_id": workflow_id,
                },
            )

        else:
            if self.verify:
                return redirect(
                    "documentation:user-authentication",
                    document_id=kwargs["document_id"],
                )
            return redirect("https://100014.pythonanywhere.com/logout")

    def post(self, request, *args, **kwargs):
        if request.session["user_name"]:
            print(
                "request.POST.get document id----->",
                request.POST.get("document_id", "Nothinggg"),
            )
            print(
                "request.POST.get type documentdata----->",
                type(request.POST.get("documentData", "Nothinggg")),
            )
            print(
                "request.POST.get document data----->",
                request.POST.get("documentData", "Nothinggg"),
            )
            doc_data = request.POST.get("documentData", False)
            doc_id = request.POST.get("document_id", False)
            # body_unicode = request.doc_data.decode("utf-8")
            # print("body_unicode----->", body_unicode)
            body = json.loads(doc_data)
            # print("Document Post:----------------\n", body["file_id"], str(body["content"]))
            # res = update_document(
            #     body["file_id"], {"content": json.dumps(body["content"])}
            # )
            res = ""
            if doc_id:
                print("in doc_id now")
                if doc_data:
                    print("In doc data now")
                    # res = update_document(
                    #     doc_id, {"content": json.dumps(body)}
                    # )

                    doc = get_document_object(doc_id)
                    # print(
                    #     "-----Document in wf-----:  \n",
                    #     doc["int_wf_step"],
                    #     doc["ext_wf_step"],
                    #     doc["int_wf_position"],
                    # )
                    # print("-----------Doc--------- \n", doc)
                    doc, status, step_name = workflowVerification(request, doc)
                    print("status after verification =====> internal \n", status)
                    print("step after verification =====> internal \n", step_name)
                    print("doc after verification =====> internal \n", doc)
                    if status and step_name != "":
                        data = json.loads(request.POST["documentData"])
                        doc = json.loads(
                            update_document(
                                request.POST["document_id"],
                                {"content": json.dumps(data)},
                            )
                        )
                        # print("----------Document after updating step---------- : \n", doc)
                        # return JsonResponse(
                        #     {"status": 200, "message": f"Document updated! - {doc}"}
                        # )  # return redirect('editor:documents-in-workflow', company_id=kwargs['company_id'])
                        return redirect("documentation:thank-you")
                    else:
                        print("Unauthorize access to document 403")
                        return JsonResponse(
                            {
                                "status": 403,
                                "url": "/",
                                "error": "Unauthorize access to document.",
                            }
                        )

            # res_obj = json.loads(res)
            # # print("This is a response from Report server ----------------\n", res)

            # if res_obj["isSuccess"]:
            #     return JsonResponse(
            #         {"status": 200, "res": res}
            #     )  #   "url": reverse('documentation:document-editor', kwargs={'document_id': body['file_id']})
            # else:
            #     return JsonResponse(
            #         {"status": 400, "message": "Unable to save on database"}
            #     )
            # """
            # Uncomment this when document update is corrected.
            # if resObj['isSuccess'] :
            #     return JsonResponse({"status": 200, "url": reverse('documentation:document-editor', kwargs={'document_id':document_id'})  #redirect('documentation:document-editor', template_id=resObj['inserted_id'])

            # """
        else:
            return JsonResponse({"status": 420, "message": "invalid data"})


def user_in_wf(user, wf):
    status = False
    for step in wf:
        if user["Email"] == step[1]:
            status = True
    return status


def documentRejectionRequest(request, *args, **kwargs):
    if request.method == "POST" and request.session["user_name"]:
        body = json.loads(request.body)
        doc = get_document_object(body["file_id"])
        wf = get_wf_object(doc["workflow_id"])
        int_wf_steps = wf[
            "int_wf_string"
        ]  #   re.findall("\w*\-\w*\*", wf['int_wf_string'])
        ext_wf_steps = wf[
            "ext_wf_string"
        ]  #   re.findall("\w*\-\w*\*", wf['ext_wf_string'])
        user = get_user_info_by_username(request.session["user_name"])
        if user_in_wf(user, wf["int_wf_string"]) or user_in_wf(
            user, wf["ext_wf_string"]
        ):
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
                return JsonResponse({"status": 300, "url": "Unable to reject."})
            return JsonResponse(
                {"status": 200, "url": reverse("documentation:documents-to-sign")}
            )
        else:
            return JsonResponse(
                {"status": 302, "url": "Only wf authority requests are accepted."}
            )
    else:
        return JsonResponse({"status": 500, "url": "Only POST requests are accepted."})


class DocumentCreatedListView(View):
    executed = False
    title = "Draft Documents"

    def get(self, request, *args, **kwargs):

        documents = get_document_list(request.session["company_id"])
        # documents = get_document_list("6365ee18ff915c925f3a6691")
        # print("---------Documents---------------- \n :", documents)

        filtered_list = []
        try:
            for doc in documents:
                # print("===================User in Question is ================== \n :", request.session["user_name"])
                # print("---------Document workflow Id---------------- \n :", doc["workflow_id"])
                # print("---------Document Name---------------- \n :", doc["document_name"])
                # print("---------Document int_wf_position---------------- \n :", doc["int_wf_position"])
                # print("---------Document ext_wf_position---------------- \n :", doc["ext_wf_position"])

                workflow_objec = get_wf_object(doc["workflow_id"])
                # print("---------Document workflow_objec---------------- \n :", workflow_objec)
                # print("---------Document workflow_objec int_wf_string---------------- \n :", workflow_objec["int_wf_string"])
                # print("---------Document workflow_objec ext_wf_string---------------- \n :", workflow_objec["ext_wf_string"])
                for obj in workflow_objec["int_wf_string"]:
                    if (
                        str(obj[0]) == str(doc["int_wf_position"])
                        and str(obj[-1]) == request.session["user_name"]
                    ):
                        print("ur time for internal workflow")
                if (
                    workflow_objec["ext_wf_string"][0] == doc["ext_wf_position"]
                    and workflow_objec["ext_wf_string"][-1]
                    == request.session["user_name"]
                ):
                    print("ur time for external workflow")
                doc["document_id"] = doc["_id"]
                if doc["created_by"] == request.session["user_name"]:
                    if self.executed:
                        if doc["int_wf_position"] > 0 or doc["ext_wf_position"] > 0:
                            filtered_list.append(doc)
                    else:
                        filtered_list.append(doc)
        except:
            pass
        return render(
            request,
            "requested_documents.html",
            {"filtered_list": filtered_list, "title": self.title},
        )


class DocumentCreatedInExecutionListView(DocumentCreatedListView):
    executed = True
    title = "Created By Me"


class DocumentExecutionListView(View):
    rejected = False
    signing = True
    title = "Documents to Sign"
    template_name = "requested_documents.html"

    def get(self, request, *args, **kwargs):
        filtered_list = []
        documents = get_document_list(request.session["company_id"])
        # documents = get_document_list("6365ee18ff915c925f3a6691")
        get_user_info_by_username(request.session["user_name"])
        # print("Documents in List view  DOcuments to Sign--------- \n", documents)
        # print("My role is--------------- \n", request.session["Role"])
        for doc in documents:
            doc["document_id"] = doc["_id"]
            print(
                "===================User in Question is DOcuments to Sign ================== \n :",
                request.session["user_name"],
            )
            print(
                "---------Document workflow Id DOcuments to Sign---------------- \n :",
                doc["workflow_id"],
            )
            print(
                "---------Document Name DOcuments to Sign---------------- \n :",
                doc["document_name"],
            )
            print(
                "---------Document int_wf_position DOcuments to Sign---------------- \n :",
                doc["int_wf_position"],
            )
            print(
                "---------Document ext_wf_position DOcuments to Sign---------------- \n :",
                doc["ext_wf_position"],
            )

            workflow_objec = get_wf_object(doc["workflow_id"])
            print(
                "---------Document workflow_objec DOcuments to Sign---------------- \n :",
                workflow_objec,
            )
            print(
                "---------Document workflow_objec int_wf_string DOcuments to Sign---------------- \n :",
                workflow_objec["int_wf_string"],
            )
            print(
                "---------Document workflow_objec ext_wf_string DOcuments to Sign---------------- \n :",
                workflow_objec["ext_wf_string"],
            )
            for obj in workflow_objec["int_wf_string"]:
                if (
                    str(obj[0]) == str(doc["int_wf_position"])
                    and str(obj[-1]) == request.session["user_name"]
                ):
                    print("ur time for internal workflow DOcuments to Sign")
                    filtered_list.append(doc)
            # if workflow_objec["ext_wf_string"][0] == doc["ext_wf_position"] and workflow_objec["ext_wf_string"][-1] ==request.session["user_name"] :
            #     print("ur time for external workflow")
            for obj in workflow_objec["ext_wf_string"]:
                if (
                    str(obj[0]) == str(doc["ext_wf_position"])
                    and str(obj[-1]) == request.session["user_name"]
                ):
                    print("ur time for externa; workflow DOcuments to Sign")
                    filtered_list.append(doc)

            # doc["document_id"] = doc["_id"]
            # try:
            #     wf = get_wf_object(doc["workflow_id"])
            #     int_wf_steps = wf["int_wf_string"]
            #     ext_wf_steps = wf["ext_wf_string"]

            #     if doc["workflow_id"]:
            #         if wf["int_wf_string"] != "" and doc["int_wf_step"] != "complete":
            #             for step in int_wf_steps:
            #                 if (step[0] == doc["int_wf_step"]) and (
            #                     step[2] == user["Email"]
            #                 ):
            #                     if not self.rejected:
            #                         if doc["rejected_by"] == "":
            #                             filtered_list.append(doc)
            #                     else:
            #                         if doc["rejected_by"] != "":
            #                             filtered_list.append(doc)

            #         elif wf["ext_wf_string"] != [] and (
            #             doc["ext_wf_step"] != "complete"
            #         ):
            #             for step in ext_wf_steps:
            #                 if (step[0] == doc["ext_wf_step"]) and (
            #                     step[2] == user["Email"]
            #                 ):
            #                     if not self.rejected:
            #                         if doc["rejected_by"] == "":
            #                             filtered_list.append(doc)
            #                     else:
            #                         if doc["rejected_by"] != "":
            #                             filtered_list.append(doc)
            # except:
            #     pass
        return render(
            request,
            self.template_name,
            {
                "filtered_list": filtered_list,
                "Role": request.session["Role"],
                "signing": self.signing,
                "rejected": self.rejected,
                "title": self.title,
            },
        )


class RejectedDocumentListView(DocumentExecutionListView):
    rejected = True
    title = "Rejected Documents"
    template_name = "reject_list.html"


"""
class RejectedDocumentListView(DocumentExecutionListView):
    def get(self, *args, **kwargs):
        filtered_list = []
        documents = get_document_list(request.session['company_id'])

        for doc in documents:
            wf = get_wf_object(doc['workflow_id'])
            int_wf_steps = re.findall("\w*\-\w*\*", wf['int_wf_string'])
            ext_wf_steps = re.findall("\w*\-\w*\*", wf['ext_wf_string'])

            if wf['int_wf_string'] != '' and doc['int_wf_step'] != 'complete'):
                for step in int_wf_steps:
                    if (re.split('-', step)[0] == doc['int_wf_step']) and (re.split('-', step)[1][:-1] == request.session['user_name']):
                        if doc['rejected_by'] != '' :
                            filtered_list.append(doc)

            elif wf['ext_wf_string'] != '' and (doc['ext_wf_step'] != 'complete'):
                for step in ext_wf_steps:
                    if (re.split('-', step)[0] == doc['ext_wf_step']) and (re.split('-', step)[1][:-1] == request.session['user_name']):
                        if doc['rejected_by'] != '' :
                            filtered_list.append(doc)


        return render(request, 'document_list.html', {'object_list': filtered_list})

"""
