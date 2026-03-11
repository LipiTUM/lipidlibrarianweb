from django.urls import path
from django.urls import re_path

from . import views


urlpatterns = [
    path("query", views.QueryView.as_view()),
    re_path(r'^query/(?P<query_id>[A-Za-z0-9\-]+?)$', views.get_query),
    re_path(r'^lipid/(?P<lipid_id>[A-Za-z0-9\-]+?)$', views.lipid),
    re_path(r'^lipid-html/(?P<lipid_id>[A-Za-z0-9\-]+?)$', views.lipid_html),
    path("bulk-query", views.BulkQueryView.as_view()),
    re_path(r'^bulk-query/(?P<bulk_query_id>[A-Za-z0-9\-]+?)$', views.get_bulk_query),
    re_path(r'^query-or-bulk-query/(?P<query_id>[A-Za-z0-9\-]+?)$', views.get_query_or_bulk_query),
    re_path(r'^preview/(?P<structure_identifier>.+?(?=(\?|$)))', views.preview),
    re_path(r'^speak/(?P<text>.+?(?=(\?|$)))', views.speak),
    path("debug/lipid", views.debug_lipid),
    path("debug/query", views.debug_query),
    path("debug/bulk-query", views.debug_bulk_query),
]
