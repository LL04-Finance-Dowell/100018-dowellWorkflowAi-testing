import json,time
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from database.mongo_db_connection import (
    save_wf,
    get_wf_object,
    get_wf_list,
    update_wf,
)
from document.algolia import save_to_algolia

def get_step(id, step_name):
    data = get_wf_object(id)["workflows"]["steps"]
    # the_step=None
    for step in data:
        if step_name == step["step_name"]:
            return step


@api_view(["POST"])
def create_workflow(request):  # Document Creation.

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
            wf_data=get_wf_object(res["inserted_id"])
            save_to_algolia(wf_data)
            print(time.time()-starter)
            try:
                return Response(
                    {
                        "workflow": wf_data,
                    },
                    status=status.HTTP_201_CREATED,
                )
            except:
                return Response(
                    {"workflow": [], "message": "Failed to Save Workflow"},
                    status=status.HTTP_200_OK,
                )

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
        # for step in form["steps"]:
        #     workflow["steps"].append(
        #         {
        #             "step_name": step["step_name"],
        #             "role": step["role"],
        #         }
        #     )
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
                return Response(
                    {"workflow": get_wf_object(nw_wf["inserted_id"])},
                    status=status.HTTP_201_CREATED,
                )
            except:
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

    try:
        return Response(
            {"workflow": data},
            status=status.HTTP_201_CREATED,
        )
    except:
        return Response(
            {"workflow": [], "message": "Failed to get response"},
            status=status.HTTP_200_OK,
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
    except:
        return Response(
            {"workflows": [], "title": "No Workflow Found"},
            status=status.HTTP_200_OK,
        )


@api_view(["POST"])
def get_workflows(request):  # List of Created Templates.
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
