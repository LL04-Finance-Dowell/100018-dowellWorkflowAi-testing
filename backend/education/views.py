from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .datacube_connection import (
    add_collection_to_database,
    get_data_from_collection,
    post_data_to_collection
)

class DBCollectionManagement(APIView):
    def post(self, request):
        """
        Add collection(s) to a database.
        """
        api_key = request.data.get('api_key')
        database = request.data.get('database')
        collections = request.data.get('collections')
        num_of_collections = request.data.get('num_of_collections')
        
        response = add_collection_to_database(
            api_key=api_key,
            database=database,
            collections=collections,
            num_of_collections=num_of_collections
        )
        
        return Response(response, status.HTTP_201_CREATED)

class CollectionData(APIView):
    """
    Get data from a collection.
    """
    def get(self, request):
        api_key = request.query_params.get('api_key')
        database = request.query_params.get('database')
        collection = request.query_params.get('collection')
        filters = request.query_params.get('filters')
        limit = int(request.query_params.get('limit', 5))
        offset = int(request.query_params.get('offset', 0))
        
        response = get_data_from_collection(
            api_key=api_key,
            database=database,
            collection=collection,
            filters=filters,
            limit=limit,
            offset=offset
        )
        
        return Response(response, status.HTTP_200_OK)
    
    def post(self, request):
        """
        Insert data into a collection.
        """
        api_key = request.data.get('api_key')
        database = request.data.get('database')
        collection = request.data.get('collection')
        data = request.data.get('data')
        
        response = post_data_to_collection(
            api_key=api_key,
            database=database,
            collection=collection,
            data=data,
            operation='insert'
        )
        
        return Response(response, status=status.HTTP_201_CREATED)  
    
    def put(self, request):
        """
        Update data in a collection.
        """
        api_key = request.data.get('api_key')
        database = request.data.get('database')
        collection = request.data.get('collection')
        data = request.data.get('data')
        query = request.data.get('query')
        
        response = post_data_to_collection(
            api_key=api_key,
            database=database,
            collection=collection,
            data=data,
            operation='update',
            query=query
        )
        
        return Response(response, status.HTTP_200_OK)
    
    def delete(self, request):
        """
        Delete data from a collection.
        """
        api_key = request.data.get('api_key')
        database = request.data.get('database')
        collection = request.data.get('collection')
        query = request.data.get('query')
        
        response = post_data_to_collection(
            api_key=api_key,
            database=database,
            collection=collection,
            operation='delete',
            query=query
        )
        
        return Response(response, status=status.HTTP_200_OK)
    
