import unittest
from datetime import datetime, timedelta
import sys
from app.utils.checks import time_limit_right
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from rest_framework.test import APITestCase

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


class TestTimeLimitRight(unittest.TestCase):
     #Before running the tests, modify the variale "start"
    #to a relevant, relative time because current_time is
    #computed based on your current time in your timezone
    
    def test_no_time_limit(self):
        result = time_limit_right("no_time_limit", None, None, None, None)
        self.assertTrue(result)

    def test_select_time_limit_within_1_hour(self):
        start = "2023-05-05T11:00"
        datetime_object = datetime.fromisoformat(start)
        creation_time = datetime_object.strftime("%d:%m:%Y,%H:%M:%S")
        current_time = "2023-05-05T13:30"
        result = time_limit_right("select", "within_1_hour", None, None, creation_time)
        self.assertTrue(result)

    def test_select_time_limit_within_1_hour_expired(self):
        start = "2023-05-05T08:00"
        datetime_object = datetime.fromisoformat(start)
        creation_time = datetime_object.strftime("%d:%m:%Y,%H:%M:%S")
        current_time = "2023-05-05T13:30"
        result = time_limit_right("select", "within_1_hour", None, None, creation_time)
        self.assertFalse(result)

    def test_select_time_limit_within_8_hours(self):
        start = "2023-05-05T05:00"
        datetime_object = datetime.fromisoformat(start)
        creation_time = datetime_object.strftime("%d:%m:%Y,%H:%M:%S")
        current_time = "2023-05-05T18:30"
        result = time_limit_right("select", "within_8_hours", None, None, creation_time)
        self.assertTrue(result)

    def test_select_time_limit_within_8_hours_expired(self):
        start = "2023-05-05T01:00"
        datetime_object = datetime.fromisoformat(start)
        creation_time = datetime_object.strftime("%d:%m:%Y,%H:%M:%S")
        current_time = "2023-05-05T23:30"
        result = time_limit_right("select", "within_8_hours", None, None, creation_time)
        self.assertFalse(result)

    def test_select_time_limit_within_24_hours(self):
        start = "2023-05-05T05:00"
        datetime_object = datetime.fromisoformat(start)
        creation_time = datetime_object.strftime("%d:%m:%Y,%H:%M:%S")
        current_time = "2023-05-06T12:00"
        result = time_limit_right(
            "select", "within_24_hours", None, None, creation_time
        )
        self.assertTrue(result)

    def test_select_time_limit_within_3_days(self):
        start = "2023-05-03T07:00"
        datetime_object = datetime.fromisoformat(start)
        creation_time = datetime_object.strftime("%d:%m:%Y,%H:%M:%S")
        current_time = "2023-05-08T12:00"
        result = time_limit_right("select", "within_3_days", None, None, creation_time)
        self.assertTrue(result)

    def test_select_time_limit_within_7_days(self):
        start = "2023-05-01T12:00"
        datetime_object = datetime.fromisoformat(start)
        creation_time = datetime_object.strftime("%d:%m:%Y,%H:%M:%S")
        current_time = "2023-05-15T12:00"
        result = time_limit_right("select", "within_7_days", None, None, creation_time)
        self.assertTrue(result)

    def test_custom_time_limit_within_range(self):
        start_time = "2023-05-05T05:00"
        end_time = "2023-05-05T15:00"
        current_time = "2023-05-05T13:00"
        result = time_limit_right("custom", None, start_time, end_time, None)
        self.assertTrue(result)

    def test_custom_time_limit_outside_range(self):
        start_time = "2023-05-05T05:00"
        end_time = "2023-05-05T08:00"
        current_time = "2023-05-05T15:00"
        result = time_limit_right("custom", None, start_time, end_time, None)
        self.assertFalse(result)


if __name__ == "__main__":
    unittest.main()

# Still writing tests, this doesn't run
class ExampleModelTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.example_data = {
            "created_by": "WorkflowAiedwin",
            "company_id": "6390b313d77dc467630713f2",
            "data_type": "Real_Data",
        }
        self.example_model = ""

    def test_get_folder(self):
        url = reverse("folders/", kwargs={"str": self.example_model})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["folder_name"], "Untitled folder")
