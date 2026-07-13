import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const NavigationBar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('access_token');

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    if (!token) return null;

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Container>
                <Navbar.Brand as={Link} to="/">Finance Tracker</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
                        <Nav.Link as={Link} to="/transactions">Transactions</Nav.Link>
                        <Nav.Link as={Link} to="/budgets">Budgets</Nav.Link>
                        <Nav.Link as={Link} to="/reports">Reports</Nav.Link>
                    </Nav>
                    <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
