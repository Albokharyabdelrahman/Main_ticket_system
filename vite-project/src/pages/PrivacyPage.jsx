import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Home.css";
import React from "react";

export default function PrivacyPage() {
  const navigate = useNavigate();
  const numParticles = 18;
  const particles = Array.from({ length: numParticles });

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
        <div className="cta-glassy-purple-card" style={{ maxWidth: 800, padding: '3rem 2.5rem' }}>
          <h1 className="refined-title" style={{ textAlign: 'center', marginBottom: 24 }}>Privacy Policy</h1>
          <div style={{ color: '#444', fontSize: 16 }}>
            <section style={{ marginBottom: 28 }}>
              <h2 className="refined-title" style={{ fontSize: 20, color: '#6b46c1', marginBottom: 10 }}>1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us when you create an account, purchase tickets, or contact us. This may include your name, email address, payment information, and event preferences.
              </p>
            </section>
            <section style={{ marginBottom: 28 }}>
              <h2 className="refined-title" style={{ fontSize: 20, color: '#6b46c1', marginBottom: 10 }}>2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul style={{ paddingLeft: 24, margin: '15px 0', color: '#475569' }}>
                <li>Process transactions and send you tickets</li>
                <li>Communicate with you about events and updates</li>
                <li>Improve our services and website</li>
                <li>Prevent fraud and ensure security</li>
                <li>Personalize your experience based on your preferences</li>
              </ul>
            </section>
            <section style={{ marginBottom: 28 }}>
              <h2 className="refined-title" style={{ fontSize: 20, color: '#6b46c1', marginBottom: 10 }}>3. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information. All payment transactions are encrypted using SSL technology.
              </p>
            </section>
            <section style={{ marginBottom: 28 }}>
              <h2 className="refined-title" style={{ fontSize: 20, color: '#6b46c1', marginBottom: 10 }}>4. Your Rights</h2>
              <p>
                You have the right to access, correct, or delete your personal information. You can update your account details at any time through your profile settings.
              </p>
            </section>
            <section style={{ marginBottom: 28 }}>
              <h2 className="refined-title" style={{ fontSize: 20, color: '#6b46c1', marginBottom: 10 }}>5. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on our website.
              </p>
            </section>
            <p style={{ fontSize: 14, color: '#64748b', textAlign: 'right', marginTop: 40, fontStyle: 'italic' }}>
              Last updated: {new Date().toLocaleDateString()}
            </p>
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
    </div>
  );
}
