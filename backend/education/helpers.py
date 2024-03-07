# helper functions
from app import processing
from education.datacube_connection import datacube_collection_retrieval
import json


def check_database():
    if True:
        return True
    else:
        return {
            "Message": "Please This service key has no database prepared; create a new database",
            "Url": "https://datacube.uxlivinglab.online/",
        }


def generate_unique_collection_name(
    existing_collection_names, base_name="template_collection"
):
    # Extract indices from existing names
    indices = [
        int(name.split("_")[-1])
        for name in existing_collection_names
        if name.startswith(base_name)
    ]
    # If no indices found, start from 1
    if not indices:
        return f"{base_name}_1"
    # Increment the highest index and generate the new name
    new_index = max(indices) + 1
    return f"{base_name}_{new_index}"


def check_if_name_exists_collection(api_key, collection_name, db_name):
    res = datacube_collection_retrieval(api_key, db_name)
    if res["success"] == True:
        if collection_name not in res["data"][0]:
            new_collection_name = generate_unique_collection_name(res["data"][0])
            return {
                "name": new_collection_name,
                "success": True,
                "Message": "New_name_generated",
                "status": "New",
            }
        else:
            return {
                "name": collection_name,
                "success": True,
                "Message": "template_generated",
                "status": "Existing",
            }
    else:
        return {
            "Message": res["message"],
            "Url": "https://datacube.uxlivinglab.online/",
        }
        
def create_process_helper(company_id, workflows, 
                          created_by, creator_portfolio, 
                          process_type, org_name,
                          workflows_ids, parent_id,
                          data_type, process_title,
                          action, email=None
                          ):
    processing.Process(company_id, workflows, 
                        created_by, creator_portfolio, 
                        process_type, org_name,
                        workflows_ids, parent_id,
                        data_type, process_title,
                        action, email)
    
