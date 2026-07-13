import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [userData, setUserData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/api/register/', userData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.email?.[0] || 'Registration failed. Please try again.');
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <h2 className="mb-4">Register</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" name="username" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="password" minLength={6} onChange={handleChange} required />
                        </Form.Group>
                        <Button variant="dark" type="submit" className="w-100 mb-3">
                            Register
                        </Button>
                    </Form>
                    <p className="text-center">Already have an account? <Link to="/login">Login here</Link></p>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
