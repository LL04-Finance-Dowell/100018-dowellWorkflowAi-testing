import ast
import json
import os
import re
from datetime import datetime

import requests
import spacy
from crontab import CronTab
from django.core.cache import cache
# from git.repo import Repo
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from app import processing
from app.checks import is_finalized, is_wf_setting_exist, register_user_access
from app.helpers import (
    access_editor,
    access_editor_metadata,
    check_all_accessed,
    check_last_finalizer,
    check_progress,
    cloning_process,
    compare_hash,
    create_document_helper,
    create_favourite,
    dowell_email_sender,
    get_hash,
    get_link,
    get_metadata_id,
    get_prev_and_next_users,
    list_favourites,
    paginate,
    register_finalized,
    remove_favourite,
    remove_members_from_steps,
    update_signed,
    validate_id,
    remove_finalized_reminder,
)
from app.mongo_db_connection import (
    add_document_to_folder,
    add_template_to_folder,
    authorize,
    authorize_metadata,
    bulk_query_clones_collection,
    bulk_query_clones_metadata_collection,
    bulk_query_document_collection,
    bulk_query_document_metadata_collection,
    bulk_query_folder_collection,
    bulk_query_process_collection,
    bulk_query_public_collection,
    bulk_query_settings_collection,
    bulk_query_team_collection,
    bulk_query_template_collection,
    bulk_query_template_metadata_collection,
    bulk_query_workflow_collection,
    delete_document,
    delete_folder,
    delete_items_in_folder,
    delete_process,
    delete_template,
    delete_workflow,
    delete_group_collection,
    finalize_item,
    get_workflow_setting_object,
    process_folders_to_item,
    save_to_document_collection,
    save_to_document_metadata_collection,
    save_to_folder_collection,
    save_to_process_collection,
    save_to_public_collection,
    save_to_setting_collection,
    save_to_team_collection,
    save_to_template_collection,
    save_to_template_metadata_collection,
    save_to_workflow_collection,
    single_query_clones_collection,
    single_query_document_collection,
    single_query_folder_collection,
    single_query_links_collection,
    single_query_process_collection,
    single_query_qrcode_collection,
    single_query_settings_collection,
    single_query_team_collection,
    single_query_template_collection,
    single_query_template_metadata_collection,
    single_query_workflow_collection,
    update_folder,
    update_metadata,
    update_process,
    update_team_data,
    update_wf,
    update_workflow_setting,
    update_group_collection
)
from app.utils import notification_cron

from .constants import EDITOR_API, PROCESS_COMPLETION_MAIL

# Download the English model for spaCy
# spacy.cli.download("en_core_web_sm")

nlp = spacy.load("en_core_web_sm")

# to be redone
# class PADeploymentWebhook(APIView):
#     """Pick an event from GH and update our PA-server code"""

#     def post(self, request):
#         repo = Repo("/home/100094/100094.pythonanywhere.com")
#         origin = repo.remotes.origin
#         origin.pull()
#         return Response("Updated PA successfully", status.HTTP_200_OK)


class HomePage(APIView):
    def get(self, request):
        return Response(
            "If you are seeing this :), the server is !down.", status.HTTP_200_OK
        )


class DocumentOrTemplateProcessing(APIView):
    def post(self, request, *args, **kwargs):
        """processing is determined by action picked by user."""
        payload_dict = kwargs.get("payload")
        if payload_dict:
            request_data = payload_dict
        else:
            request_data = request.data

        if not request_data:
            return Response("You are missing something!", status.HTTP_400_BAD_REQUEST)

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


class Process(APIView):
    def get(self, request, company_id):
        data_type = request.query_params.get("data_type")
        if not validate_id(company_id) or data_type is None:
            return Response("Invalid Request!", status.HTTP_400_BAD_REQUEST)
        process_state = request.query_params.get("process_state")
        if process_state:
            completed = bulk_query_process_collection(
                {
                    "company_id": company_id,
                    "data_type": data_type,
                    "processing_state": process_state,
                }
            )
            page = int(request.GET.get("page", 1))
            completed = paginate(completed, page, 50)
            return Response(completed, status.HTTP_200_OK)
        else:
            """By Company"""
            cache_key = f"processes_{company_id}"
            process_list = cache.get(cache_key)
            if process_list is None:
                process_list = bulk_query_process_collection(
                    {"company_id": company_id, "data_type": data_type}
                )
                cache.set(cache_key, process_list, timeout=60)
            return Response(process_list, status.HTTP_200_OK)


class ProcessDetail(APIView):
    def get(self, request, process_id):
        """get process by process id"""
        if not validate_id(process_id):
            return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
        process = single_query_process_collection({"_id": process_id})
        progress = check_progress(process_id)
        if process["parent_item_id"]:
            document_id = process["parent_item_id"]
            document = single_query_document_collection({"_id": document_id})
            if document:
                document_name = document["document_name"]
                process.update({"document_name": document_name})
            links = single_query_links_collection({"process_id": process["_id"]})
            if links:
                links_object = links[0]
                process.update({"links": links_object["links"]})
        process["progress"] = progress
        return Response(process, status.HTTP_200_OK)

    def put(self, request, process_id):
        """_summary_
        Args:
            request (req): _description_
            process_id (str): _description_
        """
        if not validate_id(process_id):
            return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)

        if not request.data:
            return Response("Some parameters are missing", status.HTTP_400_BAD_REQUEST)

        workflow = request.data.get("workflows")
        step_id = request.data.get("step_id")
        step_id -= 1

        process = single_query_process_collection({"_id": process_id})
        steps = process.get("process_steps")
        state = "processing_state"

        step_content = steps[step_id]
        if step_content.get("permitInternalWorkflow") == True:
            step_content.update({"workflows": workflow})
            update_process(process_id, steps, state)
            return Response(process, status.HTTP_200_OK)
        else:
            return Response(
                "Internal workflow is not permitted in this step",
                status.HTTP_403_FORBIDDEN,
            )


class ProcessLink(APIView):
    def post(self, request, process_id):
        """get a link process for person having notifications"""
        links_info = single_query_links_collection({"process_id": process_id})
        if not links_info:
            return Response(
                "Verification link unavailable", status.HTTP_400_BAD_REQUEST
            )
        user = request.data["user_name"]
        process = single_query_process_collection({"_id": process_id})
        process_steps = process.get("process_steps")
        links = links_info[0]["links"]
        for step in process_steps:
            step_clone_map = step.get("stepDocumentCloneMap")
            step_role = step.get("stepRole")
            state = check_all_accessed(step_clone_map)
            if state:
                pass
            else:
                link = get_link(user, step_role, links)
                if link:
                    return Response(link, status.HTTP_200_OK)
        return Response(
            "user is not part of this process", status.HTTP_401_UNAUTHORIZED
        )


class ProcessVerification(APIView):
    def post(self, request, process_id):
        """verification of a process step access and checks that duplicate document based on a step."""
        user_type = request.data["user_type"]
        auth_user = request.data["auth_username"]
        auth_role = request.data["auth_role"]
        auth_portfolio = request.data["auth_portfolio"]
        token = request.data["token"]
        org_name = request.data["org_name"]
        collection_id = None
        link_object = single_query_qrcode_collection({"unique_hash": token})
        if user_type == "team" or user_type == "user":
            collection_id = (
                request.data["collection_id"]
                if request.data.get("collection_id")
                else None
            )
            if (
                link_object["user_name"] != auth_user
                or link_object["auth_portfolio"] != auth_portfolio
            ):
                return Response(
                    "User Logged in is not part of this process",
                    status.HTTP_401_UNAUTHORIZED,
                )
        process = single_query_process_collection({"_id": link_object["process_id"]})

        if user_type == "public":
            for step in process["process_steps"]:
                if step.get("stepRole") == auth_role:
                    for item in step["stepDocumentCloneMap"]:
                        if item.get(auth_user[0]):
                            # Assign Collection ID
                            collection_id = item.get(auth_user[0])

        # Get previous and next users/viewers
        prev_viewers, next_viewers = get_prev_and_next_users(
            process, auth_user, auth_role, user_type
        )

        user_email = (
            request.data.get("user_email") if request.data.get("user_email") else ""
        )

        process["org_name"] = org_name
        handler = processing.HandleProcess(process)
        location = handler.verify_location(
            auth_role,
            {
                "city": request.data["city"],
                "country": request.data["country"],
                "continent": request.data["continent"],
            },
        )
        if not location:
            return Response(
                "access to this document not allowed from this location",
                status.HTTP_400_BAD_REQUEST,
            )
        if not handler.verify_display(auth_role):
            return Response(
                "display rights set do not allow access to this document",
                status.HTTP_400_BAD_REQUEST,
            )
        if not handler.verify_time(auth_role):
            return Response(
                "time limit for access to this document has elapsed",
                status.HTTP_400_BAD_REQUEST,
            )

        editor_link = handler.verify_access_v2(
            auth_role,
            auth_user,
            user_type,
            collection_id,
            prev_viewers,
            next_viewers,
            user_email,
        )
        if editor_link:
            return Response(editor_link, status.HTTP_200_OK)
        else:
            return Response(
                "Error accessing the requested document, Retry opening the document again :)",
                status.HTTP_400_BAD_REQUEST,
            )


