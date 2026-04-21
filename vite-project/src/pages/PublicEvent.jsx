import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "../assets/logo.png";

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

const EventsTable = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  // Floating ticket animation keyframes (must be inside component)
  useEffect(() => {
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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:7000/api/v1/events", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setEvents(response.data);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleLogoClick = () => {
    window.history.back();
  };

  // Extract unique categories for dropdown
  const categories = ["All", ...new Set(events.map((e) => e.category))];

  // Filter events
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || event.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

        .container {
          background: transparent !important;
          min-height: 100vh;
          padding: 50px 30px 30px;
          font-family: 'Poppins', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .logo {
          position: absolute;
          top: 20px;
          right: 30px;
          width: 100px;
          height: auto;
          user-select: none;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .logo:hover {
          transform: scale(1.05);
        }

        h1 {
          color: white;
          font-weight: 700;
          font-size: 2rem;
          margin-bottom: 10px;
          user-select: none;
        }

        .filters {
          margin-bottom: 20px;
          display: flex;
          gap: 15px;
          width: 100%;
          max-width: 1100px;
          justify-content: flex-start;
        }

        .search-input, .category-select {
          padding: 8px 12px;
          font-size: 1rem;
          border-radius: 6px;
          border: none;
          outline: none;
          box-shadow: 0 0 5px rgba(0,0,0,0.1);
        }

        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          width: 100%;
          max-width: 1100px;
          margin-top: 20px;
        }

        .event-card {
          background: rgba(124, 58, 237, 0.18); /* more purple glassy */
          border-radius: 18px;
          box-shadow: 0 8px 32px 0 rgba(124, 58, 237, 0.18), 0 1.5px 8px #a78bfa44;
          transition: transform 0.22s cubic-bezier(.4,2,.6,1), box-shadow 0.22s cubic-bezier(.4,2,.6,1);
          overflow: hidden;
          border: 1.5px solid #a78bfa;
          backdrop-filter: blur(14px);
          color: #fff;
        }

        .event-card:hover {
          transform: translateY(-8px) scale(1.025);
          box-shadow: 0 16px 40px 0 #a78bfa33, 0 2px 12px #7c3aed22;
        }

        .event-image {
          width: 100%;
          height: 180px;
          object-fit: cover;
          border-top-left-radius: 18px;
          border-top-right-radius: 18px;
          box-shadow: 0 2px 12px #a78bfa22;
        }

        .event-content {
          padding: 22px 20px 18px 20px;
        }

        .event-card h3 {
          font-size: 1.25rem;
          color: #7c3aed;
          margin-bottom: 10px;
          text-shadow: 0 2px 8px #a78bfa22;
        }

        .event-description {
          font-size: 0.98rem;
          color: #4b5563;
          margin-bottom: 10px;
          min-height: 48px;
        }

        .event-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.93rem;
          color: #6d28d9;
        }

        .no-events-msg {
          text-align: center;
          color: white;
          font-size: 1.2rem;
          margin-top: 40px;
        }

        /* Loading spinner styles */
        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
          margin: 40px auto;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-text {
          color: white;
          text-align: center;
          margin-top: 10px;
        }

        .default-event-image {
          width: 100%;
          height: 180px;
          background-color: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #888;
          font-size: 0.9rem;
          border-top-left-radius: 14px;
          border-top-right-radius: 14px;
        }

        body, html, #root, .container {
          background: #fff !important;
        }
        .floating-ticket-bg {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          z-index: 0;
          pointer-events: none;
        }
        .floating-ticket-img {
          position: absolute;
          opacity: 0.22;
          filter: blur(1.5px) drop-shadow(0 2px 12px #a78bfa88);
          user-select: none;
          z-index: 0;
          pointer-events: none;
          animation: ticketFloat 8s ease-in-out infinite alternate;
        }
      `}</style>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="floating-ticket-bg" style={{ zIndex: 0 }}>
          {ticketPositions.map((pos, i) => (
            <img
              key={i}
              src={logo}
              alt="ticket"
              className="floating-ticket-img"
              style={{
                width: pos.size,
                height: 'auto',
                top: pos.top,
                left: pos.left,
                right: pos.right,
                bottom: pos.bottom,
                transform: `rotate(${pos.rot}deg)`,
                animationDelay: `${pos.delay}s`,
                opacity: 0.22,
                filter: 'blur(1.5px) drop-shadow(0 2px 12px #a78bfa88)',
                pointerEvents: 'none',
                position: 'absolute',
                zIndex: 0,
              }}
              draggable={false}
            />
          ))}
        </div>

        <img
          src={logo}
          alt="Logo"
          className="logo"
          onClick={handleLogoClick}
          title="Go to Dashboard"
        />

        <h1>Available Events</h1>

        <div className="filters">
          <input
            type="text"
            placeholder="Search events..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search events"
          />
          <select
            className="category-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter by category"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div>
            <div className="spinner"></div>
            <p className="loading-text">Loading events...</p>
          </div>
        ) : (
          <div className="events-grid">
            {filteredEvents.length === 0 ? (
              <p className="no-events-msg">
                {events.length === 0 ? "No events available." : "No matching events found."}
              </p>
            ) : (
              filteredEvents.map((event) => {
                const eventDate = new Date(event.date);
                return (
                  <div className="event-card" key={event._id}>
                    {event.image ? (
                      <img 
                        src={event.image} 
                        alt={event.title} 
                        className="event-image" 
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentNode.querySelector('.default-event-image').style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="default-event-image" 
                      style={{ display: event.image ? 'none' : 'flex' }}
                    >
                      No Image Available
                    </div>
                    <div className="event-content">
                      <h3>{event.title}</h3>
                      <p className="event-description">{event.description}</p>
                      <div className="event-info">
                        <span><strong>📍</strong> {event.location}</span>
                        <span><strong>📅</strong> {eventDate.toLocaleDateString()}</span>
                        <span><strong>⏰</strong> {eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        <span><strong>🎟️</strong> {event.availableTickets} / {event.totalTickets} available</span>
                        <span><strong>💰</strong> ${event.price}</span>
                        <span><strong>📁</strong> {event.category}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default EventsTable;