import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "./logo.png";


const EventsTable = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

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
      }
    };

    fetchEvents();
  }, []);

  const handleLogoClick = () => {
    window.location.href = "/";
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
          background: linear-gradient(135deg, #667eea, #764ba2);
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
          background: #fff;
          padding: 20px;
          border-radius: 14px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .event-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
        }

        .event-card h3 {
          font-size: 1.25rem;
          color: #333;
          margin-bottom: 10px;
        }

        .event-description {
          font-size: 0.95rem;
          color: #666;
          margin-bottom: 10px;
          min-height: 48px;
        }

        .event-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.9rem;
          color: #444;
        }

        .no-events-msg {
          text-align: center;
          color: white;
          font-size: 1.2rem;
          margin-top: 40px;
        }
      `}</style>

      <div className="container">
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

        <div className="events-grid">
          {filteredEvents.length === 0 ? (
            <p className="no-events-msg">
              {events.length === 0 ? "Loading events..." : "No matching events found."}
            </p>
          ) : (
            filteredEvents.map((event) => {
              const eventDate = new Date(event.date);
              return (
                <div className="event-card" key={event._id}>
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
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default EventsTable;