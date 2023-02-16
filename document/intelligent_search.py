from .algolia import get_algolia_data
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from algoliasearch.search_client import SearchClient

client = SearchClient.create("N7KJ4AQQ7Z", "9514747f86dce7e94cc5a2d56677e8e8")


@api_view(["POST"])
def search(request):
    # get_search_result = {"workflow": [], "document": [], "template": []}
    # workflow_list = get_wf_list(request.data["company_id"])
    # documents = get_document_list(request.data["company_id"])
    # templats = get_template_list(request.data["company_id"])

    # if request.method == "POST":

    #     t=time.time()
    #     workflow_list = get_wf_list(request.data["company_id"])
    #     documents = get_document_list(request.data["company_id"])
    #     templats = get_template_list(request.data["company_id"])
    #     print("before search ",time.time()-t)

    #     get_search_result["document"] = [
    #         doc
    #         for doc in documents
    #         if doc.get("document_name") == request.data["search"]
    #     ]
    #     get_search_result["workflow"] = [
    #         wf
    #         for wf in workflow_list
    #         if wf.get("workflow_title") == request.data["search"]
    #     ]
    #     get_search_result["template"] = [
    #         temp
    #         for temp in templats
    #         if temp.get("template_name") == request.data["search"]
    #     ]
    #     print("after",time.time()-t)

    return Response(
        {
            "search_keyword": request.data["search"],
            "search_result": get_algolia_data(request.data["search"], request.data["company_id"]),
        },
        status=status.HTTP_200_OK,
    )
