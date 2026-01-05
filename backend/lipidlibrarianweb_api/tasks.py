import logging
from django.conf import settings
from django.core.files.base import ContentFile
from lipidlibrarian.LipidQuery import LipidQuery

from .models import QUERY_STATUS_RUNNING
from .models import QUERY_STATUS_DONE
from .models import QUERY_STATUS_ERROR
from .models import Lipid
from .models import Query
from .models import QueryResult


def duplicate_query(query_id, existing_query_id):
    try:
        query = Query.objects.get(id=query_id)
        existing_query = Query.objects.get(id=existing_query_id)

        query.status = QUERY_STATUS_RUNNING
        query.save(update_fields=["status"])

        for query_result in QueryResult.objects.filter(query=existing_query):
            QueryResult.objects.create(query=query, lipid=query_result.lipid)

        query.status = QUERY_STATUS_DONE
        query.save(update_fields=["status"])

    except Exception as e:
        Query.objects.filter(id=query_id).update(status=QUERY_STATUS_ERROR)
        logging.exception(e)


def execute_query(query_id):
    query = Query.objects.get(id=query_id)

    query.status = QUERY_STATUS_RUNNING
    query.save()

    sources = set()
    cutoff = None
    requeries = None

    for filter in query.query_filters.split(";"):
        key, val = filter.split("=")
        if key == "source":
            sources.add(val.lower())
        elif key == "cutoff":
            cutoff = float(val)
        elif key == "requeries":
            requeries = val

    try:
        query_results = LipidQuery(
            input_string=query.query_string,
            selected_APIs=sources,
            cutoff=cutoff,
            requeries=requeries,
            sql_args=getattr(settings, "ALEX123_DB_ARGS", None)
        ).query()

        for result in query_results:
            lipid = Lipid.objects.create(
                name=result.nomenclature.name,
                level=result.nomenclature.level
            )

            content = ContentFile(format(result, "json"))
            lipid.file.save("", content)

            QueryResult.objects.create(query=query, lipid=lipid)

        query.status = QUERY_STATUS_DONE
        query.save()

    except Exception as e:
        logging.exception("LipidLibrarian Error:")
        query.status = QUERY_STATUS_ERROR
        query.save()
