# hello_algolia.py
from algoliasearch.search_client import SearchClient
from .models import FavoriteWorkflow,FavoriteDocument,FavoriteTemplte
from database.mongo_db_connection import (
    get_document_object,
    get_wf_object,
    get_template_object,
)
# import jsonfield
# from django.db import models

# Connect and authenticate with your Algolia app
client = SearchClient.create("N7KJ4AQQ7Z", "9514747f86dce7e94cc5a2d56677e8e8")
index = client.init_index("workflow_index")
index.set_settings(
    {
        "searchableAttributes": [
            "_id",
            "document_name",
            "template_name",
            "workflows,workflow_title",
        ]
    }
)

favorited = client.init_index("Favorite")
favorited.set_settings(
    {
        "searchableAttributes": [
            "favorite",
            "_id",
            "document_name",
            "template_name",
            "workflows,workflow_title",
        ]
    }
)

# Create a new index and add a record

#             {"objectID":2, "name": "dev_record","address": "ababa"}
# ]
# class FavoriteData(models.Model):
#     data = jsonfield.JSONField()
#     # data_type= models.TextField(max_length=50,default=None)


def save_to_algolia(identifier, func):
    # get_search_result = get_wf_list(company_id)+get_document_list(company_id)+get_template_list(company_id)
    data = func(identifier)
    index.save_object(data, {"autoGenerateObjectIDIfNotExist": True}).wait()
    
def save_as_favorite(identifier, type):
    # data['favorite']=True
    # data['type']=type
    if type=="workflow":
        data=get_wf_object(identifier)
        model=FavoriteWorkflow(**data)
        model.save()
    if type=="document":
        data=get_document_object(identifier)
        data['content']=eval(data['content'])
        model=FavoriteDocument(**data)
        model.save()
    if type=="template":
        data=get_template_object(identifier)
        data['content']=eval(data['content'])

        model=FavoriteTemplte(**data)
        model.save()
        
def get_algolia_data(term, comp_id):
    index.set_settings({
        "attributesForFaceting": ["company_id"]
        })
    filters = "company_id:" + comp_id
    results = index.search(
        term,
        {
            # 'restrictSearchableAttributes':  [ 'document_name', 'template_name',"workflow_title"],
            "attributesToHighlight": [],
            "filters": filters,
        },
    )
    return results["hits"]

def get_fav_data(term, comp_id):
    favorited.set_settings({
        "attributesForFaceting": ["company_id"]
        })
    filters = "company_id:" + comp_id
    results = favorited.search(
        term,
        {
            # 'restrictSearchableAttributes':  [ 'document_name', 'template_name',"workflow_title"],
            "attributesToHighlight": [],
            "filters": filters,
        },
    )
    return results["hits"]
def update_from_algolia(payload):
    try:
        data = get_algolia_data(payload["_id"], payload["company_id"])
        payload["objectID"] = data[0]["objectID"]
        index.partial_update_object(payload)

    except:
        index.save_object(payload, {"autoGenerateObjectIDIfNotExist": True})


