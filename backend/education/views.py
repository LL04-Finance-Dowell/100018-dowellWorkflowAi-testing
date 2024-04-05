import json
import requests
import ast
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from education.serializers import CreateCollectionSerializer
import threading
from app.helpers import validate_id
from app import processing
from app.mongo_db_connection import single_query_process_collection, update_process
from app.views_v2 import FinalizeOrReject
from education.constants import PROCESS_DB_0

from education.helpers import (
    check_if_name_exists_collection,
    generate_unique_collection_name,
    access_editor,
    CustomResponse,
)

from education.serializers import *

from education.helpers import *
from education.datacube_connection import (
    datacube_collection_retrieval,
    get_data_from_collection,
    get_process_from_collection,
    post_data_to_collection,
    add_collection_to_database,
    Template_database,
    save_to_metadata,
    post_to_data_service,
    save_to_process_collection,
    update_process_collection,
    # save_to_template_metadata,
    get_clones_from_collection,
    get_clone_from_collection,
    get_documents_from_collection,
    get_document_from_collection,
    get_template_from_collection,
    save_to_workflow_collection,
    get_workflow_from_collection,
    get_folders_from_collection,
    get_folder_from_collection,
    save_to_folder_collection,
)

from django.core.cache import cache
from app.constants import EDITOR_API
from app.mongo_db_connection import process_folders_to_item

# Create your views here.
# Education views are created here
# Anywhere we see template_function_it is


class HomeView(APIView):
    def get(self, request):
        return Response({"Message": "Education is live"}, status.HTTP_200_OK)


