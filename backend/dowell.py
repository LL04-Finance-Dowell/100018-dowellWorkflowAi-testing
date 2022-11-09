import json
from .dowellconnection import dowellconnection


def get_document_list(company_id):
    fields = {"company_id": str(company_id)}
    response_obj = dowellconnection(
        "Documents",
        "bangalore",
        "Documentation",
        "DocumentReports",
        "documentreports",
        "11689044433",
        "ABCDE",
        "fetch",
        fields,
        "nil",
    )
    res_obj = json.loads(response_obj)
    if len(res_obj["data"]):
        return res_obj["data"]
    else:
        return []


print(get_document_list(6))
