import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Form, Modal, Badge, ProgressBar } from 'react-bootstrap';
import api from '../services/api';

const Budgets = () => {
    const [budgets, setBudgets] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        category: 'Food',
        monthly_limit: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
    });
    const [editingId, setEditingId] = useState(null);

    const categories = ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other'];

    useEffect(() => {
        fetchBudgets();
    }, []);

    const fetchBudgets = async () => {
        try {
            const response = await api.get('budgets/');
            setBudgets(response.data);
        } catch (error) {
            console.error("Failed to fetch budgets");
        }
    };

    const handleClose = () => {
        setShowModal(false);
        setEditingId(null);
        setFormData({
            category: 'Food', monthly_limit: '', month: new Date().getMonth() + 1, year: new Date().getFullYear()
        });
    };
    const handleShow = () => setShowModal(true);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`budgets/${editingId}/`, formData);
            } else {
                await api.post('budgets/', formData);
            }
            fetchBudgets();
            handleClose();
        } catch (error) {
            alert(error.response?.data?.non_field_errors?.[0] || "Error saving budget.");
        }
    };

    const handleEdit = (budget) => {
        setFormData({
            category: budget.category,
            monthly_limit: budget.monthly_limit,
            month: budget.month,
            year: budget.year
        });
        setEditingId(budget.id);
        handleShow();
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this budget?")) {
            try {
                await api.delete(`budgets/${id}/`);
                fetchBudgets();
            } catch (error) {
                alert("Error deleting budget.");
            }
        }
    };

    return (
        <Container>
            <Row className="align-items-center mb-4">
                <Col>
                    <h2>Monthly Budgets</h2>
                </Col>
                <Col className="text-end">
                    <Button variant="dark" onClick={handleShow}>Create Budget</Button>
                </Col>
            </Row>

            <Table striped bordered hover responsive>
                <thead className="table-dark">
                    <tr>
                        <th>Month/Year</th>
                        <th>Category</th>
                        <th>Budget Limit</th>
                        <th>Spent</th>
                        <th>Progress</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {budgets.length > 0 ? budgets.map(b => {
                        const spentPct = Math.min((b.spent / b.monthly_limit) * 100, 100).toFixed(0);
                        const isOver = b.status === "Over Budget";
                        return (
                            <tr key={b.id}>
                                <td>{b.month}/{b.year}</td>
                                <td>{b.category}</td>
                                <td>₹{parseFloat(b.monthly_limit).toFixed(2)}</td>
                                <td>₹{b.spent.toFixed(2)}</td>
                                <td>
                                    <ProgressBar variant={isOver ? 'danger' : 'success'} now={spentPct} label={`${spentPct}%`} />
                                </td>
                                <td>
                                    <Badge bg={isOver ? 'danger' : 'success'}>{b.status}</Badge>
                                </td>
                                <td>
                                    <Button variant="outline-dark" size="sm" className="me-2" onClick={() => handleEdit(b)}>Edit</Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(b.id)}>Delete</Button>
                                </td>
                            </tr>
                        );
                    }) : <tr><td colSpan="7" className="text-center">No budgets found</td></tr>}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingId ? 'Edit Budget' : 'Create Budget'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Select name="category" value={formData.category} onChange={handleChange}>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Monthly Limit (₹)</Form.Label>
                            <Form.Control type="number" step="0.01" name="monthly_limit" value={formData.monthly_limit} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Month (1-12)</Form.Label>
                            <Form.Control type="number" min="1" max="12" name="month" value={formData.month} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Year</Form.Label>
                            <Form.Control type="number" min="2000" max="2100" name="year" value={formData.year} onChange={handleChange} required />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                        <Button variant="dark" type="submit">Save</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default Budgets;
