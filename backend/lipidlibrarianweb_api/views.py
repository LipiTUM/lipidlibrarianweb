import io
import threading
from gtts import gTTS
from rdkit import Chem
from rdkit.Chem import Draw
from urllib.parse import unquote

from django.http import FileResponse
from django.shortcuts import get_object_or_404
from django.db import transaction
from django_q.tasks import async_task
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.decorators import renderer_classes

from .tasks import duplicate_query
from .tasks import execute_query
from .renderers import PNGRenderer
from .renderers import MP3Renderer
from .models import Query
from .models import Lipid
from .models import BulkQuery
from .models import BulkQueryItem
from .models import QUERY_STATUS_DONE
from .serializers import QuerySerializer
from .serializers import LipidSerializer
from .serializers import BulkQuerySerializer
from .serializers import BulkQueryCreateSerializer


class QueryView(APIView):
    """
    QueryView is the API endpoint for interactions with queries. It is generally used to obtain or
    modify information of all queries associated with a token.
    """

    def get(self, request, *args, **kwargs):
        """
        Get all queries from the database for a given token.

        :param request: A GET request containing the session token
        :returns: A JSON formatted list of the queries associated to this token, or an empty JSON dict
        """
        queryset = Query.objects.filter(token=request.GET.get('token'))
        query_serializer = QuerySerializer(queryset, many=True)
        return Response(query_serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """
        Start the querying of lipids.

        :param request: A form request containing the query string and a session token
        :returns: the created query database entry, or a bad request negative status code
        """
        query_data = {
            "query_string": request.POST.get('query_string'),
            "query_filters": request.POST.get('query_filters'),
            "token": request.POST.get('token'),
        }
        query_serializer = QuerySerializer(data=query_data)
        if query_serializer.is_valid():
            query = query_serializer.save()
            queryset = Query.objects.filter(query_string=query.query_string, query_filters=query.query_filters, status=QUERY_STATUS_DONE)
            if queryset:
                # query has already been executed; duplicating...
                existing_query = queryset.first()
                async_task("lipidlibrarianweb_api.tasks.duplicate_query", query.id, existing_query.id)
            else:
                # query has not already been executed; querying...
                async_task("lipidlibrarianweb_api.tasks.execute_query", query.id)
            return Response(query_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(query_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BulkQueryView(APIView):
    def get(self, request, *args, **kwargs):
        """
        Get all bulk queries from the database for a given token.

        :param request: A GET request containing the session token
        :returns: A JSON formatted list of the bulk queries associated to this token, or an empty JSON dict
        """
        queryset = BulkQuery.objects.filter(token=request.GET.get('token'))
        bulk_query_serializer = BulkQuerySerializer(queryset, many=True)
        return Response(bulk_query_serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """
        Submit multiple query tasks as a bulk query.
        """
        serializer = BulkQueryCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        token = serializer.validated_data["token"]
        queries_data = serializer.validated_data["queries"]

        with transaction.atomic():
            bulk_query = BulkQuery.objects.create(token=token)

            for item in queries_data:
                queryset = Query.objects.filter(
                    query_string=item.query_string,
                    query_filters=item.query_filters,
                    status=QUERY_STATUS_DONE
                )
                if queryset:
                # query has already been executed; duplicating...
                    existing_query = queryset.first()
                    query = Query.objects.create(
                        token=token,
                        query_string=item["query_string"],
                        query_filters=item.get("query_filters", "")
                    )

                    BulkQueryItem.objects.create(
                        bulk_query=bulk_query,
                        query=query
                    )

                    async_task(
                        "lipidlibrarianweb_api.tasks.duplicate_query",
                        query.id,
                        existing_query.id
                    )
                else:
                    # query has not already been executed; querying...
                    query = Query.objects.create(
                        token=token,
                        query_string=item["query_string"],
                        query_filters=item.get("query_filters", "")
                    )

                    BulkQueryItem.objects.create(
                        bulk_query=bulk_query,
                        query=query
                    )

                    async_task("lipidlibrarianweb_api.tasks.execute_query", query.id)

        return Response(
            BulkQuerySerializer(bulk_query).data,
            status=status.HTTP_201_CREATED
        )


@api_view(['GET', 'DELETE'])
def get_query(request, query_id):
    query = get_object_or_404(Query, id=query_id)
    
    if request.method == 'DELETE':
        query.delete()
        return Response(status=status.HTTP_200_OK)

    if request.method == 'GET':
        return Response(
            QuerySerializer(query).data,
            status=status.HTTP_200_OK
        )


@api_view(['GET', 'DELETE'])
def get_bulk_query(request, bulk_query_id):
    bulk_query = get_object_or_404(BulkQuery, id=bulk_query_id)

    if request.method == 'DELETE':
        bulk_query.delete()
        return Response(status=status.HTTP_200_OK)
    
    if request.method == 'GET':
        return Response(
            BulkQueryStatusSerializer(bulk_query).data,
            status=status.HTTP_200_OK
        )


@api_view(['GET'])
def lipid(request, lipid_id):
    lipid = get_object_or_404(Lipid, id=lipid_id)
    return FileResponse(lipid.file.open())


@api_view(['GET'])
@renderer_classes([PNGRenderer])
def preview(request, structure_identifier: str):
    structure_identifier = unquote(structure_identifier)

    if structure_identifier.startswith('InChI'):
        m = Chem.MolFromInchi(structure_identifier)
    else:
        m = Chem.MolFromSmiles(structure_identifier)

    img_bytes = io.BytesIO()
    img = Draw.MolToImage(m, size=(1000, 650), fitImage=True)
    img.save(img_bytes, format='PNG')
    return Response(img_bytes.getvalue())


@api_view(['GET'])
@renderer_classes([MP3Renderer])
def speak(request, text):
    audio_bytes = io.BytesIO()
    lipid_description = gTTS(text=unquote(text), lang='en', slow=False)
    lipid_description.write_to_fp(audio_bytes)
    return Response(audio_bytes.getvalue())


@api_view(['GET'])
def debug_lipid(request):
    queryset = Lipid.objects.all()
    lipid_serializer = LipidSerializer(queryset, many=True)
    return Response(lipid_serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def debug_query(request):
    queryset = Query.objects.all()
    query_serializer = QuerySerializer(queryset, many=True)
    return Response(query_serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def debug_bulk_query(request):
    queryset = BulkQuery.objects.all()
    bulk_query_serializer = BulkQuerySerializer(queryset, many=True)
    return Response(bulk_query_serializer.data, status=status.HTTP_200_OK)
