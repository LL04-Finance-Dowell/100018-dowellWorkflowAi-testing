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
@api_view(["GET"])
def approved_templates(request):  # List of Created Templates.
    pass

@api_view(["GET", "POST"])
def not_approved_templates(request): # List of Templates to be approved.
    pass

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