class DatabaseServices(APIView):

    def post(self, request):
        type_request = request.GET.get("type")

        if type_request == "create_collection":
            return self.create_collection(request)
        else:
            return self.handle_error(request)

    def get(self, request):
        type_request = request.GET.get("type")

        if type_request == "check_metadata_database_status":
            return self.check_metadata_database_status(request)
        elif type_request == "check_data_database_status":
            return self.check_data_database_status(request)
        else:
            return self.handle_error(request)

    def create_collection(self, request):
        """
        Create a new collection from the given database

        This method helps to create a new collection in the specified database.

        :param database_type: The type of the database, which can be META DATA or DATA.
        :param workspace_id: The ID of the workspace where the collection will be created.
        :param collection_name: The name of the collection to be created.
        """
        database_type = request.data.get("database_type")
        workspace_id = request.GET.get("workspace_id")

        try:
            api_key = authorization_check(request.headers.get("Authorization"))

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        serializer = CreateCollectionSerializer(data=request.data)

        if not serializer.is_valid():
            return CustomResponse(
                False,
                "Posting wrong data to API",
                serializer.errors,
                status.HTTP_400_BAD_REQUEST,
            )
        all_responses = []

        for types in database_type:
            if types == "META_DATA":
                database = f"{workspace_id}_DB_0"
                collection_names = [
                    f"{workspace_id}_templates_metadata_collection_0",
                    f"{workspace_id}_documents_metadata_collection_0",
                    f"{workspace_id}_clones_metadata_collection_0",
                ]
            elif types == "DATA":
                database = f"{workspace_id}_DB_0"
                collection_names = [
                    f"{workspace_id}_template_collection_0",
                    f"{workspace_id}_document_collection_0",
                    f"{workspace_id}_process_collection",
                    f"{workspace_id}_clone_collection_0",
                    f"{workspace_id}_workflow_collection_0",
                    f"{workspace_id}_folder_collection_0",
                ]
            for collection_name in collection_names:
                response = add_collection_to_database(
                    api_key, database, collection_name
                )

                all_responses.append(response)
        #print(all_responses)
        for responses in all_responses:
            if not responses["success"]:
                return CustomResponse(
                    False,
                    "Failed to create collection, kindly contact the administrator.",
                    None,
                    status.HTTP_400_BAD_REQUEST,
                )

        return CustomResponse(
            True, "Collection has been created successfully", None, status.HTTP_200_OK
        )

    def check_metadata_database_status(self, request):
        """
        Check the existence of the metadata database.

        This method checks if the specified databases (meta data and data) are available for a given workspace.

        :param request: The HTTP request object.
        :param api_key: The API key for authorization.
        :param workspace_id: The ID of the workspace.
        """
        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        workspace_id = request.GET.get("workspace_id")
        meta_data_database = f"{workspace_id}_DB_0"
        # #print(meta_data_database)

        response_meta_data = datacube_collection_retrieval(api_key, meta_data_database)
        # #print(response_meta_data)

        if not response_meta_data["success"]:
            return CustomResponse(
                False,
                "Meta-Data is not yet available, kindly contact the administrator.",
                None,
                status.HTTP_501_NOT_IMPLEMENTED,
            )

        list_of_meta_data_collection = [
            f"{workspace_id}_templates_metadata_collection_0",
            f"{workspace_id}_documents_metadata_collection_0",
            f"{workspace_id}_clones_metadata_collection_0",
        ]

        missing_collections = []
        for collection in list_of_meta_data_collection:
            if collection not in response_meta_data["data"][0]:
                missing_collections.append(collection)

        if missing_collections:
            missing_collections_str = ", ".join(missing_collections)
            self.create_collection(request)
            return CustomResponse(
                False,
                f"The following collections are missing: {missing_collections_str}",
                missing_collections,
                status.HTTP_404_NOT_FOUND,
            )

        return CustomResponse(
            True, "Meta-Data are available to be used", None, status.HTTP_200_OK
        )

    def check_data_database_status(self, request):
        """
        Check the existence of the data database.

        This method checks if the specified databases (meta data and data) are available for a given workspace.

        :param request: The HTTP request object.
        :param api_key: The API key for authorization.
        :param workspace_id: The ID of the workspace.
        """
        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        workspace_id = request.GET.get("workspace_id")

        datas = [
            f"{workspace_id}_process_collection",
            f"{workspace_id}_document_collection_0",
            f"{workspace_id}_workflow_collection_0",
            f"{workspace_id}_template_collection_0",
            f"{workspace_id}_clone_collection_0",
            f"{workspace_id}_folder_collection_0",
        ]

        data_database = f"{workspace_id}_DB_0"
        ready_collection = []

        response_data = datacube_collection_retrieval(api_key, data_database)
        datas=response_data['data'][0]
        #print(datas)
        
        if response_data["success"]:
            ready_collection.append(response_data["data"][0])

            if not response_data["success"]:
                return CustomResponse(
                    False,
                    "Database is not yet available, kindly contact the administrator",
                    None,
                    status.HTTP_501_NOT_IMPLEMENTED,
                )

        missing_collections = []

        for collection in datas:
            if collection not in response_data["data"][0]:
                missing_collections.append(collection)

        if missing_collections:
            missing_collections_str = ", ".join(missing_collections)
            return CustomResponse(
                False,
                f"The following collections are missing: {missing_collections_str}",
                missing_collections,
                status.HTTP_404_NOT_FOUND,
            )

        return CustomResponse(
            True, "Databases are available to be used", None, status.HTTP_200_OK
        )

    def handle_error(self, request):
        """
        Handle invalid request type.
        This method is called when the requested type is not recognized or supported.

        :param request: The HTTP request object.
        :type request: HttpRequest
        :return: Response indicating failure due to an invalid request type.
        :rtype: Response
        """
        return Response(
            {"success": False, "message": "Invalid request type"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class NewTemplate(APIView):

    def get(self, request):

        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)
        workspace_id = request.GET.get("workspace_id")
        template_id = request.GET.get("template_id")
        db_name = f"{workspace_id}_DB_0"
        collection_name = f"{workspace_id}_template_collection_0"
        filters = {"_id":template_id}
        res = get_template_from_collection(api_key, db_name, collection_name, filters)
        if res["success"]:
            return Response(res)
        else:
            return CustomResponse(
                False, res["message"], None, status.HTTP_400_BAD_REQUEST
            )

    def post(self, request):
        type_request = request.GET.get("type")
        workspace_id = request.data.get("workspace_id")

        if type_request == "approve":
            return self.approve(request)

        data = ""
        page = ""
        folder = []
        approved = False
        collection_name = f"{workspace_id}_template_collection_0"
        db_name = f"{workspace_id}_DB_0"

        metadata_db = f"{workspace_id}_DB_0"
        metadata_collection = f"{workspace_id}_template_metadata_collection_0"

        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

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
                "approval": approved,
                "collection_name": collection_name,
                "DB_name": db_name,
            }

            res = post_data_to_collection(
                api_key=api_key,
                collection=collection_name,
                database=db_name,
                operation="insert",
                data=template_data,
            )
            if res["success"]:
                collection_id = res["data"]["inserted_id"]
                res_metadata = save_to_metadata(
                    api_key,
                    metadata_collection,
                    metadata_db,
                    {
                        "template_name": "Untitled Template",
                        "created_by": request.data["created_by"],
                        "collection_id": collection_id,
                        "data_type": request.data["data_type"],
                        "company_id": organization_id,
                        "auth_viewers": viewers,
                        "template_state": "draft",
                        "approval": False,
                    },
                )
                if not res_metadata["success"]:
                    try:
                        create_new_collection_for_template = add_collection_to_database(
                            api_key=api_key,
                            database=db_name,
                            collections=metadata_collection,
                        )
                        return CustomResponse(
                            True,
                            "collection created successfully",
                            None,
                            status.HTTP_201_CREATED,
                        )
                    except:

                        return CustomResponse(
                            False,
                            "An error occured while trying to save document metadata",
                            res_metadata["message"],
                            status.HTTP_500_INTERNAL_SERVER_ERROR,
                        )
                payload = {
                    "product_name": "workflowai",
                    "details": {
                        "_id": collection_id,
                        "field": "template_name",
                        "action": "template",
                        "metadata_id": res_metadata["data"]["inserted_id"],
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

    def approve(self, request):
        """Post data for template approval
        :  Templates can only be used after approval True
        :  Collection_id is ID for template collection
        :  metadata_id is the ID for the metadata
        """

        form = request.data
        if not form:
            return Response("Data is needed", status.HTTP_400_BAD_REQUEST)
        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)
        workspace_id = request.GET.get("workspace_id")

        database = f"{workspace_id}_DB_0"
        collection = f"{workspace_id}_template_collection_0"
        meta_data_collection = f"{workspace_id}_template_metadata_collection_0"
        update_data = {"approval": True}
        collection_id = form["collection_id"]
        metadata_id = form["metadata_id"]

        query = {"_id": collection_id}
        query_metadata = {"_id": metadata_id}

        approval_update = post_data_to_collection(
            api_key, database, collection, update_data, "update", query
        )
        metadata_approval_update = post_data_to_collection(
            api_key,
            database,
            meta_data_collection,
            update_data,
            "update",
            query_metadata,
        )

        if approval_update and metadata_approval_update:
            return CustomResponse(True, "Template approved", None, status.HTTP_200_OK)
        else:
            return CustomResponse(
                False, "Template approval failed", None, status.HTTP_400_BAD_REQUEST
            )

class ApprovedTemplates(APIView):
    def get(self, request, *args, **kwargs):
        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)
        
        workspace_id = request.GET.get("workspace_id")
        database = f"{workspace_id}_DB_0"
        collection = f"{workspace_id}_template_collection_0"
        meta_data_collection = f"{workspace_id}_template_metadata_collection_0"
        filters = {"approval": True}
        res = get_template_from_collection(api_key,database, meta_data_collection, filters)
        if res["success"]:
            return Response(res)
        else:
            return CustomResponse(
                False, res["message"], None, status.HTTP_400_BAD_REQUEST
            )


