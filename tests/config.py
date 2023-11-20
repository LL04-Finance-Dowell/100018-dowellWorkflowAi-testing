from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework.test import APIClient
from rest_framework.test import APIRequestFactory


class TestConfig(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.factory = APIRequestFactory()

        #sample variables
        self.sample_user = "MorvinIan"
        self.sample_company_id = "64ecb08a3033b00f16a496f4"
        self.sample_template_id = "6518275e8dfcad1f6faa5eb4"
        self.sample_document_id = "6523c0c9318bb2857ffd53b6"
        self.sample_portfolio = "Workflow AI"

        # documents api urls
        self.doc_creation_url = reverse('documents')
        self.doc_link_url = reverse('document_link', kwargs={"document_id":self.sample_document_id})
        self.doc_detail_url = reverse('document_detail', kwargs={"item_id":self.sample_document_id})
        self.get_docs_url  = reverse('get_documents', kwargs={'company_id': self.sample_company_id})   

        # Workflow api urls
        self.workflow_creation_url = reverse('create-workflow')
        self.get_workflows_url = reverse('get-workflows',  kwargs={'company_id': self.sample_company_id})

     

        return super().setUp()
    
    
    def tearDown(self):
        return super().tearDown()