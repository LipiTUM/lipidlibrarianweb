from django.urls import path
from django.urls import re_path

from . import views


urlpatterns = [
    path("query", views.QueryView.as_view()),
    re_path(r'^query/(?P<query_id>[A-Za-z0-9\-]+?)$', views.get_query),
    re_path(r'^lipid/(?P<lipid_id>[A-Za-z0-9\-]+?)$', views.lipid),
    re_path(r'^preview/(?P<structure_identifier>.+?(?=(\?|$)))', views.preview),
    re_path(r'^speak/(?P<text>.+?(?=(\?|$)))', views.speak),
    path("debug/lipid", views.debug_lipid),
    path("debug/query", views.debug_query),
]
