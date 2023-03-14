from app.models import FavoriteDocument, FavoriteTemplate, FavoriteWorkflow
from app.utils.mongo_db_connection import (
    get_document_object,
    get_wf_object,
    get_template_object,
)


def save_as_favorite(identifier, type, username):
    if type == "workflow":
        data = get_wf_object(identifier)
        data["username"] = username
        model = FavoriteWorkflow(**data)
        model.save()
    if type == "document":
        data = get_document_object(identifier)
        data["username"] = username

        try:
            data["content"] = eval(data["content"])
        except:
            pass
        model = FavoriteDocument(**data)
        model.save()
    if type == "template":
        data = get_template_object(identifier)
        data["username"] = username
        try:
            data["content"] = eval(data["content"])
        except:
            pass
        model = FavoriteTemplate(**data)
        model.save()


def remove_favorite(identifier, type):
    if type == "workflow":

        FavoriteWorkflow.objects.filter(_id=identifier).delete()

    if type == "document":

        FavoriteDocument.objects.filter(_id=identifier).delete()

    if type == "template":

        FavoriteTemplate.objects.filter(_id=identifier).delete()
