from django.db import models
from django.contrib.auth.models import User

class Transaction(models.Model):
    TYPE_CHOICES = [
        ('Income', 'Income'),
        ('Expense', 'Expense'),
    ]

    CATEGORY_CHOICES = [
        ('Food', 'Food'),
        ('Travel', 'Travel'),
        ('Shopping', 'Shopping'),
        ('Bills', 'Bills'),
        ('Salary', 'Salary'),
        ('Freelance', 'Freelance'),
        ('Entertainment', 'Entertainment'),
        ('Health', 'Health'),
        ('Education', 'Education'),
        ('Other', 'Other'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=255, blank=True)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.transaction_type} - {self.category} - {self.amount}"
