import os
import logging
from django.conf import settings
from django.core.files.base import ContentFile
from lipidlibrarian.LipidQuery import LipidQuery

from .models import QUERY_STATUS_RUNNING
from .models import QUERY_STATUS_DONE
from .models import QUERY_STATUS_ERROR
from .models import Lipid
from .models import LipidSource
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
            lipid = Lipid(
                name=result.nomenclature.name,
                level=result.nomenclature.level.name
            )
            lipid.save()  # get UUID assigned; file fields are still empty in the DB

            # save=False: write files to disk, update fields in memory, do not change the DB yet
            lipid.file_json.save(f"{lipid.id}.json", ContentFile(format(result, "json")), save=False)
            lipid.file_html.save(f"{lipid.id}.html", ContentFile(format(result, "html")), save=False)
            logging.info(f"Writing lipid files to: {lipid.file_json.path}, {lipid.file_html.path}")

            lipid.save(update_fields=["file_json", "file_html"])  # DB write with both file paths after files have been written
            logging.info(f"Lipid saved. File exists: {os.path.exists(lipid.file_json.path)}")

            for src in result.sources:
                LipidSource.objects.create(lipid=lipid, source=src.source)

            # create QueryResult after Lipid files are confirmed on disk and committed to the DB
            QueryResult.objects.create(query=query, lipid=lipid)

        query.status = QUERY_STATUS_DONE
        query.save()

    except Exception as e:
        logging.exception("LipidLibrarian Error:")
        query.status = QUERY_STATUS_ERROR
        query.save()
