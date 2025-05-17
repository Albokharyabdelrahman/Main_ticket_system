import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // Adjust path as needed

const API_BASE_URL = "http://localhost:7000/api/v1/users";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/events`, {
          withCredentials: true,
        });
        if (res.data.events) {
          setEvents(res.data.events);
        } else {
          setError(res.data.message || "No events found.");
        }
      } catch (err) {
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div style={styles.container}>
      <img
        src={logo}
        alt="Logo"
        style={styles.logo}
        onClick={() => navigate(-1)}
      />
      <h1 style={styles.title}>My Events</h1>

      {loading && <p>Loading events...</p>}
      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.grid}>
        {events.map((event) => (
          <div
            key={event.id}
            style={styles.card}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <h2 style={styles.cardTitle}>{event.title}</h2>
            <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Status:</strong> {event.status}</p>
            <p><strong>Tickets:</strong> {event.tickets.available} / {event.tickets.total}</p>
            <p style={styles.timestamp}>Created: {new Date(event.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "'Inter', sans-serif",
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
    position: "relative",
  },
  logo: {
    position: "absolute",
    top: "1rem",
    right: "1.5rem",
    width: "50px",
    height: "50px",
    cursor: "pointer",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "1.5rem",
    color: "#1e293b",
  },
  error: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    padding: "1rem",
    borderRadius: "0.5rem",
    marginBottom: "1rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    background: "linear-gradient(135deg, #434190, #2c2e8f)",
    color: "white",
    padding: "1.5rem",
    borderRadius: "0.75rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease",
  },
  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    marginBottom: "0.5rem",
  },
  timestamp: {
    fontSize: "0.75rem",
    color: "#dbeafe",
    marginTop: "1rem",
  },
};

export default MyEvents;
