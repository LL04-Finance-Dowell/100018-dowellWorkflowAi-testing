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
    get_all_teams,
    get_document_content,
    get_documents,
    get_completed_documents,
    get_process_link,
    get_templates,
    get_team_data,
    # get_wf_ai_setting,
    get_workflows,
    finalize_or_reject,
    process_verification,
    processes,
    template_detail,
    trash_favourites,
    trigger_process,
    update_team,
    workflow_detail,
    process_copies,
    create_workflow_ai_setting,
    update_workflow_ai_setting,
    all_workflow_ai_setting,
    get_workflow_ai_setting,
)

urlpatterns = [
    path("companies/<str:company_id>/processes/", processes),
    path("companies/<str:company_id>/workflows/", get_workflows),
    path("companies/<str:company_id>/favourites/", all_favourites),
    path("companies/<str:company_id>/templates/", get_templates),
    path("companies/<str:company_id>/documents/", get_documents),
    path("companies/<str:company_id>/documents/completed/", get_completed_documents),
    path("companies/<str:company_id>/teams/", get_all_teams),
    path("companies/<str:company_id>/settings/", all_workflow_ai_setting),
    path("templates/", create_template),
    path("templates/<str:template_id>/", template_detail),
    path("templates/<str:template_id>/approval/", approve),
    path("documents/", create_document),
    path("documents/<str:document_id>/", document_detail),
    path("documents/<str:document_id>/content/", get_document_content),
    path("workflows/", create_workflow),
    path("workflows/<str:workflow_id>/", workflow_detail),
    # path("workflow-settings/", create_workflow_setting),
    path("processes/", document_processing),
    path("processes/verify/", process_verification),
    path("processes/<str:process_id>/", a_single_process),
    path("processes/<str:process_id>/trigger/", trigger_process),
    path("processes/<str:process_id>/copies/", process_copies),
    path("processes/<str:process_id>/finalize-or-reject/", finalize_or_reject),
    path("processes/<str:process_id>/links/", fetch_process_links),
    path("processes/<str:process_id>/user-link/", get_process_link),
    path("favourites/", favorites),
    path(
        "favourites/<str:item_id>/<str:item_type>/<str:username>/",
        trash_favourites,
    ),
    path("archives/", archives),
    path("archives/<str:item_id>/<str:item_type>/restore/", archive_restore),
    path("teams/", create_team),
    path("teams/<str:team_id>/", get_team_data),
    path("update-to-teams/", update_team),
    path("settings/", create_workflow_ai_setting),
    path("update-settings/", update_workflow_ai_setting),
    path("settings/<str:wf_setting_id>", get_workflow_ai_setting),

]
