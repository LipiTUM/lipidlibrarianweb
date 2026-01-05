from rest_framework import serializers

from .models import Query
from .models import QueryResult
from .models import Lipid
from .models import BulkQuery
from .models import BulkQueryItem
from .models import QUERY_STATUS_CREATED
from .models import QUERY_STATUS_RUNNING
from .models import QUERY_STATUS_DONE
from .models import QUERY_STATUS_ERROR


class LipidSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lipid
        fields = ('id', 'file', 'name', 'level', 'timestamp')
        extra_kwargs = {'timestamp': {'read_only': True, 'required': True}}


class QueryResultSerializer(serializers.ModelSerializer):
    lipid = LipidSerializer(many=False, read_only=True)

    class Meta:
        model = QueryResult
        fields = ['lipid']


class QuerySerializer(serializers.ModelSerializer):
    results = QueryResultSerializer(many=True, read_only=True)

    class Meta:
        model = Query
        fields = ('id', 'token', 'query_string', 'query_filters', 'timestamp', 'status', 'results')
        extra_kwargs = {'timestamp': {'read_only': True, 'required': True}}


class BulkQueryItemSerializer(serializers.ModelSerializer):
    query = QuerySerializer(many=False, read_only=True)

    class Meta:
        model = BulkQueryItem
        fields = ['query']


class BulkQuerySerializer(serializers.ModelSerializer):
    items = BulkQueryItemSerializer(many=True, read_only=True)
    status = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = BulkQuery
        fields = ('id', 'token', 'timestamp', 'status', 'items')
        extra_kwargs = {'timestamp': {'read_only': True, 'required': True}}

    def get_status(self, obj):
        statuses = obj.items.values_list("query__status", flat=True)

        if not statuses:
            return "EMPTY"

        if QUERY_STATUS_ERROR in statuses:
            return QUERY_STATUS_ERROR

        if QUERY_STATUS_RUNNING in statuses:
            return QUERY_STATUS_RUNNING

        if QUERY_STATUS_DONE in statuses:
            if all(s == QUERY_STATUS_DONE for s in statuses):
                return QUERY_STATUS_DONE

        return QUERY_STATUS_RUNNING
