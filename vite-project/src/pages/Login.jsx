import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Home.css";

export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hoverLogin, setHoverLogin] = useState(false);
  const [hoverGuest, setHoverGuest] = useState(false);
  const navigate = useNavigate();
  const numParticles = 18;
  const particles = Array.from({ length: numParticles });

  function handleChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  function handleForgotPassword() {
    navigate("/forgot-password");
  }

  function handleRegisterRedirect() {
    navigate("/register");
  }

  function handleContinueAsGuest() {
    navigate("/");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
    try {
      await axios.post("http://localhost:7000/api/v1/login", data, {
        withCredentials: true,
      });
      const res = await axios.get("http://localhost:7000/api/v1/users/profile", {
        withCredentials: true,
      });
      const role = res.data.user.role;
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        if (role === "Admin") navigate("/AdminDashboard");
        else if (role === "Organizer") navigate("/OrganizerDashboard");
        else navigate("/UserDashboard");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="home-wrapper home-bg-white" style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Floating logo particles */}
      <div className="particles">
        {particles.map((_, i) => (
          <img
            key={i}
            src={logo}
            alt="logo particle"
            className="particle-logo"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 32 + 32}px`,
              height: "auto",
              opacity: Math.random() * 0.18 + 0.08,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
            }}
            draggable={false}
          />
        ))}
      </div>
      {/* Back Logo */}
      <div className="category-logo-circle" style={{ position: 'absolute', top: 32, left: 32, cursor: 'pointer', zIndex: 10 }} onClick={() => navigate(-1)}>
        <img src={logo} alt="BookedIn Logo" style={{ width: 40, height: 40, borderRadius: '50%' }} />
      </div>
      {/* Centered Large Logo */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 32, marginBottom: 0 }}>
        <img src={logo} alt="BookedIn Logo" style={{ width: 110, height: 'auto', borderRadius: 24, background: 'transparent' }} />
      </div>
      {/* Main Content Card */}
      <main style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '60vh', margin: '2.2rem 0 1.5rem 0' }}>
        <div className="cta-glassy-purple-card" style={{ maxWidth: 400, padding: '3rem 2.5rem', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <span className="refined-title" style={{ fontSize: 28, color: '#7c3aed', fontWeight: 700 }}>BookedIn</span>
            <div className="footer-glassy-slogan" style={{ marginBottom: 18 }}>click.book.enjoy</div>
          </div>
          <form style={{ display: 'flex', flexDirection: 'column', gap: 16 }} onSubmit={handleSubmit}>
            <h2 className="refined-title" style={{ fontSize: 22, textAlign: 'center', marginBottom: 8 }}>Login</h2>
            {error && <div style={{ color: '#e74c3c', fontWeight: 600, textAlign: 'center', marginBottom: 8 }}>{error}</div>}
            {success && <div style={{ color: 'green', fontWeight: 600, textAlign: 'center', marginBottom: 8 }}>{success}</div>}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={data.email}
              onChange={handleChange}
              required
              autoComplete="username"
              style={{ padding: '12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 16, marginBottom: 6 }}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={data.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              style={{ padding: '12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 16, marginBottom: 6 }}
            />
            <button
              type="submit"
              className="refined-book-btn"
              style={{
                marginBottom: 10,
                width: '100%',
                background: 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)',
                color: '#fff',
                fontWeight: 700,
                boxShadow: '0 2px 8px #a78bfa22',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
            <button
              type="button"
              className="refined-more-btn"
              style={{
                marginBottom: 18,
                width: '100%',
                background: 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)',
                color: '#fff',
                fontWeight: 600,
                boxShadow: '0 2px 8px #a78bfa22',
              }}
              onClick={handleContinueAsGuest}
            >
              Continue as Guest
            </button>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
              <button type="button" className="refined-more-btn" style={{ color: '#7c3aed', background: 'none', fontWeight: 600 }} onClick={handleForgotPassword}>
                Forgot Password?
              </button>
              <span style={{ color: '#a78bfa', fontWeight: 600 }}>|</span>
              <button type="button" className="refined-more-btn" style={{ color: '#7c3aed', background: 'none', fontWeight: 600 }} onClick={handleRegisterRedirect}>
                Create Account
              </button>
            </div>
          </form>
        </div>
      </main>
      {/* Footer */}
      <div className="footer-glassy-outer">
        <footer className="footer-glassy-purple">
          <div className="footer-glassy-inner">
            <div className="footer-glassy-brand">
              BookedIn
              <div className="footer-glassy-slogan">click.book.enjoy</div>
            </div>
            <div className="footer-glassy-links">
              <div className="footer-glassy-col">
                <a href="/public-event">All Tickets on Sale</a>
                <a href="#">Hot Events</a>
                <a href="#">Outlets</a>
              </div>
              <div className="footer-glassy-col">
                <a href="/about">About Us</a>
                <a href="/contact">Contact Us</a>
                <a href="/policies">Policies</a>
                <a href="/privacy">Privacy Policy</a>
                <a href="/faqs">FAQs</a>
              </div>
            </div>
            <a href="/contact" className="footer-glassy-help-btn">
              <span className="footer-glassy-help-icon">?</span>
              <span className="footer-glassy-help-text">Need some help? Contact us</span>
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
