from algoliasearch.search_client import SearchClient
from .models import FavoriteWorkflow, FavoriteDocument, FavoriteTemplte


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


def save_to_algolia(identifier, func):
    # get_search_result = get_wf_list(company_id)+get_document_list(company_id)+get_template_list(company_id)
    data = func(identifier)
    index.save_object(data, {"autoGenerateObjectIDIfNotExist": True}).wait()



def get_algolia_data(term, comp_id):
    index.set_settings({"attributesForFaceting": ["company_id"]})
    filters = "company_id:" + comp_id
    results = index.search(
        term,
        {
            "attributesToHighlight": [],
            "filters": filters,
        },
    )
    return results["hits"]


def get_fav_data(term, comp_id):
    favorited.set_settings({"attributesForFaceting": ["company_id"]})
    filters = "company_id:" + comp_id
    results = favorited.search(
        term,
        {
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
