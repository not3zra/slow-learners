import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./TeacherDashboard.css";

export default function TeacherDashboard() {
  const [user, setUser] = useState(null);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/verify", { withCredentials: true })
      .then((response) => {
        setUser(response.data.user);

        axios
          .get("http://localhost:5000/api/sessions/list", {
            params: { teacherId: response.data.user._id },
            withCredentials: true,
          })
          .then((response) => {
            const today = new Date();
            const upcomingSessions = response.data.sessions.reduce(
              (acc, session) => {
                const validDates = session.dates
                  .filter((date) => new Date(date) >= today)
                  .map((date) => ({
                    name: session.sessionName,
                    timeSlot: session.timeSlot,
                    date: date,
                  }));

                return [...acc, ...validDates];
              },
              []
            );

            const sortedSessions = upcomingSessions.sort(
              (a, b) => new Date(a.date) - new Date(b.date)
            );

            setUpcoming(sortedSessions.slice(0, sortedSessions.length < 5 ? sortedSessions.length : 5));
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="teacher-dashboard-container">
      {/* Welcome Section */}
      <div className="welcome-banner">
        {user && (
          <h1 className="welcome-heading">Welcome, {user.name}!</h1>
        )}
        <p className="hero-subtitle">
          Manage your sessions and materials effortlessly.
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="teacher-section">
        {/* Upcoming Sessions */}
        <div className="teacher-card">
          <h2>📅 Upcoming Sessions</h2>
          {upcoming.length > 0 ? (
            <div>
              {upcoming.map((val, idx) => (
                <div key={idx} className="session-entry">
                  <h3>{val.name}</h3>
                  <p>
                    📆 {val.date} | 🕒 {val.timeSlot.startTime} - {val.timeSlot.endTime}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="card-content">❌ No upcoming sessions</p>
          )}
        </div>

        {/* Actions Card */}
        <div className="teacher-card">
          <h2>🔧 Actions</h2>
          <Link to="/teacher/create-session" className="dashboard-link create">
            ➕ Create New Session
          </Link>
          <Link to="/teacher/view-sessions" className="dashboard-link view">
            📂 View Sessions
          </Link>
        </div>

        {/* Profile Settings Card */}
        <div className="teacher-card">
          <h2>🔒 Profile & Settings</h2>
          <Link to="/teacher/profile" className="dashboard-link edit">
            ✏️ Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
}