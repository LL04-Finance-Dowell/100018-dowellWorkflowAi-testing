import unittest
from unittest.mock import patch
# from datetime import datetime, timedelta
# import sys
from app.checks import time_limit_right
from django.test import TestCase, RequestFactory
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
# from rest_framework.test import APITestCase

from app.views import (document_detail,
                       create_document,
                       document_object,
                       get_document_content,
                       archives,
                       )


class BaseTestCase(TestCase):
    factory = RequestFactory()
    document_id = None

    def setUp(self):
        self.factory = RequestFactory()
        if not self.document_id:
            # Create the document only if it hasn't been created before
            url = reverse(create_document)

            data ={
                "company_id": "6390b313d77dc467630713f2",
                "created_by": "WorkflowAiedwin",
                "data_type": "Archive_Data",
                "page": [
                    "div_1"
                ],
                "content": "[[{\"1\":[{\"width\":547,\"height\":261,\"top\":72,\"topp\":\"72px\",\"left\":153,\"type\":\"SCALE_INPUT\",\"data\":\"testing-zainab_scale_1\",\"scale_url\":\"https://100035.pythonanywhere.com/nps-scale1/UntitledTemplate_scale5114?brand_name=WorkflowAI&product_name=editor\",\"scaleId\":\"646554edb13f12c62d789b90\",\"id\":\"scl1\",\"details\":\"Template scale\"}]}]]"
            }
            request = self.factory.post(url, data)
            response = create_document(request)
            self.document_id = response.data["_id"]


class CreateDocumentTestCase(BaseTestCase):
    """Document creation test suite"""
    def test_create_document_success(self):
        self.maxDiff = None
        pass

    def test_create_document_failure(self):
        """Unsuccessful document creation due to invalid/no data"""
        url = reverse(create_document)

        request = self.factory.post(url)

        response = create_document(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"message": "Failed to process document creation."})


class DocumentDetailTestCase(BaseTestCase):
    """Document Details test suite"""

    def test_document_detail_success(self):
        """Successful document retrieval"""
        document_id = self.document_id
        print(document_id)
        url = reverse(document_detail, args=[document_id])
        request = self.factory.get(url)

        response = document_detail(request, document_id)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 672)

    def test_document_detail_invalid_id(self):
        """Unsuccessful document detail retrieval due to invalid document_id"""
        document_id = "invalid_id"
        url = reverse(document_detail, args=[document_id])
        request = self.factory.get(url)

        response = document_detail(request, document_id)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, "Something went wrong!")


class DocumentObjectTestCase(BaseTestCase):
    """Document object test suite"""

    def test_document_object_success(self):
        """Successful document object retrieval"""
        document_id = self.document_id
        url = reverse(document_object, args=[document_id])
        request = self.factory.get(url)

        response = document_object(request, document_id)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 18)


    def test_document_object_invalid_id(self):
        """Unsuccessful document object retrieval (invalid id)"""
        document_id = "invalid_id"
        url = reverse(document_object, args=[document_id])
        request = self.factory.get(url)

        response = document_object(request, document_id)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, "Something went wrong!")


class GetDocumentContentTestCase(BaseTestCase):
    """Document content test suite"""

    def test_get_document_content_success(self):
        """Successful document content retrieval"""
        document_id = self.document_id
        url = reverse(get_document_content, args=[document_id])
        request = self.factory.get(url)

        response = get_document_content(request, document_id)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [
            {
                "1": [
                    {
                        "id": "scl1",
                        "data": "testing-zainab_scale_1",
                    }
                ]
            }
        ])


    def test_get_document_content_invalid_id(self):
        """Unsuccessful document retrieval (invalid id)"""
        document_id = "invalid_id"
        url = reverse(get_document_content, args=[document_id])
        request = self.factory.get(url)

        response = get_document_content(request, document_id)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, "Something went wrong!")


    def test_send_to_archive(self):
        """Send document to archive (Archive_Data)"""
        document_id = self.document_id

        url = reverse(archives)
        data = {
            "item_id": document_id,
            "item_type": "document"
        }
        request = self.factory.post(url, data)

        response = archives(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, "Document moved to archives")



if __name__ == '__main__':
    unittest.main()
