from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from database.mongo_db_connection import (get_document_list,
                                            get_wf_list,
                                            get_template_list,
                                            get_process_list)


@api_view(["POST"])
def count_objects(request):
    if request.method == "POST":
        data = ""
        form = request.data 
        document=len(get_document_list(form['company_id']))
        template=len(get_template_list(form['company_id']))
        workflow=len(get_wf_list(form['company_id']))
        process =len(get_process_list(form['company_id']))

        return Response(
            {"document_count":document,"template_count":template,
            "process_count":process,"workflow_count":workflow}, status=status.HTTP_200_OK
        )