class Workflow(APIView):
    def get(self, request):
        """Get Workflows Created in a collection"""
        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        workspace_id = request.GET.get("workspace_id")
        db_name = f"{workspace_id}_DB_0"
        collection_name = f"{workspace_id}_workflow_collection_0"

        res = get_workflow_from_collection(
            api_key,
            db_name,
            collection_name,
        )

        if res["success"]:
            return CustomResponse(
                True, "workflows found!", res["data"], status.HTTP_200_OK
            )

        else:
            CustomResponse(
                False,
                "Couldn't fetch workflow collection",
                None,
                status.HTTP_400_BAD_REQUEST,
            )

    def post(self, request):
        """Creates a new workflow"""
        form = request.data
        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        if not form:
            return Response("Workflow Data required", status.HTTP_400_BAD_REQUEST)

        workspace_id = request.GET.get("workspace_id")
        db_name = f"{workspace_id}_DB_0"

        organization_id = form["company_id"]
        data = {
            "workflow_title": form["wf_title"],
            "steps": form["steps"],
        }
        collection_name = f"{workspace_id}_workflow_collection_0"
        """ workflow_unique_name = generate_unique_collection_name(
            collection_name, "workflow_collection"""

        # if workflow_unique_name["success"]:

        res = save_to_workflow_collection(
            api_key,
            collection_name,
            db_name,
            {
                "workflows": data,
                "company_id": organization_id,
                "created_by": form["created_by"],
                "portfolio": form["portfolio"],
                "data_type": form["data_type"],
                "workflow_type": "original",
            },
        )
        if res["success"]:
            return Response(
                {
                    "_id": res["data"]["inserted_id"],
                    "workflows": data,
                    "created_by": form["created_by"],
                    "company_id": form["company_id"],
                    "workflow_type": "original",
                    "data_type": form["data_type"],
                },
                status.HTTP_201_CREATED,
            )
        else:
            return CustomResponse(
                False,
                "Workflow Not created",
                None,
                status.HTTP_400_BAD_REQUEST,
            )

    def put(self, request):
        form = request.data
        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        if not form:
            return CustomResponse(
                False, "Workflow Data is required", None, status.HTTP_400_BAD_REQUEST
            )
        workspace_id = request.GET.get("workspace_id")
        workflow_id = form["workflow_id"]
        query = {"_id": workflow_id}
        database = f"{workspace_id}_DB_0"
        collection = f"{workspace_id}_workflow_collection_0"
        update_data = form["workflow_update"]
        update_workflow = post_data_to_collection(
            api_key, database, collection, update_data, "update", query
        )
        #print(update_workflow)
        if update_workflow:
            return CustomResponse(
                True, "Workflow updated successfully", None, status.HTTP_201_CREATED
            )
        else:
            return CustomResponse(
                False, update_workflow["message"], None, status.HTTP_400_BAD_REQUEST
            )


