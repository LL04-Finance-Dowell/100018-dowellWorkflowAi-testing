from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .mongo_db_connection import get_user_info_by_username


@api_view(["POST"])
def user(request):
    res = get_user_info_by_username(request.data["user_name"])
    if not res:
        return Response(
            {"message": "Failed to fecth user info"}, status=status.HTTP_400_BAD_REQUEST
        )

    return Response(
        {"message": "Here is your info", "user": res}, status=status.HTTP_200_OK
    )


@api_view(["GET"])
def api(request):
    return Response({"message": "Welcome to the WorkflowAI service."})


@api_view(["GET"])
def nothing(request):
    return Response({"message": "Nothing to see here, go to `/v0.1`"})
