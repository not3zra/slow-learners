import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import LoginPage from "./pages/Login";
import CreateSession from "./pages/teacher/CreateSession";
import TeacherProfile from "./pages/teacher/TeacherProfile";
import ViewSessions from "./pages/teacher/ViewSessions";
import ViewSingleSession from "./pages/teacher/ViewSingleSession";
import UploadMaterial from "./pages/teacher/UploadMaterial";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/create-session" element={<CreateSession />} />
        <Route path="/teacher/profile" element={<TeacherProfile />} />
        <Route path="/teacher/view-sessions" element={<ViewSessions />} />
        <Route
          path="/teacher/view-session/:id"
          element={<ViewSingleSession />}
        />
        <Route path="/teacher/session/:id/upload-material" element={<UploadMaterial />} />
      </Routes>
    </Router>
  );
}
