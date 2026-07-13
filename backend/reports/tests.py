from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

class ReportTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        response = self.client.post('/api/login/', {'username': 'testuser', 'password': 'testpass123'})
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

    def test_monthly_report_no_params(self):
        response = self.client.get('/api/reports/monthly/')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
