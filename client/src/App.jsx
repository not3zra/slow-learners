import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import LoginPage from './pages/Login';
import CreateSession from './pages/teacher/CreateSession';
import TeacherProfile from './pages/teacher/TeacherProfile';
import ViewSessions from './pages/teacher/ViewSessions';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={ <Home /> } />
                <Route path='/login' element={ <LoginPage /> } />
                <Route path="/teacher/dashboard" element={ <TeacherDashboard />} />
                <Route path="/teacher/create-session" element={ <CreateSession /> } />
                <Route path="/teacher/profile" element={ <TeacherProfile /> } />
                <Route path="/teacher/view-session" element={ <ViewSessions /> } />
            </Routes>
        </Router>
    );
}