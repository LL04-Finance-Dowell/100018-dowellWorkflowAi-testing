from django.urls import path
from education import views


urlpatterns = [
    path("education/", views.HomeView.as_view()),
    path("eduation/database", views.DatabaseServices.as_view()),
    path(
        "education/templates/", views.NewTemplate.as_view()
    ),
    path("education/workflows/", views.Workflow.as_view()),
    path("education/documents/", views.NewDocument.as_view()),
    path("education/collections/", views.CollectionData.as_view()),
    path("education/processes/", views.ItemProcessing.as_view()),
    # path("", views.Template),
    path("education/documents/<str:item_id>/link/", views.DocumentLink.as_view()),
    path("education/documents/<str:item_id>/detail/", views.DocumentDetail.as_view()),
    path("education/documents/<str:company_id>/list/", views.Document.as_view()),
]
