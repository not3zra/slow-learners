import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import LoginPage from './pages/Login';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={ <Home /> } />
                <Route path='/login' element={ <LoginPage /> } />
                <Route path="/teacher/dashboard" element={ <TeacherDashboard />} />
            </Routes>
        </Router>
    );
}