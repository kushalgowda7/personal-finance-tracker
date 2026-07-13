from rest_framework import serializers
from .models import Budget
from transactions.models import Transaction
from django.db.models import Sum

class BudgetSerializer(serializers.ModelSerializer):
    spent = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = Budget
        fields = ['id', 'category', 'monthly_limit', 'month', 'year', 'spent', 'status', 'created_at']
        read_only_fields = ['id', 'created_at']

    def get_spent(self, obj):
        total_spent = Transaction.objects.filter(
            user=obj.user,
            transaction_type='Expense',
            category=obj.category,
            date__year=obj.year,
            date__month=obj.month
        ).aggregate(total=Sum('amount'))['total'] or 0
        return float(total_spent)

    def get_status(self, obj):
        spent = self.get_spent(obj)
        limit = float(obj.monthly_limit)
        return "Over Budget" if spent > limit else "Safe"
