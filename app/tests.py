import unittest
from datetime import datetime, timedelta
import sys
from app.utils.checks import time_limit_right
from rest_framework.test import APIClient, APIRequestFactory, APITestCase
from django.test import TestCase, RequestFactory
from django.urls import reverse
from rest_framework import status
from django.test import Client
from unittest.mock import patch
from . views import *


class ProcessTest(APITestCase):
    """Test module for the Process"""

    def test_create_a_valid_process(self):
        pass

    def test_create_an_ivalid_process(self):
        pass

    def test_verify_a_valid_process(self):
        pass

    def test_verify_an_invalid_process(self):
        pass

    def test_finalize_a_valid_document_processing(self):
        pass

    def test_reject_a_valid_document_processing(self):
        pass

    def test_reject_an_ivalid_document_processing(self):
        pass


class CreateTemplateTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_create_template_success(self):
        url = reverse('create_template')

        data = {
            "created_by": "WorkflowAiedwin",
            "company_id": "6390b313d77dc467630713f2",
            "data_type": "Real_Data"
        }
        request = self.factory.post(url, data)


        with patch('app.views.create_template') as mock_create_template:
            mock_create_template.return_value = {"editor_link": "example_link", "_id": "example_id"}

            response = create_template(request)

            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            self.assertIn('editor_link', response.data)
            self.assertIn('_id', response.data)

    def test_create_template_invalid_company(self):
        url = reverse('create_template')

        data = {
            "created_by": "WorkflowAiedwin",
            "company_id": "",
            "data_type": "Real_Data"
        }
        request = self.factory.post(url, data)


        with patch('app.views.create_template') as mock_create_template:
            mock_create_template.return_value = {"error": "Invalid company ID"}

            response = create_template(request)

            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_create_template_failure(self):
        url = reverse('create_template')
        data = {
            "created_by": "",
            "company_id": "",
            "data_type": "Real_Data"
        }
        request = self.factory.post(url, data)

        with patch('app.views.create_template') as mock_create_template:
            mock_create_template.return_value = {"error": "Invalid data"}

            response = create_template(request)

            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)




class TemplateDetailTest(unittest.TestCase):
    def setUp(self):
        self.client = Client()

    def test_template_detail(self):
        template_id = "64101d8cd41764723cc8bda8"

        url = reverse('template_detail', args=[template_id])


        with patch('app.views.template_detail') as mock_template_detail:
            mock_template_detail.return_value = {"example_data": "example"}

            response = self.client.get(url)

            self.assertEqual(response.status_code, 201)

    def test_template_invalid_template_id(self):
        template_id = "64101d8cd417647"

        url = reverse('template_detail', args=[template_id])

        with patch('app.views.template_detail') as mock_template_detail:
            mock_template_detail.return_value = {"error": "Invalid template ID"}

            response = self.client.get(url)

            self.assertEqual(response.status_code, 400)


class TemplateObjectTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_template_object_success(self):
        template_id = "64101d8cd41764723cc8bda8"
        url = reverse('template_object', args=[template_id])
        request = self.factory.get(url)

        with patch('app.views.validate_id') as mock_validate_id, \
                patch('app.views.get_template_object') as mock_get_template_object:
            mock_validate_id.return_value = True
            mock_get_template_object.return_value = {"template_data": "example"}

            response = template_object(request, template_id)

            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.data, {"template_data": "example"})

    def test_template_object_invalid_id(self):
        template_id = "64101d8cd417"
        url = reverse('template_object', args=[template_id])
        request = self.factory.get(url)

        with patch('app.views.validate_id') as mock_validate_id:
            mock_validate_id.return_value = False

            response = template_object(request, template_id)

            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertEqual(response.data, "Something went wrong!")


class ApproveTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_approve_success(self):
        template_id = "64101d8cd41764723cc8bda8"
        url = reverse('approve', args=[template_id])
        request = self.factory.put(url)

        with patch('app.utils.helpers.validate_id') as mock_validate_id, \
                patch('app.utils.mongo_db_connection.update_template_approval') as mock_update_template_approval:
            mock_validate_id.return_value = True
            mock_update_template_approval.return_value = '{"isSuccess": true}'

            response = approve(request, template_id)

            print(f"here is rhe tesdjwdw {response}")

            self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, "Template Approved")

    def test_approve_invalid_id(self):
        template_id = "64101d8"
        url = reverse('approve', args=[template_id])
        request = self.factory.put(url)

        with patch('app.views.validate_id') as mock_validate_id:
            mock_validate_id.return_value = False

            response = approve(request, template_id)

            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertEqual(response.data, "Something went wrong!")

    def test_approve_failure(self):
        template_id = "64101d8cd41764"
        url = reverse('approve', args=[template_id])
        request = self.factory.put(url)

        with patch('app.utils.helpers.validate_id') as mock_validate_id, \
                patch('app.utils.mongo_db_connection.update_template_approval') as mock_update_template_approval:
            mock_validate_id.return_value = True
            mock_update_template_approval.return_value = '{"isSuccess": false}'

            response = approve(request, template_id)

            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertEqual(response.data, "Something went wrong!")




