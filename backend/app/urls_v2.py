from django.urls import path
from app import views_v2

urlpatterns = [
    # path("", views_v2.HomePage.as_view()),
    # path("server/", views_v2.PADeploymentWebhook.as_view()),
    path("processes/", views_v2.DocumentOrTemplateProcessing.as_view()),
    path("processes/invoice/", views_v2.TriggerInvoice.as_view()),
    path("processes/<str:process_id>/", views_v2.ProcessDetail.as_view()),
    path("processes/<str:process_id>/process-link/", views_v2.ProcessLink.as_view()),
    path("processes/<str:process_id>/verify/", views_v2.ProcessVerification.as_view()),
    path("processes/<str:process_id>/trigger/", views_v2.TriggerProcess.as_view()),
    path(
        "processes/process-import/<str:process_id>/", views_v2.ProcessImport.as_view()
    ),
    path(
        "processes/<str:process_id>/finalize-or-reject/",
        views_v2.FinalizeOrReject.as_view(),
        name="finalize_process",
    ),
    path(
        "processes/<str:process_id>/portfolio/",
        views_v2.AssignPortfolio.as_view(),
        name="assign_porfolio",
    ),
    path(
        "processes/<str:company_id>/organisations/",
        views_v2.Process.as_view(),
        name="process",
    ),
    path(
        "processes/<str:company_id>/public/",
        views_v2.PublicUser.as_view(),
        name="public_qrids",
    ),
    path("processes/<str:process_id>/copies/", 
         views_v2.ProcessCopies.as_view(), 
         name="process_copies"
    ),
    path("workflows/", views_v2.NewWorkflow.as_view(), name="create-workflow"),
    path("workflows/<str:workflow_id>/", views_v2.WorkflowDetail.as_view()),
    path(
        "workflows/<str:company_id>/organisations/",
        views_v2.Workflow.as_view(),
        name="get-workflows",
    ),
    path("documents/", views_v2.NewDocument.as_view(), name="documents"),
    path(
        "documents/<str:item_id>/",
        views_v2.DocumentDetail.as_view(),
        name="document_detail",
    ),
    path(
        "documents/<str:document_id>/link/",
        views_v2.DocumentLink.as_view(),
        name="document_link",
    ),
    path(
        "documents/<str:company_id>/organisations/",
        views_v2.Document.as_view(),
        name="get_documents",
    ),
    path("metadata/", views_v2.NewMetadata.as_view()),
    path("metadata/<str:company_id>/organisations/", views_v2.Metadata.as_view()),
    path("content/<str:item_id>/", views_v2.ItemContent.as_view()),
    path("archives/", views_v2.Archive.as_view()),
    path("archives/restore/", views_v2.ArchiveRestore.as_view()),
    path("bookmarks/", views_v2.NewBookmark.as_view()),
    path("bookmarks/<str:bookmark_id>/", views_v2.BookmarkDetail.as_view()),
    path("bookmarks/<str:company_id>/organisations/", views_v2.Bookmark.as_view()),
    path("templates/", views_v2.NewTemplate.as_view(), name="create_template"),
    path(
        "templates/<str:template_id>/",
        views_v2.TemplateDetail.as_view(),
        name="template_detail",
    ),
    path(
        "templates/<str:template_id>/link/",
        views_v2.TemplateLink.as_view(),
        name="template_link",
    ),
    path(
        "templates/<str:company_id>/organisations/",
        views_v2.Template.as_view(),
        name="list_templates",
    ),
    path("teams/", views_v2.NewTeam.as_view()),
    path("teams/<str:team_id>/", views_v2.TeamDetail.as_view()),
    path("teams/<str:company_id>/organisations/", views_v2.Team.as_view()),   
    path("groups/<str:company_id>/organisations/", views_v2.Group.as_view()),
    path("settings/", views_v2.NewWorkflowSetting.as_view()),
    path("settings/<str:setting_id>/", views_v2.WorkflowSettingsDetail.as_view()),
    path(
        "settings/<str:company_id>/organisations/", views_v2.WorkflowSettings.as_view()
    ),
    path("folders/", views_v2.NewFolder.as_view()),
    path("folders/<str:folder_id>/", views_v2.FolderDetail.as_view()),
    path("folders/<str:company_id>/organisations/", views_v2.Folder.as_view()),
    path("public/", views_v2.NewPublicUser.as_view()),
    path("public/<str:company_id>/organisations/", views_v2.PublicUser.as_view()),
    path("notifications/", views_v2.NewNotification.as_view()),
    path(
        "notifications/<str:process_id>/reminders/",
        views_v2.NotificationReminder.as_view(),
    ),
    path(
        "documents/<str:item_id>/reports/",
        views_v2.DocumentReport.as_view(),
        name="document-report",
    ),
    
     path(
        "companies/<str:company_id>/<str:item_type>/knowledge-centre/",
         views_v2.DowellCenter.as_view(),
    ),
]
