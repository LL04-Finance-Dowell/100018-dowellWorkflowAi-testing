from django.urls import path

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
from .wf_management import create_workflow

from .intelligent_search import (
    search,
)

from .views import api, user

urlpatterns = [
    path("", api),
    path("/user-info", user),
    # Search----------------------------
    path("search/<str:str>", search),
    # Templates-----------------------------------------------------
    path("templates/", create_template),
    path("templates/detail/", template_detail),
    path("templates/approve/", approve),
    path("templates/approved/", approved),
    path("templates/pending/", not_approved_templates),
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
        "documents/drafts/",
        draft_documents,
        name="requested-documents",
    ),
    path("documents/detail/", document_detail, name="document"),
    path("workflows/", create_workflow, name="workflows"),
]
