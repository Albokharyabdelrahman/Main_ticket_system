import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Home.css";
import React, { useState } from "react";

export default function ContactPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const numParticles = 18;
  const particles = Array.from({ length: numParticles });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      navigate(-1);
    }, 2000);
  };

  return (
    <div className="home-wrapper home-bg-white">
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
      {/* Main Content Card */}
      <main style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', margin: '3.5rem 0' }}>
        <div className="cta-glassy-purple-card" style={{ maxWidth: 700, padding: '3rem 2.5rem' }}>
          <h1 className="refined-title" style={{ textAlign: 'center', marginBottom: 24 }}>Contact Us</h1>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <h2 style={{ color: '#7c3aed', fontSize: 22, marginBottom: 10 }}>📩 Get in Touch</h2>
            <p style={{ color: '#444', fontSize: 16, marginBottom: 0 }}>
              Have questions or feedback? We'd love to hear from you!
            </p>
          </div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start', color: '#334155', fontSize: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ fontSize: 20 }}>📧</span> <span>Email: support@bookedin.com</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ fontSize: 20 }}>📞</span> <span>Phone: +1 (555) 123-4567</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ fontSize: 20 }}>🏢</span> <span>Address: 123 Event Street, Showtown, ST 12345</span></div>
            </div>
          </div>
          <form style={{ display: 'flex', flexDirection: 'column', gap: 18 }} onSubmit={handleSubmit}>
            <input type="text" placeholder="Your name" required style={{ padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 16, marginBottom: 6 }} />
            <input type="email" placeholder="Your email" required style={{ padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 16, marginBottom: 6 }} />
            <textarea placeholder="Your message" rows={5} required style={{ padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 16, marginBottom: 6, resize: 'vertical' }} />
            <button type="submit" style={{ padding: '14px 24px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-start' }}>Send Message</button>
            {submitted && <p style={{ color: '#16a34a', fontWeight: 600, marginTop: 10 }}>✅ Your message has been sent!</p>}
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
                {/* Contact Us link removed on Contact page */}
                <a href="/privacy">Policies</a>
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
