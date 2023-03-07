from .algolia import get_algolia_data,get_fav_data
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from algoliasearch.search_client import SearchClient

client = SearchClient.create("N7KJ4AQQ7Z", "9514747f86dce7e94cc5a2d56677e8e8")



@api_view(["POST"])
def search(request):
    return Response(
        {
            "search_keyword": request.data["search"],
            "search_result": get_algolia_data(request.data["search"], request.data["company_id"]),
        },
        status=status.HTTP_200_OK,
    )

@api_view(["POST"])
def get_fav(request):
    return Response(
        {
            "search_keyword": request.data["search"],
            "search_result": get_fav_data(request.data["search"], request.data["company_id"]),
        },
        status=status.HTTP_200_OK,
    )

