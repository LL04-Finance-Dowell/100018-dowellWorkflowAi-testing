from django.urls import path

# from .wf_management import (
#     assign_emails,
#     generate_link,
#     process_document,
#     reject_document,
#     signature,
#     internal_signature,
#     workflow,
#     approved_workflows,
#     rejected_workflows,
#     draft_workflows,
# )
from .template_management import (
    template_list,
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
    # reject_document,
)

from .wf_management import (create_workflow)

from .intelligent_search import (
    search,
)

from .views import api

urlpatterns = [
    path("", api, name="api"),
    # Search----------------------------
    path("search/<str:str>", search, name="search_result"),
    # Workflow--------------------------------------------------------
    # path("emails/", assign_emails, name="assign_emails"),
    # path("linkflow/", generate_link, name="generate_linkflow"),
    # path("workflows/", workflow, name="workflows"),
    # path("workflows/process/", process_document, name="add_to_workflow"),
    # path("workflows/drafts/", draft_workflows, name="add_to_workflow"),
    # path("workflows/approved/", approved_workflows, name="approved_workflows"),
    # path("workflows/rejected/", rejected_workflows, name="rejected_workflows"),
    # Templates-----------------------------------------------------
    path("templates/", create_template, name="templates"),
    path("templates/detail/", template_detail, name="templates"),
    path("templates/approve/", approve, name="templates_approve"),
    path("templates/approved/", approved, name="approved_templates"),
    path("templates/pending/", not_approved_templates, name="not_approved_templates"),
    path("templates/mine/", template_list, name="my_templates"),
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
        "documents/drafts/",
        draft_documents,
        name="requested-documents",
    ),
    path("documents/detail/", document_detail, name="document"),

    path("workflows/", create_workflow, name="workflows"),
]
