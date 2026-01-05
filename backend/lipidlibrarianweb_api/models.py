import uuid

from django.db import models


QUERY_STATUS_CREATED = "created"
QUERY_STATUS_RUNNING = "running"
QUERY_STATUS_DONE = "done"
QUERY_STATUS_ERROR = "error"

BULK_STATUS_CREATED = "created"
BULK_STATUS_RUNNING = "running"
BULK_STATUS_DONE = "done"
BULK_STATUS_ERROR = "error"


class Lipid(models.Model):
    def lipid_file_path_generator(instance, filename):
        return f"{instance.id}.json"

    id = models.UUIDField(primary_key=True, auto_created=True, default=uuid.uuid4)
    file = models.FileField(upload_to=lipid_file_path_generator)
    name = models.CharField(max_length=255)
    level = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)


class Query(models.Model):
    id = models.UUIDField(primary_key=True, auto_created=True, default=uuid.uuid4)
    token = models.UUIDField()
    query_string = models.CharField(max_length=255)
    query_filters = models.CharField(max_length=1023, default='')
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=255, default=QUERY_STATUS_CREATED)


class QueryResult(models.Model):
    query = models.ForeignKey(Query, on_delete=models.CASCADE, related_name="results")
    lipid = models.ForeignKey(Lipid, on_delete=models.CASCADE)


class BulkQuery(models.Model):
    id = models.UUIDField(primary_key=True, auto_created=True, default=uuid.uuid4)
    token = models.UUIDField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def status(self):
        queryset = self.items.select_related("query")

        counts = queryset.values("query_status").annotate(c=Count("id"))
        status_map = {row["query_status"]: row["c"] for row in counts}

        if status_map.get(QUERY_STATUS_ERROR, 0) > 0:
            return BULK_STATUS_ERROR

        if status_map.get(QUERY_STATUS_RUNNING, 0) > 0:
            return BULK_STATUS_RUNNING

        if status_map.get(QUERY_STATUS_DONE, 0) == qs.count() and qs.exists():
            return BULK_STATUS_DONE

        return BULK_STATUS_CREATED


class BulkQueryItem(models.Model):
    bulk_query = models.ForeignKey(BulkQuery, on_delete=models.CASCADE, related_name="items")
    query = models.ForeignKey(Query, on_delete=models.CASCADE)