# class TestTimeLimitRight(unittest.TestCase):
#      #Before running the tests, modify the variale "start"
#     #to a relevant, relative time because current_time is
#     #computed based on your current time in your timezone
    
#     def test_no_time_limit(self):
#         result = time_limit_right("no_time_limit", None, None, None, None)
#         self.assertTrue(result)

#     def test_select_time_limit_within_1_hour(self):
#         start = "2023-05-05T11:00"
#         datetime_object = datetime.fromisoformat(start)
#         creation_time = datetime_object.strftime("%d:%m:%Y,%H:%M:%S")
#         current_time = "2023-05-05T13:30"
#         result = time_limit_right("select", "within_1_hour", None, None, creation_time)
#         self.assertTrue(result)

#     def test_select_time_limit_within_1_hour_expired(self):
#         start = "2023-05-05T08:00"
#         datetime_object = datetime.fromisoformat(start)
#         creation_time = datetime_object.strftime("%d:%m:%Y,%H:%M:%S")
#         current_time = "2023-05-05T13:30"
#         result = time_limit_right("select", "within_1_hour", None, None, creation_time)
#         self.assertFalse(result)

#     def test_select_time_limit_within_8_hours(self):
#         start = "2023-05-05T05:00"
#         datetime_object = datetime.fromisoformat(start)
#         creation_time = datetime_object.strftime("%d:%m:%Y,%H:%M:%S")
#         current_time = "2023-05-05T18:30"
#         result = time_limit_right("select", "within_8_hours", None, None, creation_time)
#         self.assertTrue(result)

#     def test_select_time_limit_within_8_hours_expired(self):
#         start = "2023-05-05T01:00"
#         datetime_object = datetime.fromisoformat(start)
#         creation_time = datetime_object.strftime("%d:%m:%Y,%H:%M:%S")
#         current_time = "2023-05-05T23:30"
#         result = time_limit_right("select", "within_8_hours", None, None, creation_time)
#         self.assertFalse(result)

#     def test_select_time_limit_within_24_hours(self):
#         start = "2023-05-05T05:00"
#         datetime_object = datetime.fromisoformat(start)
#         creation_time = datetime_object.strftime("%d:%m:%Y,%H:%M:%S")
#         current_time = "2023-05-06T12:00"
#         result = time_limit_right(
#             "select", "within_24_hours", None, None, creation_time
#         )
#         self.assertTrue(result)

#     def test_select_time_limit_within_3_days(self):
#         start = "2023-05-03T07:00"
#         datetime_object = datetime.fromisoformat(start)
#         creation_time = datetime_object.strftime("%d:%m:%Y,%H:%M:%S")
#         current_time = "2023-05-08T12:00"
#         result = time_limit_right("select", "within_3_days", None, None, creation_time)
#         self.assertTrue(result)

#     def test_select_time_limit_within_7_days(self):
#         start = "2023-05-01T12:00"
#         datetime_object = datetime.fromisoformat(start)
#         creation_time = datetime_object.strftime("%d:%m:%Y,%H:%M:%S")
#         current_time = "2023-05-15T12:00"
#         result = time_limit_right("select", "within_7_days", None, None, creation_time)
#         self.assertTrue(result)

#     def test_custom_time_limit_within_range(self):
#         start_time = "2023-05-05T05:00"
#         end_time = "2023-05-05T15:00"
#         current_time = "2023-05-05T13:00"
#         result = time_limit_right("custom", None, start_time, end_time, None)
#         self.assertTrue(result)

#     def test_custom_time_limit_outside_range(self):
#         start_time = "2023-05-05T05:00"
#         end_time = "2023-05-05T08:00"
#         current_time = "2023-05-05T15:00"
#         result = time_limit_right("custom", None, start_time, end_time, None)
#         self.assertFalse(result)


# Still writing tests, this doesn't run
# class ExampleModelTestCase(TestCase):
#     def setUp(self):
#         self.client = APIClient()
#         self.example_data = {
#             "created_by": "WorkflowAiedwin",
#             "company_id": "6390b313d77dc467630713f2",
#             "data_type": "Real_Data",
#         }
#         self.example_model = ""

#     def test_get_folder(self):
#         url = reverse("folders/", kwargs={"str": self.example_model})
#         response = self.client.get(url)
#         self.assertEqual(response.status_code, 200)
#         self.assertEqual(response.data["folder_name"], "Untitled folder")



if __name__ == '__main__':
    unittest.main()