from rest_framework import serializers

from .models import Query
from .models import QueryResult
from .models import Lipid
from .models import LipidSource
from .models import BulkQuery
from .models import BulkQueryItem
from .models import QUERY_STATUS_CREATED
from .models import QUERY_STATUS_RUNNING
from .models import QUERY_STATUS_DONE
from .models import QUERY_STATUS_ERROR


class LipidSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = LipidSource
        fields = ("source",)


class LipidSerializer(serializers.ModelSerializer):
    sources = LipidSourceSerializer(many=True, read_only=True)

    class Meta:
        model = Lipid
        fields = ('id', 'file', 'name', 'level', 'timestamp', 'sources')
        extra_kwargs = {'timestamp': {'read_only': True, 'required': True}}


class QuerySerializer(serializers.ModelSerializer):
    results = serializers.SerializerMethodField(read_only=True)
    type = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Query
        fields = ('id', 'type', 'token', 'query_string', 'query_filters', 'timestamp', 'status', 'results')
        extra_kwargs = {'timestamp': {'read_only': True, 'required': True}}

    def get_type(self, obj):
        return "query"

    def get_results(self, obj):
        return LipidSerializer([qr.lipid for qr in obj.results.all()], many=True).data



class BulkQuerySerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField(read_only=True)
    type = serializers.SerializerMethodField(read_only=True)
    items = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = BulkQuery
        fields = ('id', 'type', 'token', 'timestamp', 'status', 'items')
        extra_kwargs = {'timestamp': {'read_only': True, 'required': True}}
    
    def get_type(self, obj):
        return "bulk"
    
    def get_items(self, obj):
        # flatten the nested BulkQueryItem
        return [QuerySerializer(item.query).data for item in obj.items.all()]

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
