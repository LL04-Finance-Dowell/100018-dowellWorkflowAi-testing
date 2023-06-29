import unittest
from unittest.mock import patch
# from datetime import datetime, timedelta
# import sys
from app.utils.checks import time_limit_right
from django.test import TestCase, RequestFactory
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
# from rest_framework.test import APITestCase

from app.utils.mongo_db_connection import update_document_type
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

    def test_create_document_success(self):
        self.maxDiff = None
        pass
        # url = reverse(create_document)

        # data ={
        #     "company_id": "6390b313d77dc467630713f2",
        #     "created_by": "WorkflowAiedwin",
        #     "data_type": "Real_Data",
        #     "page": [
        #         "div_1"
        #     ],
        #     "content": "[[{\"1\":[{\"width\":200,\"height\":80,\"top\":12,\"topp\":\"12px\",\"left\":311,\"type\":\"TEXT_INPUT\",\"data\":\"This is a test exam\",\"raw_data\":\"<div style=\\\"text-align: center;\\\"><b style=\\\"background-color: rgba(0, 0, 0, 0); font-size: 1rem;\\\">This is a test exam</b></div><span style=\\\"font-family: &quot;Times New Roman&quot;;\\\"></span>\",\"id\":\"t1\"},{\"width\":200,\"height\":80,\"top\":114,\"topp\":\"114px\",\"left\":38,\"type\":\"TEXT_INPUT\",\"data\":\"Answer Here \",\"raw_data\":\"Answer Here&nbsp;\",\"id\":\"t2\"},{\"width\":200,\"height\":80,\"top\":112,\"topp\":\"112px\",\"left\":298,\"type\":\"TEXT_INPUT\",\"data\":\"Answer Here \",\"raw_data\":\"Answer Here&nbsp;\",\"id\":\"t3\"},{\"width\":200,\"height\":80,\"top\":110,\"topp\":\"110px\",\"left\":567,\"type\":\"TEXT_INPUT\",\"data\":\"Answer Here\",\"raw_data\":\"Answer Here\",\"id\":\"t4\"},{\"width\":200,\"height\":80,\"top\":249,\"topp\":\"249px\",\"left\":39,\"type\":\"TEXT_INPUT\",\"data\":\"Answer Here\",\"raw_data\":\"Answer Here\",\"id\":\"t5\"},{\"width\":200,\"height\":80,\"top\":248,\"topp\":\"248px\",\"left\":298,\"type\":\"TEXT_INPUT\",\"data\":\"Answer Here\",\"raw_data\":\"Answer Here\",\"id\":\"t6\"},{\"width\":200,\"height\":80,\"top\":245,\"topp\":\"245px\",\"left\":566,\"type\":\"TEXT_INPUT\",\"data\":\"Answer Here\",\"raw_data\":\"Answer Here\",\"id\":\"t7\"},{\"width\":200,\"height\":80,\"top\":893,\"topp\":\"893px\",\"left\":181,\"type\":\"TEXT_INPUT\",\"data\":\"HOD Approval\",\"raw_data\":\"<div style=\\\"text-align: center;\\\"><span style=\\\"background-color: rgba(0, 0, 0, 0); font-size: 1rem;\\\">HOD Approval</span></div>\",\"id\":\"t8\"},{\"width\":200,\"height\":80,\"top\":893,\"topp\":\"893px\",\"left\":500,\"type\":\"TEXT_INPUT\",\"data\":\"Teacher Approval\",\"raw_data\":\"<div style=\\\"text-align: center;\\\"><span style=\\\"background-color: rgba(0, 0, 0, 0); font-size: 1rem;\\\">Teacher Approval</span></div>\",\"id\":\"t9\"},{\"width\":200,\"height\":80,\"top\":1032,\"topp\":\"1032px\",\"left\":184,\"type\":\"SIGN_INPUT\",\"data\":\"Place your signature here\",\"id\":\"s1\"},{\"width\":200,\"height\":80,\"top\":1027,\"topp\":\"1027px\",\"left\":496,\"type\":\"SIGN_INPUT\",\"data\":\"Place your signature here\",\"id\":\"s2\"}]}]]"
        # }
        # request = self.factory.post(url, data)

        # with patch('app.utils.mongo_db_connection.save_document') as mock_save_document, \
        #         patch('app.utils.helpers.access_editor') as mock_access_editor:
        #     mock_save_document.return_value = '{"isSuccess": true, "inserted_id": "6390b313d77dc467630713f2"}'
        #     mock_access_editor.return_value = "https://ll04-finance-dowell.github.io/100058-dowelleditor/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9kdWN0X25hbWUiOiJ3b3JrZmxvd19haSIsImRldGFpbHMiOnsiY2x1c3RlciI6IkRvY3VtZW50cyIsImRhdGFiYXNlIjoiRG9jdW1lbnRhdGlvbiIsImNvbGxlY3Rpb24iOiJEb2N1bWVudFJlcG9ydHMiLCJkb2N1bWVudCI6ImRvY3VtZW50cmVwb3J0cyIsInRlYW1fbWVtYmVyX0lEIjoiMTE2ODkwNDQ0MzMiLCJmdW5jdGlvbl9JRCI6IkFCQ0RFIiwiX2lkIjoiNjQ5YzYzNmRmMjNiODU4MDkzYjZkNDI5IiwiZmllbGQiOiJkb2N1bWVudF9uYW1lIiwidHlwZSI6ImRvY3VtZW50IiwiYWN0aW9uIjoiZG9jdW1lbnQiLCJmbGFnIjoiZWRpdGluZyIsImNvbW1hbmQiOiJ1cGRhdGUiLCJ1cGRhdGVfZmllbGQiOnsiZG9jdW1lbnRfbmFtZSI6IiIsImNvbnRlbnQiOiIiLCJwYWdlIjoiIn19fQ.S-LGszVge6AZmfe-GYmvfCv1xw7gWauwJMxhEkLRv2w"

        # response = create_document(request)

        # data = response.data
        # document_id = data["_id"]
        # self.document_id = document_id
        # print(self.document_id)
        # print(document_id)

        # self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # self.assertEqual(len(data["editor_link"]), 672)
        # self.assertEqual(len(document_id), 24)
    

    def test_create_document_failure(self):
        url = reverse(create_document)

        request = self.factory.post(url)

        response = create_document(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"message": "Failed to process document creation."})



