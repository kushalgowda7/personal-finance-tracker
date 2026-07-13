import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import NavigationBar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Reports from './pages/Reports';

function App() {
    return (
        <Router>
            <NavigationBar />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/budgets" element={<Budgets />} />
                    <Route path="/reports" element={<Reports />} />
                </Route>

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