class CollectionData(APIView):
    def post(self, request):
        api_key = request.data["api_key"]
        database = request.data["db_name"]
        collection = request.data["coll_name"]
        filters = request.data["filters"]
        limit = request.data.get("limit")
        offset = request.data.get("offset")

        res = get_data_from_collection(
            api_key, database, collection, filters, limit, offset
        )

        return Response(res, status.HTTP_200_OK)


class AddToCollection(APIView):
    def post(self, request):
        api_key = request.data["api_key"]
        database = request.data["db_name"]
        collection = request.data["coll_name"]
        filters = request.data["filters"]
        limit = request.data.get("limit")
        offset = request.data.get("offset")

        res = get_data_from_collection(
            api_key, database, collection, filters, limit, offset
        )

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
        if not request_data.get("api_key"):
            return Response("You are missing an API key!", status.HTTP_400_BAD_REQUEST)

        api_key = request_data["api_key"]

        collection = check_if_name_exists_collection(
            api_key, "process_collection", PROCESS_DB_0
        )
        # print("collection:::", collection)
        collection_name = collection["name"]
        return Response({f"collection: {collection_name}", f"data : {collection}"})

        if collection["success"] and collection["status"] == "New":
            new_process_collection = add_collection_to_database(
                api_key=api_key,
                database=PROCESS_DB_0,
                collections=collection_name,
                num_of_collections=1,
            )
            if new_process_collection["success"] == False:
                return Response(
                    "Unable to create new Process collection",
                    status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        if not collection["name"]:
            return Response(
                "Could not detect Process collection",
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

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
                saved_data = process.normal_process(action)  # type: ignore
                data = {"process": saved_data}
                saved_process = save_to_process_collection(
                    api_key, PROCESS_DB_0, collection_name, data
                )
        if action == "start_document_processing_wf_steps_wise":
            if request_data.get("process_id") is not None:
                process = single_query_process_collection(
                    {"_id": request_data["process_id"]}
                )
            else:
                saved_data = process.normal_process(action)  # type: ignore
                data = {"process": saved_data}
                saved_process = save_to_process_collection(
                    api_key, PROCESS_DB_0, collection_name, data
                )
        if action == "start_document_processing_wf_wise":
            if request_data.get("process_id") is not None:
                process = single_query_process_collection(
                    {"_id": request_data["process_id"]}
                )
            else:
                saved_data = process.normal_process(action)  # type: ignore
                data = {"process": saved_data}
                saved_process = save_to_process_collection(
                    api_key, PROCESS_DB_0, collection_name, data
                )
        if action == "test_document_processing_content_wise":
            if request_data.get("process_id") is not None:
                process = single_query_process_collection(
                    {"_id": request_data["process_id"]}
                )
            else:
                saved_data = process.normal_process(action)  # type: ignore
                data = {"process": saved_data}
                saved_process = save_to_process_collection(
                    api_key, PROCESS_DB_0, collection_name, data
                )
        if action == "test_document_processing_wf_steps_wise":
            if request_data.get("process_id") is not None:
                process = single_query_process_collection(
                    {"_id": request_data["process_id"]}
                )
            else:
                saved_data = process.normal_process(action)  # type: ignore
                data = {"process": saved_data}
                saved_process = save_to_process_collection(
                    api_key, PROCESS_DB_0, collection_name, data
                )
        if action == "test_document_processing_wf_wise":
            if request_data.get("process_id") is not None:
                process = single_query_process_collection(
                    {"_id": request_data["process_id"]}
                )
            else:
                saved_data = process.normal_process(action)  # type: ignore
                data = {"process": saved_data}
                saved_process = save_to_process_collection(
                    api_key, PROCESS_DB_0, collection_name, data
                )
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
                    process_id=process["process_id"],
                    api_key=api_key,
                    database=PROCESS_DB_0,
                    collection=collection_name,
                    data={
                        "_id": saved_process["_id"],
                        "processing_steps": saved_process["processing_steps"],
                        "processing_state": "completed",
                    },
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
                    process_id=process["process_id"],
                    api_key=api_key,
                    database=PROCESS_DB_0,
                    collection=collection_name,
                    data={
                        "_id": saved_process["_id"],
                        "processing_steps": saved_process["processing_steps"],
                        "processing_state": "cancelled",
                    },
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
            existing_proc = get_process_from_collection(
                api_key=api_key,
                database=PROCESS_DB_0,
                collection=collection_name,
                filters={"_id": saved_process["data"].get("inserted_id")},
            )
            verification_links = processing.HandleProcess(data["process"]).start()
            updated_with_links = single_query_process_collection(
                {"_id": data["process"].get("_id")}
            )
            update_process_collection(
                process_id=saved_process["data"].get("inserted_id"),
                api_key=api_key,
                database=PROCESS_DB_0,
                collection=collection_name,
                data={
                    "process": updated_with_links,
                },
            )
            return Response(
                {
                    "inserted_id": saved_process["data"].get("inserted_id"),
                    "process_id": data["process"].get("_id"),
                    "updated-w-links": updated_with_links,
                    "links": verification_links,
                },
                status.HTTP_200_OK,
            )

    def get(self, request):
        """List of Created Processes."""

        api_key = request.query_params.get("api_key")
        database = request.query_params.get("db_name")
        collection = request.query_params.get("coll_name")

        coll_id = request.query_params.get("coll_id")
        if coll_id:
            if not validate_id(coll_id):
                return Response("Invalid Request!", status=status.HTTP_400_BAD_REQUEST)
            query = {"_id": coll_id}
            # #print("filter: ", query)
            data = get_data_from_collection(
                api_key, database, collection, filters=query, limit=1
            )
        else:
            data = get_data_from_collection(api_key, database, collection, limit=20)
        return Response(data, status.HTTP_200_OK)


class NewDocument(APIView):

    def post(self, request):
        workspace_id = request.data.get("workspace_id")
        organization_id = request.data.get("company_id")
        created_by = request.data.get("created_by")
        data_type = request.data.get("data_type")
        template_id = request.data.get("template_id")


        db_name_0 = f"{workspace_id}_DB_0"
        db_name_1 = f"{workspace_id}_TEMPLATE_DB_1"
        collection_name = f"{workspace_id}_template_collection_0"
        metadata_db = f"{workspace_id}_DB_0"
        metadata_collection = f"{workspace_id}_document_metadata_collection_0"

        try:
            api_key = authorization_check(request.headers.get("Authorization"))

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        portfolio = ""
        if request.data["portfolio"]:
            portfolio = request.data["portfolio"]
        viewers = [{"member": created_by, "portfolio": portfolio}]

        if not workspace_id or not created_by or not data_type:
            return CustomResponse(
                False,
                "workspace_id, created_by and data_type are required",
                None,
                status.HTTP_400_BAD_REQUEST,
            )

        collection = check_if_name_exists_collection(
            api_key, collection_name, db_name_0
        )


        if not collection["success"]:
            return CustomResponse(
                False, "No collection with found", None, status.HTTP_404_NOT_FOUND
            )

        collection_name = collection["name"]

        template = get_template_from_collection(
            api_key, db_name_0, collection_name, {"_id": template_id}
        )

        if not template["success"]:
            return CustomResponse(
                False, "No template found", None, status.HTTP_404_NOT_FOUND
            )
      
        isapproved = template["data"][0]["approval"]

        if not isapproved:
            return CustomResponse(
                False, "Template is not approved", None, status.HTTP_403_FORBIDDEN
            )

        document_data = {
            "document_name": "Untitled Document",
            "content": template["data"][0]["content"],
            "created_by": request.data["created_by"],
            "company_id": organization_id,
            "page": template["data"][0]["page"],
            "data_type": request.data["data_type"],
            "document_state": "draft",
            "auth_viewers": viewers,
            "document_type": "original",
            "collection_name": collection_name,
            "process_id": "",
            "folders": [],
            "template": db_name_0,
        }

        db_0_res = post_data_to_collection(
            api_key=api_key,
            collection=collection_name,
            database=db_name_0,
            operation="insert",
            data=document_data,
        )

        if not db_0_res["success"]:
            return CustomResponse(
                False,
                "An error occured while trying to save document",
                None,
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        res = post_data_to_collection(
            api_key=api_key,
            collection=collection_name,
            database=db_name_1,
            operation="insert",
            data=document_data,
        )

        if res["success"]:
            collection_id = res["data"]["inserted_id"]
            metadata = save_to_metadata(
                api_key,
                metadata_collection,
                metadata_db,
                {
                    "document_name": "Untitled Document",
                    "created_by": request.data["created_by"],
                    "collection_id": collection_id,
                    "data_type": request.data["data_type"],
                    "company_id": organization_id,
                    "auth_viewers": viewers,
                    "document_state": "draft",
                },
            )

            res_metadata = save_to_metadata(
                api_key=api_key,
                collection_id=collection_name,
                db_name=db_name_1,
                data=metadata,
            )

            if not res_metadata["success"]:
                return CustomResponse(
                    False,
                    "An error occured while trying to save document metadata",
                    None,
                    status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        return CustomResponse(
            True,
            {"_id": res["data"]["inserted_id"], "doc_status": "document created"},
            None,
            status.HTTP_201_CREATED,
        )


class Document(APIView):
    def get(self, request, company_id):
        """List of Created Documents."""
        workspace_id = request.query_params.get("workspace_id")
        data_type = request.query_params.get("data_type")
        document_type = request.query_params.get("document_type")
        document_state = request.query_params.get("document_state")
        member = request.query_params.get("member")
        portfolio = request.query_params.get("portfolio")

        db_name = f"{workspace_id}_DB_0"
        collection_name = f"{workspace_id}_template_collection_0"

        try:
            api_key = authorization_check(request.headers.get("Authorization"))

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        if not document_type or not document_state or not workspace_id:
            return CustomResponse(
                False,
                "document_type, workspace_id and document_state are required",
                None,
                status.HTTP_400_BAD_REQUEST,
            )
        if not validate_id(company_id) or not data_type:
            return CustomResponse(
                False, "Invalid Request!", None, status.HTTP_400_BAD_REQUEST
            )

        collection = check_if_name_exists_collection(api_key, collection_name, db_name)

        if not collection["success"]:
            return CustomResponse(
                False, "No collection with found", None, status.HTTP_404_NOT_FOUND
            )

        collection_name = collection["name"]

        if member and portfolio:
            auth_viewers = [{"member": member, "portfolio": portfolio}]

            document_list = get_clones_from_collection(
                api_key,
                db_name,
                collection_name,
                {
                    "company_id":company_id,
                    "data_type": data_type,
                    "document_state": document_state,
                    "auth_viewers": auth_viewers,
                },
            )
            return Response(
                {"documents": document_list},
                status=status.HTTP_200_OK,
            )
        else:
            if document_type == "document":
                documents = get_documents_from_collection(
                    api_key,
                    db_name,
                    collection_name,
                    {
                        "company_id":company_id,
                        "data_type": data_type,
                        "document_state": document_state,
                    },
                )
                return Response({"documents": documents}, status=status.HTTP_200_OK)
            if document_type == "clone":
                cache_key = f"clones_{workspace_id}"
                clones_list = cache.get(cache_key)
                if clones_list is None:
                    clones_list = get_clones_from_collection(
                        api_key,
                        db_name,
                        collection_name,
                        {
                            "company_id":company_id,
                            "data_type": data_type,
                            "document_state": document_state,
                        },
                    )
                    cache.set(cache_key, clones_list, timeout=60)
                return Response(
                    {"clones": clones_list},
                    status.HTTP_200_OK,
                )


class DocumentLink(APIView):
    def get(self, request, item_id):
        """editor link for a document"""
        workspace_id = request.query_params.get("workspace_id")
        document_type = request.query_params.get("document_type")

        db_name = f"{workspace_id}_DB_0"
        collection_name = f"{workspace_id}_template_collection_0"

        try:
            api_key = authorization_check(request.headers.get("Authorization"))

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        if not document_type or not workspace_id:
            return CustomResponse(
                False,
                "workspace_id and document_type are required",
                None,
                status.HTTP_400_BAD_REQUEST,
            )

        collection = check_if_name_exists_collection(api_key, collection_name, db_name)

        if not collection["success"]:
            return CustomResponse(
                False, "No collection with found", None, status.HTTP_404_NOT_FOUND
            )

        collection_name = collection["name"]

        if not validate_id(item_id) or not document_type:
            return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
        if document_type == "document":
            document = get_document_from_collection(
                api_key, db_name, collection_name, {"_id": item_id}
            )
        elif document_type == "clone":
            document = get_clone_from_collection(
                api_key, db_name, collection_name, {"_id": item_id}
            )
        if document:
            portfolio = request.query_params.get("portfolio", "")

            editor_link = access_editor(
                item_id,
                document_type,
                api_key,
                db_name,
                collection_name,
                portfolio=portfolio,
            )
            if not editor_link:
                return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response(editor_link, status.HTTP_200_OK)
        return Response("Document could not be accessed!", status.HTTP_404_NOT_FOUND)


class DocumentDetail(APIView):
    def get(self, request, item_id):
        """Retrieves the document object for a specific document"""
        workspace_id = request.query_params.get("workspace_id")
        document_type = request.query_params.get("document_type")

        db_name = f"{workspace_id}_DB_0"
        collection_name = f"{workspace_id}_template_collection_0"

        try:
            api_key = authorization_check(request.headers.get("Authorization"))

        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        if not workspace_id or not document_type:
            return CustomResponse(
                False,
                "workspace_id and document_type are required",
                None,
                status.HTTP_400_BAD_REQUEST,
            )

        collection = check_if_name_exists_collection(api_key, collection_name, db_name)

        if not collection["success"]:
            return CustomResponse(
                False, "No collection with found", None, status.HTTP_404_NOT_FOUND
            )

        collection_name = collection["name"]

        if not validate_id(item_id) or not document_type:
            return collection_name(
                False, "Something went wrong!", None, status.HTTP_400_BAD_REQUEST
            )
        if document_type == "document":
            document = get_document_from_collection(
                api_key, db_name, collection_name, {"_id": item_id}
            )
            return Response(document["data"], status.HTTP_200_OK)
        if document_type == "clone":
            document = get_clone_from_collection(
                api_key, db_name, collection_name, {"_id": item_id}
            )
            return Response(document["data"], status.HTTP_200_OK)
        return Response("Document could not be accessed!", status.HTTP_404_NOT_FOUND)




class ItemContent(APIView):
    def get(self, request, item_id):
        """Content map of a given document or a template or a clone"""
        content = []
        item_type = request.query_params.get("item_type")
        workspace_id = request.query_params.get("workspace_id")
        collection_name = f"{workspace_id}_template_collection_0"
        db_name = f"{workspace_id}_DB_0"

        try:
            api_key = authorization_check(request.headers.get("Authorization"))
        except InvalidTokenException as e:
            return CustomResponse(False, str(e), None, status.HTTP_401_UNAUTHORIZED)

        if not validate_id(item_id):
            return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
        content = []
        item_type = request.query_params.get("item_type")
        if item_type == "template":
            my_dict = ast.literal_eval(
                get_template_from_collection(api_key, db_name, collection_name, {"_id": item_id})["data"][0]["content"]
            )[0][0]
        else:
            my_dict = ast.literal_eval(
                get_document_from_collection(api_key, db_name, collection_name, {"_id": item_id})["data"][0]["content"]
            )[0][0]
        all_keys = [i for i in my_dict.keys()]
        for i in all_keys:
            temp_list = []
            for j in my_dict[i]:
                if "data" in j:
                    if j["type"] == "CONTAINER_INPUT":
                        container_list = []
                        for item in j["data"]:
                            container_list.append({"id": item["id"], "data": item["data"]})
                        temp_list.append({"id": j["id"], "data": container_list})
                    else:
                        temp_list.append({"id": j["id"], "data": j["data"]})
                else:
                    temp_list.append({"id": j["id"], "data": ""})
            content.append(
                {
                    i: temp_list,
                }
            )
        sorted_content = []
        for dicts in content:
            for key, val in dicts.items():
                sorted_content.append(
                    {
                        key: sorted(
                            dicts[key],
                            key=lambda x: int([a for a in re.findall("\d+", x["id"])][-1]),
                        )
                    }
                )
        return Response(sorted_content, status.HTTP_200_OK)


class FinalizeOrRejectEducation(APIView):
    def post(self, request, collection_id):
        """After access is granted and the user has made changes on a document."""
        if not validate_id(collection_id):
            return Response("Invalid Request!", status=status.HTTP_400_BAD_REQUEST)

        if not request.data:
            return Response("you are missing something", status.HTTP_400_BAD_REQUEST)

        api_key = request.data["api_key"]
        collection_name = request.data["coll_name"]
        api_key = request.data["api_key"]

        item_id = request.data["item_id"]
        item_type = request.data["item_type"]
        role = request.data["role"]
        user = request.data["authorized"]
        user_type = request.data["user_type"]
        state = request.data["action"]
        message = request.data.get("message", None)
        link_id = request.data.get("link_id", None)
        product = request.data.get("product", "education")

        payload = {
            "item_id": item_id,
            "item_type": item_type,
            "role": role,
            "authorized": user,
            "user_type": user_type,
            "action": state,
            "message": message,
            "link_id": link_id,
        }

        query = {"_id": collection_id}
        # #print("filter: ", query)
        data = get_data_from_collection(
            api_key, PROCESS_DB_0, collection_name, filters=query, limit=1
        )
        process_id = data["data"][0].get("process").get("_id")

        # res = FinalizeOrReject().get(request, process_id)
        res = FinalizeOrReject().post(request, process_id, payload=payload)

        # if res.status_code == 200:
        process = single_query_process_collection({"_id": process_id})

        update_process_collection(
            process_id=collection_id,
            api_key=api_key,
            database=PROCESS_DB_0,
            collection=collection_name,
            data={"process": process},
        )

        return Response(res.data, status.HTTP_200_OK)
        return CustomResponse(
            False, "Document could not be accessed!", None, status.HTTP_404_NOT_FOUND
        )


class Folders(APIView):
    def get(self, request):
        data_type = request.query_params.get("data_type")
        company_id = request.query_params.get("company_id")

        if not validate_id(company_id) or data_type is None:
            return Response("Invalid Request!", status.HTTP_400_BAD_REQUEST)
        cache_key = f"folders_{company_id}"
        folders_list = cache.get(cache_key)
        if folders_list is None:
            try:
                folders_list = get_folders_from_collection(
                    {"company_id": company_id, "data_type": data_type}
                )
                cache.set(cache_key, folders_list, timeout=60)
            except:
                return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(folders_list, status.HTTP_200_OK)

    def post(self, request):
        folder_name = request.data.get("folder_name")
        created_by = request.data.get("created_by")
        company_id = request.data.get("company_id")
        data_type = request.data.get("data_type")

        if not all[folder_name, created_by, company_id, data_type]:
            return CustomResponse(
                False, "Invalid Request!", None, status.HTTP_400_BAD_REQUEST
            )

        data = []
        if not validate_id(request.data["company_id"]):
            return Response("Invalid company details", status.HTTP_400_BAD_REQUEST)
        res = save_to_folder_collection(
            {
                "folder_name": folder_name,
                "data": data,
                "created_by": created_by,
                "company_id": company_id,
                "data_type": data_type,
                "folder_type": "original",
            }
        )
        if res["success"]:
            return CustomResponse(
                True,
                res["data"]["inserted_id"],
                None,
                status.HTTP_201_CREATED,
            )


class FolderDetail(APIView):
    def get(self, request, folder_id):
        folder_details = get_folder_from_collection({"_id": folder_id})
        return Response(folder_details, status.HTTP_200_OK)

    # def put(self, request, folder_id):
    #     form = request.data
    #     if not form:
    #         return Response("Folder Data is Required", status.HTTP_400_BAD_REQUEST)
    #     items = form["items"]
    #     old_folder = get_folder_from_collection({"_id": folder_id})
    #     old_folder["folder_name"] = form["folder_name"]
    #     old_folder["data"].extend(items)
    #     document_ids = [item["document_id"] for item in items if "document_id" in item]
    #     template_ids = [item["template_id"] for item in items if "template_id" in item]
    #     if items:
    #         process_folders_to_item(document_ids, folder_id, add_document_to_folder)
    #         process_folders_to_item(template_ids, folder_id, add_template_to_folder)
    #     updt_folder = json.loads(update_folder(folder_id, old_folder))
    #     if updt_folder["isSuccess"]:
    #         return Response("Folder Updated", status.HTTP_201_CREATED)

    # def delete(self, request, folder_id):
    #     item_id = request.query_params.get("item_id")
    #     item_type = request.query_params.get("item_type")
    #     delete_items_in_folder(item_id, folder_id, item_type)
    #     return Response(status.HTTP_204_NO_CONTENT)