class DocumentDetailTestCase(BaseTestCase):

    def test_document_detail_success(self):
        document_id = self.document_id
        print(document_id)
        url = reverse(document_detail, args=[document_id])
        request = self.factory.get(url)

        # with patch('app.utils.helpers.validate_id') as mock_validate_id, \
        #         patch('app.utils.helpers.access_editor') as mock_access_editor:
        #     mock_validate_id.return_value = True
        #     mock_access_editor.return_value = "https://ll04-finance-dowell.github.io/100058-dowelleditor/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9kdWN0X25hbWUiOiJ3b3JrZmxvd19haSIsImRldGFpbHMiOnsiY2x1c3RlciI6IkRvY3VtZW50cyIsImRhdGFiYXNlIjoiRG9jdW1lbnRhdGlvbiIsImNvbGxlY3Rpb24iOiJEb2N1bWVudFJlcG9ydHMiLCJkb2N1bWVudCI6ImRvY3VtZW50cmVwb3J0cyIsInRlYW1fbWVtYmVyX0lEIjoiMTE2ODkwNDQ0MzMiLCJmdW5jdGlvbl9JRCI6IkFCQ0RFIiwiX2lkIjoiNjQxMDFkOGNkNDE3NjQ3MjNjYzhiZGE4IiwiZmllbGQiOiJkb2N1bWVudF9uYW1lIiwidHlwZSI6ImRvY3VtZW50IiwiYWN0aW9uIjoiZG9jdW1lbnQiLCJmbGFnIjoiZWRpdGluZyIsImNvbW1hbmQiOiJ1cGRhdGUiLCJ1cGRhdGVfZmllbGQiOnsiZG9jdW1lbnRfbmFtZSI6IiIsImNvbnRlbnQiOiIiLCJwYWdlIjoiIn19fQ.yZl_Lxcw0ouDUw8hssYGuArCcNZ3CFyOQ6wy9ZkTSAg"

        response = document_detail(request, document_id)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 672)


    def test_document_detail_invalid_id(self):
        document_id = "invalid_id"
        url = reverse(document_detail, args=[document_id])
        request = self.factory.get(url)

        # with patch('app.views.validate_id') as mock_validate_id:
        #     mock_validate_id.return_value = None

        response = document_detail(request, document_id)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, "Something went wrong!")


    # def test_document_detail_failure(self):
    #     document_id = CreateDocumentTestCase().test_create_document_success()
    #     url = reverse(document_detail, args=[document_id])
    #     request = self.factory.get(url)

    #     with patch('app.views.validate_id') as mock_validate_id, \
    #             patch('app.views.access_editor') as mock_access_editor:
    #         mock_validate_id.return_value = True
    #         mock_access_editor.return_value = None

    #         response = document_detail(request, document_id)

    #         self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)



