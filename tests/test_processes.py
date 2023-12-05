from rest_framework import status
from tests.config import TestConfig
from urllib.parse import urlparse



class DocumentOrTemplateProcessingTests(TestConfig):
    def test_post_missing_data(self):
        response = self.client.post(self.process_creation_url, {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_post_save_workflow_to_document_and_save_to_drafts(self):
        mock_request_data = {
            "workflows": "",
            "created_by": self.sample_user,
            "creator_portfolio": "Sample Portfolio",
            "company_id":self.sample_company_id,
            "process_type": "document",
            "org_name": "Workflow",
            "workflows_ids": "",
            "parent_id": self.sample_document_id,
            "data_type": "some_type",
            "process_title": "Test Process",
            'action': 'save_workflow_to_document_and_save_to_drafts',
        }
        
        response = self.client.post(self.process_creation_url, data=mock_request_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data, "Process Saved in drafts.")
     

class ProcessTests(TestConfig):
    def test_get_invalid_request(self):
        response = self.client.get(self.get_invalid_process)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, "Invalid Request!")

    def test_a_valid_request(self):
        response = self.client.get(self.get_process_url, {
            "data_type":"Real_Data",
            "process_state":"processing"
        })

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_process_missing(self):
        response = self.client.get(self.get_process_url, {
            "data_type":"Real_Data",
        })

        self.assertEqual(response.status_code, status.HTTP_200_OK)

class ProcessDetailTests(TestConfig):
    def test_invalid_process_id(self):
        response = self.client.get(self.get_invalid_process_detail)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, "Something went wrong!")
        
    def test_valid_process_id(self):
        response = self.client.get(self.get_process_detail)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        


class ProcessLinkTests(TestConfig):
    def test_invalid_process_id(self):
        response = self.client.post(self.get_invalid_process_link)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, "Verification link unavailable")
        
    def test_valid_process_id_unauthorized_user(self):
        response = self.client.post(self.get_process_link, data={"user_name":self.sample_user})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data,  "user is not part of this process")

    def test_valid_process_id_authorized_user(self):
        response = self.client.post(self.get_process_link, data={"user_name":"lA4zWMfcsV3T"})
        parsed_url = urlparse(response.data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(parsed_url.scheme and parsed_url.netloc)


# TODOS
class ProcessVerificationTests(TestConfig):
    pass

class FinalizeOrRejectTests(TestConfig):
    finalize_data = {
        "action":"finalized",
        "authorized":"sJdxBvEJX9Hw",
        "company_id":"64ecb08a3033b00f16a496f4",
        "item_id":"654359e7d123a46bf70d435e",
        "item_type":"clone",
        "role":"Understand the Doc",
        "user_type":"public"
    }
    
    def test_rejected_with_no_message(self):
        self.finalize_data["action"] = "rejected"
        response = self.client.post(self.finalize_process, data= self.finalize_data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data,"provide a reason for rejecting the document")
        

class TriggerProcessTests(TestConfig):
    def test_invalid_process_id(self):
        request_data = {
            "process_id": "invalid_id",
        }        
        
        response = self.client.post(self.trigger_process, data=request_data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, "something went wrong!")

    def test_unauthorized_user(self):
        request_data = {
            "process_id": self.sample_process_id,
            "user_name": "unauthorized_user",
            "processing_state":"state",
            "action":"halt_process"
        }
        
        response = self.client.post(self.trigger_process, data=request_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data, "User Unauthorized")


    def test_halt_process_not_paused(self):
        request_data = {
            "process_id": self.sample_process_id,
            "user_name": "mayorisaac",
            "processing_state":"state",
            "action":"halt_process"
        }
     
        response = self.client.post(self.trigger_process, data=request_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, "Process has been paused until manually resumed!")


    # Discussion to be held 
    '''
    def test_process_draft_not_processing(self):
        request_data = {
            "process_id": self.sample_process_id,
            "user_name": "mayorisaac",
            "processing_state":"state",
            "action": "process_draft",
        }
        
        response = self.client.post(self.trigger_process, data=request_data)
        parsed_url = urlparse(response.data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(parsed_url.scheme and parsed_url.netloc)

    '''

class ProcessImportTests(TestConfig):
    pass
