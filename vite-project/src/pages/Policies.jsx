import React from "react";
import logo from "../assets/logo.png";
import "./Home.css";
import { useNavigate } from "react-router-dom";

export default function Policies() {
  const navigate = useNavigate();
  const numParticles = 12;
  const particles = Array.from({ length: numParticles });

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
      {/* Main Content Card */}
      <main style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '60vh', margin: '2.2rem 0 1.5rem 0' }}>
        <div className="cta-glassy-purple-card" style={{ maxWidth: 700, padding: '3rem 2.5rem', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <span className="refined-title" style={{ fontSize: 28, color: '#7c3aed', fontWeight: 700 }}>Policies</span>
            <div className="footer-glassy-slogan" style={{ marginBottom: 18 }}>click.book.enjoy</div>
          </div>
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ color: '#7c3aed', fontSize: 22, fontWeight: 700, marginBottom: 12 }}>General Policy</h2>
            <p style={{ color: '#222', fontSize: 16, marginBottom: 10 }}>
              We are committed to providing a safe, fair, and enjoyable ticketing experience for all users. Please read our policies below.
            </p>
          </section>
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ color: '#7c3aed', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Refund Policy</h2>
            <p style={{ color: '#222', fontSize: 16, marginBottom: 10 }}>
              All ticket sales are final unless the event is cancelled. In the event of cancellation, refunds will be processed automatically to the original payment method.
            </p>
          </section>
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ color: '#7c3aed', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Privacy Policy</h2>
            <p style={{ color: '#222', fontSize: 16, marginBottom: 10 }}>
              We respect your privacy and protect your data. For more details, please see our <a href="/privacy" style={{ color: '#7c3aed', textDecoration: 'underline' }}>Privacy Policy</a>.
            </p>
          </section>
          <section>
            <h2 style={{ color: '#7c3aed', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Contact</h2>
            <p style={{ color: '#222', fontSize: 16, marginBottom: 10 }}>
              If you have any questions about our policies, please <a href="/contact" style={{ color: '#7c3aed', textDecoration: 'underline' }}>contact us</a>.
            </p>
          </section>
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