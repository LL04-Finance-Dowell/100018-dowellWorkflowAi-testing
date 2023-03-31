from django.conf import settings
from django.conf.urls.static import static
from django.urls import path

from .views import (
    a_single_process,
    all_favourites,
    approve,
    archive_restore,
    archives,
    create_document,
    create_team,
    create_template,
    create_workflow,
    create_workflow_setting,
    document_detail,
    document_processing,
    favorites,
    fetch_process_links,
    get_document_content,
    get_documents,
    get_process_link,
    get_templates,
    get_wf_ai_setting,
    get_workflows,
    finalize_or_reject,
    process_verification,
    processes,
    template_detail,
    trash_favourites,
    trigger_process,
    workflow_detail,
)

urlpatterns = [
    path("companies/<str:company_id>/processes/", processes),
    path("companies/<str:company_id>/workflows/", get_workflows),
    path("companies/<str:company_id>/favourites/", all_favourites),
    path("companies/<str:company_id>/templates/", get_templates),
    path("companies/<str:company_id>/documents/", get_documents),
    path("templates/", create_template),
    path("templates/<str:template_id>/", template_detail),
    path("templates/<str:template_id>/approval/", approve),
    path("documents/", create_document),
    path("documents/<str:document_id>/", document_detail),
    path("documents/<str:document_id>/content/", get_document_content),
    path("workflows/", create_workflow),
    path("workflows/<str:workflow_id>/", workflow_detail),
    path("workflow-settings/", create_workflow_setting),
    path("workflow-settings/<str:wf_setting_id>/", get_wf_ai_setting),
    path("processes/", document_processing),
    path("processes/<str:process_id>/", a_single_process),
    path("processes/<str:process_id>/verify/", process_verification),
    path("processes/<str:process_id>/trigger/", trigger_process),
    path("processes/<str:process_id>/finalize-or-reject/", finalize_or_reject),
    path("processes/<str:process_id>/links/", fetch_process_links),
    path("favourites/", favorites),
    path(
        "favourites/<str:item_id>/<str:item_type>/<str:username>/",
        trash_favourites,
    ),
    path("archives/", archives),
    path("archives/<str:item_id>/<str:item_type>/restore/", archive_restore),
    path("teams/", create_team),
]
if settings.DEBUG:
    urlpatterns = urlpatterns + static(
        settings.STATIC_URL, document_root=settings.STATIC_ROOT
    )
    urlpatterns = urlpatterns + static(
        settings.MEDIA_URL, document_root=settings.MEDIA_ROOT
    )
