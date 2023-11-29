from rest_framework import status
from django.urls import reverse
from urllib.parse import urlparse
from tests.config import TestConfig


class NewDocumentViewTestCase(TestConfig):
    def test_create_new_document(self):
        data = {
            "company_id": self.sample_company_id,
            "created_by": self.sample_user,
            "data_type": "Real_Data",
            "template_id": self.sample_template_id,
            "portfolio": "Workflow AI",
            "page": ["div_1"],
            "content": "Test Content",
        }
        response = self.client.post(self.doc_creation_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("editor_link", response.data)
        self.assertIn("_id", response.data)

    def test_create_new_document_failure(self):
        # Missing request data
        response = self.client.post(self.doc_creation_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data, {"message": "Failed to process document creation."}
        )


class DocumentsViewTestCase(TestConfig):
    def test_invalid_request(self):
        # Sending a request with missing data_type parameter to simulate an invalid request
        response = self.client.get(self.get_docs_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, "Invalid Request!")

    def test_document_list_mobile_source(self):
        pass

    def test_document_list_other_sources(self):
        # Sending a request with the params
        response = self.client.get(
            self.get_docs_url,
            {
                "data_type": "some_type",
                "document_state": "some_state",
                "member": "some_member",
                "portfolio": "some_portfolio",
                "source": "web",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class DocumentLinkViewTestCase(TestConfig):
    def test_invalid_document_id(self):
        url = reverse(
            "document_link", kwargs={"document_id": "invalid_id"}
        )  # Replace 'document_link' with your actual URL name
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, "Something went wrong!")

    def test_valid_document_id(self):
        response = self.client.get(self.doc_link_url)
        parsed_url = urlparse(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(parsed_url.scheme and parsed_url.netloc)


class DocumentDetailViewTestCase(TestConfig):
    def test_invalid_item_id(self):
        invalid_item_id = "invalid_id"
        url = reverse("document_detail", kwargs={"item_id": invalid_item_id})
        response = self.client.get(url, {"document_type": "document"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, "Something went wrong!")

    def test_valid_item_id(self):
        response = self.client.get(self.doc_detail_url, {"document_type": "document"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
