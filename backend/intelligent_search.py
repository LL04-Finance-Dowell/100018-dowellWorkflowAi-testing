# Do all Search Logic Here.
import time
from .mongo_db_connection import get_wf_list,get_document_list,get_template_list
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import  Q

# searchable =  [get_template_object(id),]

@api_view(["GET",'POST'])
def search(request,str,company='6365ee18ff915c925f3a6691'):
    # print(request.POST.cleaned_data.keys)
    get_search_result={'workflow':[],'document':[],'template':[]}

    if request.method == "GET":
        
        workflow_list = get_wf_list(company)
        documents = get_document_list(company)
        templats = get_template_list(company)

        get_search_result["document"]=[doc for doc in documents if doc.get("document_name")==str ]
        get_search_result["workflow"]=[wf for wf in workflow_list if wf.get("workflow_title")==str ]
        get_search_result["template"]=[temp for temp in templats if temp.get("template_name")==str ]

        # for wf in workflow_list:
        #     if wf.get("workflow_title") == str:
        #         get_search_result["workflow"].append(wf)
        # for doc in documents:
        #     if str ==doc.get('document_name'):
        #         get_search_result["document"].append(doc)
        # for template in templats:
        #     if str == template.get('template_name'):
        #         get_search_result["template"].append(template)
        
    return Response(
        {
            "message": "Search Listing Success",
            'search_keyword':str,
            "search_result": get_search_result,
        },
        status=status.HTTP_200_OK,
    )