class FinalizeOrReject(APIView):
    def post(self, request, process_id, *args, **kwargs):
        """After access is granted and the user has made changes on a document."""
        payload_dict = kwargs.get("payload")
        if payload_dict:
            request_data = payload_dict
        else:
            request_data = request.data
            
        if not request_data:
            return Response("you are missing something", status.HTTP_400_BAD_REQUEST)
        item_id = request_data["item_id"]
        item_type = request_data["item_type"]
        role = request_data["role"]
        user = request_data["authorized"]
        user_type = request_data["user_type"]
        state = request_data["action"]
        message = ""
        if state == "rejected":
            message = request_data.get("message", None)
            if not message:
                return Response(
                    "provide a reason for rejecting the document",
                    status=status.HTTP_400_BAD_REQUEST,
                )
        check, current_state = is_finalized(item_id, item_type)
        if item_type == "document" or item_type == "clone":
            if check and current_state != "processing":
                return Response(
                    f"document already processed as `{current_state}`!",
                    status.HTTP_200_OK,
                )
        elif item_type == "template":
            if check and current_state != "draft":
                return Response(
                    f"template already processed as `{current_state}`!",
                    status.HTTP_200_OK,
                )
        if item_type == "clone":
            signers_list = single_query_clones_collection({"_id": item_id}).get(
                "signed_by"
            )
            updated_signers_true = update_signed(signers_list, member=user, status=True)
        res = json.loads(
            finalize_item(
                item_id, state, item_type, message, signers=updated_signers_true
            )
        )
        if res["isSuccess"]:
            # Check the finalize action, no need to check document state since the finalize_item() call was successful
            if state == "rejected":
                try:
                    process_steps = single_query_process_collection(
                        {"_id": process_id}
                    ).get("process_steps")
                    update_process(
                        process_id=process_id, steps=process_steps, state=state
                    )
                    return Response(
                        "document rejected successfully", status.HTTP_200_OK
                    )
                except Exception as e:
                    # Revert document and process states back to "processing"
                    json.loads(
                        finalize_item(
                            item_id, "processing", item_type, message, signers=None
                        )
                    )
                    update_process(
                        process_id=process_id, steps=process_steps, state="processing"
                    )
                    return Response(
                        f"an error occurred while rejecting the process {e}",
                        status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )

            else:
                # Process item normally
                try:
                    process = single_query_process_collection({"_id": process_id})
                    background = processing.Background(
                        process, item_type, item_id, role, user, message
                    )
                    if user_type == "public":
                        link_id = request_data.get("link_id")
                        register_finalized(link_id)
                    if item_type == "document" or item_type == "clone":
                        background.document_processing()
                        item = single_query_clones_collection({"_id": item_id})
                        if item:
                            if item.get("document_state") == "finalized":
                                meta_id = get_metadata_id(item_id, item_type)
                                updated_process = single_query_process_collection(
                                    {"_id": process_id}
                                )
                                process_state = updated_process.get("processing_state")
                                if (
                                    process.get("process_type") == "internal"
                                    and process_state == "finalized"
                                ):
                                    process_creator = process.get("created_by")
                                    process_creator_portfolio = process.get(
                                        "creator_portfolio"
                                    )
                                    parent_process = process.get("parent_process")

                                    user_dict = {
                                        "member": process_creator,
                                        "portfolio": process_creator_portfolio,
                                    }
                                    authorize(
                                        item_id, user_dict, parent_process, "document"
                                    )
                                    authorize_metadata(
                                        meta_id, user_dict, parent_process, "document"
                                    )

                                else:
                                    update_metadata(
                                        meta_id,
                                        "finalized",
                                        item_type,
                                        signers=updated_signers_true,
                                    )
                            elif item.get("document_state") == "processing":
                                meta_id = get_metadata_id(item_id, item_type)
                        if check_last_finalizer(user, user_type, process):
                            subject = (
                                f"Completion of {process['process_title']} Processing"
                            )
                            email = process.get("email", None)

                            if email:
                                dowell_email_sender(
                                    process["created_by"],
                                    email,
                                    subject,
                                    email_content=PROCESS_COMPLETION_MAIL,
                                )

                        # Remove Reminder after finalization
                        remove_finalized_reminder(user, process_id)

                        return Response(
                            "document processed successfully", status.HTTP_200_OK
                        )
                    elif item_type == "template":
                        background.template_processing()
                        item = single_query_template_collection({"_id": item_id})
                        if item:
                            if item.get("template_state") == "saved":
                                meta_id = get_metadata_id(item_id, item_type)
                                updated_signers_true = update_signed(
                                    signers_list, member=user, status=True
                                )
                                update_metadata(
                                    meta_id,
                                    "saved",
                                    item_type,
                                    signers=updated_signers_true,
                                )
                            elif item.get("template_state") == "draft":
                                meta_id = get_metadata_id(item_id, item_type)
                                update_metadata(meta_id, "draft", item_type)

                        if check_last_finalizer(user, user_type, process):
                            subject = (
                                f"Completion of {process['process_title']} Processing"
                            )
                            email = process.get("email", None)

                            if email:
                                dowell_email_sender(
                                    process["created_by"],
                                    email,
                                    subject,
                                    email_content=PROCESS_COMPLETION_MAIL,
                                )

                        # Remove Reminder after finalization
                        remove_finalized_reminder(user, process_id)

                        return Response(
                            "template processed successfully", status.HTTP_200_OK
                        )
                except Exception as err:
                    print(err)
                    return Response(
                        "An error occured during processing",
                        status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )
                    
    def get(self, request, process_id):
        return Response("Success", status.HTTP_200_OK)


class TriggerProcess(APIView):
    def post(self, request, process_id):
        """Get process and begin processing it."""
        if not validate_id(request.data["process_id"]):
            return Response("something went wrong!", status.HTTP_400_BAD_REQUEST)
        process = single_query_process_collection({"_id": request.data["process_id"]})
        action = request.data["action"]
        state = process["processing_state"]
        if request.data["user_name"] != process["created_by"]:
            return Response("User Unauthorized", status.HTTP_403_FORBIDDEN)
        if action == "halt_process" and state != "paused":
            res = json.loads(
                update_process(
                    process_id=request.data["process_id"],
                    steps=process["process_steps"],
                    state="paused",
                )
            )
            if res["isSuccess"]:
                return Response(
                    "Process has been paused until manually resumed!",
                    status.HTTP_200_OK,
                )
        if action == "process_draft" and state != "processing":
            verification_links = processing.HandleProcess(process).start()
            if verification_links:
                return Response(verification_links, status.HTTP_200_OK)
        else:
            return Response(
                f"The process is already in {state} state",
                status.HTTP_200_OK,
            )


