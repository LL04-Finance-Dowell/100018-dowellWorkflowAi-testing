import json
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


from app.helpers import validate_id
from education.helpers import (
    check_if_name_exists_collection,
    generate_unique_collection_name,
)

from education.datacube_connection import (
    datacube_collection_retrieval,
    get_data_from_collection,
    post_data_to_collection,
    add_collection_to_database,
    Template_database,
    save_to_template_metadata,
)

from app.constants import EDITOR_API

# Create your views here.
# Education views are created here
# Anywhere we see template_function_it is


class HomeView(APIView):
    def get(self, request):
        return Response({"Message": "Education is live"}, status.HTTP_200_OK)


class NewTemplate(APIView):

    def get(self, request):
        # collection_id = request.queryParams["collection_id"]
        api_key = request.query_params.get("api_key")
        db_name = request.query_params.get("db_name")
        res = datacube_collection_retrieval(api_key, db_name)
        return Response(res["data"])

    def post(self, request):
        data = ""
        page = ""
        folder = []
        approved = False
        workspace_id = request.data["workspace_id"]
        collection_name = "template_collection_0"
        # Rememember to change
        # db_name=f'{workspace_id}_"template_database_1"'
        db_name = "6390b313d77dc467630713f2_database0"
        api_key = request.data["api_key"]
        no_of_collections = 1
        collection_names = check_if_name_exists_collection(
            api_key, collection_name, db_name
        )
        collection_name = collection_names["name"]
        if collection_names["success"]:
            create_new_collection_for_template = add_collection_to_database(
                api_key=api_key,
                database=db_name,
                collections=collection_name,
                num_of_collections=no_of_collections,
            )
        if create_new_collection_for_template["success"] == False:
            try:
                collection_name = generate_unique_collection_name(collection_name)
                res = add_collection_to_database(
                    api_key=api_key,
                    database=db_name,
                    collections=collection_name,
                    num_of_collections=no_of_collections,
                )
            except Exception as e:
                return Response(
                    "Database does not exist", status.HTTP_400_BAD_REQUEST, e.message
                )

        if (
            create_new_collection_for_template["success"] == True
            or res["success"] == True
        ):
            if not validate_id(request.data["company_id"]):
                return Response("Invalid company details", status.HTTP_400_BAD_REQUEST)

            portfolio = ""
            if request.data["portfolio"]:
                portfolio = request.data["portfolio"]
            viewers = [{"member": request.data["created_by"], "portfolio": portfolio}]
            organization_id = request.data["company_id"]
            template_data = {
                "template_name": "Untitled Template",
                "content": data,
                "page": page,
                "folders": folder,
                "created_by": request.data["created_by"],
                "company_id": organization_id,
                "data_type": request.data["data_type"],
                "template_type": "draft",
                "auth_viewers": viewers,
                "message": "",
                "approved": approved,
                "collection_name": collection_name,
            }

            res = post_data_to_collection(
                api_key=api_key,
                collection=collection_name,
                database=db_name,
                operation="insert",
                data=template_data,
            )
            if res["success"]:
                print(res)
                collection_id = res["data"]["inserted_id"]
                res_metadata = save_to_template_metadata(
                    {
                        "template_name": "Untitled Template",
                        "created_by": request.data["created_by"],
                        "collection_id": collection_id,
                        "data_type": request.data["data_type"],
                        "company_id": organization_id,
                        "auth_viewers": viewers,
                        "template_state": "draft",
                        "approval": False,
                    }
                )
                if not res_metadata:
                    return Response(
                        "An error occured while trying to save document metadata",
                        status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )
                print(collection_name)
                payload = {
                    "product_name": "workflowai",
                    "details": {
                        "_id": res_metadata["collection_id"],
                        "field": "template_name",
                        "action": "template",
                        "metadata_id": res_metadata["collection_id"],
                        "cluster": "Documents",
                        "database": db_name,
                        "collection": collection_name,
                        "document": "templatereports",
                        "team_member_ID": "22689044433",
                        "function_ID": "ABCDE",
                        "command": "update",
                        "name": "Untitled Template",
                        "flag": "editing",
                        "update_field": {
                            "template_name": "Untitled Template",
                            "content": "",
                            "page": "",
                        },
                    },
                }
                editor_link = requests.post(
                    EDITOR_API,
                    data=json.dumps(payload),
                )
                return Response(
                    {
                        "editor_link": editor_link.json(),
                        "_id": res["data"]["inserted_id"],
                    },
                    status.HTTP_201_CREATED,
                )
        else:
            return Response(
                {"Message": "Error creating template "}, status.HTTP_404_NOT_FOUND
            )


# class Template(APIView):


"""class NewMetadata(APIView):
    def post(self, request):
        item_id = request.data["item_id"]
        item_type = request.data["item_type"]
        if item_type == "template":
            template = "Database_function"
            if not template:
                return Response("Template not found", status.HTTP_404_NOT_FOUND)
            options = {
                "template_name": template.get("template_name"),
                "created_by": template.get("created_by"),
                "collection_id": template.get("_id"),
                "data_type": template.get("data_type"),
                "company_id": template.get("company_id"),
                "auth_viewers": template.get("auth_viewers", []),
                "template_state": "draft",
            }
            res_metadata = json.loads(save_to_template_metadata_collection(options))
            if res_metadata["isSuccess"]:
                return Response(
                    {"template": res_metadata},
                    status=status.HTTP_201_CREATED,
                )
"""
"""class NewMetadata(APIView):
    def post(self, request):
        item_id = request.data["item_id"]
        item_type = request.data["item_type"]
        if item_type == "template":
            template = single_query_template_collection({"_id": item_id})
            if not template:
                return Response("Template not found", status.HTTP_404_NOT_FOUND)
            options = {
                "template_name": template.get("template_name"),
                "created_by": template.get("created_by"),
                "collection_id": template.get("_id"),
                "data_type": template.get("data_type"),
                "company_id": template.get("company_id"),
                "auth_viewers": template.get("auth_viewers", []),
                "template_state": "draft",
            }
            res_metadata = json.loads(save_to_template_metadata_collection(options))
            if res_metadata["isSuccess"]:
                return Response(
                    {"template": res_metadata},
                    status=status.HTTP_201_CREATED,
                )
"""
