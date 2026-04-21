import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Home.css";

const ROLE_OPTIONS = [
  { label: "Standard User", value: "User" },
  { label: "Organizer", value: "Organizer" },
];

function OTPModal({ open, onClose, email }) {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post("http://localhost:7000/api/v1/verify-email", {
        email,
        otp
      });
      setMessage(res.data.message || "Email verified successfully! You can now log in.");
      setTimeout(() => {
        setMessage("");
        onClose();
        navigate("/login");
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setMessage("");
    try {
      const res = await axios.post("http://localhost:7000/api/v1/resend-otp", { email });
      setMessage(res.data.message || "A new OTP has been sent to your email.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 36, borderRadius: 18, boxShadow: '0 4px 24px #a78bfa33', minWidth: 340, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <h2 style={{ color: '#7c3aed', marginBottom: 8 }}>Verify Your Email</h2>
        <div style={{ color: '#555', marginBottom: 8 }}>Enter the OTP sent to your email to complete verification.</div>
        <input
          type="text"
          value={otp}
          onChange={e => setOtp(e.target.value)}
          placeholder="Enter OTP"
          maxLength={6}
          required
          style={{ padding: 12, borderRadius: 8, border: '1.5px solid #a78bfa', fontSize: 18, marginBottom: 8 }}
        />
        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" disabled={loading} style={{ background: 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 0', fontWeight: 700, fontSize: 18, cursor: 'pointer', flex: 1 }}>
            {loading ? 'Verifying...' : 'Submit OTP'}
          </button>
          <button type="button" onClick={handleResend} disabled={resending} style={{ background: '#fff', color: '#7c3aed', border: '1.5px solid #a78bfa', borderRadius: 10, padding: '12px 0', fontWeight: 700, fontSize: 18, cursor: 'pointer', flex: 1 }}>
            {resending ? 'Resending...' : 'Resend OTP'}
          </button>
        </div>
        {message && <div style={{ color: message.includes('success') ? 'green' : 'red', fontWeight: 500 }}>{message}</div>}
        <button type="button" onClick={onClose} style={{ marginTop: 8, background: 'none', color: '#7c3aed', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
      </form>
    </div>
  );
}

export default function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    profilePicture: null,
    birthdate: "",
    phone: "",
    country: "",
    gender: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const numParticles = 18;
  const particles = Array.from({ length: numParticles });
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    setData({ ...data, role: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setData({ ...data, profilePicture: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("birthdate", data.birthdate);
      formData.append("phone", data.phone);
      formData.append("country", data.country);
      formData.append("gender", data.gender);
      formData.append("role", data.role);
      if (data.profilePicture) {
        formData.append("profilePicture", data.profilePicture);
      }

      await axios.post("http://localhost:7000/api/v1/register", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });
      setSuccess("Registration successful! Please check your email for the OTP.");
      setPendingEmail(data.email);
      setShowOtpModal(true);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
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
            <h2 className="refined-title" style={{ fontSize: 22, textAlign: 'center', marginBottom: 8 }}>Register</h2>
            {error && <div style={{ color: '#e74c3c', fontWeight: 600, textAlign: 'center', marginBottom: 8 }}>{error}</div>}
            {success && <div style={{ color: 'green', fontWeight: 600, textAlign: 'center', marginBottom: 8 }}>{success}</div>}
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={data.name}
              onChange={handleChange}
              required
              style={{ padding: '12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 16, marginBottom: 6 }}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={data.email}
              onChange={handleChange}
              required
              style={{ padding: '12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 16, marginBottom: 6 }}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={data.password}
              onChange={handleChange}
              required
              style={{ padding: '12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 16, marginBottom: 6 }}
            />
            <input
              type="date"
              name="birthdate"
              value={data.birthdate}
              onChange={handleChange}
              required
              style={{ padding: '12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 16, marginBottom: 6 }}
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={data.phone}
              onChange={handleChange}
              required
              style={{ padding: '12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 16, marginBottom: 6 }}
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={data.country}
              onChange={handleChange}
              required
              style={{ padding: '12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 16, marginBottom: 6 }}
            />
            <select
              name="gender"
              value={data.gender}
              onChange={handleChange}
              required
              style={{ padding: '12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 16, marginBottom: 6 }}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <select
              name="role"
              value={data.role}
              onChange={handleRoleChange}
              required
              style={{ padding: '12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 16, marginBottom: 6 }}
            >
              <option value="">Select Role</option>
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div style={{ width: '100%', marginBottom: 8 }}>
              <label htmlFor="profilePicture" style={{
                display: 'inline-block',
                padding: '10px 22px',
                background: 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)',
                color: '#fff',
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15,
                cursor: 'pointer',
                boxShadow: '0 2px 8px #a78bfa22',
                border: 'none',
                marginBottom: 6,
                transition: 'background 0.2s',
              }}>
                {data.profilePicture ? 'Change Profile Picture' : 'Choose Profile Picture'}
                <input
                  id="profilePicture"
                  type="file"
                  name="profilePicture"
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </label>
              {data.profilePicture && (
                <span style={{ display: 'block', fontSize: 13, color: '#7c3aed', marginTop: 4, fontWeight: 500 }}>{data.profilePicture.name}</span>
              )}
            </div>
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
              {isLoading ? "Registering..." : "Register"}
            </button>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="refined-more-btn"
                style={{ color: '#7c3aed', background: 'none', fontWeight: 600 }}
              >
                Already have an account? Login
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
      <OTPModal open={showOtpModal} onClose={() => setShowOtpModal(false)} email={pendingEmail} />
    </div>
  );
}