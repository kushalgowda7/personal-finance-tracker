from django.urls import path
from .views import MonthlyReportView, ExportCSVView, ExportPDFView, ExportExcelView

urlpatterns = [
    path('monthly/', MonthlyReportView.as_view(), name='monthly_report'),
    path('export/csv/', ExportCSVView.as_view(), name='export_csv'),
    path('export/pdf/', ExportPDFView.as_view(), name='export_pdf'),
    path('export/excel/', ExportExcelView.as_view(), name='export_excel'),
]
