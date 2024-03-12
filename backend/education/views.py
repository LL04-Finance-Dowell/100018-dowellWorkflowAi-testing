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
    access_editor,
)

from education.datacube_connection import (
    datacube_collection_retrieval,
    get_data_from_collection,
    post_data_to_collection,
    add_collection_to_database,
    Template_database,
    save_to_metadata,
    post_to_data_service,
    save_to_process_collection,
    update_process_collection,
    # save_to_template_metadata,
    bulk_query_clones_collection,
    single_query_clones_collection,
    bulk_query_document_collection,
    single_query_document_collection,
    single_query_template_collection,
    save_to_workflow_collection,
)

from django.core.cache import cache
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
        # metadata_db = request.data["metadata_db"]
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
                collection_name = generate_unique_collection_name(
                    collection_name, "template_collection"
                )
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


class Workflow(APIView):
    def get(self, request):
        pass

    def post(self, request):
        """Creates a new workflow"""
        form = request.data
        api_key = form.get("api_key")
        db_name = form.get("db_name")

        if not form:
            return Response("Workflow Data required", status.HTTP_400_BAD_REQUEST)
        organization_id = form["company_id"]
        data = {
            "workflow_title": form["wf_title"],
            "steps": form["steps"],
        }
        collection_name = "workflow_collection_0"
        workflow_unique_name = generate_unique_collection_name(
            collection_name, "workflow_collection"
        )
        if workflow_unique_name["success"]:

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
            if res["isSuccess"]:
                return Response(
                    {
                        "_id": res["inserted_id"],
                        "workflows": data,
                        "created_by": form["created_by"],
                        "company_id": form["company_id"],
                        "creator_portfolio": form["portfolio"],
                        "workflow_type": "original",
                        "data_type": form["data_type"],
                    },
                    status.HTTP_201_CREATED,
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

        collection = check_if_name_exists_collection(
            api_key, "process_collection", PROCESS_DB_0
        )
        collection_name = collection["name"]
        if collection["success"] and collection["status"] == "New":
            new_process_collection = add_collection_to_database(
                api_key=api_key,
                database=PROCESS_DB_0,
                collections=collection_name,
                num_of_collections=1,
            )
        if not collection["name"] or new_process_collection["success"] == False:
            return Response(
                "Could not detect Process collection",
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

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

        saved_process = save_to_process_collection(
            api_key, PROCESS_DB_0, collection_name, process
        )
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
            verification_links = processing.HandleProcess(data).start()
            return Response(verification_links, status.HTTP_200_OK)


class NewDocument(APIView):

    def post(self, request):
        api_key = request.data.get("api_key")
        db_name = request.data.get("db_name")
        collection_name = request.data.get("collection_name")
        organization_id = request.data.get("company_id")
        created_by = request.data.get("created_by")

        portfolio = ""
        if request.data["portfolio"]:
            portfolio = request.data["portfolio"]
        viewers = [{"member": created_by, "portfolio": portfolio}]

        if not api_key or not db_name or not collection_name:
            return Response(
                "API key, collection name  and database name are required",
                status.HTTP_400_BAD_REQUEST,
            )

        collection = check_if_name_exists_collection(api_key, collection_name, db_name)
        collection_name = collection["name"]
        if not collection["success"]:
            return Response("No collection with found", status.HTTP_404_NOT_FOUND)

        template = single_query_template_collection(
            api_key, db_name, collection_name, {"collection_name": collection_name}
        )

        if not template["success"]:
            return Response("No template found", status.HTTP_404_NOT_FOUND)

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
            "parent_id": None,
            "process_id": "",
            "folders": [],
            "template": db_name,
        }

        res = post_data_to_collection(
            api_key=api_key,
            collection=collection_name,
            database=db_name,
            operation="insert",
            data=document_data,
        )

        if res["success"]:
            metadata = {
                "document_name": "Untitled Document",
                "created_by": request.data["created_by"],
                "company_id": organization_id,
                "document_state": "draft",
                "auth_viewers": viewers,
                "template": db_name,
            }

            res_metadata = save_to_metadata(
                api_key=api_key,
                collection_id=collection_name,
                db_name=db_name,
                data=metadata,
            )

            if not res_metadata["success"]:
                return Response(
                    "An error occured while trying to save document metadata",
                    status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        return Response({"message": "document created"}, status=status.HTTP_201_CREATED)


class Document(APIView):
    def get(self, request, company_id):
        """List of Created Documents."""
        api_key = request.query_params.get("api_key")
        db_name = request.query_params.get("db_name")
        collection_name = request.query_params.get("collection_name")
        data_type = request.query_params.get("data_type")
        document_type = request.query_params.get("document_type")
        document_state = request.query_params.get("document_state")
        member = request.query_params.get("member")
        portfolio = request.query_params.get("portfolio")

        if not api_key or not db_name:
            return Response(
                "API Key and Database Name are required",
                status.HTTP_400_BAD_REQUEST,
            )
        if not validate_id(company_id) or not data_type:
            return Response("Invalid Request!", status=status.HTTP_400_BAD_REQUEST)

        collection = check_if_name_exists_collection(api_key, collection_name, db_name)
        collection_name = collection["name"]
        if not collection["success"]:
            return Response("No collection with found", status.HTTP_404_NOT_FOUND)

        if member and portfolio:
            auth_viewers = [{"member": member, "portfolio": portfolio}]

            document_list = bulk_query_clones_collection(
                api_key,
                db_name,
                collection_name,
                {
                    "company_id": company_id,
                    "data_type": data_type,
                    "document_state": document_state,
                    "auth_viewers": auth_viewers,
                    "template": db_name,
                },
            )
            return Response(
                {"documents": document_list},
                status=status.HTTP_200_OK,
            )
        else:
            if document_type == "document":
                documents = bulk_query_document_collection(
                    api_key,
                    db_name,
                    collection_name,
                    {
                        "company_id": company_id,
                        "data_type": data_type,
                        "document_type": document_type,
                        "document_state": document_state,
                        "template": db_name,
                        "api_key": api_key,
                    },
                )
                return Response({"documents": documents}, status=status.HTTP_200_OK)
            if document_type == "clone":
                cache_key = f"clones_{company_id}"
                clones_list = cache.get(cache_key)
                if clones_list is None:
                    clones_list = bulk_query_clones_collection(
                        api_key,
                        db_name,
                        collection_name,
                        {
                            "company_id": company_id,
                            "data_type": data_type,
                            "document_state": document_state,
                            "template": db_name,
                            "api_key": api_key,
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
        api_key = request.data.get("api_key")
        db_name = request.data.get("db_name")
        collection_name = request.data.get("collection_name")
        document_type = request.data.get("document_type")

        if not api_key or not db_name:
            return Response(
                "API Key and Database Name are required",
                status.HTTP_400_BAD_REQUEST,
            )

        collection = check_if_name_exists_collection(api_key, collection_name, db_name)
        collection_name = collection["name"]
        if not collection["success"]:
            return Response("No collection with found", status.HTTP_404_NOT_FOUND)

        if not validate_id(item_id) or not document_type:
            return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
        if document_type == "document":
            document = single_query_document_collection(
                api_key, db_name, collection_name, {"_id": item_id, "template": db_name}
            )
        elif document_type == "clone":
            document = single_query_clones_collection(
                {"_id": item_id, "template": db_name}
            )
        if document:
            username = request.query_params.get("username", "")
            portfolio = request.query_params.get("portfolio", "")
            email = request.query_params.get("email", "")

            editor_link = access_editor(
                item_id,
                document_type,
                api_key,
                db_name,
                collection_name,
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
        api_key = request.data.get("api_key")
        db_name = request.data.get("db_name")
        collection_name = request.data.get("collection_name")
        document_type = request.data.get("document_type")

        if not api_key or not db_name:
            return Response(
                "API Key and Database Name are required",
                status.HTTP_400_BAD_REQUEST,
            )

        collection = check_if_name_exists_collection(api_key, collection_name, db_name)
        collection_name = collection["name"]
        if not collection["success"]:
            return Response("No collection with found", status.HTTP_404_NOT_FOUND)

        if not validate_id(item_id) or not document_type:
            return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
        if document_type == "document":
            document = single_query_document_collection(
                api_key, db_name, collection_name, {"_id": item_id}
            )
            return Response(document["data"], status.HTTP_200_OK)
        if document_type == "clone":
            document = single_query_clones_collection(
                api_key, db_name, collection_name, {"_id": item_id}
            )
            return Response(document["data"], status.HTTP_200_OK)
        return Response("Document could not be accessed!", status.HTTP_404_NOT_FOUND)
