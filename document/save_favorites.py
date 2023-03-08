from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from database.mongo_db_connection import (
    get_document_object,
    
    get_template_object,get_wf_object
)
from database.mongo_db_connection_v2 import save_document
from .thread_start import FavoriteThread


@api_view(["GET"])
def favorite(request, id,type):
    try:
        if type=="document":
            FavoriteThread(id, type).start()
        if type=="template":
            FavoriteThread(id,type).start()
        if type=="workflow":
            FavoriteThread(id, type).start()
        return Response(status=status.HTTP_200_OK)
    except RuntimeError:
        return
        
    
    