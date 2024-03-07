import json
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


from app.helpers import validate_id
from app import processing
from app.mongo_db_connection import single_query_process_collection, update_process
from education.constants import PROCESS_DB_0
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
    post_to_data_service,
    save_to_document_metadata,
    save_to_process_collection,
    update_process_collection
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
                save_to_metadata(
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
    
    
class CollectionData(APIView):
    def post(self, request):
        api_key = request.data["api_key"]
        database = request.data["db_name"]
        collection = request.data["coll_name"]
        filters = request.data["filters"]
        limit = request.data.get("limit")
        offset = request.data.get("offset")
        
        res = get_data_from_collection(api_key,database,
                                       collection, filters,
                                       limit, offset)
        
        return Response(res, status.HTTP_200_OK)


class AddToCollection(APIView):
    def post(self, request):
        api_key = request.data["api_key"]
        database = request.data["db_name"]
        collection = request.data["coll_name"]
        filters = request.data["filters"]
        limit = request.data.get("limit")
        offset = request.data.get("offset")
        
        res = get_data_from_collection(api_key,database,
                                       collection, filters,
                                       limit, offset)
        
        return Response(res, status.HTTP_200_OK)


class ItemProcessing(APIView):
    def post(self, request, *args, **kwargs):
        """processing is determined by action picked by user."""
        payload_dict = kwargs.get("payload")
        if payload_dict:
            request_data = payload_dict
        else:
            request_data = request.data

        if not request_data:
            return Response("You are missing something!", status.HTTP_400_BAD_REQUEST)

        collection = check_if_name_exists_collection(api_key, "process_collection", PROCESS_DB_0)
        collection_name = collection["name"]
        if collection["success"] and collection["status"] == "New":
            new_process_collection = add_collection_to_database(
                api_key=api_key,
                database=PROCESS_DB_0,
                collections=collection_name,
                num_of_collections=1,
            )
        if not collection["name"] or new_process_collection["success"] == False:
            return Response("Could not detect Process collection", status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        api_key = request_data["api_key"]
        organization_id = request_data["company_id"]
        process = processing.Process(
            request_data["workflows"],
            request_data["created_by"],
            request_data["creator_portfolio"],
            organization_id,
            request_data["process_type"],
            request_data["org_name"],
            request_data["workflows_ids"],
            request_data["parent_id"],
            request_data["data_type"],
            request_data["process_title"],
            request.data.get("email", None),
        )
        
        saved_process = save_to_process_collection(api_key, PROCESS_DB_0, collection_name, process)
        print(saved_process)
        
        action = request_data["action"]
        data = None
        if action == "save_workflow_to_document_and_save_to_drafts":
            process.normal_process(action)
            return Response("Process Saved in drafts.", status.HTTP_201_CREATED)
        if action == "start_document_processing_content_wise":
            if request_data.get("process_id") is not None:
                process = single_query_process_collection(
                    {"_id": request_data["process_id"]}
                )
            else:
                data = process.normal_process(action)
        if action == "start_document_processing_wf_steps_wise":
            if request_data.get("process_id") is not None:
                process = single_query_process_collection(
                    {"_id": request_data["process_id"]}
                )
            else:
                data = process.normal_process(action)  # type: ignore
        if action == "start_document_processing_wf_wise":
            if request_data.get("process_id") is not None:
                process = single_query_process_collection(
                    {"_id": request_data["process_id"]}
                )
            else:
                data = process.normal_process(action)  # type: ignore
        if action == "test_document_processing_content_wise":
            if request_data.get("process_id") is not None:
                process = single_query_process_collection(
                    {"_id": request_data["process_id"]}
                )
            else:
                data = process.test_process(action)  # type: ignore
        if action == "test_document_processing_wf_steps_wise":
            if request_data.get("process_id") is not None:
                process = single_query_process_collection(
                    {"_id": request_data["process_id"]}
                )
            else:
                data = process.test_process(action)  # type: ignore
        if action == "test_document_processing_wf_wise":
            if request_data.get("process_id") is not None:
                process = single_query_process_collection(
                    {"_id": request_data["process_id"]}
                )
            else:
                data = process.test_process(action)  # type: ignore
        if action == "close_processing_and_mark_as_completed":
            process = single_query_process_collection(
                {"_id": request_data["process_id"]}
            )
            if process["processing_state"] == "completed":
                return Response(
                    "This Workflow process is already complete", status.HTTP_200_OK
                )
            res = json.loads(
                update_process(
                    process_id=process["process_id"],
                    steps=process["processing_steps"],
                    state="completed",
                )
            )
            res_saved = json.loads(
                update_process_collection(
                    api_key=api_key,
                    database=PROCESS_DB_0,
                    collection=collection_name,
                    data={
                        "_id": saved_process["_id"],
                        "processing_steps": saved_process["processing_steps"],
                        "processing_state": "completed",
                    }
                )
            )
            if res["isSuccess"]:
                return Response(
                    "Process closed and marked as complete!", status.HTTP_200_OK
                )
            return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)
        if action == "cancel_process_before_completion":
            process = single_query_process_collection(
                {"_id": request_data["process_id"]}
            )
            if process["processing_state"] == "cancelled":
                return Response(
                    "This Workflow process is Cancelled!", status.HTTP_200_OK
                )
            res = json.loads(
                update_process(
                    process_id=process["process_id"],
                    steps=process["processing_steps"],
                    state="cancelled",
                )
            )
            res_saved = json.loads(
                update_process_collection(
                    api_key=api_key,
                    database=PROCESS_DB_0,
                    collection=collection_name,
                    data={
                        "_id": saved_process["_id"],
                        "processing_steps": saved_process["processing_steps"],
                        "processing_state": "cancelled",
                    }
                )
            )

            if res["isSuccess"]:
                return Response("Process has been cancelled!", status.HTTP_200_OK)
            return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)
        if action == "pause_processing_after_completing_ongoing_step":
            return Response(
                "This Option is currently in development",
                status.HTTP_501_NOT_IMPLEMENTED,
            )
        if data:
            verification_links = processing.HandleProcess(data).start()
            return Response(verification_links, status.HTTP_200_OK)
