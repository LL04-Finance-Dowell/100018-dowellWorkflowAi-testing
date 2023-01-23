from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.
@api_view(["GET"])
def nothing(request):
    return Response({"message": "Nothing to see here, go to `/v0.1`"})
