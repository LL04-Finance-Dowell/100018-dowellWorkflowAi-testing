from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .thread_start import FavoriteThread, DeleteFavoriteThread


@api_view(["GET"])
def favorite(request, item_id, item_type):
    try:

        FavoriteThread(item_id, item_type).start()
        return Response(status=status.HTTP_200_OK)
    except RuntimeError:
        return


@api_view(["GET"])
def delete_favorite(request, item_id, item_type):
    try:

        DeleteFavoriteThread(item_id, item_type).start()
        return Response(status=status.HTTP_200_OK)
    except RuntimeError:
        return
