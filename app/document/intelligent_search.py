from .algolia import get_algolia_data, get_fav_data
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from algoliasearch.search_client import SearchClient
from ..models import *
import json
from django.core import serializers

client = SearchClient.create("N7KJ4AQQ7Z", "9514747f86dce7e94cc5a2d56677e8e8")


@api_view(["POST"])
def search(request):
    return Response(
        {
            "search_keyword": request.data["search"],
            "search_result": get_algolia_data(
                request.data["search"], request.data["company_id"]
            ),
        },
        status=status.HTTP_200_OK,
    )


@api_view(["GET", "POST"])
def get_fav(request):
    documents = []
    templates = []
    workflows = []
    if request.method == "POST":
        company_id = request.data["company_id"]
        created_by = request.data["created_by"]
        documents = FavoriteDocument.objects.filter(
            company_id=company_id, created_by=created_by
        ).values()
        templates = FavoriteTemplate.objects.filter(
            company_id=company_id, created_by=created_by
        ).values()
        workflows = FavoriteWorkflow.objects.filter(
            company_id=company_id, created_by=created_by
        ).values()
    return Response(
        {"documents": documents, "templates": templates, "workflows": workflows},
        status=status.HTTP_200_OK,
    )
