from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from database.mongo_db_connection import (
    get_document_object,
    
    get_template_object,get_wf_object
)
from database.mongo_db_connection_v2 import save_document
from .thread_start import FavoriteThreadAlgolia


@api_view(["GET"])
def favorite(request, id,type):
    try:
        if type=="document":
            FavoriteThreadAlgolia(id, get_document_object,type).start()
        if type=="template":
            FavoriteThreadAlgolia(id, get_template_object,type).start()
        if type=="workflow":
            FavoriteThreadAlgolia(id, get_wf_object,type).start()
        return Response(status=status.HTTP_200_OK)
    except RuntimeError:
        return
    
    