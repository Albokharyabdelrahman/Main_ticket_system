import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";
import "./Home.css";

const API_BASE_URL = "http://localhost:7000/api/v1";

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

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{ background: 'white', borderRadius: 12, padding: 32, maxWidth: 400, width: '90%', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: '#7c3aed', marginBottom: 16 }}>{title}</h3>
        <p style={{ fontSize: 16, color: '#4b2997', marginBottom: 24 }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button style={{ background: '#ede9fe', color: '#7c3aed', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }} onClick={onClose}>Cancel</button>
          <button style={{ background: 'linear-gradient(90deg,#a78bfa,#7c3aed)', color: 'white', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }} onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState("");
  const [bookingMsg, setBookingMsg] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [ticketsInput, setTicketsInput] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_BASE_URL}/events/${id}`)
      .then(res => setEvent(res.data))
      .catch(() => setError("Event not found."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async () => {
    setBookingLoading(true);
    setBookingMsg("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/bookings`,
        {
          eventId: id,
          ticketsBooked: Number(quantity),
          totalPrice: Number(quantity) * Number(event.price)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setBookingMsg("Booking successful!");
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || "Booking failed.";
      setBookingMsg(errorMsg);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="category-events-spinner-container"><div className="category-events-spinner"></div></div>;
  if (error) return <div style={{ color: '#e74c3c', textAlign: 'center', marginTop: 40 }}>{error}</div>;
  if (!event) return null;

  const eventDate = event.date ? new Date(event.date) : null;

  return (
    <div className="home-wrapper home-bg-white" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', background: '#fff' }}>
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
      <main style={{ width: '100%', display: 'block', minHeight: '60vh', margin: '2.2rem 0 1.5rem 0' }}>
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
          <div style={{ display: 'flex', maxWidth: 700, width: '100%', alignItems: 'stretch', gap: 0 }}>
            {/* Left card: title, date, location, booking controls */}
            <div style={{ flex: 2, background: 'rgba(124,58,237,0.08)', borderRadius: '0 0 0 28px', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 320, boxShadow: '0 2px 8px #a78bfa11' }}>
              <h1 className="refined-title" style={{ fontSize: 32, color: '#7c3aed', fontWeight: 800, marginBottom: 8 }}>{event.title}</h1>
              <div style={{ color: '#7c3aed', fontWeight: 600, fontSize: 18, marginBottom: 6 }}>
                {eventDate && eventDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                {eventDate && ' | ' + eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div style={{ color: '#222', fontSize: 16, marginBottom: 18 }}>{event.location}</div>
              {/* Booking controls */}
              <div style={{ marginTop: 8, marginBottom: 8 }}>
                <label style={{ fontWeight: 600, color: '#7c3aed', fontSize: 16, marginRight: 12 }}>Tickets:</label>
                <input
                  type="number"
                  min={1}
                  max={event.availableTickets}
                  value={quantity}
                  onChange={e => {
                    const val = e.target.value;
                    if (val === "") setQuantity("");
                    else setQuantity(Math.max(1, Math.min(event.availableTickets, Number(val))));
                  }}
                  placeholder="Enter quantity"
                  style={{ width: 60, padding: 8, borderRadius: 8, border: '1.5px solid #a78bfa', fontSize: 16, marginRight: 12 }}
                />
                <button
                  onClick={handleBook}
                  disabled={
                    bookingLoading ||
                    quantity === "" ||
                    isNaN(quantity) ||
                    Number(quantity) < 1 ||
                    Number(quantity) > event.availableTickets
                  }
                  style={{
                    background: 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)',
                    color: '#fff',
                    fontWeight: 700,
                    border: 'none',
                    borderRadius: 10,
                    padding: '10px 28px',
                    fontSize: 16,
                    boxShadow: '0 2px 8px #a78bfa22',
                    cursor: bookingLoading ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s',
                  }}
                >
                  {bookingLoading ? 'Booking...' : 'Book Now'}
                </button>
              </div>
              {bookingMsg && <div style={{ color: bookingMsg.includes('success') ? 'green' : '#e74c3c', fontWeight: 600, marginTop: 8 }}>{bookingMsg}</div>}
            </div>
            {/* Vertical separator */}
            <div style={{ width: 2, background: 'rgba(124,58,237,0.13)', margin: '1.2rem 0', borderRadius: 2 }} />
            {/* Right card: Organizer */}
            <div style={{ flex: 1.2, background: 'rgba(124,58,237,0.08)', borderRadius: '0 0 28px 0', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 180, boxShadow: '0 2px 8px #a78bfa11' }}>
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