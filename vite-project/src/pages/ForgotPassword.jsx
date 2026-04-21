import React, { useState } from "react";
import axios from "axios";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [mode, setMode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const numParticles = 18;
  const particles = Array.from({ length: numParticles });

  const submitButtonStyle = {
    marginTop: "16px",
    padding: "12px 0",
    width: "100%",
    background: "linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background 0.2s",
    opacity: isLoading ? 0.7 : 1,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (!mode) {
      setError("Please select an action.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.put("http://localhost:7000/api/v1/forgetPassword", {
        email,
        otp: otp ? Number(otp) : undefined,
        newPassword,
        mode,
      });
      setSuccess(response.data.message || "Success!");
      setError("");
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || "Unknown error";
      setError(msg);
      setSuccess("");
    }
    setIsLoading(false);
  };

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
            <h2 className="refined-title" style={{ fontSize: 22, textAlign: 'center', marginBottom: 8 }}>Forgot Password</h2>
            {error && <div style={{ color: '#e74c3c', fontWeight: 600, textAlign: 'center', marginBottom: 8 }}>{error}</div>}
            {success && <div style={{ color: 'green', fontWeight: 600, textAlign: 'center', marginBottom: 8 }}>{success}</div>}
            <input
              style={{ padding: '12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 16, marginBottom: 6 }}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              style={{ padding: '12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 16, marginBottom: 6 }}
              type="number"
              placeholder="OTP (if verifying)"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <input
              style={{ padding: '12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 16, marginBottom: 6 }}
              type="password"
              placeholder="New Password (if verifying)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {/* Radio buttons for mode selection */}
            <div style={{
              width: "100%",
              marginBottom: 10,
              display: "flex",
              justifyContent: "center",
              gap: "24px",
            }}>
              <label style={{ fontSize: '15px', color: '#7c3aed', cursor: "pointer" }}>
                <input
                  type="radio"
                  value="send"
                  checked={mode === "send"}
                  onChange={() => setMode("send")}
                  style={{ marginRight: "8px" }}
                />
                Send OTP
              </label>
              <label style={{ fontSize: '15px', color: '#7c3aed', cursor: "pointer" }}>
                <input
                  type="radio"
                  value="verify"
                  checked={mode === "verify"}
                  onChange={() => setMode("verify")}
                  style={{ marginRight: "8px" }}
                />
                Verify OTP
              </label>
            </div>
            <button
              type="submit"
              style={submitButtonStyle}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Submit"}
            </button>
            {mode && (
              <div style={{ marginTop: "12px", fontSize: "14px", fontWeight: "bold", color: "#7c3aed" }}>
                Current mode: <span style={{ fontWeight: "normal" }}>
                  {mode === "send" ? "Send" : mode === "verify" ? "Verify" : ""}
                </span>
              </div>
            )}
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
                <a href="/public-event">Hot Events</a>
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
};

export default ForgotPassword;