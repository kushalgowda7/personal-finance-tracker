from rest_framework import generics, permissions
from .models import Budget
from .serializers import BudgetSerializer
from django_filters.rest_framework import DjangoFilterBackend

class BudgetListCreateView(generics.ListCreateAPIView):
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['month', 'year']

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BudgetDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)
