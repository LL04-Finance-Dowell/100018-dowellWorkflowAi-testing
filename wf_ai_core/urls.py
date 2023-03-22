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


from app.views import (
    all_favourites,
    archive_restore,
    archives,
    document_detail,
    create_document,
    favorites,
    get_document_content,
    get_documents,
    search,
    create_template,
    template_detail,
    approve,
    get_templates,
    index_update,
    create_workflow_setting,
    get_wf_ai_setting,
    trash_favourites,
    update_wfai_setting,
    create_workflow,
    workflow_detail,
    update_workflow,
    get_workflows,
    home,
    a_single_process,
    get_process_link,
    fetch_process_links,
    processes,
    document_processing,
    process_verification,
    mark_process_as_finalize_or_reject,
    trigger_process,
)

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
    # archives
    path("v0.1/archives/", archives),
    path("v0.1/archives/restore/", archive_restore),
    # processing.
    # path("v0.1/process/", save_and_start_processing),
    path("v0.1/process/<str:process_id>/", a_single_process),
    path("v0.1/process/action/mark/", mark_process_as_finalize_or_reject),
    # path("v0.1/process/action/verify/", verify_process),
    path("v0.1/process/verification/link/", get_process_link),
    path("v0.1/process/org/<str:company_id>/", processes),
    path("v0.1/process/org/links/fetch/", fetch_process_links),
    # workflow
    path("v0.1/workflows/", create_workflow, name="workflows"),
    path("v0.1/workflows/update/", update_workflow, name="update_workflow"),
    path("v0.1/workflows/<str:workflow_id>/", workflow_detail, name="workflow_detail"),
    path("v0.1/workflows/org/<str:company_id>/", get_workflows, name="all_workflows"),
    # wf_settings
    path("v0.1/settings/", create_workflow_setting, name="save_wf_setting"),
    path(
        "v0.1/settings/<str:wf_setting_id>/",
        get_wf_ai_setting,
        name="get_wf_ai_setting",
    ),
    path("v0.1/settings/update/", update_wfai_setting, name="update_WFAI_setting"),
    # search
    path("v0.1/search/", search),
    # index
    path("v0.1/index/", index_update),
    # Favourites
    path("v0.1/favourites/", favorites),
    path("v0.1/favourites/org/<str:company_id>/", all_favourites),
    path(
        "v0.1/favourites/delete/<str:item_id>/<str:item_type>/<str:username>/",
        trash_favourites,
    ),
    # templates
    path("v0.1/templates/", create_template),
    path("v0.1/templates/<str:template_id>/", template_detail, name="template_detail"),
    path("v0.1/templates/org/<str:company_id>/", get_templates, name="all_templates"),
    path("v0.1/templates/approve/<str:template_id>/", approve),
    # documents
    path("v0.1/documents/", create_document, name="documents"),
    path("v0.1/documents/<str:document_id>/", document_detail, name="document"),
    path(
        "v0.1/documents/content/<str:document_id>/",
        get_document_content,
        name="content",
    ),
    path("v0.1/documents/org/<str:company_id>/", get_documents, name="all_documents"),
    # v2 processing.
    path("v0.2/process/", document_processing),
    path("v0.2/process/action/verify/", process_verification),
    path("v0.2/process/action/trigger/", trigger_process),
]
if settings.DEBUG:
    urlpatterns = urlpatterns + static(
        settings.STATIC_URL, document_root=settings.STATIC_ROOT
    )
    urlpatterns = urlpatterns + static(
        settings.MEDIA_URL, document_root=settings.MEDIA_ROOT
    )
