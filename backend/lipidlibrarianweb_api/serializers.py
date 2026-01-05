from rest_framework import serializers

from .models import Query
from .models import QueryResult
from .models import Lipid
from .models import BulkQuery
from .models import BulkQueryItem


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

    class Meta:
        model = BulkQuery
        fields = ('id', 'token', 'timestamp', 'items')
        extra_kwargs = {'timestamp': {'read_only': True, 'required': True}}
