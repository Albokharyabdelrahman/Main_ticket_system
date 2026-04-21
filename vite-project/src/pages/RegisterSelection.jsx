import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Home.css";

export default function RegisterSelection() {
  const navigate = useNavigate();
  const numParticles = 18;
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
      {/* Centered Large Logo */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 32, marginBottom: 0 }}>
        <img src={logo} alt="BookedIn Logo" style={{ width: 110, height: 'auto', borderRadius: 24, background: 'transparent' }} />
      </div>
      {/* Main Content */}
      <main style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', margin: '2.2rem 0 1.5rem 0' }}>
        <div style={{ maxWidth: 800, padding: '2rem', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <span className="refined-title" style={{ fontSize: 28, color: '#7c3aed', fontWeight: 700 }}>BookedIn</span>
            <div className="footer-glassy-slogan" style={{ marginBottom: 18 }}>click.book.enjoy</div>
            <h1 style={{ fontSize: 32, color: '#333', marginBottom: 16 }}>Choose Your Account Type</h1>
            <p style={{ fontSize: 16, color: '#666', maxWidth: 500, margin: '0 auto' }}>
              Select the type of account that best fits your needs. You can always update your preferences later.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 32 }}>
            {/* User Registration Card */}
            <div className="cta-glassy-purple-card" style={{ padding: '2rem', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }} 
                 onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                 onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                 onClick={() => navigate('/register-user')}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎫</div>
              <h2 style={{ fontSize: 24, color: '#7c3aed', marginBottom: 12 }}>Event Attendee</h2>
              <p style={{ color: '#666', marginBottom: 20, lineHeight: 1.6 }}>
                Perfect for individuals who want to discover, book, and attend amazing events. 
                Browse events, purchase tickets, and manage your bookings.
              </p>
              <ul style={{ textAlign: 'left', color: '#555', marginBottom: 24, paddingLeft: 20 }}>
                <li>Browse and search events</li>
                <li>Purchase tickets easily</li>
                <li>Manage your bookings</li>
                <li>Get event notifications</li>
                <li>Access to exclusive deals</li>
              </ul>
              <button
                className="refined-book-btn"
                style={{
                  width: '100%',
                  background: 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  boxShadow: '0 2px 8px #a78bfa22',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px',
                  borderRadius: 10,
                  border: 'none',
                  fontSize: 16,
                }}
              >
                Register as User
              </button>
            </div>

            {/* Organizer Registration Card */}
            <div className="cta-glassy-purple-card" style={{ padding: '2rem', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                 onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                 onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                 onClick={() => navigate('/register-organizer')}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎪</div>
              <h2 style={{ fontSize: 24, color: '#7c3aed', marginBottom: 12 }}>Event Organizer</h2>
              <p style={{ color: '#666', marginBottom: 20, lineHeight: 1.6 }}>
                Ideal for businesses, organizations, and individuals who want to create and manage events. 
                Sell tickets, manage attendees, and grow your audience.
              </p>
              <ul style={{ textAlign: 'left', color: '#555', marginBottom: 24, paddingLeft: 20 }}>
                <li>Create and manage events</li>
                <li>Sell tickets online</li>
                <li>Track attendance and analytics</li>
                <li>Manage event details</li>
                <li>Access to marketing tools</li>
              </ul>
              <button
                className="refined-book-btn"
                style={{
                  width: '100%',
                  background: 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  boxShadow: '0 2px 8px #a78bfa22',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px',
                  borderRadius: 10,
                  border: 'none',
                  fontSize: 16,
                }}
              >
                Register as Organizer
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="refined-more-btn"
              style={{ color: '#7c3aed', background: 'none', fontWeight: 600, border: 'none', fontSize: 16 }}
            >
              Already have an account? Login
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
    </div>
  );
} 