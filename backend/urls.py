from django.urls import path
from .wf_management import (
    DocumentVerificationView,
    documentRejectionRequest,
    DocumentExecutionListView,
    documentWorkFlowAddView,
    DocumentCreatedListView,
    RejectedDocumentListView,
    DocumentInternalSign,
)
from .wf_management import (
    DocumentCreatedInExecutionListView,
    GenFlowLink,
)
from . import views

urlpatterns = [
    path("assign-emails/", views.assign_emails, name="assign_emails"),
    path("generate-linkflow/", GenFlowLink.as_view(), name="generate_linkflow"),
    path("add-to-workflow/", documentWorkFlowAddView, name="add_to_workflow"),
    path("workflows/", views.email_workflow, name="workflows"),
    path("templates/", views.template_list, name="templates"),
    path("template/<str:template_id>/", views.template_detail, name="template"),
    path("documents/", views.document_list, name="documents"),
    path("document/<str:document_id>/", views.document_detail, name="document"),
    path(
        "documents-to-sign/",
        DocumentExecutionListView.as_view(),
        name="documents_to_sign",
    ),
    path(
        "rejected-documents/",
        RejectedDocumentListView.as_view(),
        name="rejected_documents",
    ),
    path(
        "previous-documents/",
        DocumentCreatedListView.as_view(),
        name="previous-documents",
    ),
    path(
        "requested-documents/",
        DocumentCreatedInExecutionListView.as_view(),
        name="requested-documents",
    ),
    path(
        "sign-document/<str:document_id>/<str:uuid_hash>/<str:user_name>",
        DocumentVerificationView.as_view(),
        name="verify-document",
    ),
    path(
        "sign-int/<str:document_id>",
        DocumentInternalSign.as_view(),
        name="sign-int",
    ),
]
