from django.urls import path
from .wf_management import (
    assign_emails,
    generate_link,
    process_document,
    reject_document,
    signature,
    internal_signature,
    create_workflow,
)
from .views import (
    documents_to_be_signed,
    document_detail,
    rejected_documents,
    my_documents,
    draft_documents,
    template_detail,
    template_list,
    create_document,
)

urlpatterns = [
    path("assign-emails/", assign_emails, name="assign_emails"),
    path("generate-linkflow/", generate_link, name="generate_linkflow"),
    path("add-to-workflow/", process_document, name="add_to_workflow"),
    path("workflows/", create_workflow, name="workflows"),
    path("templates/", template_list, name="templates"),
    path("template/<str:template_id>/", template_detail, name="template"),
    path("documents/", create_document, name="documents"),
    path("document/<str:document_id>/", document_detail, name="document"),
    path("reject-document/", reject_document, name="reject_document"),
    path(
        "documents-to-sign/",
        documents_to_be_signed,
        name="documents_to_sign",
    ),
    path(
        "rejected-documents/",
        rejected_documents,
        name="rejected_documents",
    ),
    path(
        "my-documents/",
        my_documents,
        name="my_documents",
    ),
    path(
        "draft-documents/",
        draft_documents,
        name="requested-documents",
    ),
    path(
        "signature/<str:document_id>/<str:uuid_hash>/<str:user_name>",
        signature,
        name="verify-document",
    ),
    path(
        "internal-signature/<str:document_id>",
        internal_signature,
        name="internal_signature",
    ),
]
