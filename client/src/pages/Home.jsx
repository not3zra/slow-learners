import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Classroom Booking for Slow Learner Sessions
          </h1>
          <p className="hero-subtitle">
            A smart, easy-to-use platform to organize and schedule sessions efficiently.
          </p>
          <div className="hero-buttons">
            <button onClick={() => navigate("/login")} className="btn btn-primary">
              Login
            </button>
            <button onClick={() => navigate("/signup")} className="btn btn-secondary">
              Sign Up
            </button>
          </div>
        </div>
      </header>

{/* Features Section */}
<section className="features-section">
  <h2 className="features-heading">Smart Features for Slow Learner Support</h2>
  <div className="features-grid">
    {/* Feature 1 */}
    <div className="feature-card">
      <span className="feature-icon">📅</span>
      <h3>Simple Scheduling</h3>
      <p>Book classrooms with ease for personalized support sessions tailored to student needs.</p>
    </div>

    {/* Feature 2 */}
    <div className="feature-card">
      <span className="feature-icon">🧠</span>
      <h3>Personalized Planning</h3>
      <p>Create custom learning plans and manage sessions that focus on each learner's pace and style.</p>
    </div>

    {/* Feature 3 */}
    <div className="feature-card">
      <span className="feature-icon">📈</span>
      <h3>Progress Tracking</h3>
      <p>Track session outcomes, attendance, and learning improvements with ease.</p>
    </div>
  </div>
</section>


      <footer className="footer">
  <div className="footer-container">
    {/* Brand and Description */}
    <div className="footer-column">
      <h3 className="footer-logo">SmartClassroom</h3>
      <p className="footer-description">
        Empowering education through simple and smart solutions for every learner.
      </p>
      <div className="social-icons">
        <a href="#" aria-label="LinkedIn">🔗</a>
        <a href="#" aria-label="Twitter">🐦</a>
        <a href="#" aria-label="GitHub">🐙</a>
      </div>
    </div>

    {/* Quick Links */}
    <div className="footer-column">
      <h4>Quick Links</h4>
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">Features</a></li>
        <li><a href="#">Pricing</a></li>
        <li><a href="#">Support</a></li>
      </ul>
    </div>

    {/* Contact Info */}
    <div className="footer-column">
      <h4>Contact</h4>
      <p>Email: support@smartclassroom.io</p>
      <p>Phone: +91 98765 43210</p>
      <p>Location: Bengaluru, India</p>
    </div>
  </div>

  {/* Bottom Bar */}
  <div className="footer-bottom">
    <p>© {new Date().getFullYear()} SmartClassroom. All rights reserved.</p>
  </div>
</footer>

    </div>
  );
}