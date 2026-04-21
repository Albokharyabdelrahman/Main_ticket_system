import React, { useState } from "react";
import axios from "axios";
import logo from "./logo.png";  // Adjust path accordingly
import { useNavigate } from "react-router-dom"; // if you use react-router
import ticketImg from "./logo.png";

const FindBooking = () => {
  const [bookingId, setBookingId] = useState("");
  const [bookingData, setBookingData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // react-router navigation hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBookingData(null);

    if (!bookingId.trim()) {
      setError("Please enter a Booking ID.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:7000/api/v1/bookings/${bookingId.trim()}`,
        { withCredentials: true }
      );
      setBookingData(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Booking not found or unauthorized."
      );
    }
  };

  const handleLogoClick = () => {
    navigate("/UserDashboard");
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'Inter', sans-serif", position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {/* Floating tickets */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
        {ticketPositions.map((pos, i) => (
          <img
            key={i}
            src={ticketImg}
            alt="ticket"
            style={{
              position: 'absolute',
              opacity: 0.22,
              filter: 'blur(1.5px) drop-shadow(0 2px 12px #a78bfa88)',
              userSelect: 'none',
              zIndex: 0,
              pointerEvents: 'none',
              transition: 'opacity 0.3s',
              animation: 'ticketFloat 8s ease-in-out infinite alternate',
              willChange: 'transform, opacity',
              top: pos.top,
              left: pos.left,
              right: pos.right,
              bottom: pos.bottom,
              width: pos.size,
              height: 'auto',
              transform: `rotate(${pos.rot}deg)`,
              animationDelay: `${pos.delay}s`,
            }}
            draggable={false}
          />
        ))}
      </div>
      {/* Logo top right */}
      <div style={{ position: 'absolute', top: 24, right: 32, width: 60, height: 60, cursor: 'pointer', zIndex: 2, background: 'white', borderRadius: '50%', padding: 5, boxShadow: '0 2px 10px #a78bfa22' }} onClick={handleLogoClick} title="Go to Home">
        <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
      <div style={{ maxWidth: 500, width: '100%', background: 'rgba(124, 58, 237, 0.18)', border: '1.5px solid #a78bfa', borderRadius: 28, boxShadow: '0 8px 32px 0 #a78bfa33, 0 1.5px 8px #a78bfa44', color: '#4b2997', backdropFilter: 'blur(18px)', padding: 36, marginTop: 60, marginBottom: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 24, color: '#4b2997', textAlign: 'center', letterSpacing: 1 }}>Find Booking</h1>
        <form onSubmit={handleSubmit} style={{ marginBottom: 32, display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', width: '100%' }}>
          <input
            type="text"
            placeholder="Enter Booking ID"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            style={{ padding: '14px 16px', fontSize: 16, borderRadius: 12, border: '1.5px solid #a78bfa', width: 260, outline: 'none', background: 'rgba(255,255,255,0.95)', color: '#4b2997', fontWeight: 600, boxShadow: '0 2px 8px #a78bfa11', transition: 'border 0.2s, box-shadow 0.2s' }}
          />
          <button type="submit" style={{ padding: '14px 28px', fontSize: 16, borderRadius: 12, border: 'none', background: 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)', color: 'white', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px #a78bfa22', transition: 'background 0.3s ease', minWidth: 120 }}>Search</button>
        </form>
        {error && <p style={{ color: '#f87171', fontWeight: 700, marginTop: 10, marginBottom: 0, textAlign: 'center', fontSize: 16 }}>{error}</p>}
        {bookingData && (
          <div style={{ marginTop: 24, width: '100%', borderRadius: 20, background: 'rgba(255,255,255,0.95)', boxShadow: '0 8px 24px #a78bfa22', padding: '28px 20px', color: '#4b2997', textAlign: 'left', border: '1.5px solid #a78bfa' }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 16, color: '#7c3aed' }}>🎫 {bookingData.eventId.title}</h2>
            <p style={{ margin: '8px 0', fontWeight: 600 }}><span style={{ color: '#a78bfa' }}>📍 Location:</span> {bookingData.eventId.location}</p>
            <p style={{ margin: '8px 0', fontWeight: 600 }}><span style={{ color: '#a78bfa' }}>📅 Date:</span> {new Date(bookingData.eventId.date).toLocaleString()}</p>
            <p style={{ margin: '8px 0', fontWeight: 600 }}><span style={{ color: '#a78bfa' }}>🪑 Tickets Booked:</span> {bookingData.ticketsBooked}</p>
            <p style={{ margin: '8px 0', fontWeight: 600 }}><span style={{ color: '#a78bfa' }}>💰 Total Price:</span> ${bookingData.totalPrice}</p>
            <p style={{ margin: '8px 0', fontWeight: 600 }}><span style={{ color: '#a78bfa' }}>📌 Status:</span> {bookingData.status}</p>
            <p style={{ margin: '8px 0', fontWeight: 600 }}><span style={{ color: '#a78bfa' }}>🕒 Booking Date:</span> {new Date(bookingData.bookingDate).toLocaleString()}</p>
            <p style={{ margin: '8px 0', fontWeight: 600 }}><span style={{ color: '#a78bfa' }}>🆔 Booking ID:</span> {bookingData._id}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Floating ticket positions and animation
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

// Add ticketFloat animation to the page
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes ticketFloat {
      0% { transform: translateY(0) scale(1) rotate(-8deg); opacity: 0.22; }
      100% { transform: translateY(-30px) scale(1.08) rotate(8deg); opacity: 0.28; }
    }
  `;
  if (!document.getElementById('ticket-float-style')) {
    style.id = 'ticket-float-style';
    document.head.appendChild(style);
  }
}

export default FindBooking;