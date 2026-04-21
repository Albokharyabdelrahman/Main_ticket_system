import React, { useEffect, useState } from "react";
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

const CATEGORY_ICONS = {
  sports: "⚽",
  music: "🎵",
  talks: "🎤",
  comedy: "😂",
  theatre: "🎭",
};

export default function CategoryEvents() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:7000/api/v1/events/future")
      .then(res => {
        const filtered = (res.data || []).filter(e => (e.category || '').toLowerCase() === categoryName.toLowerCase());
        setEvents(filtered);
      })
      .finally(() => setLoading(false));
  }, [categoryName]);

  // Pick an icon for the category
  const icon = CATEGORY_ICONS[categoryName?.toLowerCase()] || "🎫";

  return (
    <div style={{ background: '#fff', minHeight: '100vh', width: '100vw', position: 'relative', overflow: 'hidden' }}>
      {/* Floating ticket background */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }}>
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
      <div className="category-events-page" style={{ position: 'relative', zIndex: 1, maxWidth: 1400, margin: '0 auto' }}>
        {/* Clickable logo */}
        <div
          className="category-logo-circle"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="Home" style={{ width: 38, height: 38 }} />
        </div>
        <button className="category-back-btn" style={{ marginLeft: 110, marginTop: 24 }} onClick={() => navigate(-1)}>&larr; Back</button>
        <h1 className="category-events-title gradient-category-title">
          <span className="category-title-icon">{icon}</span> {categoryName} Events
        </h1>
        {loading ? (
          <div className="category-events-spinner-container">
            <div className="category-events-spinner"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="category-events-empty">No upcoming events in this category.</div>
        ) : (
          <div className="category-events-grid">
            {events.map(event => {
              const eventDate = event.date ? new Date(event.date) : null;
              return (
                <div className="category-event-card glassy-purple-info" key={event._id} onClick={() => navigate(`/public-event-details/${event._id}`)} style={{ cursor: 'pointer' }}>
                  <div className="category-event-image-wrapper">
                    {event.image ? (
                      <img src={event.image} alt={event.title} className="category-event-image" />
                    ) : (
                      <div className="category-event-image-fallback" />
                    )}
                  </div>
                  <div className="category-event-info">
                    <div className="category-event-title">{event.title}</div>
                    <div className="category-event-date">
                      {eventDate && eventDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      {eventDate && ' | ' + eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="category-event-location">{event.location}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 