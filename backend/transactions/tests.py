from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Transaction
from datetime import date

class TransactionTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        response = self.client.post('/api/login/', {'username': 'testuser', 'password': 'testpass123'})
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

    def test_create_transaction(self):
        data = {
            'transaction_type': 'Income',
            'category': 'Salary',
            'amount': '5000.00',
            'description': 'Monthly salary',
            'date': str(date.today())
        }
        response = self.client.post('/api/transactions/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Transaction.objects.count(), 1)
