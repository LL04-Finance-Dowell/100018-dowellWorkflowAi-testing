from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .thread_start import FavoriteThread


@api_view(["GET"])
def favorite(request, item_id, item_type):
    try:
        if type == "document":
            FavoriteThread(item_id, item_type).start()
        if type == "template":
            FavoriteThread(item_id, item_type).start()
        if type == "workflow":
            FavoriteThread(item_id, item_type).start()
        return Response(status=status.HTTP_200_OK)
    except RuntimeError:
        return
