from rest_framework import status
from django.urls import reverse
from tests.config import TestConfig



class NewWorkflowTests(TestConfig):
    def test_create_new_workflow_missing_data(self):
        # Make POST request with missing data
        response = self.client.post(self.workflow_creation_url, data={}, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, "Workflow Data required")
    
    def test_create_new_workflow_success(self):
        request_data = {
            "wf_title": "Test Workflow",
            "steps": ["Step 1", "Step 2"],
            "company_id": 1,
            "created_by": "John Doe",
            "portfolio": "Some Portfolio",
            "data_type": "Some Data Type",
        }

        response = self.client.post(self.workflow_creation_url, data=request_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["workflows"]["workflow_title"], "Test Workflow")
        self.assertEqual(response.data["creator_portfolio"], "Some Portfolio")


class WorkflowTests(TestConfig):
    def test_get_workflows_success(self):
        data_type = "Some Data Type"
        response = self.client.get(f"{self.get_workflows_url}?data_type={data_type}")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_workflows_failure(self):
        # Make GET request with no data type
        response = self.client.get(self.get_workflows_url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, "Invalid Request!")

 