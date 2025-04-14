import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/verify", { withCredentials: true })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="student-dashboard-container">
      {/* Full-width Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <h1 className="welcome-heading">Welcome {user ? user.name : ""}</h1>
          <p className="hero-subtitle">
            Organize, manage, and track your sessions effectively in one place.
          </p>
          <div className="hero-buttons">
            <button
              onClick={() => navigate("/book-session")}
              className="btn btn-secondary"
            >
              Book a Session
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Cards Section */}
      <section className="dashboard-cards">
        <div className="card">
          <h2 className="card-title">
            <i
              className="fas fa-calendar-alt"
              style={{ marginRight: "10px", color: "#4e73df" }}
            ></i>
            Upcoming Sessions
          </h2>
          <p className="card-content">No upcoming sessions available.</p>
        </div>
        <div className="card">
          <h2 className="card-title">
            <i
              className="fas fa-book-open"
              style={{ marginRight: "10px", color: "#4e73df" }}
            ></i>
            View Materials
          </h2>
          <p className="card-content">No materials available.</p>
        </div>
        <div className="card">
          <h2 className="card-title">
            <i
              className="fas fa-user-graduate"
              style={{ marginRight: "10px", color: "#4e73df" }}
            ></i>
            Your Sessions
          </h2>
          <p className="card-content">
            You are not enrolled in any sessions yet.
          </p>
        </div>
      </section>
    </div>
  );
}
