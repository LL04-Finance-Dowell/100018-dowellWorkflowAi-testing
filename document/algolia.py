# hello_algolia.py
from algoliasearch.search_client import SearchClient
from database.mongo_db_connection import (
    get_wf_list,
    get_document_list,
    get_template_list,
)
# Connect and authenticate with your Algolia app
client = SearchClient.create("N7KJ4AQQ7Z", "9514747f86dce7e94cc5a2d56677e8e8")
index = client.init_index("workflow_index")
index.set_settings(
   {'searchableAttributes': ['document_name', 'template_name','workflows,workflow_title']
})
# Create a new index and add a record

#             {"objectID":2, "name": "dev_record","address": "ababa"}
# ]
def save_to_algolia(data):
    # get_search_result = get_wf_list(company_id)+get_document_list(company_id)+get_template_list(company_id)
    index.save_object(data,{'autoGenerateObjectIDIfNotExist': True}).wait()

def get_algolia_data(term):
    # index.clear_objects()
    # get_search_result = get_wf_list("6385c0f38eca0fb652c94585")+get_document_list("6385c0f38eca0fb652c94585")+get_template_list("6385c0f38eca0fb652c94585")
    # save_to_algolia("6385c0f38eca0fb652c94585")            
    # # # # # print(get_search_result)
    # index.save_objects(get_search_result,{'autoGenerateObjectIDIfNotExist': True}).wait()
    # # # ,{'searchableAttributes': [ 'document_name', 'template_name',"workflow_title"]}

    

    results = index.search(term,{
                 # 'restrictSearchableAttributes':  [ 'document_name', 'template_name',"workflow_title"],
                 'attributesToHighlight': []
                 })
    return results['hits']

