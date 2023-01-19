from django.urls import path

from .template_management import (
    template_list,
    org_templates,
    approved,
    not_approved_templates,
    create_template,
    template_detail,
    approve,
)

from .document_management import (
    document_detail,
    documents_to_be_signed,
    draft_documents,
    my_documents,
    create_document,
    rejected_documents,
    get_document_content,
)
from .wf_management import (
    create_workflow,
    workflow_detail,
    my_workflows,
    update_workflow,
    saved_workflows,
)
from .wf_ai_setting import create_workflow_setting,get_wf_ai_setting,update_WFAI_setting

from .intelligent_search import (
    search,
)

from .process import (
    save_and_start_processing,
    save_workflows_to_document,
    verify_process,
    get_process_link,
    processes
)

from .views import api

urlpatterns = [
    path("", api),
    # Workflow Processing-----------------------
    path("processes/", processes),
    path("process/new/", save_workflows_to_document),
    path("process/start/", save_and_start_processing),
    path("process/verify/", verify_process),
    path("process/link/", get_process_link),
    # path("process/doc-map/", document_map),
    # Search----------------------------
    path("search/", search),
    # Templates-----------------------------------------------------
    path("templates/", create_template),
    path("templates/detail/", template_detail),
    path("templates/approve/", approve),
    path("templates/approved/", approved),
    path("templates/pending/", not_approved_templates),
    path("templates/saved/", org_templates),
    path("templates/mine/", template_list),
    # Documents----------------------------------------------------
    path("documents/", create_document, name="documents"),
    # path("documents/reject/", reject_document, name="reject_document"),
    path(
        "documents/to-sign/",
        documents_to_be_signed,
        name="documents_to_sign",
    ),
    path(
        "documents/rejected/",
        rejected_documents,
        name="rejected_documents",
    ),
    path(
        "documents/mine/",
        my_documents,
        name="my_documents",
    ),
    path(
        "documents/saved/",
        draft_documents,
        name="drafted_documents",
    ),
    path("documents/detail/", document_detail, name="document"),
    path("documents/document_content/", get_document_content, name="document_content"),
    # Workflow
    path("workflows/", create_workflow, name="workflows"),
    path("workflows/detail/", workflow_detail, name="workflow_detail"),
    path("workflows/mine/", my_workflows, name="my_workflows"),
    path("workflows/update/", update_workflow, name="update_workflow"),
    path("workflows/saved/", saved_workflows, name="saved_workflow"),

    #Workflow AI Setting Process

    path("workflow_ai_setting/", create_workflow_setting, name="save_wf_setting"),
    path("get_WFAI_setting/", get_wf_ai_setting, name="get_wf_ai_setting"),
    path("update_WFAI_setting/", update_WFAI_setting, name="update_WFAI_setting"),


]
