from django.urls import path
from .wf_management import (
    assign_emails,
    generate_link,
    process_document,
    reject_document,
    signature,
    internal_signature,
    workflow,
    approved_workflows,
    rejected_workflows,
    draft_workflows,
)
from .template_management import (
    template_detail,
    template_list,
    template_editor,
    approved_templates,
    not_approved_templates,
    create_template,
)

from .document_management import (
    document_detail,
    document_editor,
    documents_to_be_signed,
    draft_documents,
    my_documents,
    create_document,
    rejected_documents,
)

urlpatterns = [
    path("emails/", assign_emails, name="assign_emails"),
    path("linkflow/", generate_link, name="generate_linkflow"),
    path("workflows/", workflow, name="workflows"),
    path("workflows/process/", process_document, name="add_to_workflow"),
    path("workflows/drafts/", draft_workflows, name="add_to_workflow"),
    path("workflows/approved/", approved_workflows, name="approved_workflows"),
    path("workflows/rejected/", rejected_workflows, name="rejected_workflows"),
    path("templates/", create_template, name="templates"),
    path("templates/approved/", approved_templates, name="approved_templates"),
    path("templates/pending/", not_approved_templates, name="not_approved_templates"),
    path("templates/mine/", template_list, name="my_templates"),
    path("template/<str:template_id>/", template_editor, name="template"),
    path("documents/", create_document, name="documents"),
    path("documents/reject/", reject_document, name="reject_document"),
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
    path("documents/<str:document_id>/", document_detail, name="document"),
    path(
        "signatures/<str:document_id>/<str:uuid_hash>/<str:user_name>/",
        signature,
        name="verify-document",
    ),
    path(
        "signatures/internal/<str:document_id>/",
        internal_signature,
        name="internal_signature",
    ),
]
