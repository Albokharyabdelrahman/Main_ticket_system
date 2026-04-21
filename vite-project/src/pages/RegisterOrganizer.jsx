import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Home.css";

// Simple SVG Icons
const Icons = {
  user: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  ),
  email: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
  ),
  lock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
    </svg>
  ),
  phone: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
    </svg>
  ),
  camera: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12m-3.2 0a3.2 3.2 0 1 1 6.4 0a3.2 3.2 0 1 1 -6.4 0"/>
      <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
    </svg>
  ),
  check: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
    </svg>
  ),
  welcome: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  ),
  business: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
    </svg>
  ),
  contact: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 2.75c1.24 0 2.25 1.01 2.25 2.25s-1.01 2.25-2.25 2.25S9.75 10.24 9.75 9 10.76 6.75 12 6.75zM17 17H7v-1.5c0-1.67 3.33-2.5 5-2.5s5 .83 5 2.5V17z"/>
    </svg>
  ),
  review: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
    </svg>
  )
};

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

export default function RegisterOrganizer() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Organizer",
    profilePicture: null,
    phone: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const numParticles = 18;
  const particles = Array.from({ length: numParticles });
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const steps = [
    { id: 1, title: "Organization Info", icon: Icons.user },
    { id: 2, title: "Contact Details", icon: Icons.phone },
    { id: 3, title: "Review & Submit", icon: Icons.check }
  ];

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setData({ ...data, profilePicture: file });
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
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
      formData.append("phone", data.phone);
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div style={{ animation: 'slideIn 0.5s ease-out' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ marginBottom: 16, color: '#7c3aed' }}>{Icons.welcome()}</div>
              <h2 style={{ fontSize: 28, color: '#7c3aed', marginBottom: 8 }}>Welcome to BookedIn!</h2>
              <p style={{ color: '#666', fontSize: 16 }}>Let's set up your organization account</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="name"
                  placeholder="What's your organization name?"
                  value={data.name}
                  onChange={handleChange}
                  required
                  style={{ 
                    padding: '16px 20px', 
                    borderRadius: 16, 
                    border: '2px solid #e5e7eb', 
                    fontSize: 16, 
                    width: '100%',
                    transition: 'all 0.3s ease',
                    background: '#fff'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
                <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: '#7c3aed' }}>{Icons.user()}</div>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your business email"
                  value={data.email}
                  onChange={handleChange}
                  required
                  style={{ 
                    padding: '16px 20px', 
                    borderRadius: 16, 
                    border: '2px solid #e5e7eb', 
                    fontSize: 16, 
                    width: '100%',
                    transition: 'all 0.3s ease',
                    background: '#fff'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
                <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: '#7c3aed' }}>{Icons.email()}</div>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a strong password"
                  value={data.password}
                  onChange={handleChange}
                  required
                  style={{ 
                    padding: '16px 20px', 
                    borderRadius: 16, 
                    border: '2px solid #e5e7eb', 
                    fontSize: 16, 
                    width: '100%',
                    transition: 'all 0.3s ease',
                    background: '#fff'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
                <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: '#7c3aed' }}>{Icons.lock()}</div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div style={{ animation: 'slideIn 0.5s ease-out' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ marginBottom: 16, color: '#7c3aed' }}>{Icons.contact()}</div>
              <h2 style={{ fontSize: 28, color: '#7c3aed', marginBottom: 8 }}>Contact Information</h2>
              <p style={{ color: '#666', fontSize: 16 }}>Help attendees reach your organization</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="phone"
                  placeholder="Your business phone number"
                  value={data.phone}
                  onChange={handleChange}
                  required
                  style={{ 
                    padding: '16px 20px', 
                    borderRadius: 16, 
                    border: '2px solid #e5e7eb', 
                    fontSize: 16, 
                    width: '100%',
                    transition: 'all 0.3s ease',
                    background: '#fff'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
                <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: '#7c3aed' }}>{Icons.phone()}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <label htmlFor="profilePicture" style={{
                  display: 'inline-block',
                  padding: '20px 40px',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
                  color: '#fff',
                  borderRadius: 20,
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px #a78bfa33',
                  border: 'none',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)', opacity: 0, transition: 'opacity 0.3s ease' }}></div>
                  <span style={{ position: 'relative', zIndex: 1 }}>
                    <span style={{ marginRight: 8 }}>{Icons.camera()}</span>
                    {data.profilePicture ? 'Change Logo' : 'Add Organization Logo'}
                  </span>
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
                  <div style={{ 
                    marginTop: 12, 
                    padding: '8px 16px', 
                    background: '#f3f4f6', 
                    borderRadius: 12,
                    fontSize: 14, 
                    color: '#7c3aed', 
                    fontWeight: 500 
                  }}>
                    <span style={{ marginRight: 8, color: '#7c3aed' }}>{Icons.check()}</span>
                    {data.profilePicture.name}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div style={{ animation: 'slideIn 0.5s ease-out' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ marginBottom: 16, color: '#7c3aed' }}>{Icons.review()}</div>
              <h2 style={{ fontSize: 28, color: '#7c3aed', marginBottom: 8 }}>Almost there!</h2>
              <p style={{ color: '#666', fontSize: 16 }}>Review your information and create your account</p>
            </div>
            <div style={{ 
              background: '#f8fafc', 
              borderRadius: 20, 
              padding: 24, 
              marginBottom: 24,
              border: '2px solid #e5e7eb'
            }}>
              <div style={{ display: 'grid', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#666', fontWeight: 500 }}>Organization:</span>
                  <span style={{ color: '#7c3aed', fontWeight: 600 }}>{data.name || 'Not provided'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#666', fontWeight: 500 }}>Email:</span>
                  <span style={{ color: '#7c3aed', fontWeight: 600 }}>{data.email || 'Not provided'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#666', fontWeight: 500 }}>Phone:</span>
                  <span style={{ color: '#7c3aed', fontWeight: 600 }}>{data.phone || 'Not provided'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#666', fontWeight: 500 }}>Logo:</span>
                  <span style={{ color: '#7c3aed', fontWeight: 600 }}>
                    {data.profilePicture ? (
                      <span><span style={{ marginRight: 4 }}>{Icons.check()}</span>Added</span>
                    ) : (
                      <span style={{ color: '#9ca3af' }}>Not added</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
            {error && (
              <div style={{ 
                background: '#f0f9ff', 
                border: '1px solid #bae6fd', 
                color: '#0369a1', 
                padding: '16px 20px', 
                borderRadius: 16, 
                marginBottom: 16,
                textAlign: 'center',
                fontWeight: 500,
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}>
                <span style={{ fontSize: 18 }}>💡</span>
                <span>{error}</span>
              </div>
            )}
          </div>
        );

      default:
        return null;
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
      
      {/* Progress Bar */}
      <div style={{ 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        marginTop: 24, 
        marginBottom: 32 
      }}>
        <div style={{ 
          width: '80%', 
          maxWidth: 400, 
          background: '#f3f4f6', 
          borderRadius: 20, 
          padding: 4,
          position: 'relative'
        }}>
          <div style={{ 
            width: `${(currentStep / steps.length) * 100}%`, 
            height: '100%', 
            background: 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)', 
            borderRadius: 16, 
            transition: 'width 0.5s ease'
          }}></div>
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            color: '#7c3aed', 
            fontWeight: 600, 
            fontSize: 14 
          }}>
            Step {currentStep} of {steps.length}
          </div>
        </div>
      </div>

      {/* Step Indicators */}
      <div style={{ 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        marginBottom: 32 
      }}>
        <div style={{ 
          display: 'flex', 
          gap: 16, 
          flexWrap: 'wrap', 
          justifyContent: 'center' 
        }}>
          {steps.map((step, index) => (
            <div key={step.id} style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: 8 
            }}>
              <div style={{ 
                width: 48, 
                height: 48, 
                borderRadius: '50%', 
                background: currentStep >= step.id ? 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)' : '#f3f4f6',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: 20,
                color: currentStep >= step.id ? '#fff' : '#9ca3af',
                transition: 'all 0.3s ease',
                boxShadow: currentStep >= step.id ? '0 4px 12px #a78bfa33' : 'none'
              }}>
                {step.icon()}
              </div>
              <span style={{ 
                fontSize: 12, 
                color: currentStep >= step.id ? '#7c3aed' : '#9ca3af', 
                fontWeight: 500 
              }}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Card */}
      <main style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '50vh', margin: '0 0 2rem 0' }}>
        <div className="cta-glassy-purple-card" style={{ maxWidth: 500, padding: '3rem 2.5rem', width: '100%' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {renderStepContent()}
            
            {/* Navigation Buttons */}
            <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  style={{
                    flex: 1,
                    padding: '16px',
                    background: '#fff',
                    color: '#7c3aed',
                    border: '2px solid #7c3aed',
                    borderRadius: 16,
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  ← Previous
                </button>
              )}
              
              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  style={{
                    flex: 1,
                    padding: '16px',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 16,
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px #a78bfa33'
                  }}
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    padding: '16px',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 16,
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px #a78bfa33'
                  }}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </button>
              )}
            </div>
          </form>
          
          {/* Login Links */}
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button
              type="button"
              onClick={() => navigate("/login")}
              style={{ 
                color: '#7c3aed', 
                background: 'none', 
                border: 'none',
                fontWeight: 600, 
                cursor: 'pointer',
                fontSize: 14,
                marginBottom: 8
              }}
            >
              Already have an account? Login
            </button>
            <br />
            <button
              type="button"
              onClick={() => navigate("/register-user")}
              style={{ 
                color: '#7c3aed', 
                background: 'none', 
                border: 'none',
                fontWeight: 600, 
                cursor: 'pointer',
                fontSize: 14
              }}
            >
              Want to book tickets? Register as User
            </button>
          </div>
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

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
} 