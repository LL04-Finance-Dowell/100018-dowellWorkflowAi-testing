from django.urls import path
from education import views


urlpatterns =[
    path("education/", views.HomeView.as_view() ),
    path("education/templates/", views.NewTemplate.as_view() )
    
]