import uuid

from django.db import models


QUERY_STATUS_CREATED = "created"
QUERY_STATUS_RUNNING = "running"
QUERY_STATUS_DONE = "done"
QUERY_STATUS_ERROR = "error"


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
