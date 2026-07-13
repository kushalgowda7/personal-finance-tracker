import csv
import io
import pandas as pd
from django.http import HttpResponse, JsonResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from transactions.models import Transaction
from reportlab.pdfgen import canvas
from django.db.models import Sum

class MonthlyReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        month = request.query_params.get('month')
        year = request.query_params.get('year')
        
        if not month or not year:
            return JsonResponse({"error": "Please provide month and year parameters."}, status=status.HTTP_400_BAD_REQUEST)
        
        transactions = Transaction.objects.filter(
            user=request.user,
            date__year=year,
            date__month=month
        )
        
        income = transactions.filter(transaction_type='Income').aggregate(total=Sum('amount'))['total'] or 0
        expense = transactions.filter(transaction_type='Expense').aggregate(total=Sum('amount'))['total'] or 0
        
        categories = transactions.filter(transaction_type='Expense').values('category').annotate(total=Sum('amount'))
        
        return JsonResponse({
            "income": float(income),
            "expense": float(expense),
            "savings": float(income - expense),
            "categories": list(categories)
        })

class ExportCSVView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="transactions.csv"'

        writer = csv.writer(response)
        writer.writerow(['ID', 'Type', 'Category', 'Amount', 'Description', 'Date'])

        transactions = Transaction.objects.filter(user=request.user)
        for t in transactions:
            writer.writerow([t.id, t.transaction_type, t.category, t.amount, t.description, t.date])

        return response

class ExportPDFView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="transactions.pdf"'

        p = canvas.Canvas(response)
        p.drawString(100, 800, "Transactions Report")
        
        transactions = Transaction.objects.filter(user=request.user)[:50] # Limit to 50 for simple PDF
        y = 750
        for t in transactions:
            p.drawString(100, y, f"{t.date} - {t.transaction_type} - {t.category}: Rs. {t.amount}")
            y -= 20
            if y < 50:
                p.showPage()
                y = 800

        p.showPage()
        p.save()
        return response

class ExportExcelView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        transactions = Transaction.objects.filter(user=request.user).values(
            'id', 'transaction_type', 'category', 'amount', 'description', 'date'
        )
        df = pd.DataFrame(list(transactions))
        
        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename="transactions.xlsx"'
        
        if not df.empty:
            df.to_excel(response, index=False)
        else:
            # Create empty excel if no data
            df = pd.DataFrame(columns=['id', 'transaction_type', 'category', 'amount', 'description', 'date'])
            df.to_excel(response, index=False)

        return response
