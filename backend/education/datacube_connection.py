import json
import requests

from education.constants import DB_API, DB_API_CRUD

headers = {"Content-Type": "application/json"}


def post_to_data_service(url: str, data: dict):
    """posts data to an API endpoint

    Args:
        url (str): api endpoint
        data (dict): data to post

    Returns:
        dict: json response
    """
    response = requests.post(url=url, data=data, headers=headers)
    return json.loads(response.text)


def create_db(options):
    """Creates a new database entity

    Args:
        options (_type_): _description_
    """


def add_collection_to_database(
    api_key: str,
    database: str,
    collections: str,
    num_of_collections=1,
):
    """adds collection(s) to a database

    Args:
        api_key (str): API key
        database (str): database name
        collections (str): comma separated list of collection names to be created
        num_of_collections (int): number of collcctions to be added
    """
    url = f"{DB_API}/add_collection/"

    payload = json.dumps(
        {
            "api_key": api_key,
            "db_name": database,
            "coll_names": collections,
            "num_collections": num_of_collections,
        }
    )

    response = post_to_data_service(url=url, data=payload)
    return response


def get_data_from_collection(
    api_key: str, database: str, collection: str, filters: dict = {}, limit=5, offset=0
):
    """_summary_

    Args:
        api_key (str): the API key
        database (str): database name
        collection (str): collection name
        filters (dict): a dictionary of all the filter parameters
        limit (int, optional): max number of results per page. Defaults to 5.
        offset (int, optional): page number . Defaults to 0.
    """
    url = f"{DB_API}/get_data/"

    payload = {
        "api_key": api_key,
        "db_name": database,
        "coll_name": collection,
        "operation": "fetch",
        "filters": filters,
        "limit": limit,
        "offset": offset,
    }

    response = requests.post(url, json=payload)
    res = json.loads(response.text)
    return res


def post_data_to_collection(
    api_key: str,
    database: str,
    collection: str,
    data: dict,
    operation: str,
    query: dict = None,
):
    payload_dict = {
        "api_key": api_key,
        "db_name": database,
        "coll_name": collection,
        "operation": operation,
    }
    if operation.lower() == "insert":
        payload_dict["data"] = data
        payload = payload_dict
    elif operation.lower() == "update":
        payload_dict["update_data"] = data
        payload_dict["query"] = query
        payload = payload_dict
        response = requests.put(DB_API_CRUD, json=payload)
        return response
    elif operation.lower() == "delete":
        payload_dict["query"] = query
        payload = payload_dict
        response = requests.delete(DB_API_CRUD, json=payload)
        return
    # print(payload)
    response = requests.post(DB_API_CRUD, json=payload)
    res = json.loads(response.text)
    # print(res)
    return res


def datacube_collection_retrieval(api_key, db_name):
    """
    Retrieve a list of collections in the DataCube database.

    :param api_key: The API key for authentication.
    :param db_name: The name of the database.
    :return: The response text from the server.
    """
    url = "https://datacube.uxlivinglab.online/db_api/collections/"
    payload = {"api_key": api_key, "db_name": db_name, "payment": False}
    response = requests.get(url, json=payload)
    res = json.loads(response.content)
    print("payload: ", payload)
    return res


def Template_database():
    pass


def save_to_metadata(api_key: str, collection_id: str, db_name: str, data: dict):
    return post_data_to_collection(
        api_key,
        database=db_name,
        collection=collection_id,
        data=data,
        operation="insert",
    )


def save_to_workflow_collection(
    api_key: str, collection_id: str, db_name: str, data: dict
):
    return post_data_to_collection(
        api_key,
        database=db_name,
        collection=collection_id,
        data=data,
        operation="insert",
    )


def get_workflow_from_collection(
    api_key: str,
    database: str,
    collection: str,
    filters={},
):
    return get_data_from_collection(api_key, database, collection, filters, limit=1)


def save_to_process_collection(
    api_key: str, database: str, collection: str, data: dict
):
    return post_data_to_collection(api_key, database, collection, data, "insert")


def update_process_collection(process_id: str, api_key: str, database: str, collection: str, data: dict):
    query = {"_id": process_id}
    return post_data_to_collection(
        api_key, database, collection, data, "update", query
    )


def get_process_from_collection(
    api_key: str, database: str, collection: str, filters: dict
):
    return get_data_from_collection(api_key, database, collection, filters, limit=1)


def save_to_document_collection(
    api_key: str, database: str, collection: str, data: dict
):
    return post_data_to_collection(api_key, database, collection, data, "insert")


def get_clones_from_collection(
    api_key: str, database: str, collection: str, filters: dict
):
    return get_data_from_collection(api_key, database, collection, filters)


def get_clone_from_collection(
    api_key: str, database: str, collection: str, filters: dict
):
    return get_data_from_collection(api_key, database, collection, filters, limit=1)


def get_documents_from_collection(
    api_key: str, database: str, collection: str, filters: dict
):
    return get_data_from_collection(api_key, database, collection, filters)


def get_document_from_collection(
    api_key: str, database: str, collection: str, filters: dict
):
    return get_data_from_collection(api_key, database, collection, filters, limit=1)


def get_template_from_collection(
    api_key: str, database: str, collection: str, filters: dict
):
    return get_data_from_collection(api_key, database, collection, filters)

def get_workflows_from_collection(
    api_key: str, database: str, collection: str, filters: dict
):
    return get_data_from_collection(api_key, database, collection, filters)


def get_folders_from_collection(
    api_key: str, database: str, collection: str, filters: dict
):
    return get_data_from_collection(api_key, database, collection, filters)

def get_folder_from_collection(
    api_key: str, database: str, collection: str, filters: dict
):
    return get_data_from_collection(api_key, database, collection, filters, limit=1)

def save_to_folder_collection(
    api_key: str, database: str, collection: str, data: dict
):
    return post_data_to_collection(api_key, database, collection, data, "insert")
