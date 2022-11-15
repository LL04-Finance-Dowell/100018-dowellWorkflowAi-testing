# import json
# import requests
# from django import forms
# from django.views import View
# from django.shortcuts import render, redirect, reverse
# from django.views.decorators.csrf import csrf_exempt
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from .dowellconnection import dowellconnection
# from rest_framework import status
# from .mongo_db_connection import (
#     get_all_wf_list,
#     save_wf,
#     get_wf_list,
#     get_user_list,
#     get_template_list,
#     get_document_list,
#     save_template,
#     get_template_object,
#     update_template,
#     save_document,
#     update_wf,
#     get_uuid,
# )
# from .mongo_db_connection import (
#     get_document_object,
#     update_document,
#     get_wf_object,
#     get_user_info_by_username,
# )
# from .members import get_members
# from .forms import CreateTemplateForm, CreateDocumentForm

# SESSION_ARGS = ["login", "bangalore", "login", "login", "login", "6752828281", "ABCDE"]
# REGISTRATION_ARGS = [
#     "login",
#     "bangalore",
#     "login",
#     "registration",
#     "registration",
#     "10004545",
#     "ABCDE",
# ]



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




# def get_hash(document_id):
#     res = get_uuid(document_id)
#     if res != []:
#         unique_hash = res["uuid_hash"]
#         return Response({"status": 200, "unique_hash": unique_hash})
#     else:
#         return Response({"status": 204})










