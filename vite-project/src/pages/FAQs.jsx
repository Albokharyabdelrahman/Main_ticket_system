import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Home.css";

export default function FAQs() {
  const navigate = useNavigate();
  const numParticles = 18;
  const particles = Array.from({ length: numParticles });

  const faqs = [
    {
      q: "How do I book a ticket?",
      a: "Simply find your event, click 'Book Now', and follow the checkout process."
    },
    {
      q: "Can I cancel or refund my ticket?",
      a: "Refunds depend on the event's policy. Please check the event details or contact support."
    },
    {
      q: "How do I become an organizer?",
      a: "Register as an organizer during signup or update your role in your profile settings."
    },
    {
      q: "Where can I see my bookings?",
      a: "Log in and visit your dashboard to view all your bookings."
    },
    {
      q: "What payment methods are accepted?",
      a: "We accept major credit cards, debit cards, and select digital wallets."
    },
    {
      q: "How do I contact support?",
      a: "Use the Contact & Support link in the footer or header to reach us."
    }
  ];

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
        <div className="cta-glassy-purple-card" style={{ maxWidth: 600, padding: '3rem 2.5rem', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <span className="refined-title" style={{ fontSize: 28, color: '#7c3aed', fontWeight: 700 }}>Frequently Asked Questions</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ background: 'rgba(124,58,237,0.07)', borderRadius: 18, padding: '1.2rem 1.5rem', boxShadow: '0 2px 8px #a78bfa11' }}>
                <div style={{ fontWeight: 700, color: '#7c3aed', fontSize: 18, marginBottom: 6 }}>Q: {faq.q}</div>
                <div style={{ color: '#222', fontSize: 16, lineHeight: 1.6 }}>A: {faq.a}</div>
              </div>
            ))}
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
                <a href="/faqs">FAQs</a>
                <a href="/privacy">Privacy Policy</a>
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