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
from .forms import CreateTemplateForm, CreateDocumentForm

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
    user = request.session["user_name"]
    if user:
        documents = get_document_list(request.session["company_id"])
        if documents:
            for doc in documents:
                workflow = get_wf_object(doc["workflow_id"])
                for obj in workflow["int_wf_string"]:
                    if (
                        str(obj[0]) == str(doc["int_wf_position"])
                        and str(obj[-1]) == user
                    ):
                        print("Part of Internal Workflow signatures------------ \n")
                        filtered_list.append(doc)
                for obj in workflow["ext_wf_string"]:
                    if (
                        str(obj[0]) == str(doc["ext_wf_position"])
                        and str(obj[-1]) == user
                    ):
                        print("Part of External Workflow signatures------------ \n")
                        filtered_list.append(doc)
                return Response(
                    {
                        "documents": filtered_list,
                        "Role": request.session["Role"],
                        "signing": signing,
                        "rejected": rejected,
                    },
                    status=status.HTTP_200_OK,
                )
        else:
            return Response(
                {"message": "An Error Occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
    else:
        return Response(
            {"message": "You Must Be LoggedIn"}, status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(["GET"])
def my_documents(self, request, *args, **kwargs):  # List of my documents.
    executed = True
    title = "Created By Me"
    user = request.session["user_name"]
    documents = get_document_list(request.session["company_id"])
    if documents:
        filtered_list = []
        try:
            for doc in documents:
                workflow = get_wf_object(doc["workflow_id"])
                if workflow:
                    for obj in workflow["int_wf_string"]:
                        if (
                            str(obj[0]) == str(doc["int_wf_position"])
                            and str(obj[-1]) == user
                        ):
                            print("ur time for internal workflow")
                    if (
                        workflow["ext_wf_string"][0] == doc["ext_wf_position"]
                        and workflow["ext_wf_string"][-1] == user
                    ):
                        print("ur time for external workflow")
                    doc["document_id"] = doc["_id"]
                    if doc["created_by"] == user:
                        if self.executed:
                            if doc["int_wf_position"] > 0 or doc["ext_wf_position"] > 0:
                                filtered_list.append(doc)
                        else:
                            filtered_list.append(doc)
                else:
                    return Response(
                        {"message": "An Error Occurred."},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )
        except:
            return Response(
                {"message": "An Error Occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        return Response(
            {"documents": filtered_list, "title": self.title},
        )
    else:
        return Response(
            {"message": "An Error Occurred."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
def draft_documents(self, request, *args, **kwargs):  # List of Draft Documents.
    executed = False
    title = "Draft Documents."
    user = request.session["user_name"]
    documents = get_document_list(request.session["company_id"])
    if documents:
        filtered_list = []
        try:
            for doc in documents:
                workflow = get_wf_object(doc["workflow_id"])
                if workflow:
                    for obj in workflow["int_wf_string"]:
                        if (
                            str(obj[0]) == str(doc["int_wf_position"])
                            and str(obj[-1]) == user
                        ):
                            print("ur time for internal workflow")
                    if (
                        workflow["ext_wf_string"][0] == doc["ext_wf_position"]
                        and workflow["ext_wf_string"][-1] == user
                    ):
                        print("ur time for external workflow")
                    doc["document_id"] = doc["_id"]
                    if doc["created_by"] == user:
                        if self.executed:
                            if doc["int_wf_position"] > 0 or doc["ext_wf_position"] > 0:
                                filtered_list.append(doc)
                        else:
                            filtered_list.append(doc)
                else:
                    return Response(
                        {"message": "An Error Occurred."},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )
        except:
            return Response(
                {"message": "An Error Occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        return Response(
            {"documents": filtered_list, "title": self.title},
        )
    else:
        return Response(
            {"message": "An Error Occurred."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
def rejected_documents(request):  # List of rejected documents.
    rejected = True
    signing = True
    title = "Rejected Documents"
    filtered_list = []
    user = request.session["user_name"]
    if user:
        documents = get_document_list(request.session["company_id"])
        if documents:
            for doc in documents:
                workflow = get_wf_object(doc["workflow_id"])
                for obj in workflow["int_wf_string"]:
                    if (
                        str(obj[0]) == str(doc["int_wf_position"])
                        and str(obj[-1]) == user
                    ):
                        print("Part of Internal Workflow signatures------------ \n")
                        filtered_list.append(doc)
                for obj in workflow["ext_wf_string"]:
                    if (
                        str(obj[0]) == str(doc["ext_wf_position"])
                        and str(obj[-1]) == user
                    ):
                        print("Part of External Workflow signatures------------ \n")
                        filtered_list.append(doc)
                return Response(
                    {
                        "documents": filtered_list,
                        "Role": request.session["Role"],
                        "signing": signing,
                        "rejected": rejected,
                    },
                    status=status.HTTP_200_OK,
                )
        else:
            return Response(
                {"message": "An Error Occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
    else:
        return Response(
            {"message": "You Must Be LoggedIn"}, status=status.HTTP_401_UNAUTHORIZED
        )


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


# class Template(View):
#     def get(self, request, *args, **kwargs):
#         if request.session["user_name"]:
#             template_list = []
#             template_list = [(0, "--Template Name(None)--")]
#             try:
#                 for i in get_template_list(request.session["company_id"]):
#                     template_list.append((i["_id"], i["template_name"]))
#             except:
#                 pass
#             wf_list = []
#             wf_list = [(0, "--Workflow (None)--")]
#             try:
#                 for i in get_wf_list(request.session["company_id"]):
#                     if i["workflow_title"] != "execute_wf":
#                         wf_list.append((i["_id"], i["workflow_title"]))
#             except:
#                 pass
#             form = CreateTemplateForm()
#             CreateTemplateForm.base_fields["workflow"] = forms.ChoiceField(
#                 choices=wf_list
#             )
#             CreateTemplateForm.base_fields["copy_template"] = forms.ChoiceField(
#                 choices=template_list, required=False
#             )
#             CreateTemplateForm.base_fields["workflow"].widget.attrs.update(
#                 {"class": "form-control selectpicker", "data-style": "btn-custom"}
#             )
#             CreateTemplateForm.base_fields["copy_template"].widget.attrs.update(
#                 {"class": "form-control selectpicker", "data-style": "btn-custom"}
#             )
#             form = CreateTemplateForm()
#             return render(request, "create_template.html", {"form": form})
#         else:
#             return redirect_to_login()

# def post(self, request, *args, **kwargs):
#     data = ""
#     old_template = None
#     form = CreateTemplateForm(request.POST)
#     company_id = request.session["company_id"]
#     created_by = request.session["user_name"]
#     if form.is_valid():
#         if (
#             "name" in form.cleaned_data.keys()
#             and "workflow" in form.cleaned_data.keys()
#         ):
#             if form.cleaned_data["copy_template"]:
#                 try:
#                     old_template = get_template_object(
#                         form.cleaned_data["copy_template"]
#                     )
#                     data = old_template["content"]
#                 except:
#                     pass
#             resObj = json.loads(
#                 save_template(
#                     form.cleaned_data["name"],
#                     form.cleaned_data["workflow"],
#                     data,
#                     created_by,
#                     company_id,
#                 )
#             )
#             print("Template Created---------\n", resObj)
#             if resObj["isSuccess"]:
#                 return redirect(
#                     "documentation:template-editor",
#                     template_id=resObj["inserted_id"],
#                 )
#         return JsonResponse({"status": 300, "Error": "Name and workflow required."})
#     return JsonResponse({"status": 420, "Error": "invalid form"})


# class TemplateEditor(View):
#     def get(self, request, *args, **kwargs):
#         if request.session["user_name"]:
#             template_obj = get_template_object(template_id=kwargs["template_id"])
#             workflow_obj = get_wf_object(template_obj["workflow_id"])
#             user = get_user_info_by_username(request.session["user_name"])
#             role_list = []
#             for step in workflow_obj["int_wf_string"]:
#                 if step[0] != "No Steps.":
#                     role_list.append(step[1])
#             for step in workflow_obj["ext_wf_string"]:
#                 if step[0] != "No Steps.":
#                     role_list.append(step[1])

#             ctx = {
#                 "id": template_obj["_id"],
#                 "name": template_obj["template_name"],
#                 "created_by": template_obj["created_by"],
#                 # "auth_role_list": [str(user["Username"]), *role_list],
#                 "auth_role_list": [*role_list],
#                 "file": template_obj["content"],
#                 "verify": False,
#                 "template": True,
#                 "doc_viewer": False,
#                 "company_id": template_obj["company_id"],
#                 "user_email": user["Email"],
#             }
#             return render(request, "editor.html", context={"document": ctx})
#         else:
#             return redirect_to_login()

#     def post(self, request, *args, **kwargs):
#         if request.session["user_name"]:
#             body = json.loads(request.body)
#             template_id = body["file_id"]
#             data = body["content"]
#             resObj = update_template(template_id, json.dumps(data))
#             print("Templated Saved----------------- \n")
#             try:
#                 if resObj["isSuccess"]:
#                     return JsonResponse(
#                         {"status": "200", "message": "Template saved!"}
#                     )  #   redirect('documentation:document-editor', template_id=resObj['inserted_id'])
#             except:
#                 return JsonResponse(
#                     {"status": "340", "Error": "Unable to save on database"}
#                 )
#         else:
#             return JsonResponse({"status": "420", "message": "invalid data"})


# class CreateDocument(View):
#     def get(self, request, *args, **kwargs):
#         if request.session["user_name"]:
#             form = CreateDocumentForm()
#             template_list = [(0, "__Template Name__")]
#             for i in get_template_list(company_id=request.session["company_id"]):
#                 template_list.append((i["_id"], i["template_name"]))
#             CreateDocumentForm.base_fields["copy_template"] = forms.ChoiceField(
#                 choices=template_list
#             )
#             CreateDocumentForm.base_fields["copy_template"].widget.attrs.update(
#                 {"class": "form-control selectpicker", "data-style": "btn-custom"}
#             )
#             CreateDocumentForm.base_fields["copy_template"].label = "Select Template"
#             form = CreateDocumentForm()
#             return render(request, "create_document.html", {"form": form})
#         else:
#             return redirect_to_login()

#     def post(self, request, *args, **kwargs):
#         data = ""
#         form = CreateDocumentForm(request.POST)
#         if request.session["user_name"]:
#             company_id = request.session["company_id"]
#             created_by = request.session["user_name"]
#             if form.is_valid():
#                 template_id = form.cleaned_data["copy_template"]
#                 name = form.cleaned_data["name"]
#                 resObj = json.loads(
#                     save_document(name, template_id, data, created_by, company_id)
#                 )
#                 print("This is a response from Report server -------\n", resObj)
#                 if resObj["isSuccess"]:
#                     return redirect(
#                         "documentation:document-editor",
#                         document_id=resObj["inserted_id"],
#                     )
#                 return JsonResponse(
#                     {"status": 400, "message": "Unable to save on database"}
#                 )
#             return JsonResponse({"status": 420, "message": "invalid form"})
#         else:
#             return redirect_to_login()


# class UserAuthenticate(View):
#     redirect_url = ""

#     def get(self, request, *args, **kwargs):
#         self.redirect_url = reverse(
#             "document:verify", kwargs={"document_id": kwargs["document_id"]}
#         )
#         return render(request, "link_based_authenticate.html")

#     def post(self, request):
#         post_obj = {
#             "Username": request.POST["user"],
#             "OS": request.POST["osver"],
#             "Device": request.POST["device"],
#             "Browser": request.POST["brow"],
#             "Location": request.POST["loc"],
#             "Time": request.POST["ltime"],
#             "Connection": request.POST["mobconn"],
#             "IP": request.POST["ipuser"],
#         }
#         res_obj = requests.post(
#             "https://100014.pythonanywhere.com/api/linkbased", payload=post_obj
#         )
#         request.session["user_name"] = res_obj["data"][0]["Username"]
#         return redirect(self.redirect_url)


# def get_auth_roles(document_obj):
#     role_list = list()
#     content = document_obj["content"]
#     res_content_obj = json.loads(content)
#     for i in res_content_obj[0]:
#         role_list.append(i["auth_user"])
#     return role_list


# class DocumentEditor(View):
#     verify = False
#     template = False
#     doc_viewer = False

#     def get(self, request, *args, **kwargs):
#         if request.session["user_name"]:
#             document_obj = get_document_object(document_id=kwargs["document_id"])
#             user = get_user_info_by_username(request.session["user_name"])
#             # print("Document object in Editor", document_obj["int_wf_step"])
#             workflow_id = document_obj["workflow_id"]
#             wf_single = get_wf_object(workflow_id)
#             # print("User ---------llll", user)
#             member_list = get_members(str(request.session["session_id"]))
#             # print("Members are-----------", member_list)
#             ctx = {
#                 "id": document_obj["_id"],
#                 "name": document_obj["document_name"],
#                 "created_by": document_obj["created_by"],
#                 "auth_role_list": get_auth_roles(document_obj),
#                 "file": document_obj["content"],
#                 "username": request.session["user_name"],
#                 "verify": self.verify,
#                 "template": self.template,
#                 "doc_viewer": self.doc_viewer,
#                 "company_id": document_obj["company_id"],
#                 "user_email": user["Email"],
#                 "wf_list": wf_single,
#                 "member_list": member_list,
#                 "workflow_id": workflow_id,  # eric to send this with the form
#             }
#             # print("ctx---------------------")
#             # print(ctx)
#             return render(
#                 request,
#                 "editor.html",
#                 context={
#                     "curr_user_role": user["Role"],
#                     "document": ctx,
#                     "member_list": member_list,
#                     "workflow_id": workflow_id,
#                 },
#             )
#         else:
#             if self.verify:
#                 return redirect(
#                     "documentation:user-authentication",
#                     document_id=kwargs["document_id"],
#                 )
#             return redirect("https://100014.pythonanywhere.com/logout")

#     def post(self, request, *args, **kwargs):
#         if request.session["user_name"]:
#             body_unicode = request.body.decode("utf-8")
#             body = json.loads(body_unicode)
#             # print("Document Post:----------------\n", body["file_id"], str(body["content"]))
#             res = update_document(
#                 body["file_id"], {"content": json.dumps(body["content"])}
#             )
#             res_obj = json.loads(res)
#             # print("This is a response from Report server ----------------\n", res)
#             if res_obj["isSuccess"]:
#                 return JsonResponse(
#                     {"status": 200, "res": res}
#                 )  #   "url": reverse('documentation:document-editor', kwargs={'document_id': body['file_id']})
#             else:
#                 return JsonResponse(
#                     {"status": 400, "message": "Unable to save on database"}
#                 )
#             """
#             Uncomment this when document update is corrected.
#             if resObj['isSuccess'] :
#                 return JsonResponse({"status": 200, "url": reverse('documentation:document-editor', kwargs={'document_id':document_id'})  #redirect('documentation:document-editor', template_id=resObj['inserted_id'])

#             """
#         else:
#             return JsonResponse({"status": 420, "message": "invalid data"})


# def get_hash(document_id):
#     res = get_uuid(document_id)
#     if res != []:
#         unique_hash = res["uuid_hash"]
#         return JsonResponse({"status": 200, "unique_hash": unique_hash})
#     else:
#         return JsonResponse({"status": 204})


# class ThankYou(View):
#     def get(self, request, *args, **kwargs):
#         return render(request, "thank_you.html")


# class DocumentViewer(DocumentEditor):
#     verify = False
#     template = False
#     doc_viewer = True

#     def post(self, request, *args, **kwargs):
#         pass


# def previous_template(request):
#     template_list = get_template_list(company_id=request.session["company_id"])
#     for item in template_list:
#         item["template_id"] = item["_id"]
#     return render(request, "prev_temp.html", context={"template_list": template_list})


# class Document(View):
#     pass


# def add_members(request):
#     reject_list = []
#     return render(request, "reject_list.html", context={"reject_list": reject_list})


# def requested_documents(request):
#     reject_list = []
#     return render(request, "reject_list.html", context={"reject_list": reject_list})

# def redirect_to_login():
#     return redirect(
#         "https://100014.pythonanywhere.com/?redirect_url=https://100084.pythonanywhere.com/"
#     )


# # Going to Be onbsolete. frontend will handle this.
# @csrf_exempt
# def main(request):
#     session_id = request.GET.get("session_id", None)
#     if session_id:
#         field = {"SessionID": session_id}
#         response = dowellconnection(*SESSION_ARGS, "fetch", field, "nil")
#         res = json.loads(response)
#         if res["isSuccess"]:
#             request.session["session_id"] = res["data"][0]["SessionID"]
#             print("Res------------- \n", res["data"])
#         fields = {"Username": res["data"][0]["Username"]}
#         response = dowellconnection(*REGISTRATION_ARGS, "fetch", fields, "nil")
#         usrdic = json.loads(response)
#         if usrdic["isSuccess"]:
#             print("User Role :", usrdic["data"][0]["Role"])
#             request.session["Role"] = usrdic["data"][0]["Role"]
#             try:
#                 request.session["company_id"] = usrdic["data"][0]["company_id"]
#             except:
#                 request.session["company_id"] = None
#             request.session["user_name"] = usrdic["data"][0]["Username"]
#             print("LoggedIn as : ", usrdic["data"][0])
#             return redirect("documentation:home")  #   HttpResponse("hello")
#         else:
#             return (
#                 redirect_to_login()
#             )  #   return redirect("https://100014.pythonanywhere.com/?code=100084")
#     else:
#         return redirect_to_login()


# Deprecated
# def logout(request):
#     del request.session["user_name"]
#     del request.session["company_id"]
#     del request.session["Role"]
#     return redirect("https://100014.pythonanywhere.com/sign-out")


# # Deprecated.
# def home(request, *args, **kwargs):
#     if request.session.get("user_name"):
#         return render(
#             request, "home.html", {"obj": request.session.items()}
#         )  # HttpResponse(context)
#     else:
#         return redirect_to_login()
