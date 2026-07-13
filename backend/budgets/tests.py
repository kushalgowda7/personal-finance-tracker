from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Budget

class BudgetTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        response = self.client.post('/api/login/', {'username': 'testuser', 'password': 'testpass123'})
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

    def test_create_budget(self):
        data = {
            'category': 'Food',
            'monthly_limit': '1000.00',
            'month': 7,
            'year': 2026
        }
        response = self.client.post('/api/budgets/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Budget.objects.count(), 1)
