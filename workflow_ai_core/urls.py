"""workflow_ai URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
# from django.conf.urls import url
from django.conf.urls.static import static
from django.urls import path, re_path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

from document.count_all import count_objects
from document.document_management import (
    document_detail,
    create_document,
    get_document_content,
    get_documents,
)
from document.intelligent_search import search
from document.template_management import (
    create_template,
    template_detail,
    approve,
    get_templates,
)
from workflow.wf_ai_setting import (
    create_workflow_setting,
    get_wf_ai_setting,
    update_wfai_setting,
)
from workflow.wf_management import (
    create_workflow,
    workflow_detail,
    update_workflow,
    get_workflows,
    home,
)
from workflow_processing.process import (
    save_and_start_processing,
    a_single_process,
    register_finalize_or_reject,
    verify_process,
    get_process_link,
    fetch_process_links,
    processes,
)
from workflow_processing.process_v2 import document_processing, verification, wf_processes, \
    mark_process_as_finalize_or_reject

schema_view = get_schema_view(
    openapi.Info(
        title="WorkflowAI",
        default_version="v1",
        description="Backend Service for Workflow AI",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@snippets.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path("", home, name="Home"),
    # api doc
    re_path(
        r"^swagger(?P<format>\.json|\.yaml)$",
        schema_view.without_ui(cache_timeout=0),
        name="schema-json",
    ),
    re_path(
        r"^swagger/$",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    re_path(
        r"^redoc/$", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"
    ),

    # processing.
    path("v0.1/process/", save_and_start_processing),
    path("v0.1/process/<str:process_id>/", a_single_process),
    path("v0.1/process/verify/", verify_process),
    path("v0.1/process/link/", get_process_link),
    path("v0.1/process/org/<str:company_id>/", processes),
    path("v0.1/process/links/<str:process_id>/", fetch_process_links),
    path("v0.1/process/verification/", register_finalize_or_reject),
    # workflow
    path("v0.1/workflows/", create_workflow, name="workflows"),
    path("v0.1/workflows/<str:workflow_id>/", workflow_detail, name="workflow_detail"),
    path("v0.1/workflows/org/<str:company_id>/", get_workflows, name="all_workflows"),
    path("v0.1/workflows/update/", update_workflow, name="update_workflow"),
    # wf_settings
    path("v0.1/settings/", create_workflow_setting, name="save_wf_setting"),
    path("v0.1/get_WFAI_setting/", get_wf_ai_setting, name="get_wf_ai_setting"),
    path("v0.1/settings/update/", update_wfai_setting, name="update_WFAI_setting"),
    # search
    path("v0.1/search/", search),
    # templates
    path("v0.1/templates/", create_template),
    path("v0.1/templates/<str:template_id>/", template_detail),
    path("v0.1/templates/org/<str:company_id>/", get_templates, name="all_templates"),
    path("v0.1/templates/approve/<str:template_id>/", approve),
    # documents
    path("v0.1/documents/", create_document, name="documents"),
    path("v0.1/documents/<str:document_id>/", document_detail, name="document"),
    path("v0.1/documents/content/str:document_id>/", get_document_content, name="content"),
    path("v0.1/documents/org/<str:company_id>/", get_documents, name="all_documents"),
    # v2 processing.
    path("v0.2/process/", document_processing),
    path("v0.2/process/verify/", verification),
    path('v0.2/process/mark/', mark_process_as_finalize_or_reject),
    path("v0.2/process/org/<str:company_id>/", wf_processes),

    # ----------------- @deprecated --------------
    # path(
    #     "v0.1/documents/to-sign/",
    #     documents_to_be_signed,
    #     name="documents_to_sign",
    # ),
    # path(
    #     "v0.1/documents/rejected/",
    #     rejected_documents,
    #     name="rejected_documents",
    # ),
    # path(
    #     "v0.1/documents/mine/",
    #     my_documents,
    #     name="my_documents",
    # ),
    # path(
    #     "v0.1/documents/saved/",
    #     draft_documents,
    #     name="drafted_documents",
    # ),
    # path("v0.1/workflows/mine/", my_workflows, name="my_workflows"),
    # path("v0.1/workflows/saved/", saved_workflows, name="saved_workflow"),
    # path("v0.1/templates/approved/", approved),
    # path("v0.1/templates/pending/", not_approved_templates),
    # path("v0.1/templates/saved/", org_templates),
    # path("v0.1/templates/mine/", template_list),
    # path(
    #     "v0.1/object_count/",
    #     count_objects,
    #     name="object_count",
    # ),

]
if settings.DEBUG:
    urlpatterns = urlpatterns + static(
        settings.STATIC_URL, document_root=settings.STATIC_ROOT
    )
    urlpatterns = urlpatterns + static(
        settings.MEDIA_URL, document_root=settings.MEDIA_ROOT
    )
