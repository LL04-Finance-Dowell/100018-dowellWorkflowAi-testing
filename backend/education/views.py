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
    save_to_metadata,
    # save_to_template_metadata,
    save_to_document_metadata,
    bulk_query_clones_collection,
    single_query_clones_collection,
    bulk_query_document_collection,
    single_query_document_collection
)

from django.core.cache import cache
from app.constants import EDITOR_API
from app.helpers import access_editor

# Create your views here.
# Education views are created here
# Anywhere we see template_function_it is


class HomeView(APIView):
    def get(self, request):
        return Response({"Message": "Education is live"}, status.HTTP_200_OK)


class NewTemplate(APIView):

    def get(self, request):
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
        # Create a metadata_collection too
        # Rememember to change
        # db_name=f'{workspace_id}_"template_database_1"'
        db_name = "6390b313d77dc467630713f2_database0"
        metadata_db = request.data["metadata_db"]
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
        ##   create_new_collection_for_template_metadata=
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
                res_metadata = save_to_metadata(
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


class Workflow(APIView):
    def get(self, request):
        pass

    def post(self, request):
        pass


class NewDocument(APIView):

    def post(self, request):
        api_key = request.query_params.get("api_key")
        db_name = request.query_params.get("db_name")
        content = datacube_collection_retrieval(api_key, db_name)["content"]
        page = datacube_collection_retrieval(api_key, db_name)["page"]
        organization_id = request.data["company_id"]
        portfolio = ""
        if request.data["portfolio"]:
            portfolio = request.data["portfolio"]
        viewers = [{"member": request.data["created_by"], "portfolio": portfolio}]

        if not content or page:
            return Response("Database Template not found", status.HTTP_404_NOT_FOUND)

        res = json.loads(
            post_data_to_collection(
                {
                    "document_name": "Untitled Document",
                    "content": content,
                    "created_by": request.data["created_by"],
                    "company_id": organization_id,
                    "page": page,
                    "data_type": request.data["data_type"],
                    "document_state": "draft",
                    "auth_viewers": viewers,
                    "document_type": "original",
                    "parent_id": None,
                    "process_id": "",
                    "folders": [],
                    "template": db_name,
                    "message": "",
                }
            )
        )

        if res["isSuccess"]:
            res_metadata = json.loads(
                save_to_document_metadata(
                    {
                        "document_name": "Untitled Document",
                        "collection_id": res["inserted_id"],
                        "created_by": request.data["created_by"],
                        "company_id": organization_id,
                        "data_type": request.data["data_type"],
                        "document_state": "draft",
                        "auth_viewers": viewers,
                    }
                )
            )
            if not res_metadata["isSuccess"]:
                return Response(
                    "An error occured while trying to save document metadata",
                    status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        
        return Response("Document Created", status=status.HTTP_201_CREATED)


class Document(APIView):
    def get(self, request, company_id):
        """List of Created Documents."""
        data_type = request.query_params.get("data_type")

        if not validate_id(company_id) or not data_type:
            return Response("Invalid Request!", status=status.HTTP_400_BAD_REQUEST)

        document_type = request.query_params.get("document_type")
        document_state = request.query_params.get("document_state")
        member = request.query_params.get("member")
        portfolio = request.query_params.get("portfolio")
        if member and portfolio:
            auth_viewers = [{"member": member, "portfolio": portfolio}]
           
            document_list = bulk_query_clones_collection(
                {
                    "company_id": company_id,
                    "data_type": data_type,
                    "document_state": document_state,
                    "auth_viewers": auth_viewers,
                }
            )
            return Response(
                {"documents": document_list},
                status=status.HTTP_200_OK,
            )
        else:
            if document_type == "document":
                documents = bulk_query_document_collection(
                    {
                        "company_id": company_id,
                        "data_type": data_type,
                        "document_type": document_type,
                        "document_state": document_state,
                    }
                )
                return Response({"documents": documents}, status=status.HTTP_200_OK)
            if document_type == "clone":
                cache_key = f"clones_{company_id}"
                clones_list = cache.get(cache_key)
                if clones_list is None:
                    clones_list = bulk_query_clones_collection(
                        {
                            "company_id": company_id,
                            "data_type": data_type,
                            "document_state": document_state,
                        }
                    )
                    cache.set(cache_key, clones_list, timeout=60)
                return Response(
                    {"clones": clones_list},
                    status.HTTP_200_OK,
                )


class DocumentLink(APIView):
    def get(self, request, document_id):
        """editor link for a document"""
        document_type = request.query_params.get("document_type")
        if not validate_id(document_id) or not document_type:
            return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
        if document_type == "document":
            document = single_query_document_collection({"_id": document_id})
        elif document_type == "clone":
            document = single_query_clones_collection({"_id": document_id})
        if document:
            username = request.query_params.get("username", "")
            portfolio = request.query_params.get("portfolio", "")
            email = request.query_params.get("email", "")

            editor_link = access_editor(
                document_id,
                document_type,
                username=username,
                portfolio=portfolio,
                email=email,
            )
            if not editor_link:
                return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response(editor_link, status.HTTP_200_OK)
        return Response("Document could not be accessed!", status.HTTP_404_NOT_FOUND)


class DocumentDetail(APIView):
    def get(self, request, item_id):
        """Retrieves the document object for a specific document"""
        document_type = request.query_params.get("document_type")
        if not validate_id(item_id) or not document_type:
            return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
        if document_type == "document":
            document = single_query_document_collection({"_id": item_id})
            return Response(document, status.HTTP_200_OK)
        if document_type == "clone":
            document = single_query_clones_collection({"_id": item_id})
            return Response(document, status.HTTP_200_OK)
        return Response("Document could not be accessed!", status.HTTP_404_NOT_FOUND)
