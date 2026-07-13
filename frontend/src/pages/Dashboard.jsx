import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import api from '../services/api';

const Dashboard = () => {
    const [summary, setSummary] = useState({ income: 0, expense: 0, savings: 0 });
    const [monthlyData, setMonthlyData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const today = new Date();
            const month = today.getMonth() + 1;
            const year = today.getFullYear();
            
            const response = await api.get(`reports/monthly/?month=${month}&year=${year}`);
            setSummary({
                income: response.data.income,
                expense: response.data.expense,
                savings: response.data.savings
            });

            // Format category data for PieChart
            const formattedCategoryData = response.data.categories.map(c => ({
                name: c.category,
                value: parseFloat(c.total)
            }));
            setCategoryData(formattedCategoryData);

            // Fetch last 6 months for LineChart (mocked with current month for simplicity, a real app would have a dedicated endpoint)
            setMonthlyData([
                { name: 'Current Month', Income: response.data.income, Expense: response.data.expense }
            ]);

        } catch (error) {
            console.error("Failed to fetch dashboard data");
        }
    };

    return (
        <Container>
            <h2 className="mb-4">Financial Dashboard</h2>
            
            <Row className="mb-4">
                <Col md={4}>
                    <Card className="text-center bg-light">
                        <Card.Body>
                            <Card.Title>Total Income</Card.Title>
                            <h3>₹{summary.income.toFixed(2)}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center bg-light">
                        <Card.Body>
                            <Card.Title>Total Expenses</Card.Title>
                            <h3 className="text-danger">₹{summary.expense.toFixed(2)}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center bg-light">
                        <Card.Body>
                            <Card.Title>Savings</Card.Title>
                            <h3 className="text-success">₹{summary.savings.toFixed(2)}</h3>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col md={7}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Income vs Expense</Card.Title>
                            <div style={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <RechartsTooltip formatter={(value) => `₹${value}`} />
                                        <Legend />
                                        <Bar dataKey="Income" fill="#28a745" />
                                        <Bar dataKey="Expense" fill="#dc3545" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={5}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Expenses by Category</Card.Title>
                            <div style={{ height: 300 }}>
                                {categoryData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={categoryData}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {categoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip formatter={(value) => `₹${value}`} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p className="text-muted text-center mt-5">No expense data for this month</p>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
