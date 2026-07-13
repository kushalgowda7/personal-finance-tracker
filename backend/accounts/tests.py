from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

class AuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_success(self):
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        response = self.client.post('/api/register/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['username'], 'testuser')

    def test_login_success(self):
        User.objects.create_user(username='testuser', password='testpass123')
        data = {'username': 'testuser', 'password': 'testpass123'}
        response = self.client.post('/api/login/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
