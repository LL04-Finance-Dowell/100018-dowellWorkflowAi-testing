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
    index_update,
    mark_process_as_finalize_or_reject,
    process_verification,
    processes,
    search,
    template_detail,
    trash_favourites,
    trigger_process,
    update_wfai_setting,
    update_workflow,
    workflow_detail,
)

urlpatterns = [
    # Archives
    path("archives/", archives), # - POST
    path("archives/<str:item_id>/<str:item_type>/", archive_restore), # -POST
    # Process
    path("process/", document_processing), # - POST
    path("process/<str:process_id>/", a_single_process), # - GET
    path("process/org/<str:company_id>/", processes), # - GET

    path("verifications/", process_verification), # - POST
    path("process/action/trigger/", trigger_process),
    path("process/action/mark/", mark_process_as_finalize_or_reject),
    # Links
    path("links", get_process_link), # - GET
    path("links/<str:process_id>/", fetch_process_links), # - GET
    # workflow
    path("workflows/", create_workflow), # - POST
    path("workflows/update/", update_workflow), # - POST
    path("workflows/<str:workflow_id>/", workflow_detail),
    path("workflows/org/<str:company_id>/", get_workflows),
    # Wf _settings
    path("settings/", create_workflow_setting), # - POST
    path("settings/<str:wf_setting_id>/", get_wf_ai_setting), # - GET
    path("settings/update/", update_wfai_setting),
    # Favourites
    path("favourites/", favorites),
    path("favourites/org/<str:company_id>/", all_favourites),
    path( 
        "favourites/<str:item_id>/<str:item_type>/<str:username>/",
        trash_favourites,
    ),
    # Templates
    path("templates/", create_template),
    path("templates/<str:template_id>/", template_detail),
    path("templates/org/<str:company_id>/", get_templates),
    # path("templates/approve/<str:template_id>/", approve),
    # Documents
    path("documents/", create_document),
    path("documents/<str:document_id>/", document_detail),
    path(
        "documents/content/<str:document_id>/",
        get_document_content,
    ),
    path("documents/org/<str:company_id>/", get_documents),
    # Teams
    path("teams/", create_team),
]
if settings.DEBUG:
    urlpatterns = urlpatterns + static(
        settings.STATIC_URL, document_root=settings.STATIC_ROOT
    )
    urlpatterns = urlpatterns + static(
        settings.MEDIA_URL, document_root=settings.MEDIA_ROOT
    )
