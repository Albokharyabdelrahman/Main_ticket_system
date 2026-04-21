import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";
import "./Home.css";

const ticketPositions = [
  { top: 40, left: 60, size: 120, rot: -8, delay: 0 },
  { top: 120, left: 320, size: 100, rot: 12, delay: 1 },
  { top: 300, left: 180, size: 90, rot: 6, delay: 2 },
  { top: 500, left: 80, size: 110, rot: -10, delay: 3 },
  { top: 80, right: 120, size: 130, rot: 8, delay: 1.5 },
  { top: 260, right: 60, size: 100, rot: -6, delay: 2.5 },
  { bottom: 120, left: 200, size: 140, rot: 10, delay: 2 },
  { bottom: 60, right: 180, size: 110, rot: -12, delay: 3.5 },
  { bottom: 200, right: 60, size: 100, rot: 4, delay: 1.2 },
  { bottom: 40, left: 60, size: 120, rot: 0, delay: 2.8 },
  { top: 180, left: 600, size: 100, rot: 7, delay: 2.2 },
  { bottom: 300, right: 320, size: 90, rot: -7, delay: 1.7 },
  { top: 400, right: 400, size: 110, rot: 5, delay: 2.9 },
];

export default function PublicEventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:7000/api/v1/events/${id}`)
      .then(res => setEvent(res.data))
      .catch(() => setError("Event not found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="category-events-spinner-container"><div className="category-events-spinner"></div></div>;
  if (error) return <div style={{ color: '#e74c3c', textAlign: 'center', marginTop: 40 }}>{error}</div>;
  if (!event) return null;

  const eventDate = event.date ? new Date(event.date) : null;

  return (
    <div className="home-wrapper home-bg-white" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, #ede9fe 0%, #fff 60%)' }}>
      {/* Floating ticket background */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
        {ticketPositions.map((pos, i) => (
          <img
            key={i}
            src={logo}
            alt="ticket"
            style={{
              position: 'absolute',
              opacity: 0.22,
              filter: 'blur(1.5px) drop-shadow(0 2px 12px #a78bfa88)',
              userSelect: 'none',
              zIndex: 0,
              pointerEvents: 'none',
              width: pos.size,
              height: 'auto',
              top: pos.top,
              left: pos.left,
              right: pos.right,
              bottom: pos.bottom,
              transform: `rotate(${pos.rot}deg)`,
              animation: 'ticketFloat 8s ease-in-out infinite alternate',
              animationDelay: `${pos.delay}s`,
            }}
            draggable={false}
          />
        ))}
      </div>
      <div className="category-logo-circle" style={{ position: 'absolute', top: 32, left: 32, cursor: 'pointer', zIndex: 10 }} onClick={() => navigate(-1)}>
        <img src={logo} alt="BookedIn Logo" style={{ width: 40, height: 40, borderRadius: '50%' }} />
      </div>
      {/* Large event image at the top */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 48, marginBottom: 0 }}>
        <div style={{ width: '100%', maxWidth: 700, background: '#fff', borderRadius: '28px 28px 0 0', boxShadow: '0 2px 24px #a78bfa22', overflow: 'hidden', minHeight: 320, minWidth: 320 }}>
          {event.image ? (
            <img src={event.image} alt={event.title} style={{ width: '100%', height: 320, objectFit: 'cover', background: '#fff', display: 'block' }} />
          ) : (
            <div style={{ width: '100%', height: 320, background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa', fontSize: 32, fontWeight: 700 }}>No Image</div>
          )}
        </div>
      </div>
      {/* Info cards below image */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: -12, marginBottom: 0 }}>
        <div style={{ display: 'flex', maxWidth: 700, width: '100%', alignItems: 'stretch' }}>
          {/* Left card: title, date, location, Book Now */}
          <div style={{ flex: 2, background: 'rgba(124,58,237,0.08)', borderRadius: '0 0 0 28px', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 2px 8px #a78bfa11' }}>
            <h1 style={{ fontSize: 28, color: '#7c3aed', fontWeight: 800, marginBottom: 8 }}>{event.title}</h1>
            <div style={{ color: '#7c3aed', fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
              {eventDate && eventDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              {eventDate && ' | ' + eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div style={{ color: '#222', fontSize: 15, marginBottom: 18 }}>{event.location}</div>
            <button
              className="refined-book-btn"
              style={{
                background: 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)',
                color: '#fff',
                fontWeight: 700,
                border: 'none',
                borderRadius: 12,
                padding: '12px 32px',
                fontSize: 17,
                boxShadow: '0 2px 8px #a78bfa22',
                cursor: 'pointer',
                transition: 'background 0.2s',
                minWidth: 120,
                marginTop: 8,
                alignSelf: 'flex-start'
              }}
              onClick={() => navigate('/login')}
            >
              <span className="refined-book-btn-icon" style={{ marginRight: 10, fontSize: 20 }}>🎟️</span> Book Now
            </button>
          </div>
          {/* Vertical separator */}
          <div style={{ width: 2, background: 'rgba(124,58,237,0.13)', margin: '1.2rem 0', borderRadius: 2 }} />
          {/* Right card: Organizer */}
          <div style={{ flex: 1.2, background: 'rgba(124,58,237,0.08)', borderRadius: '0 0 28px 0', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px #a78bfa11' }}>
            <div style={{ color: '#7c3aed', fontWeight: 700, fontSize: 15, marginBottom: 8, width: '100%', textAlign: 'center' }}>Organized by</div>
            {event.organizerProfilePic ? (
              <img src={event.organizerProfilePic} alt={event.organizerName} style={{ width: 140, height: 60, borderRadius: 16, objectFit: 'cover', background: '#fff', marginBottom: 8 }} />
            ) : (
              <div style={{ width: 140, height: 60, borderRadius: 16, background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa', fontWeight: 700, fontSize: 22, marginBottom: 8 }}>?</div>
            )}
            <div style={{ color: '#7c3aed', fontWeight: 800, fontSize: 18, textAlign: 'center' }}>{event.organizerName}</div>
          </div>
        </div>
      </div>
      {/* About Event section */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 32 }}>
        <div style={{ maxWidth: 700, width: '100%', background: 'rgba(124,58,237,0.06)', borderRadius: 18, boxShadow: '0 2px 8px #a78bfa11', padding: '1.7rem 2.2rem', display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start' }}>
          <div style={{ color: '#222', fontWeight: 800, fontSize: 20, marginBottom: 8, letterSpacing: 0.2, fontFamily: "'Times New Roman', Times, serif" }}>About Event</div>
          <div style={{
            color: '#222',
            fontSize: 20,
            lineHeight: 1.85,
            marginBottom: 0,
            fontWeight: 400,
            fontFamily: "'Times New Roman', Times, serif",
            background: 'rgba(124,58,237,0.04)',
            borderLeft: '4px solid #a78bfa',
            padding: '16px 18px',
            borderRadius: 8,
            boxShadow: '0 1px 4px #a78bfa11',
            letterSpacing: 0.1
          }}>{event.description}</div>
        </div>
      </div>
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