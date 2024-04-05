from django.urls import path
from education import views


urlpatterns = [
    path("education/", views.HomeView.as_view()),
    path("education/database/", views.DatabaseServices.as_view()),
    path("education/templates/", views.NewTemplate.as_view()),
    path("education/templates/approved", views.ApprovedTemplates.as_view()),
    path("education/workflows/", views.Workflow.as_view()),
    path("education/collections/", views.CollectionData.as_view()),
    path("education/processes/", views.ItemProcessing.as_view()),
    path(
        "education/processes/<str:collection_id>/finalize-or-reject/",
        views.FinalizeOrRejectEducation.as_view(),
    ),
    path("education/documents/", views.NewDocument.as_view()),
    path("education/documents/<str:item_id>/link/", views.DocumentLink.as_view()),
    path("education/documents/<str:item_id>/detail/", views.DocumentDetail.as_view()),
    path("education/documents/<str:company_id>/list/", views.Document.as_view()),
    path("education/folders/", views.Folders.as_view()),
    path("education/folders/<str:folder_id>/detail", views.FolderDetail.as_view()),
    path("education/content/<str:item_id>/", views.ItemContent.as_view()),

]
