# Do all Search Logic Here.
import time
from database.mongo_db_connection import (
    get_wf_list,
    get_document_list,
    get_template_list,
)
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q


@api_view(["POST"])
def search(request):
    get_search_result = {"workflow": [], "document": [], "template": []}

    if request.method == "POST":

        workflow_list = get_wf_list(request.data["company_id"])
        documents = get_document_list(request.data["company_id"])
        templats = get_template_list(request.data["company_id"])

        get_search_result["document"] = [
            doc
            for doc in documents
            if doc.get("document_name") == request.data["search"]
        ]
        get_search_result["workflow"] = [
            wf
            for wf in workflow_list
            if wf.get("workflow_title") == request.data["search"]
        ]
        get_search_result["template"] = [
            temp
            for temp in templats
            if temp.get("template_name") == request.data["search"]
        ]

    return Response(
        {
            "search_keyword": request.data["search"],
            "search_result": get_search_result,
        },
        status=status.HTTP_200_OK,
    )
