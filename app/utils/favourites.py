from rest_framework import status
from rest_framework.response import Response

from app.models import FavoriteDocument, FavoriteTemplate, FavoriteWorkflow
from app.serializers import (
    FavouriteDocumentSerializer,
    FavouriteTemplateSerializer,
    FavouriteWorkflowSerializer,
)


def list_favourites(company_id):
    """
    Get all favourites

    Args:
        username(str): requesting person
        company_id(str): the org belonging

    Returns:
        Response: a http response to client
    """
    try:
        documents = FavoriteDocument.objects.filter(company_id=company_id)
        doc_serializer = FavouriteDocumentSerializer(documents, many=True)

        templates = FavoriteTemplate.objects.filter(company_id=company_id)
        template_serializer = FavouriteTemplateSerializer(templates, many=True)

        workflows = FavoriteWorkflow.objects.filter(company_id=company_id)
        workflow_serializer = FavouriteWorkflowSerializer(workflows, many=True)
        return Response(
            {
                "documents": doc_serializer.data,
                "templates": template_serializer.data,
                "workflows": workflow_serializer.data,
            },
            status.HTTP_200_OK,
        )
    except RuntimeError:
        return Response(
            "failed to get favourites",
            status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


def create_favourite(item, type, username):
    """
    Add to favourites

    Args:
        item(dict): the item details
        type(str): the type of item
        username: identifier of person creating the fav

    Returns:
        Response: http response to client
    """

    if type == "workflow":
        data = {
            "_id": item["_id"],
            "workflows": item["workflows"],
            "company_id": item["company_id"],
            "favourited_by": username,
        }

        serializer = FavouriteWorkflowSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response("Item added to favourites", status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if type == "document":
        data = {
            "_id": item["_id"],
            "document_name": item["document_name"],
            "company_id": item["company_id"],
            "favourited_by": username,
        }
        serializer = FavouriteDocumentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response("Item added to favourites", status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Fav
    if type == "template":
        data = {
            "_id": item["_id"],
            "template_name": item["template_name"],
            "company_id": item["company_id"],
            "favourited_by": username,
        }

        serializer = FavouriteTemplateSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response("Item added to favourites", status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def remove_favourite(identifier, type, username):
    if type == "workflow":
        try:
            FavoriteWorkflow.objects.filter(
                _id=identifier, favourited_by=username
            ).delete()
            return Response("Item removed from favourites", status.HTTP_204_NO_CONTENT)
        except:
            return Response(
                "Failed to remove item from favourites",
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    if type == "document":
        try:
            FavoriteDocument.objects.filter(
                _id=identifier, favourited_by=username
            ).delete()
            return Response("Item removed from favourites", status.HTTP_204_NO_CONTENT)
        except:
            return Response(
                "Failed to remove item from favourites",
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    if type == "template":
        try:
            FavoriteTemplate.objects.filter(
                _id=identifier, favourited_by=username
            ).delete()
            return Response("Item removed from favourites", status.HTTP_204_NO_CONTENT)
        except:
            return Response(
                "Failed to remove item from favourites",
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
