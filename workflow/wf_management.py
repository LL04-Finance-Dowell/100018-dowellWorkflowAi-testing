import json
import time

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from database.mongo_db_connection import (
    save_wf,
    get_wf_object,
    get_wf_list,
    update_wf,
)
from document.thread_start import ThreadAlgolia


@api_view(['GET'])
def home(request):
    return Response("WorkflowAI Service is running...", status=status.HTTP_200_OK)


def processing_complete(process):
    """
    complete document and mark as complete
    """
    # check if all process steps are marked finalized
    complete = False
    if process["isSuccess"]:
        complete = process["isSuccess"]
    return complete


@api_view(["POST"])
def get_workflows(request):
    workflow_list = get_wf_list(request.data["company_id"])
    if not workflow_list:
        return Response({"workflows": []}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if len(workflow_list) > 0:
        return Response(
            {"workflows": workflow_list},
            status=status.HTTP_200_OK,
        )
    return Response(
        {"workflows": []},
        status=status.HTTP_200_OK,
    )


def get_step(sid, step_name):
    data = get_wf_object(sid)["workflows"]["steps"]
    # the_step=None
    for step in data:
        if step_name == step["step_name"]:
            return step


@api_view(["POST"])
def create_workflow(request):  # Document Creation.
    completed = False
    form = request.data
    if not form:
        return Response(
            {"message": "Workflow Data required"},
            status=status.HTTP_404_NOT_FOUND,
        )
    else:
        data = {
            "workflow_title": form["wf_title"],
            "data_type": form["data_type"],
            "steps": form["steps"],
        }
        # for step in form["steps"]:
        #     data["steps"].append(
        #         {
        #             "step_name": step["step_name"],
        #             "role": step["role"],
        #         }
        #     )
        starter = time.time()
        res = json.loads(save_wf(data, form["company_id"], form["created_by"]))
        if res["isSuccess"]:
            wf_data = get_wf_object(res["inserted_id"])
            # completed=True

            try:
                ThreadAlgolia(res["inserted_id"], get_wf_object).start()

                return Response(
                    {
                        "workflow": wf_data,
                    },
                    status=status.HTTP_201_CREATED,
                )
            except RuntimeError:
                return Response(
                    {"workflow": [], "message": "Failed to Save Workflow"},
                    status=status.HTTP_200_OK,
                )
            # finally:

            #     # print("start thread")
            #     dt = Thread(
            #     target=save_to_algolia,
            #     args=(get_wf_object(res["inserted_id"]),),
            # )
            #     dt.start()
    # if completed:
    #     print("start thread")
    # if processing_complete(res):
    #     print("tread started")
    # dt = Thread(
    #     target=save_to_algolia,
    #     args=(wf_data,),
    # )
    # dt.start()


@api_view(["POST"])
def update_workflow(request):  # Document Creation.

    form = request.data
    if not form:
        return Response(
            {"workflow": [], "message": "Workflow Data is required for Update"},
            status=status.HTTP_200_OK,
        )
    else:

        workflow = {
            "workflow_title": form["wf_title"],
            "workflow_id": form["workflow_id"],
            "data_type": form["data_type"],
            "steps": form["steps"],
        }
        old_workflow = get_wf_object(form["workflow_id"])
        old_workflow["workflows"]["data_type"] = "Archive Data"

        updt_wf = json.loads(update_wf(form["workflow_id"], old_workflow))
        nw_wf = json.loads(
            save_wf(
                {key: val for key, val in workflow.items() if key != "workflow_id"},
                form["company_id"],
                form["created_by"],
            )
        )

        if updt_wf["isSuccess"]:
            try:
                updated_wf = get_wf_object(nw_wf["inserted_id"])
                ThreadAlgolia(nw_wf["inserted_id"], get_wf_object).start()
                return Response(
                    {"workflow": updated_wf},
                    status=status.HTTP_201_CREATED,
                )
            except RuntimeError:
                return Response(
                    {"workflow": [], "message": "Failed to Update Workflow"},
                    status=status.HTTP_200_OK,
                )


@api_view(["POST"])
def workflow_detail(request):  # Single document

    workflow_id = request.data["workflow_id"]
    data = get_wf_object(workflow_id)
    if not request.data:
        return Response(
            {"workflow": [], "message": "Failed to Load Workflow."},
            status=status.HTTP_200_OK,
        )

    return Response(
        {"workflow": data},
        status=status.HTTP_201_CREATED,
    )


# return Response(
#     {"workflow": [], "message": "This Workflow is Not Loaded."},
#     status=status.HTTP_200_OK,
# )


@api_view(["POST"])
def my_workflows(request):  # List of my documents.
    filtered_list = []
    created_by = request.data["created_by"]
    company_id = request.data["company_id"]
    workflows = get_wf_list(company_id)
    if not workflows:
        return Response(
            {
                "workflow": [],
                "message": "There is no Workflow created by This user.",
            },
            status=status.HTTP_200_OK,
        )
    else:
        for wf in workflows:
            if wf["created_by"] == created_by:
                filtered_list.append(wf)

    return Response(
        {"workflow": filtered_list, "title": "My Workflows"},
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
def saved_workflows(request):
    try:
        return Response(
            {"workflows": get_wf_list(request.data["company_id"])},
            status=status.HTTP_200_OK,
        )
    except RuntimeError:
        return Response(
            {"workflows": [], "title": "No Workflow Found"},
            status=status.HTTP_200_OK,
        )
