from django.urls import path
from education import views


urlpatterns = [
    path("education/", views.HomeView.as_view()),
    path("education/templates/", views.NewTemplate.as_view()),
    path("education/workflows/", views.Workflow.as_view()),
    path("education/documents/", views.NewDocument.as_view()),
    # path("", views.Template),
]
