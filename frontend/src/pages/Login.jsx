import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login/', credentials);
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            navigate('/');
        } catch (err) {
            setError('Invalid username or password');
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <h2 className="mb-4">Login</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" name="username" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="password" onChange={handleChange} required />
                        </Form.Group>
                        <Button variant="dark" type="submit" className="w-100 mb-3">
                            Login
                        </Button>
                    </Form>
                    <p className="text-center">Don't have an account? <Link to="/register">Register here</Link></p>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
