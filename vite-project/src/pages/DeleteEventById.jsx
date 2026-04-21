import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const purpleTheme = {
  "--primary-purple": "#7c3aed",
  "--secondary-purple": "#a78bfa",
  "--accent-purple": "#c4b5fd",
  "--glass-bg": "rgba(124, 58, 237, 0.15)",
  "--glass-border": "rgba(124, 58, 237, 0.25)",
  "--header-gradient": "linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)",
};

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

const DeleteEventById = () => {
  const [eventId, setEventId] = useState("");
  const [eventData, setEventData] = useState(null);
  const [error, setError] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    Object.entries(purpleTheme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes ticketFloat {
        0% { transform: translateY(0) scale(1) rotate(-8deg); opacity: 0.22; }
        100% { transform: translateY(-30px) scale(1.08) rotate(8deg); opacity: 0.28; }
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!eventId.trim()) {
      setError("Please enter an Event ID.");
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:7000/api/v1/events/${eventId.trim()}`,
        { withCredentials: true }
      );
      setEventData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Event not found or unauthorized.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:7000/api/v1/events/${eventId.trim()}`,
        { withCredentials: true }
      );
      navigate(-1, { state: { message: "Event deleted successfully!" } });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete event.");
      setIsConfirming(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff", position: 'relative', overflow: 'hidden', padding: 0, margin: 0 }}>
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
      {/* Header */}
      <div style={{ background: "var(--header-gradient)", color: "white", padding: "2.5rem 2rem 4rem 2rem", borderBottomLeftRadius: 40, borderBottomRightRadius: 40, boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)", position: "relative", marginBottom: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ background: '#fff', borderRadius: '50%', width: 70, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px #a78bfa22', cursor: 'pointer' }} onClick={() => navigate(-1)}>
            <img src={logo} alt="Logo" style={{ width: 48, height: 48, borderRadius: '50%', boxShadow: '0 2px 8px #a78bfa', objectFit: 'cover' }} />
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: '#fff', textShadow: '0 2px 8px #a78bfa' }}>Delete Event</h1>
        </div>
      </div>
      {/* Form/Card */}
      <div style={{ width: '100%', maxWidth: 600, margin: '0 auto', background: 'rgba(124, 58, 237, 0.18)', borderRadius: 24, padding: '40px 30px', boxShadow: '0 4px 24px #a78bfa33', color: '#fff', backdropFilter: 'blur(14px)', position: 'relative', zIndex: 1, textAlign: 'center' }}>
        {!eventData ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <input
              type="text"
              placeholder="Enter Event ID"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              style={{ padding: '14px 16px', fontSize: 16, borderRadius: 12, border: '1.5px solid var(--glass-border)', width: '100%', outline: 'none', backgroundColor: '#fff', color: '#7c3aed', fontWeight: 500, marginBottom: 10 }}
            />
            <button type="submit" style={{ padding: '14px 0', fontSize: 16, borderRadius: 12, border: 'none', background: 'var(--primary-purple)', color: 'white', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px #a78bfa22', transition: 'background 0.3s ease' }}>
              Find Event
            </button>
          </form>
        ) : !isConfirming ? (
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: '#7c3aed', textAlign: 'center', paddingBottom: 16, borderBottom: '2px solid #a78bfa' }}>{eventData.title}</h2>
            <div style={{ margin: '12px 0', fontSize: 16, display: 'flex', justifyContent: 'space-between', padding: '12px 20px', backgroundColor: 'rgba(124, 58, 237, 0.08)', borderRadius: 10, alignItems: 'center', color: '#fff' }}>
              <span style={{ fontWeight: 600, color: '#a78bfa', fontSize: 15 }}>Location:</span>
              <span style={{ color: '#fff', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{eventData.location}</span>
            </div>
            <div style={{ margin: '12px 0', fontSize: 16, display: 'flex', justifyContent: 'space-between', padding: '12px 20px', backgroundColor: 'rgba(124, 58, 237, 0.08)', borderRadius: 10, alignItems: 'center', color: '#fff' }}>
              <span style={{ fontWeight: 600, color: '#a78bfa', fontSize: 15 }}>Date:</span>
              <span style={{ color: '#fff', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{new Date(eventData.date).toLocaleString()}</span>
            </div>
            <div style={{ margin: '12px 0', fontSize: 16, display: 'flex', justifyContent: 'space-between', padding: '12px 20px', backgroundColor: 'rgba(124, 58, 237, 0.08)', borderRadius: 10, alignItems: 'center', color: '#fff' }}>
              <span style={{ fontWeight: 600, color: '#a78bfa', fontSize: 15 }}>Status:</span>
              <span style={{ color: '#fff', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{eventData.status}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 32, flexWrap: 'wrap' }}>
              <button 
                onClick={() => setIsConfirming(true)} 
                style={{ padding: '14px 28px', fontSize: 16, borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #ff9800, #ff7043)', color: 'white', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px #a78bfa22', transition: 'all 0.3s ease', minWidth: 180 }}
              >
                Delete Event
              </button>
              <button 
                onClick={() => {
                  setEventData(null);
                  setEventId("");
                }} 
                style={{ padding: '14px 28px', fontSize: 16, borderRadius: 12, border: 'none', background: 'var(--primary-purple)', color: 'white', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px #a78bfa22', transition: 'all 0.3s ease', minWidth: 180 }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 48, color: '#e53e3e', marginBottom: 16, filter: 'drop-shadow(0 2px 4px #a78bfa33)' }}>⚠️</div>
            <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: '#7c3aed', textAlign: 'center', paddingBottom: 16, borderBottom: '2px solid #a78bfa' }}>Confirm Deletion</h2>
            <p style={{ fontSize: 18, fontWeight: 600, color: '#a78bfa', margin: '24px 0', lineHeight: 1.6 }}>
              Are you sure you want to permanently delete<br />
              <strong style={{ color: '#e53e3e' }}>
                "{eventData.title}"
              </strong>?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 32, flexWrap: 'wrap' }}>
              <button 
                onClick={handleDelete} 
                style={{ padding: '14px 28px', fontSize: 16, borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #ff9800, #ff7043)', color: 'white', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px #a78bfa22', transition: 'all 0.3s ease', minWidth: 180 }}
              >
                Confirm Delete
              </button>
              <button 
                onClick={() => setIsConfirming(false)} 
                style={{ padding: '14px 28px', fontSize: 16, borderRadius: 12, border: 'none', background: 'var(--primary-purple)', color: 'white', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px #a78bfa22', transition: 'all 0.3s ease', minWidth: 180 }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {error && <p style={{ color: '#ff6b6b', fontWeight: 700, marginTop: 20, textShadow: '0 1px 2px rgba(0,0,0,0.25)', fontSize: 16, backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: 8, padding: '12px 20px' }}>{error}</p>}
      </div>
    </div>
  );
};

export default DeleteEventById;