class ProcessImport(APIView):
    def post(self, request, process_id):
        data = request.data
        company_id = data.get("company_id")
        portfolio = data.get("portfolio")
        member = data.get("member")
        data_type = data.get("data_type")

        if not validate_id(process_id) or not validate_id(company_id):
            return Response("Invalid_ID!", status.HTTP_400_BAD_REQUEST)
        old_process = single_query_process_collection({"_id": process_id})
        document_id = old_process.get("parent_item_id")
        workflow_id = old_process.get("workflow_construct_ids")
        old_document = single_query_document_collection({"_id": document_id})
        viewers = [{"member": member, "portfolio": portfolio}]
        new_document_data = {
            "document_name": old_document["document_name"],
            "content": old_document["content"],
            "created_by": member,
            "company_id": company_id,
            "page": old_document["page"],
            "data_type": data_type,
            "document_state": "draft",
            "auth_viewers": viewers,
            "document_type": "imports",
            "parent_id": None,
            "process_id": "",
            "folders": [],
            "message": "",
        }
        res = json.loads(save_to_document_collection(new_document_data))
        if not res.get("isSuccess"):
            return Response(
                "Failed to create document", status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        metadata_data = {
            "document_name": old_document["document_name"],
            "collection_id": res["inserted_id"],
            "created_by": member,
            "company_id": company_id,
            "data_type": data_type,
            "document_state": "draft",
            "auth_viewers": viewers,
            "document_type": "imports",
        }
        res_metadata = json.loads(save_to_document_metadata_collection(metadata_data))
        if not res_metadata.get("isSuccess"):
            return Response(
                "Failed to create document metadata",
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        metadata_id = res_metadata["inserted_id"]
        editor_link = access_editor_metadata(
            res["inserted_id"], "document", metadata_id
        )
        if not editor_link:
            return Response(
                "Could not open document editor.", status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        old_workflow = single_query_workflow_collection({"_id": workflow_id[0]})
        new_wf_title = old_workflow["workflows"]["workflow_title"]
        new_wf_steps = old_workflow["workflows"]["steps"]
        workflow_data = {
            "workflows": {
                "workflow_title": new_wf_title,
                "steps": new_wf_steps,
            },
            "company_id": company_id,
            "created_by": member,
            "portfolio": portfolio,
            "data_type": data_type,
            "workflow_type": "imports",
        }
        res_workflow = json.loads(save_to_workflow_collection(workflow_data))
        if not res_workflow.get("isSuccess"):
            return Response(
                "Failed to create workflow", status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        remove_members_from_steps(old_process)
        process_data = {
            "process_title": old_process["process_title"],
            "process_steps": old_process["process_steps"],
            "created_by": member,
            "company_id": company_id,
            "data_type": data_type,
            "parent_item_id": res["inserted_id"],
            "processing_action": "imports",
            "creator_portfolio": portfolio,
            "workflow_construct_ids": [res_workflow["inserted_id"]],
            "process_type": old_process["process_type"],
            "process_kind": "import",
        }
        res_process = json.loads(save_to_process_collection(process_data))
        if not res_process.get("isSuccess"):
            return Response(
                "Failed to create process", status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        response_data = {
            "Message": "Workflow, document and process created successfully",
            "editor_link": editor_link,
            "document_id": res["inserted_id"],
            "workflow_id": res_workflow["inserted_id"],
            "process_id": res_process["inserted_id"],
        }
        return Response(response_data, status.HTTP_201_CREATED)


class ProcessCopies(APIView):
    def post(self, request, process_id):
        if not validate_id(process_id) or not request.data:
            return Response("something went wrong!", status.HTTP_400_BAD_REQUEST)
        if request.method == "POST":
            if not request.data:
                return Response("something went wrong!", status.HTTP_400_BAD_REQUEST)
            process_id = cloning_process(
                process_id, request.data["created_by"], request.data["portfolio"]
            )
            if process_id is None:
                return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response("success created a process clone", status.HTTP_201_CREATED)


class NewWorkflow(APIView):
    def post(self, request):
        """Creates a new workflow"""
        form = request.data
        if not form:
            return Response("Workflow Data required", status.HTTP_400_BAD_REQUEST)
        organization_id = form["company_id"]
        data = {
            "workflow_title": form["wf_title"],
            "steps": form["steps"],
        }
        res = json.loads(
            save_to_workflow_collection(
                {
                    "workflows": data,
                    "company_id": organization_id,
                    "created_by": form["created_by"],
                    "portfolio": form["portfolio"],
                    "data_type": form["data_type"],
                    "workflow_type": "original",
                }
            )
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


class Workflow(APIView):
    def get(self, request, company_id):
        """List all workflows"""
        data_type = request.query_params.get("data_type")
        if not validate_id(company_id) or data_type is None:
            return Response("Invalid Request!", status.HTTP_400_BAD_REQUEST)
        workflow_list = bulk_query_workflow_collection(
            {"company_id": company_id, "data_type": data_type}
        )
        return Response(
            {"workflows": workflow_list},
            status.HTTP_200_OK,
        )


class WorkflowDetail(APIView):
    def get(self, request, workflow_id):
        """Single workflows"""
        data = single_query_workflow_collection({"_id": workflow_id})
        return Response(data, status.HTTP_200_OK)

    def put(self, request, workflow_id):
        form = request.data
        if not form:
            return Response(
                "Workflow Data is required", status=status.HTTP_400_BAD_REQUEST
            )
        old_workflow = single_query_workflow_collection({"_id": workflow_id})
        old_workflow["workflows"]["workflow_title"] = form["workflows"][
            "workflow_title"
        ]
        old_workflow["workflows"]["data_type"] = form["data_type"]
        for i, step in enumerate(form["workflows"]["steps"]):
            if i < len(old_workflow["workflows"]["steps"]):
                old_workflow["workflows"]["steps"][i]["step_name"] = step["step_name"]
                old_workflow["workflows"]["steps"][i]["role"] = step["role"]
            else:
                new_step = {"step_name": step["step_name"], "role": step["role"]}
                old_workflow["workflows"]["steps"].append(new_step)
        if len(form["workflows"]["steps"]) < len(old_workflow["workflows"]["steps"]):
            del old_workflow["workflows"]["steps"][len(form["workflows"]["steps"]) :]
        updt_wf = update_wf(workflow_id, old_workflow)
        updt_wf = json.loads(updt_wf)
        if updt_wf.get("isSuccess"):
            return Response("Workflow Updated", status=status.HTTP_201_CREATED)


class NewDocument(APIView):
    def post(self, request, *args, **kwargs):
        """Document Creation."""
        data = request.data

        if not data:
            return Response(
                {"message": "Failed to process document creation."},
                status.HTTP_400_BAD_REQUEST,
            )
        portfolio = ""
        if request.data["portfolio"]:
            portfolio = request.data["portfolio"]

        if request.data.get("password"):
            password = request.data.get("password")
            hashed_password = get_hash(password)
            is_private = True
        else:
            password = ""
            hashed_password = ""
            is_private = False

        viewers = [{"member": request.data["created_by"], "portfolio": portfolio}]
        organization_id = request.data["company_id"]
        template_id = request.data["template_id"]
        content = single_query_template_collection({"_id": template_id})["content"]
        page = single_query_template_collection({"_id": template_id})["page"]
        email = request.data.get("email")
        res = json.loads(
            save_to_document_collection(
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
                    "template": request.data["template_id"],
                    "message": "",
                    "is_private": is_private,
                    "password": hashed_password,
                }
            )
        )
        if res["isSuccess"]:
            res_metadata = json.loads(
                save_to_document_metadata_collection(
                    {
                        "document_name": "Untitled Document",
                        "collection_id": res["inserted_id"],
                        "created_by": request.data["created_by"],
                        "company_id": organization_id,
                        "data_type": request.data["data_type"],
                        "document_state": "draft",
                        "auth_viewers": viewers,
                        "is_private": is_private,
                        "password": hashed_password,
                    }
                )
            )
            if not res_metadata["isSuccess"]:
                return Response(
                    "An error occured while trying to save document metadata",
                    status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            metadata_id = res_metadata["inserted_id"]
            editor_link = access_editor_metadata(
                res["inserted_id"], "document", metadata_id, email
            )
            return Response(
                {"editor_link": editor_link, "_id": res["inserted_id"]},
                status.HTTP_201_CREATED,
            )
        return Response(
            "Could not open document editor.",
            status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


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
        source = request.query_params.get("source")
        if member and portfolio:
            auth_viewers = [{"member": member, "portfolio": portfolio}]
            if source == "mobile":
                # Document Notifications for Docusign
                notarisation = ["Sign_with_Seal", "Digital_Signature"]
                try:
                    check_setup = bulk_query_settings_collection(
                        {
                            "company_id": company_id,
                            "created_by": member,
                        }
                    )

                    for data in check_setup:
                        if "Notarisation" in data and set(notarisation).issubset(
                            data["Notarisation"]
                        ):
                            document_list = bulk_query_clones_metadata_collection(
                                {
                                    "company_id": company_id,
                                    "data_type": data_type,
                                    "document_state": document_state,
                                    "auth_viewers": auth_viewers,
                                }
                            )
                            return Response(
                                {"Document_notification": document_list},
                                status=status.HTTP_200_OK,
                            )
                        else:
                            return Response(
                                "'Notarisation' Docusign requires Notorisation settings.",
                                status.HTTP_404_NOT_FOUND,
                            )
                except:
                    return Response(
                        "No settings saved for this user.", status.HTTP_404_NOT_FOUND
                    )
            else:
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
            document_privacy = document.get("is_private", False)
            if document_privacy == True:
                input_password = request.query_params.get("password")
                if input_password == None:
                    return Response(
                        "Missing password argument",
                        status.HTTP_422_UNPROCESSABLE_ENTITY,
                    )
                valid_password_hash = document.get("password")
                if compare_hash(valid_password_hash, input_password) == False:
                    return Response("Incorrect password", status.HTTP_401_UNAUTHORIZED)

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


class NewMetadata(APIView):
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


class Metadata(APIView):
    def get(self, request, company_id):
        """List of Created Documents."""
        data_type = request.query_params.get("data_type")
        item_type = request.query_params.get("item_type")
        document_state = request.query_params.get("document_state")
        template_state = request.query_params.get("template_state")
        member = request.query_params.get("member")
        portfolio = request.query_params.get("portfolio")
        if not validate_id(company_id) or not data_type:
            return Response("Invalid Request!", status=status.HTTP_400_BAD_REQUEST)
        if item_type == "template":
            if member and portfolio:
                auth_viewers = [{"member": member, "portfolio": portfolio}]
                templates = bulk_query_template_metadata_collection(
                    {
                        "company_id": company_id,
                        "data_type": data_type,
                        "template_state": template_state,
                        "auth_viewers": auth_viewers,
                    }
                )
                return Response(
                    {"templates": templates},
                    status.HTTP_200_OK,
                )
            else:
                templates_meta_data = bulk_query_template_metadata_collection(
                    {"company_id": company_id, "data_type": data_type}
                )
                return Response({"templates": templates_meta_data})

        if item_type == "document":
            documents = bulk_query_document_metadata_collection(
                {
                    "company_id": company_id,
                    "data_type": data_type,
                    "document_state": document_state,
                }
            )
            return Response({"documents": documents}, status=status.HTTP_200_OK)
        if item_type == "clone":
            if member and portfolio:
                auth_viewers = [{"member": member, "portfolio": portfolio}]
                document_list = bulk_query_clones_metadata_collection(
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
                cache_key = f"clones_{company_id}"
                clones_list = cache.get(cache_key)
                if clones_list is None:
                    clones_list = bulk_query_clones_metadata_collection(
                        {
                            "company_id": company_id,
                            "data_type": data_type,
                            "document_state": document_state,
                        }
                    )
                    cache.set(cache_key, clones_list, timeout=10)
                return Response(
                    {"clones": clones_list},
                    status.HTTP_200_OK,
                )


class ItemContent(APIView):
    def get(self, request, item_id):
        """Content map of a given document or a template or a clone"""
        content = []
        item_type = request.query_params.get("item_type")
        if not validate_id(item_id):
            return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
        if item_type == "template":
            try:
                to_parse = single_query_template_collection({"_id": item_id})["content"]
                # Try ast.literal_eval()
                my_dict = ast.literal_eval(to_parse)[0][0]
            except Exception as e:
                # Use json.loads()
                my_dict = json.loads(to_parse)[0][0]
        if item_type == "document":
            try:
                to_parse = single_query_document_collection({"_id": item_id})["content"]
                # Try ast.literal_eval()
                my_dict = ast.literal_eval(to_parse)[0][0]
            except Exception as e:
                # Use json.loads()
                my_dict = json.loads(to_parse)[0][0]
        if item_type == "clone":
            try:
                to_parse = single_query_clones_collection({"_id": item_id})["content"]
                # Try ast.literal_eval()
                my_dict = ast.literal_eval(to_parse)[0][0]
            except Exception as e:
                # Use json.loads()
                my_dict = json.loads(to_parse)[0][0]

        all_keys = [i for i in my_dict.keys()]
        for i in all_keys:
            temp_list = []
            for j in my_dict[i]:
                if "data" in j:
                    if j["type"] == "CONTAINER_INPUT":
                        container_list = []
                        for item in j["data"]:
                            container_list.append(
                                {"id": item["id"], "data": item["data"]}
                            )
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
                            key=lambda x: int(
                                [a for a in re.findall("\d+", x["id"])][-1]
                            ),
                        )
                    }
                )
        return Response(sorted_content, status.HTTP_200_OK)


class Archive(APIView):
    def post(self, request):
        """Archiving  (Template | Workflow | Document | Folder)"""
        if not request.data:
            return Response("You are missing something", status.HTTP_400_BAD_REQUEST)
        id = request.data["item_id"]
        if not validate_id(id):
            return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
        if request.data["item_type"] == "workflow":
            res = delete_workflow(id, "Archive_Data")
            try:
                res_dict = json.loads(res)
                if res_dict["isSuccess"]:
                    return Response("Workflow moved to archives", status.HTTP_200_OK)
                return Response(
                    "Failed to move workflow to archives",
                    status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            except Exception as e:
                return Response(
                    "Invalid response data", status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        if request.data["item_type"] == "document":
            res = delete_document(id, "Archive_Data")
            try:
                res_dict = json.loads(res)
                if res_dict["isSuccess"]:
                    return Response("Document moved to archives", status.HTTP_200_OK)
                return Response(
                    "Failed to move document to archives",
                    status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            except Exception as e:
                return Response(
                    "Invalid response data", status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        if request.data["item_type"] == "template":
            res = delete_template(id, "Archive_Data")
            try:
                res_dict = json.loads(res)
                if res_dict["isSuccess"]:
                    return Response("Template moved to archives", status.HTTP_200_OK)
                return Response(
                    "Failed to move template to archives",
                    status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            except Exception as e:
                return Response(
                    "Invalid response data", status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        if request.data["item_type"] == "process":
            res = delete_process(id, "Archive_Data")
            try:
                res_dict = json.loads(res)
                if res_dict["isSuccess"]:
                    return Response("Process moved to archives", status.HTTP_200_OK)
                return Response(
                    "Failed to move process to archives",
                    status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            except Exception as e:
                return Response(
                    "Invalid response data", status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        if request.data["item_type"] == "folder":
            res = delete_folder(id, "Archive_Data")
            try:
                res_dict = json.loads(res)
                if res_dict["isSuccess"]:
                    return Response("Folder moved to archives", status.HTTP_200_OK)
                return Response(
                    "Failed to move process to archives",
                    status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            except Exception as e:
                print(e)
                return Response(
                    "Invalid response data", status.HTTP_500_INTERNAL_SERVER_ERROR
                )


class ArchiveRestore(APIView):
    def post(self, request):
        """Restore  (Template | Workflow | Document)"""
        if not request.data:
            return Response("You are missing something", status.HTTP_400_BAD_REQUEST)
        id = request.data["item_id"]
        if not validate_id(id):
            return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
        if request.data["item_type"] == "workflow":
            res = delete_workflow(id, "Real_Data")
            try:
                res_dict = json.loads(res)
                if res_dict["isSuccess"]:
                    return Response(
                        "Workflow restored from archives", status.HTTP_200_OK
                    )
                return Response(
                    "Failed to restore Workflow from archives",
                    status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            except json.JSONDecodeError:
                return Response(
                    "Invalid response data", status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        if request.data["item_type"] == "document":
            res = delete_document(id, "Real_Data")
            try:
                res_dict = json.loads(res)
                if res_dict["isSuccess"]:
                    return Response(
                        "Document restored from archives", status.HTTP_200_OK
                    )
                return Response(
                    "Failed to restore document from archives",
                    status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            except json.JSONDecodeError:
                return Response(
                    "Invalid response data", status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        if request.data["item_type"] == "template":
            res = delete_template(id, "Real_Data")
            try:
                res_dict = json.loads(res)
                if res_dict["isSuccess"]:
                    return Response(
                        "Template restored from archives", status.HTTP_200_OK
                    )
                return Response(
                    "Failed to restore template from archives",
                    status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            except Exception as e:
                print(e)
                return Response(
                    "Invalid response data", status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        if request.data["item_type"] == "process":
            res = delete_process(id, "Real_Data")
            try:
                res_dict = json.loads(res)
                if res_dict["isSuccess"]:
                    return Response(
                        "Process restored from archives", status.HTTP_200_OK
                    )
                return Response(
                    "Failed to restore process from archives",
                    status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            except Exception as e:
                print(e)
                return Response(
                    "Invalid response data", status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        if request.data["item_type"] == "Folder":
            res = delete_folder(id, "Real_Data")
            try:
                res_dict = json.loads(res)
                if res_dict["isSuccess"]:
                    return Response("Folder restored from archives", status.HTTP_200_OK)
                return Response(
                    "Failed to restore folder from archives",
                    status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            except Exception as e:
                print(e)
                return Response(
                    "Invalid response data", status.HTTP_500_INTERNAL_SERVER_ERROR
                )


class NewBookmark(APIView):
    def post(self, request):
        """`Favourite` an Item( workflow | template | document) or List favourites"""
        if not request.data:
            return Response("You are missing something", status.HTTP_400_BAD_REQUEST)
        msg = create_favourite(
            request.data["item"],
            request.data["item_type"],
            request.data["username"],
        )
        return Response(msg, status.HTTP_201_CREATED)


class Bookmark(APIView):
    def get(self, request, company_id):
        if not validate_id(company_id):
            return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
        data = list_favourites(company_id)
        return Response(data, status.HTTP_200_OK)


class BookmarkDetail(APIView):
    def delete(self, request, bookmark_id):
        item_type = request.query_params.get("item_type")
        username = request.query_params.get("item_type")
        msg = remove_favourite(
            identifier=bookmark_id,
            type=item_type,
            username=username,
        )
        return Response(msg, status.HTTP_204_NO_CONTENT)


class NewTemplate(APIView):
    def post(self, request):
        # Template Creation
        data = ""
        page = ""
        folder = []
        if not validate_id(request.data["company_id"]):
            return Response("Invalid company details", status.HTTP_400_BAD_REQUEST)
        portfolio = ""
        if request.data["portfolio"]:
            portfolio = request.data["portfolio"]

        if request.data.get("password"):
            password = request.data.get("password")
            hashed_password = get_hash(password)
            is_private = True
        else:
            password = ""
            hashed_password = ""
            is_private = False

        viewers = [{"member": request.data["created_by"], "portfolio": portfolio}]
        organization_id = request.data["company_id"]
        email = request.data.get("email", None)
        res = json.loads(
            save_to_template_collection(
                {
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
                    "is_private": is_private,
                    "password": hashed_password,
                }
            )
        )
        if res["isSuccess"]:
            collection_id = res["inserted_id"]
            res_metadata = json.loads(
                save_to_template_metadata_collection(
                    {
                        "template_name": "Untitled Template",
                        "created_by": request.data["created_by"],
                        "collection_id": collection_id,
                        "data_type": request.data["data_type"],
                        "company_id": organization_id,
                        "auth_viewers": viewers,
                        "template_state": "draft",
                        "is_private": is_private,
                        "password": hashed_password,
                    }
                )
            )
            if not res_metadata["isSuccess"]:
                return Response(
                    "An error occured while trying to save document metadata",
                    status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            payload = {
                "product_name": "workflowai",
                "details": {
                    "_id": res["inserted_id"],
                    "field": "template_name",
                    "action": "template",
                    "metadata_id": res_metadata["inserted_id"],
                    "email": email,
                    "cluster": "Documents",
                    "database": "Documentation",
                    "collection": "TemplateReports",
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
                {"editor_link": editor_link.json(), "_id": res["inserted_id"]},
                status.HTTP_201_CREATED,
            )


class Template(APIView):
    def get(self, request, company_id):
        data_type = request.query_params.get("data_type")
        template_state = request.query_params.get("template_state")
        member = request.query_params.get("member")
        portfolio = request.query_params.get("portfolio")
        if template_state:
            if member and portfolio:
                # Template Reports
                auth_viewers = [{"member": member, "portfolio": portfolio}]
                templates = bulk_query_template_collection(
                    {
                        "company_id": company_id,
                        "data_type": data_type,
                        "template_state": template_state,
                        "auth_viewers": auth_viewers,
                    }
                )
                return Response(
                    {"templates": templates},
                    status.HTTP_200_OK,
                )
            else:
                # Company Templates
                templates = bulk_query_template_collection(
                    {"company_id": company_id, "data_type": data_type}
                )
                templates_list = []
                if templates:
                    templates_list = [
                        {
                            "folders": item.get("folders", []),
                            "company_id": item["company_id"],
                            "data_type": item["data_type"],
                            "auth_viewers": item.get("auth_viewers", []),
                            "_id": item["_id"],
                            "template_type": item.get("template_type", "draft"),
                            "template_name": item["template_name"],
                            "created_by": item["created_by"],
                        }
                        for item in templates
                    ]
                return Response(
                    {"templates": templates_list},
                    status.HTTP_200_OK,
                )


class TemplateLink(APIView):
    def get(self, request, template_id):
        """editor link for a document"""
        if not validate_id(template_id):
            return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
        template = single_query_template_collection({"_id": template_id})
        if template.get("is_private") == True:
            input_password = request.query_params.get("password")
            if input_password == None:
                return Response(
                    "Missing password argument", status.HTTP_422_UNPROCESSABLE_ENTITY
                )
            valid_password_hash = template.get("password")
            if compare_hash(valid_password_hash, input_password) == False:
                return Response("Incorrect password", status.HTTP_401_UNAUTHORIZED)

        username = request.query_params.get("username", "")
        portfolio = request.query_params.get("portfolio", "")
        email = request.query_params.get("email", "")

        editor_link = access_editor(
            template_id, "template", username=username, portfolio=portfolio, email=email
        )

        if not editor_link:
            return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(editor_link, status.HTTP_201_CREATED)


class TemplateDetail(APIView):
    def get(self, request, template_id):
        template = single_query_template_collection({"_id": template_id})
        return Response(template, status.HTTP_200_OK)


class NewTeam(APIView):
    def post(self, request):
        """Create a new Team"""
        form = request.data
        if not form:
            return Response("Team Data required", status.HTTP_400_BAD_REQUEST)
        company_id = form["company_id"]
        created_by = form["created_by"]
        team_type = form["team_type"]
        team_name = form["team_name"]
        team_code = form["team_code"]
        team_spec = form["team_spec"]
        portfolio_list = form["portfolio_list"]
        details = form["details"]
        universal_code = form["universal_code"]
        data_type = form["data_type"]
        team_set = json.loads(
            save_to_team_collection(
                {
                    "team_name": team_name,
                    "team_type": team_type,
                    "team_code": team_code,
                    "team_spec": team_spec,
                    "details": details,
                    "universal_code": universal_code,
                    "portfolio_list": portfolio_list,
                    "company_id": company_id,
                    "created_by": created_by,
                    "data_type": data_type,
                }
            )
        )
        if team_set["isSuccess"]:
            return Response(
                {
                    "Team Saved": single_query_team_collection(
                        {"_id": team_set["inserted_id"]}
                    ),
                },
                status.HTTP_201_CREATED,
            )


class Team(APIView):
    def get(self, request, company_id):
        """Get All Team"""
        all_team = bulk_query_team_collection({"company_id": company_id})
        data_type = request.query_params.get("data_type")
        if not data_type:
            return Response("Invalid Request (Provide data_type param)", status.HTTP_400_BAD_REQUEST)
        all_team = bulk_query_team_collection(
            {"company_id": company_id, "data_type": data_type}
        )
        page = int(request.GET.get("page", 1))
        all_team = paginate(all_team, page, 50)
        return Response(all_team, status.HTTP_200_OK)


class TeamDetail(APIView):
    def get(self, request, team_id):
        """Get specific Team"""
        teams = single_query_team_collection({"_id": team_id})
        return Response(teams, status.HTTP_200_OK)

    def put(self, request, team_id):
        form = request.data
        if not form:
            return Response("Team Data required", status.HTTP_400_BAD_REQUEST)
        team_set = json.loads(update_team_data(team_id, form))
        if team_set["isSuccess"]:
            return Response(
                {
                    "Team Updated": single_query_team_collection(
                        {"_id": form["team_id"]}
                    ),
                },
                status.HTTP_200_OK,
            )


class NewWorkflowSetting(APIView):
    def post(self, request):
        if not request.data:
            return Response("You are missing something", status.HTTP_400_BAD_REQUEST)
        company_id = request.data["company_id"]
        if not validate_id(company_id):
            return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
        is_exists = is_wf_setting_exist(
            company_id, request.data["created_by"], request.data["data_type"]
        )
        if is_exists:
            return Response({"WF SETTING EXISTS": is_exists}, status.HTTP_200_OK)
        try:
            res = json.loads(
                save_to_setting_collection(
                    {
                        "company_id": company_id,
                        "created_by": request.data["created_by"],
                        "data_type": request.data["data_type"],
                        "Process": request.data["Process"],
                        "Documents": request.data["Documents"],
                        "Templates": request.data["Templates"],
                        "Workflows": request.data["Workflows"],
                        "Notarisation": request.data["Notarisation"],
                        "Folders": request.data["Folders"],
                        "Records": request.data["Records"],
                        "References": request.data["References"],
                        "Approval_Process": request.data["Approval_Process"],
                        "Evaluation_Process": request.data["Evaluation_Process"],
                        "Reports": request.data["Reports"],
                        "Management": request.data["Management"],
                        "Portfolio_Choice": request.data["Portfolio_Choice"],
                        "theme_color": request.data["theme_color"],
                    }
                )
            )
            if res["isSuccess"]:
                return Response(
                    f"You added WorkflowAI settings for your organization: {res}",
                    status.HTTP_201_CREATED,
                )
        except Exception as e:
            return Response(
                f"Failed to Save Workflow Setting: {e}",
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class WorkflowSettings(APIView):
    def get(self, request, company_id):
        """Get All WF AI"""
        member = request.query_params.get("member")
        all_setting = single_query_settings_collection(
            {
                "company_id": company_id,
                "data_type": "Real_Data",
                "created_by": member,
            }
        )
        return Response(
            all_setting,
            status.HTTP_200_OK,
        )


class WorkflowSettingsDetail(APIView):
    def put(self, request, setting_id):
        """Update workflow Setting"""
        form = request.data
        if not form:
            return Response("Workflow Data is Required", status.HTTP_400_BAD_REQUEST)
        updt_wf = json.loads(update_workflow_setting(setting_id, form))
        if updt_wf["isSuccess"]:
            return Response(
                updt_wf,
                status.HTTP_200_OK,
            )


class NewFolder(APIView):
    def post(self, request):
        data = []
        if not validate_id(request.data["company_id"]):
            return Response("Invalid company details", status.HTTP_400_BAD_REQUEST)
        res = json.loads(
            save_to_folder_collection(
                {
                    "folder_name": request.data["folder_name"],
                    "data": data,
                    "created_by": request.data["created_by"],
                    "company_id": request.data["company_id"],
                    "data_type": request.data["data_type"],
                    "folder_type": "original",
                }
            )
        )
        if res["isSuccess"]:
            return Response(
                res["inserted_id"],
                status.HTTP_201_CREATED,
            )


class Folder(APIView):
    def get(self, request, company_id):
        data_type = request.query_params.get("data_type")
        if not validate_id(company_id) or data_type is None:
            return Response("Invalid Request!", status.HTTP_400_BAD_REQUEST)
        cache_key = f"folders_{company_id}"
        folders_list = cache.get(cache_key)
        if folders_list is None:
            try:
                folders_list = bulk_query_folder_collection(
                    {"company_id": company_id, "data_type": data_type}
                )
                cache.set(cache_key, folders_list, timeout=60)
            except:
                return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(folders_list, status.HTTP_200_OK)


class FolderDetail(APIView):
    def get(self, request, folder_id):
        folder_details = single_query_folder_collection({"_id": folder_id})
        return Response(folder_details, status.HTTP_200_OK)

    def put(self, request, folder_id):
        form = request.data
        if not form:
            return Response("Folder Data is Required", status.HTTP_400_BAD_REQUEST)
        items = form["items"]
        old_folder = single_query_folder_collection({"_id": folder_id})
        old_folder["folder_name"] = form["folder_name"]
        old_folder["data"].extend(items)
        document_ids = [item["document_id"] for item in items if "document_id" in item]
        template_ids = [item["template_id"] for item in items if "template_id" in item]
        if items:
            process_folders_to_item(document_ids, folder_id, add_document_to_folder)
            process_folders_to_item(template_ids, folder_id, add_template_to_folder)
        updt_folder = json.loads(update_folder(folder_id, old_folder))
        if updt_folder["isSuccess"]:
            return Response("Folder Updated", status.HTTP_201_CREATED)

    def delete(self, request, folder_id):
        item_id = request.query_params.get("item_id")
        item_type = request.query_params.get("item_type")
        delete_items_in_folder(item_id, folder_id, item_type)
        return Response(status.HTTP_204_NO_CONTENT)


class DowellCenter(APIView):
    def get(self, request, company_id, item_type):
        """Fetch Dowell Knowledge centre folders."""
        data_type = request.query_params.get("data_type")
        if not validate_id(company_id):
            return Response("Something went wrong!", status=status.HTTP_400_BAD_REQUEST)

        if item_type == "templates":
            templates = bulk_query_template_metadata_collection(
                {"company_id": company_id, "data_type": data_type}
            )
            page = int(request.GET.get("page", 1))
            templates = paginate(templates, page, 50)
            template_list = [
                {
                    "_id": item["_id"],
                    "template_name": item["template_name"],
                    "collection_id": item["collection_id"],
                }
                for item in templates
            ]
            return Response(
                {"templates": template_list},
                status=status.HTTP_200_OK,
            )

        elif item_type == "documents":
            cache_key = f"documents_{company_id}"
            document_list = cache.get(cache_key)
            if document_list is None:
                document_list = bulk_query_document_metadata_collection(
                    {"company_id": company_id, "data_type": data_type}
                )
                cache.set(cache_key, document_list, timeout=60)
            page = int(request.GET.get("page", 1))
            documents = paginate(document_list, page, 50)
            document_list = [
                {
                    "_id": item["_id"],
                    "document_name": item["document_name"],
                    "collection_id": item["collection_id"],
                }
                for item in documents
            ]
            return Response(
                {"documents": document_list},
                status.HTTP_200_OK,
            )

        elif item_type == "folders":
            folders = bulk_query_folder_collection(
                {"company_id": company_id, "data_type": data_type}
            )

            page = int(request.GET.get("page", 1))
            folder_list = paginate(folders, page, 50)

            return Response(
                {"templates": folder_list},
                status=status.HTTP_200_OK,
            )

        else:
            return Response("Invalid Item type!", status=status.HTTP_400_BAD_REQUEST)


class NewPublicUser(APIView):
    def post(self, request):
        process_id = request.data.get("process_id")
        company_id = request.data.get("company_id")
        member = request.data.get("member")
        qrids = request.data.get("qr_ids")
        options = {
            "company_id": company_id,
            "process_id": process_id,
            "member": member,
            "public_links": qrids,
        }
        res = json.loads(save_to_public_collection(options))
        if res["isSuccess"]:
            return Response("Public users details stored!", status.HTTP_201_CREATED)


class PublicUser(APIView):
    def get(self, request, company_id):
        public_users = bulk_query_public_collection({"company_id": company_id})
        return Response(public_users, status=status.HTTP_200_OK)

    def post(self, request, company_id):
        process_id = request.data.get("process_id")
        member = request.data.get("member")
        qrids = request.data.get("qr_ids")
        if not process_id or not member or not qrids:
            return Response("provide all the fields", status.HTTP_400_BAD_REQUEST)
        options = {
            "company_id": company_id,
            "process_id": process_id,
            "member": member,
            "public_links": qrids,
        }
        res = json.loads(save_to_public_collection(options))
        if res["isSuccess"]:
            return Response("Public users details stored!", status.HTTP_201_CREATED)
        return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)


class NewNotification(APIView):
    def post(self, request):
        data = {
            "created_by": request.data["created_by"],
            "portfolio": request.data["portfolio"],
            "product_name": request.data["product_name"],
            "company_id": request.data["company_id"],
            "org_name": request.data["org_name"],
            "org_id": request.data["org_id"],
            "title": "Document to Sign",
            "message": "You have a document to sign.",
            "link": request.data["link"],
            "duration": "5",
            "button_status": "",
        }
        try:
            notification_cron.send_notification(data)
            return Response("Notification sent", status.HTTP_201_CREATED)
        except Exception as err:
            return Response(
                f"Something went wrong: {err}", status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class NotificationReminder(APIView):
    def get(self, request, process_id):
        username = request.query_params.get("username")
        # cron = CronTab('root')
        if not validate_id(process_id):
            return Response("Something went wrong!", status.HTTP_400_BAD_REQUEST)
        try:
            process_detail = single_query_process_collection({"_id": process_id})
            process_steps = process_detail["process_steps"]
            for step in process_steps:
                for mem in step["stepTeamMembers"]:
                    if mem["member"] == username:
                        if not register_user_access(
                            process_steps=process_steps,
                            authorized_role=step["stepRole"],
                            user=username,
                        ):
                            data = {
                                "username": username,
                                "portfolio": mem["portfolio"],
                                "product_name": "Workflow AI",
                                "company_id": process_detail["company_id"],
                                "org_name": "WorkflowAi",
                                "org_id": process_detail["company_id"],
                                "title": "Document to Sign",
                                "message": "You have a document to sign.",
                                "link": process_detail["_id"],
                                "duration": "5",  # TODO: pass reminder time here
                                "button_status": "",
                            }

                            current_directory = os.getcwd()
                            script_path = os.path.join(
                                current_directory, "/utils/notification_cron.py"
                            )
                            command = f'python3 {script_path} "{data}"'
                            cron = CronTab("root")
                            job = cron.new(command=command)
                            if step["stepReminder"] == "every_hour":
                                # # Schedule cron job to run notification_cron.py every hour
                                # # command = f"0 * * * * python3 {current_directory}/utils/notification_cron.py '{data}'"
                                # # os.system(f"crontab -l | {{ cat; echo '{command}'; }} | crontab -")
                                # hourly_job = cron.new(command=f"python3 {current_directory}/utils/notification_cron.py '{data}'")
                                # hourly_job.minute.every(1)
                                # cron.write()
                                # print(hourly_job.command)
                                # response_data = {
                                #     "command": hourly_job.command,
                                #     # "next_run": hourly_job.next_run(),
                                # }
                                # return Response(response_data)
                                job.setall("* * * * *")
                            elif step["stepReminder"] == "every_day":
                                # Schedule cron job to run notification_cron.py every day
                                # command = f"0 0 * * * python3 {current_directory}/utils/notification_cron.py '{data}'"
                                # os.system(f"crontab -l | {{ cat; echo '{command}'; }} | crontab -")
                                # daily_job = cron.new(command=f"python3 {current_directory}/utils/notification_cron.py '{data}'")
                                # daily_job.day.every(1)
                                # cron.write()
                                # response_data = {
                                #     "command": hourly_job.command,
                                #     # "next_run": hourly_job.next_run(),
                                # }
                                # return Response(response_data)
                                job.setall("0 0 * * *")
                            else:
                                return Response(
                                    f"Invalid step reminder value: {step['stepReminder']}",
                                    status.HTTP_400_BAD_REQUEST,
                                )

                            job.enable()
                            cron.write()
                            return Response("Cron job scheduled", status.HTTP_200_OK)
                            # return Response(f"User hasnt accessed process: {step['stepReminder']}")
            return Response(process_detail, status.HTTP_200_OK)
        except Exception as err:
            return Response(
                f"An error occured: {err}", status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class DocumentReport(APIView):
    def get(self, request, item_id):
        document = single_query_document_collection({"_id": item_id})
        content = json.loads(document["content"])
        words_count = 0
        char_count = 0
        noun_count = 0
        adjective_count = 0
        for entry in content:
            for group in entry:
                for key, values in group.items():
                    for item in values:
                        text = item.get("data", "")
                        words = text.split()
                        for word in words:
                            if not word.startswith("url"):
                                words_count += 1
                                noun = self.get_nouns(word)
                                adjective = self.get_adjectives(word)
                                noun_count += len(noun)
                                adjective_count += len(adjective)
                                for ch in word:
                                    char_count += 1
            response = {
                "words": words_count,
                "characters": char_count,
                "nouns": noun_count,
                "adjectives": adjective_count,
            }

        return Response(response, status=status.HTTP_200_OK)

    def get_nouns(self, sentence):
        doc = nlp(sentence)
        nouns = [token.text for token in doc if token.pos_ in ["NOUN"]]
        return nouns

    def get_adjectives(self, sentence):
        doc = nlp(sentence)
        adjectives = [token.text for token in doc if token.pos_ in ["ADJ"]]
        return adjectives


class AssignPortfolio(APIView):
    def post(self, request, process_id):
        if request.data:
            for idx, data in enumerate(request.data):
                step_choice = data.get("step")
                portfolio = data.get("portfolio")
                member = data.get("member")
                user_type = data.get("user_type")

                if not step_choice or not portfolio or not user_type or not member:
                    return Response(
                        "Missing required fields", status.HTTP_400_BAD_REQUEST
                    )

                process = single_query_process_collection({"_id": process_id})
                steps = process["process_steps"]

                for index, step in enumerate(steps):
                    if int(step_choice) <= len(steps):
                        if int(step_choice) == (index + 1):
                            if user_type == "team":
                                step["stepTeamMembers"].append(
                                    {"member": member, "portfolio": portfolio}
                                )
                            elif user_type == "user":
                                step["stepUserMembers"].append(
                                    {"member": member, "portfolio": portfolio}
                                )
                            elif user_type == "public":
                                step["stepPublicMembers"].append(
                                    {"member": member, "portfolio": portfolio}
                                )
                            else:
                                return Response(
                                    "Invalid user type", status.HTTP_400_BAD_REQUEST
                                )
                    else:
                        return Response(
                            "Invalid step choice", status.HTTP_400_BAD_REQUEST
                        )

                res = json.loads(
                    update_process(
                        process_id,
                        process["process_steps"],
                        process["processing_state"],
                    )
                )

                if res["isSuccess"]:
                    if (len(request.data) == 1) or ((idx + 1) == len(request.data)):
                        return Response(process, status=status.HTTP_200_OK)
                    else:
                        continue
                else:
                    return Response(
                        "An error occured in the process",
                        status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )
        else:
            return Response("Missing required fields", status.HTTP_400_BAD_REQUEST)


class TriggerInvoice(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data
        if not data:
            return Response(
                {"message": "Failed to process document creation."},
                status.HTTP_400_BAD_REQUEST,
            )
        portfolio = ""
        if data.get("portfolio"):
            portfolio = data["portfolio"]

        created_by = data["created_by"]
        viewers = [{"member": created_by, "portfolio": portfolio}]
        organization_id = data["company_id"]
        organization_name = data["company_name"]
        template_id = data["template_id"]
        data_type = data["data_type"]
        payment_month = data["payment_month"]
        payment_year = data["payment_year"]
        hr_username = data["hr_username"]
        hr_portfolio = data["hr_portfolio"]
        accounts_username = data["accounts_username"]
        accounts_portfolio = data["accounts_portfolio"]
        res, res_metadata = create_document_helper(
            created_by, organization_id, template_id, data_type, viewers
        )
        document_id = res["inserted_id"]

        # OR

        # doc_payload = {
        #     "company_id": organization_id,
        #     "template_id": template_id,
        #     "created_by": created_by,
        #     "portfolio": portfolio,
        #     "data_type": data_type
        # }
        # another_doc = NewDocument().post(request, payload=doc_payload)

        # TO BE COMPLETED
        process_payload = {
            "company_id": organization_id,
            "created_by": created_by,
            "creator_portfolio": portfolio,
            "data_type": data_type,
            "parent_id": document_id,
            "action": "start_document_processing_wf_wise",
            "process_title": f"{created_by} Invoice ({payment_month}-{payment_year})",
            "workflows": [
                {
                    "workflows": {
                        "workflow_title": "oct invoice workflow",
                        "steps": [
                            {
                                "stepCloneCount": 1,
                                "stepTaskType": "assign_task",
                                "stepRights": "add_edit",
                                "stepProcessingOrder": "no_order",
                                "stepTaskLimitation": "portfolios_assigned_on_or_before_step_start_date_and_time",
                                "stepActivityType": "individual_task",
                                "stepDisplay": "before_this_step",
                                "stepName": "Step 1",
                                "stepRole": "Freelancer",
                                "stepPublicMembers": [
                                    {"member": created_by, "portfolio": portfolio}
                                ],
                                "stepTeamMembers": [],
                                "stepUserMembers": [],
                                "stepDocumentCloneMap": [],
                                "stepNumber": 1,
                                "stepDocumentMap": [
                                    {"content": "s1", "required": False, "page": 1},
                                    {"content": "i2", "required": False, "page": 2},
                                    {"content": "i3", "required": False, "page": 2},
                                    {"content": "i4", "required": False, "page": 2},
                                    {"content": "i5", "required": False, "page": 2},
                                ],
                                "permitInternalWorkflow": False,
                                "skipStep": False,
                                "stepLocation": "any",
                            },
                            {
                                "stepCloneCount": 1,
                                "stepTaskType": "assign_task",
                                "stepRights": "add_edit",
                                "stepProcessingOrder": "no_order",
                                "stepTaskLimitation": "portfolios_assigned_on_or_before_step_start_date_and_time",
                                "stepActivityType": "individual_task",
                                "stepDisplay": "before_this_step",
                                "stepName": "Step 2",
                                "stepRole": "HR",
                                "stepPublicMembers": [
                                    {"member": hr_username, "portfolio": hr_portfolio}
                                ],
                                "stepTeamMembers": [],
                                "stepUserMembers": [],
                                "stepDocumentCloneMap": [],
                                "stepNumber": 2,
                                "stepDocumentMap": [
                                    {"content": "s2", "required": False, "page": 3},
                                    {"content": "d4", "required": False, "page": 3},
                                ],
                                "permitInternalWorkflow": False,
                                "skipStep": False,
                                "stepLocation": "any",
                            },
                            {
                                "stepCloneCount": 1,
                                "stepTaskType": "assign_task",
                                "stepRights": "add_edit",
                                "stepProcessingOrder": "no_order",
                                "stepTaskLimitation": "portfolios_assigned_on_or_before_step_start_date_and_time",
                                "stepActivityType": "individual_task",
                                "stepDisplay": "before_this_step",
                                "stepName": "Step 3",
                                "stepRole": "Accounts",
                                "stepPublicMembers": [
                                    {
                                        "member": accounts_username,
                                        "portfolio": accounts_portfolio,
                                    }
                                ],
                                "stepTeamMembers": [],
                                "stepUserMembers": [],
                                "stepDocumentCloneMap": [],
                                "stepNumber": 3,
                                "stepDocumentMap": [
                                    {"content": "s3", "required": False, "page": 3},
                                    {"content": "d5", "required": False, "page": 3},
                                ],
                                "permitInternalWorkflow": False,
                                "skipStep": False,
                                "stepLocation": "any",
                            },
                        ],
                    }
                }
            ],
            "workflows_ids": ["652e7d1bfde0ae87f6c23bdc"],
            "process_type": "document",
            "org_name": organization_name,
        }
        process = DocumentOrTemplateProcessing().post(request, payload=process_payload)
        return Response(
            {"created_document": document_id, "created_process": process.data},
            status.HTTP_201_CREATED,
        )


class Group(APIView):
    def get(self, request, company_id):

        data_type = request.query_params.get("data_type")
        if not data_type:
            return Response("Invalid Request", status.HTTP_400_BAD_REQUEST)

        groups = bulk_query_team_collection(
            {"company_id": company_id, "data_type": data_type}
        )

        response = []

        for group in groups:
            if group.get("group_name"):
                response.append(group)

        return Response(response, status=status.HTTP_200_OK)

    def post(self, request, company_id):
        group_name = request.data.get("group_name")
        public_members = request.data.get("public")
        team_members = request.data.get("team")
        user_members = request.data.get("user")

        if not group_name:
            return Response("Invalid Request", status.HTTP_400_BAD_REQUEST)

        if not isinstance(team_members, list) or not isinstance(user_members, list):
            return Response(
                "Team_members and User_members must be an array or a list",
                status=status.HTTP_400_BAD_REQUEST,
            )

        res = json.loads(
            save_to_team_collection(
                {
                    "group_name": group_name,
                    "public_members": public_members,
                    "team_members": team_members,
                    "user_members": user_members,
                    "company_id": company_id,
                    "data_type": "Real_Data",
                }
            )
        )

        if res["isSuccess"]:
            return Response(res, status=status.HTTP_201_CREATED)
        else:
            return Response(res, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def put(self, request, company_id):
        group_id = request.data.get("group_id")
        group_name = request.data.get("group_name")
        public_members = request.data.get("public")
        team_members = request.data.get("team")
        user_members = request.data.get("user")

        if not group_id:
            return Response("Invalid Request", status.HTTP_400_BAD_REQUEST)
        
        res = json.loads(
            update_group_collection(
                group_id,
                self.update_choice(
                      {
                        "group_name": group_name,
                        "public_members": public_members,
                        "team_members": team_members,
                        "user_members": user_members,
                        "company_id": company_id,
                        "data_type": "Real_Data",
                    }
                )
            )
        )

        if res["isSuccess"]:
            return Response("Group Updated", status=status.HTTP_200_OK)
        else:
            return Response(res, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    #If a field is empty, it is not updated as empty initial value remains   
    def update_choice(self, data:dict)->dict:
        updated_data = {}
        fields = [
            "group_name",
            "public_members",
            "team_members",
            "user_members",
            "company_id",
            "data_type",
        ]
        for field in fields:
            if field in data and data[field]:
                updated_data[field] = data[field]
        return updated_data
    def delete(self, request, company_id):
        group_id = request.data.get("group_id")
        
        if not group_id:
            return Response("Invalid Request", status.HTTP_400_BAD_REQUEST)
        
        res = json.loads(
            delete_group_collection(group_id, "Archive_Data")
        )

        if res["isSuccess"]:
            return Response("Group Deleted", status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(res, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

