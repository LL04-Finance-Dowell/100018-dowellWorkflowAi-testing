from app.models import FavoriteDocument, FavoriteTemplate, FavoriteWorkflow
from app.serializers import (
    FavouriteDocumentSerializer,
    FavouriteTemplateSerializer,
    FavouriteWorkflowSerializer,
)
import json

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

    except RuntimeError:
        return None

    return {
        "documents": doc_serializer.data,
        "templates": template_serializer.data,
        "workflows": workflow_serializer.data,
    }


def create_favourite(item, type, username):
    """
    Add to favourites/Bookmarks

    Args:
        item(dict): the item details
        type(str): the type of item
        username: identifier of person creating the fav

    Returns:
        msg(str): response success
    """
    msg = "Item added to bookmarks"
    if type == "workflow":
        data = {
            "_id": item["_id"],
            "workflows": json.dumps(item["workflows"]),
            "company_id": item["company_id"],
            "favourited_by": username,
        }

        serializer = FavouriteWorkflowSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return msg

        print(serializer.errors)

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
            return msg

        print(serializer.errors)

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
            return msg

        print(serializer.errors)

    return None


def remove_favourite(identifier, type, username):
    msg = "Item removed from bookmarks."

    if type == "workflow":
        try:
            FavoriteWorkflow.objects.filter(
                _id=identifier, favourited_by=username
            ).delete()
            return msg
        except:
            return None

    if type == "document":
        try:
            FavoriteDocument.objects.filter(
                _id=identifier, favourited_by=username
            ).delete()
            return msg
        except:
            return None

    if type == "template":
        try:
            FavoriteTemplate.objects.filter(
                _id=identifier, favourited_by=username
            ).delete()
            return msg
        except:
            return None
