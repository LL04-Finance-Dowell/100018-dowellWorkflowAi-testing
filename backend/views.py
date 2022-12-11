from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


@api_view(["GET"])
def api(request):
    return Response({"message": "Welcome to the WorkflowAI service."})


@api_view(["GET"])
def nothing(request):
    return Response({"message": "Nothing to see here, go to `/v0.1`"})
