from django.db import models
from django.contrib.auth.models import User
from transactions.models import Transaction

class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='budgets')
    category = models.CharField(max_length=50, choices=Transaction.CATEGORY_CHOICES)
    monthly_limit = models.DecimalField(max_digits=10, decimal_places=2)
    month = models.IntegerField()
    year = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'category', 'month', 'year')

    def __str__(self):
        return f"{self.category} Budget for {self.month}/{self.year}"
