import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import api from '../services/api';

const Reports = () => {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.get(`reports/monthly/?month=${month}&year=${year}`);
            setReportData(response.data);
        } catch (error) {
            alert("Error fetching report data.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (format) => {
        try {
            const response = await api.get(`reports/export/${format}/`, { responseType: 'blob' });
            
            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `transactions.${format === 'excel' ? 'xlsx' : format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert(`Error downloading ${format.toUpperCase()}`);
        }
    };

    return (
        <Container>
            <h2 className="mb-4">Reports & Analytics</h2>

            <Row className="mb-4">
                <Col md={12}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Generate Monthly View</Card.Title>
                            <Form onSubmit={handleGenerate} className="d-flex gap-3 align-items-end">
                                <Form.Group>
                                    <Form.Label>Month</Form.Label>
                                    <Form.Control type="number" min="1" max="12" value={month} onChange={(e) => setMonth(e.target.value)} required />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Year</Form.Label>
                                    <Form.Control type="number" min="2000" max="2100" value={year} onChange={(e) => setYear(e.target.value)} required />
                                </Form.Group>
                                <Button type="submit" variant="dark" disabled={loading}>
                                    {loading ? 'Generating...' : 'View'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {reportData && (
                <Row className="mb-4">
                    <Col md={12}>
                        <Card>
                            <Card.Header>Report for {month}/{year}</Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={4}>
                                        <h5>Income: <span className="text-success">₹{reportData.income.toFixed(2)}</span></h5>
                                    </Col>
                                    <Col md={4}>
                                        <h5>Expenses: <span className="text-danger">₹{reportData.expense.toFixed(2)}</span></h5>
                                    </Col>
                                    <Col md={4}>
                                        <h5>Savings: <span>₹{reportData.savings.toFixed(2)}</span></h5>
                                    </Col>
                                </Row>
                                <hr />
                                <h5>Category Breakdown</h5>
                                <ul>
                                    {reportData.categories.map((c, idx) => (
                                        <li key={idx}>{c.category}: ₹{c.total.toFixed(2)}</li>
                                    ))}
                                </ul>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            <Row>
                <Col md={12}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Export All Transactions</Card.Title>
                            <div className="d-flex gap-3 mt-3">
                                <Button variant="outline-danger" onClick={() => handleDownload('pdf')}>Download PDF</Button>
                                <Button variant="outline-success" onClick={() => handleDownload('excel')}>Download Excel</Button>
                                <Button variant="outline-info" onClick={() => handleDownload('csv')}>Download CSV</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Reports;
