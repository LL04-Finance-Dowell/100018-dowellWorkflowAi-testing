from rest_framework import status
from urllib.parse import urlparse
from tests.config import TestConfig
from urllib.parse import urlparse


class NewTemplateTestCase(TestConfig):
    
    def test_valid_post_request(self):
        # Create a mock request
        mock_request_data = {
            "company_id": self.sample_company_id,
            "portfolio": self.sample_portfolio,
            "created_by": self.sample_user,
            "data_type": "data_type",
            
        }

        response = self.client.post(self.create_template_url, data=mock_request_data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('editor_link', response.data)
        self.assertIn('_id', response.data)


    def test_invalid_company_id(self):
        mock_request_data = {
            "company_id": "invalid_id_here",
        }

        response = self.client.post(self.create_template_url, data=mock_request_data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, "Invalid company details")


class TemplateViewTest(TestConfig):
    def test_get_templates_with_valid_parameters(self):

        # Make a GET request to the view with valid query parameters
        response = self.client.get(
            self.list_teplates_url, 
            {
                "data_type":"Real Data",
                "member":self.sample_user,
                "template_state":"state", 
                "porfolio":self.sample_portfolio
            })

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('templates', response.data)
        self.assertIsInstance(response.data['templates'], list)
        
    
class TemplateLinkTest(TestConfig):
    def test_valid_template_id(self):

        response = self.client.get(self.get_template_link)
        editor_link = urlparse(response.data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data.startswith('http'))  
        self.assertTrue(editor_link.scheme and editor_link.netloc)


    def test_invalid_template_id(self):
        response = self.client.get(self.get_invalid_template_link)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, "Something went wrong!")

 
class TemplateDetailViewTest(TestConfig):
    def test_get_template_detail_valid_id(self):

        response = self.client.get(self.get_template_detail)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('template_name', response.data)  