class DocumentObjectTestCase(BaseTestCase):

    def test_document_object_success(self):
        document_id = self.document_id
        url = reverse(document_object, args=[document_id])
        request = self.factory.get(url)

        # with patch('app.views.validate_id') as mock_validate_id, \
        #         patch('app.views.get_document_object') as mock_get_document_object:
        #     mock_validate_id.return_value = True
        #     mock_get_document_object.return_value = {
        #         "id": document_id,
        #         "name": "My Document",
        #         "content": "Document content",
        #         "created_by": "John Doe",
        #         "company_id": "6390b313d77dc467630713f2",
        #         "data_type": "Real_Data"
        #     }

        response = document_object(request, document_id)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 18)


    def test_document_object_invalid_id(self):
        document_id = "invalid_id"
        url = reverse(document_object, args=[document_id])
        request = self.factory.get(url)

        with patch('app.utils.helpers.validate_id') as mock_validate_id:
            mock_validate_id.return_value = False

            response = document_object(request, document_id)

            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertEqual(response.data, "Something went wrong!")



class GetDocumentContentTestCase(BaseTestCase):

    def test_get_document_content_success(self):
        document_id = self.document_id
        url = reverse(get_document_content, args=[document_id])
        request = self.factory.get(url)

        # with patch('app.views.validate_id') as mock_validate_id, \
        #      patch('app.views.get_document_object') as mock_get_document_object:
        #     mock_validate_id.return_value = True
        #     mock_get_document_object.return_value = {
        #         # '[{ "1": [{"id": "scl1", "data": "testing-zainab_scale_1"}] }]'
        #         "_id": document_id,
        #         "eventId": "FB1010000000000000000000003004",
        #         "document_name": "Untitled Document",
        #         "content": "[[{\"1\":[{\"width\":547,\"height\":261,\"top\":72,\"topp\":\"72px\",\"left\":153,\"type\":\"SCALE_INPUT\",\"data\":\"testing-zainab_scale_1\",\"scale_url\":\"https://100035.pythonanywhere.com/nps-scale1/UntitledTemplate_scale5114?brand_name=WorkflowAI&product_name=editor\",\"scaleId\":\"646554edb13f12c62d789b90\",\"id\":\"scl1\",\"details\":\"Template scale\"}]}]]",
        #         "company_id": "6390b313d77dc467630713f2",
        #         "created_by": "ayoolaa_",
        #     }

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
        document_id = "invalid_id"
        url = reverse(get_document_content, args=[document_id])
        request = self.factory.get(url)

        # with patch('app.utils.helpers.validate_id') as mock_validate_id:
        #     mock_validate_id.return_value = False

        response = get_document_content(request, document_id)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, "Something went wrong!")


    def test_send_to_archive(self):
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
