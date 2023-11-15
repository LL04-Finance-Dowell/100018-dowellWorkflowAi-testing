from django.urls import path

from .views import (
    a_single_process,
    all_favourites,
    all_workflow_ai_setting,
    approve,
    archive_restore,
    archives,
    all_folders,
    create_folder,
    delete_item_from_folder,
    folder_update,
    create_document,
    create_team,
    create_template,
    create_workflow,
    create_application_settings,
    document_detail,
    document_object,
    clone_detail,
    clone_object,
    document_processing,
    favorites,
    fetch_process_links,
    finalize_or_reject,
    get_all_teams,
    get_reports_documents,
    get_completed_documents_by_process,
    get_clones_by_document,
    get_item_content,
    get_clone_content,
    get_documents_in_organization,
    get_documents_metadata_in_organization,
    get_clones_in_organization,
    get_clones_metadata_in_organization,
    get_process_link,
    get_reports_templates,
    get_team_data,
    get_templates,
    get_templates_metadata,
    # template_metadata_object,
    get_workflow_ai_setting,
    get_workflows,
    import_process_settings,
    process_copies,
    process_verification,
    process_verification_v2,
    processes,
    get_completed_processes,
    template_detail,
    template_object,
    trash_favourites,
    trigger_process,
    update_team,
    update_application_settings,
    workflow_detail,
    webhook,
    read_reminder,
    send_notif,
    dowell_centre_template,
    dowell_centre_documents,
    get_reports_processes,
    get_documents_types,
    get_templates_documents,
    get_reports_templates_metata,
    get_reports_documents_metadata,
    get_template_and_insert_metadata,
    get_mobile_notifications_docusign,
    process_public_users,
    import_process_settings,
)

urlpatterns = [
    path("server/", webhook),
    path("companies/<str:company_id>/processes/", processes),
    path("companies/<str:company_id>/processes/completed/", get_completed_processes),
    path("companies/<str:company_id>/workflows/", get_workflows),
    path("companies/<str:company_id>/favourites/", all_favourites),
    path("companies/<str:company_id>/templates/", get_templates),
    path("companies/<str:company_id>/templates/metadata/", get_templates_metadata),
    path(
        "companies/<str:company_id>/templates/knowledge-centre/", dowell_centre_template
    ),
    path("companies/<str:company_id>/templates/reports/", get_reports_templates),
    path("companies/<str:company_id>/documents/", get_documents_in_organization),
    path("companies/<str:company_id>/documents/metadata/", get_documents_metadata_in_organization),
    path("companies/<str:company_id>/documents/clones/", get_clones_in_organization),
    path("companies/<str:company_id>/documents/clones/metadata/", get_clones_metadata_in_organization),
    path("companies/<str:company_id>/documents/<str:document_id>/clones/", get_clones_by_document),
    path(
        "companies/<str:company_id>/documents/knowledge-centre/",
        dowell_centre_documents,
    ),
    path("companies/<str:company_id>/documents/reports/", get_reports_documents),
    path("companies/<str:company_id>/documents/types/", get_documents_types),
    path(
        "companies/<str:company_id>/processes/<str:process_id>/",
        get_completed_documents_by_process,
    ),
    path("companies/<str:company_id>/processes/reports/", get_reports_processes),
    path("companies/<str:company_id>/teams/", get_all_teams),
    path("companies/<str:company_id>/settings/", all_workflow_ai_setting),
    path("templates/", create_template, name="create_template"),
    path("templates/<str:template_id>/", template_detail, name="template_detail"),
    path(
        "templates/<str:template_id>/object/", template_object, name="template_object"
    ),
    path("templates/<str:template_id>/approval/", approve, name="approve"),
    path("documents/", create_document, name="create_document"),
    path("documents/<str:document_id>/", document_detail, name="document_detail"),
    path(
        "documents/<str:document_id>/object/", document_object, name="document_object"
    ),
    path("documents/clones/<str:clone_id>/", clone_detail, name="clone_detail"),
    path(
        "documents/clones/<str:clone_id>/object/", clone_object, name="clone_object"
    ),
    path(
        "documents/<str:item_id>/content/",
        get_item_content,
        name="get_document_content",
    ),
    path(
        "documents/clones/<str:clone_id>/content/",
        get_clone_content,
        name="get_clone_content",
    ),
    path("workflows/", create_workflow),
    path("workflows/<str:workflow_id>/", workflow_detail),
    path("processes/", document_processing),
    path("processes/verify/", process_verification_v2),
    path("processes/trigger/", trigger_process),
    path("processes/<str:process_id>/", a_single_process),
    path("processes/<str:process_id>/copies/", process_copies),
    path("processes/<str:process_id>/finalize-or-reject/", finalize_or_reject),
    path("processes/<str:process_id>/all-links/", fetch_process_links),
    path("processes/<str:process_id>/user-link/", get_process_link),
    path("processes/<str:company_id>/public/", process_public_users),

    path("favourites/", favorites),
    path(
        "favourites/<str:item_id>/<str:item_type>/<str:username>/",
        trash_favourites,
    ),
    path("archives/", archives),
    path("archives/restore/", archive_restore),
    path("teams/", create_team),
    path("teams/<str:team_id>/", get_team_data),
    path("update-to-teams/", update_team),
    path("settings/", create_application_settings),
    path("update-settings/", update_application_settings),
    path("settings/<str:company_id>", get_workflow_ai_setting),
    path("reminder/<str:process_id>/<str:username>", read_reminder),
    path("notify/", send_notif),
    path("folders/", create_folder, name="create_folder"),
    path("folders/<str:folder_id>", folder_update),
    path("folders/<str:folder_id>/<str:item_id>", delete_item_from_folder),
    path("companies/<str:company_id>/folders/", all_folders),
    path('companies/<str:company_id>/', get_templates_documents),
    path("companies/<str:company_id>/templates/reports/metadata/", get_reports_templates_metata),
    path("companies/<str:company_id>/documents/reports/metadata/", get_reports_documents_metadata),
    path("templates/<str:template_id>/insert-metadata/", get_template_and_insert_metadata, name="get_template_and_insert_metadata"),
    path("docusign/<str:company_id>", get_mobile_notifications_docusign),
    path("processes/process-import/<str:process_id>", import_process_settings)
]
