import logging
from django.core.files.base import ContentFile
from lipidlibrarian.LipidQuery import LipidQuery

from .models import QUERY_STATUS_RUNNING
from .models import QUERY_STATUS_DONE
from .models import QUERY_STATUS_ERROR
from .models import Lipid
from .models import QueryResult


def duplicate_query(query, existing_query):
    query.status = QUERY_STATUS_RUNNING
    query.save()

    query_result_queryset = QueryResult.objects.filter(query=existing_query)
    for query_result in query_result_queryset:
        new_query_result = QueryResult(query=query, lipid=query_result.lipid)
        new_query_result.save()

    query.status = QUERY_STATUS_DONE
    query.save()


def execute_query(query):
    query.status = QUERY_STATUS_RUNNING
    query.save()

    sources = set()
    cutoff = None
    requeries = None
    for filter in query.query_filters.split(";"):
        temp = filter.split("=")
        if temp[0] == "source":
            sources.add(temp[1].lower())
        if temp[0] == "cutoff":
            cutoff = float(temp[1])
        if temp[0] == "requeries":
            requeries = temp[1]

    # Query lipidlibrarian
    try:
        query_results = LipidQuery(input_string = query.query_string, selected_APIs = sources, cutoff=cutoff, requeries=requeries).query()

        for result in query_results:
            lipid = Lipid(name=result.nomenclature.name, level=result.nomenclature.level)
            lipid.save()

            query_result = QueryResult(query=query, lipid=lipid)
            query_result.save()

            lipid_file = ContentFile(format(result, 'json'))
            lipid.file.save("", lipid_file)

        query.status = QUERY_STATUS_DONE
        query.save()
    except Exception as e:
        logging.error(f"LipidLibrarian Error caught: {e}")
        query.status = QUERY_STATUS_ERROR
        query.save()
