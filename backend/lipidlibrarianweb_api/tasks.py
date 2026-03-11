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


def dispatch_query(query_id, existing_query_id=None):
    """
    Schedule duplicate_query or execute_query to run after the current DB
    transaction has been committed.  Using transaction.on_commit() ensures the
    worker thread will always find the Query row in the database, eliminating
    the race condition that occurred when threads were started inside an
    atomic block.
    """
    if existing_query_id is not None:
        if "django_q" in settings.INSTALLED_APPS:
            from django_q.tasks import async_task
            transaction.on_commit(
                lambda: async_task(
                    "lipidlibrarianweb_api.tasks.duplicate_query",
                    query_id,
                    existing_query_id,
                )
            )
        else:
            transaction.on_commit(
                lambda qid=query_id, eqid=existing_query_id: threading.Thread(
                    target=duplicate_query,
                    args=(qid, eqid),
                    daemon=True,
                ).start()
            )
    else:
        if "django_q" in settings.INSTALLED_APPS:
            from django_q.tasks import async_task
            transaction.on_commit(
                lambda: async_task(
                    "lipidlibrarianweb_api.tasks.execute_query",
                    query_id,
                )
            )
        else:
            transaction.on_commit(
                lambda qid=query_id: threading.Thread(
                    target=execute_query,
                    args=(qid,),
                    daemon=True,
                ).start()
            )



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
                level=result.nomenclature.level.name
            )

            content = ContentFile(format(result, "json"))
            lipid.file_json.save("", content)
            content = ContentFile(format(result, "html"))
            lipid.file_html.save("", content)

            for src in result.sources:
                LipidSource.objects.create(
                    lipid=lipid,
                    source=src.source,
                )

            QueryResult.objects.create(query=query, lipid=lipid)

        query.status = QUERY_STATUS_DONE
        query.save()

    except Exception as e:
        logging.exception("LipidLibrarian Error:")
        query.status = QUERY_STATUS_ERROR
        query.save()
