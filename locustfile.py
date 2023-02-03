from locust import HttpUser, task, between

class Documents(HttpUser):

    @task
    def test_endpoint(self):
        self.client.get("/v0.1")