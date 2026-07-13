import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Form, Modal } from 'react-bootstrap';
import api from '../services/api';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        transaction_type: 'Expense',
        category: 'Food',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [editingId, setEditingId] = useState(null);

    const categories = ['Food', 'Travel', 'Shopping', 'Bills', 'Salary', 'Freelance', 'Entertainment', 'Health', 'Education', 'Other'];

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await api.get('transactions/');
            setTransactions(response.data);
        } catch (error) {
            console.error("Failed to fetch transactions");
        }
    };

    const handleClose = () => {
        setShowModal(false);
        setEditingId(null);
        setFormData({
            transaction_type: 'Expense', category: 'Food', amount: '', description: '', date: new Date().toISOString().split('T')[0]
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
                await api.put(`transactions/${editingId}/`, formData);
            } else {
                await api.post('transactions/', formData);
            }
            fetchTransactions();
            handleClose();
        } catch (error) {
            alert("Error saving transaction.");
        }
    };

    const handleEdit = (transaction) => {
        setFormData({
            transaction_type: transaction.transaction_type,
            category: transaction.category,
            amount: transaction.amount,
            description: transaction.description,
            date: transaction.date
        });
        setEditingId(transaction.id);
        handleShow();
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this transaction?")) {
            try {
                await api.delete(`transactions/${id}/`);
                fetchTransactions();
            } catch (error) {
                alert("Error deleting transaction.");
            }
        }
    };

    return (
        <Container>
            <Row className="align-items-center mb-4">
                <Col>
                    <h2>Transactions</h2>
                </Col>
                <Col className="text-end">
                    <Button variant="dark" onClick={handleShow}>Add Transaction</Button>
                </Col>
            </Row>

            <Table striped bordered hover responsive>
                <thead className="table-dark">
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.length > 0 ? transactions.map(t => (
                        <tr key={t.id}>
                            <td>{t.date}</td>
                            <td><span className={t.transaction_type === 'Income' ? 'text-success' : 'text-danger'}>{t.transaction_type}</span></td>
                            <td>{t.category}</td>
                            <td>{t.description}</td>
                            <td>₹{parseFloat(t.amount).toFixed(2)}</td>
                            <td>
                                <Button variant="outline-dark" size="sm" className="me-2" onClick={() => handleEdit(t)}>Edit</Button>
                                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(t.id)}>Delete</Button>
                            </td>
                        </tr>
                    )) : <tr><td colSpan="6" className="text-center">No transactions found</td></tr>}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingId ? 'Edit Transaction' : 'Add Transaction'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Type</Form.Label>
                            <Form.Select name="transaction_type" value={formData.transaction_type} onChange={handleChange}>
                                <option value="Expense">Expense</option>
                                <option value="Income">Income</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Select name="category" value={formData.category} onChange={handleChange}>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Amount (₹)</Form.Label>
                            <Form.Control type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Date</Form.Label>
                            <Form.Control type="date" name="date" value={formData.date} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description (Optional)</Form.Label>
                            <Form.Control type="text" name="description" value={formData.description} onChange={handleChange} />
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

export default Transactions;
