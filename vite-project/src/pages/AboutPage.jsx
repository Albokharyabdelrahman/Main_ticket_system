import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Home.css";

const AboutPage = () => {
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
        <div className="cta-glassy-purple-card" style={{ maxWidth: 900, padding: '3rem 2.5rem' }}>
          <h1 className="refined-title" style={{ textAlign: 'center', marginBottom: 24 }}>About BookedIn</h1>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 className="hero-title" style={{ color: '#7c3aed', fontSize: 24, marginBottom: 10 }}>Your Gateway to Unforgettable Events</h2>
            <p style={{ color: '#444', fontSize: 18, marginBottom: 0 }}>
              BookedIn is the premier platform for discovering and booking tickets to the most exciting events in your city and beyond.
            </p>
          </div>
          <div style={{ marginBottom: 32 }}>
            <h2 className="refined-title" style={{ fontSize: 20, color: '#6b46c1', marginBottom: 10 }}>Our Mission</h2>
            <p style={{ color: '#444', fontSize: 16 }}>
              We believe everyone should have access to amazing experiences. Our mission is to connect people with events that inspire, entertain, and create lasting memories.
            </p>
          </div>
          <div style={{ marginBottom: 32 }}>
            <h2 className="refined-title" style={{ fontSize: 20, color: '#6b46c1', marginBottom: 10 }}>Why Choose BookedIn?</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: 24, minWidth: 180, flex: 1, maxWidth: 220 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🎯</div>
                <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: 6 }}>Curated Selection</div>
                <div style={{ color: '#64748b', fontSize: 15 }}>We handpick the best events so you don't have to.</div>
              </div>
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: 24, minWidth: 180, flex: 1, maxWidth: 220 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>⚡</div>
                <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: 6 }}>Instant Booking</div>
                <div style={{ color: '#64748b', fontSize: 15 }}>Secure your tickets in just a few clicks.</div>
              </div>
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: 24, minWidth: 180, flex: 1, maxWidth: 220 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🔒</div>
                <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: 6 }}>Secure Payments</div>
                <div style={{ color: '#64748b', fontSize: 15 }}>Your transactions are always protected.</div>
              </div>
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: 24, minWidth: 180, flex: 1, maxWidth: 220 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📱</div>
                <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: 6 }}>Mobile Friendly</div>
                <div style={{ color: '#64748b', fontSize: 15 }}>Book on the go with our optimized platform.</div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="refined-title" style={{ fontSize: 20, color: '#6b46c1', marginBottom: 10 }}>Our Team</h2>
            <p style={{ color: '#444', fontSize: 16 }}>
              We're a passionate group of event enthusiasts, tech experts, and customer service professionals dedicated to making your event experience seamless.
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
                {/* About Us link removed on About page */}
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

export default AboutPage;
