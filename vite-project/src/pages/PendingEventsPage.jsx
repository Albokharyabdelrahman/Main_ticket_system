import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "./logo.png";

const API_BASE_URL = "http://localhost:7000/api/v1";

const PendingEventsPage = () => {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/events/all`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        const pending = res.data.filter(event => event.status === "pending");
        setPendingEvents(pending);
      } catch (err) {
        setMessage({ 
          text: "ERROR: " + (err.response?.data?.message || err.message),
          type: "error"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPendingEvents();
  }, []);

  const handleStatusChange = async (eventId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/events/${eventId}`,
        { status: newStatus },
        { 
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true 
        }
      );
      setPendingEvents(prev => prev.filter(e => e._id !== eventId));
      setMessage({ 
        text: `Event ${newStatus} successfully!`,
        type: "success"
      });
    } catch (err) {
      setMessage({ 
        text: "ERROR: " + (err.response?.data?.message || err.message),
        type: "error"
      });
    }
  };

  const handleLogoClick = () => {
    navigate("/UserDashboard");
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.mainContent}>
        <img
          src={logo}
          alt="Logo"
          style={styles.logo}
          onClick={handleLogoClick}
        />
        <div style={styles.header}>
          <h1 style={styles.title}>Pending Events</h1>
          <p style={styles.subtitle}>Review and approve or decline events</p>
        </div>

        {message.text && (
          <div style={{ 
            ...styles.message, 
            backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da",
            color: message.type === "success" ? "#155724" : "#721c24"
          }}>
            {message.text}
          </div>
        )}

        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <p style={styles.loadingText}>Loading pending events...</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {pendingEvents.length === 0 ? (
              <div style={styles.noEvents}>
                {loading ? "Loading..." : "No pending events available."}
              </div>
            ) : (
              pendingEvents.map((event) => {
                const eventDate = new Date(event.date);
                return (
                  <div
                    key={event._id}
                    style={styles.card}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                  >
                    <div style={styles.cardHeader}>
                      <h2 style={styles.cardTitle}>{event.title}</h2>
                      <span style={styles.statusBadge(event.status)}>
                        {event.status}
                      </span>
                    </div>
                    
                    <div style={styles.cardBody}>
                      <p style={styles.cardDescription}>{event.description}</p>
                      
                      <div style={styles.infoRow}>
                        <span style={styles.infoIcon}>📅</span>
                        <span>{eventDate.toLocaleDateString()}</span>
                        <span style={{ margin: "0 8px" }}>•</span>
                        <span>{eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                      
                      <div style={styles.infoRow}>
                        <span style={styles.infoIcon}>📍</span>
                        <span>{event.location}</span>
                      </div>
                      
                      <div style={styles.infoRow}>
                        <span style={styles.infoIcon}>🎟️</span>
                        <span>{event.availableTickets} / {event.totalTickets} available</span>
                      </div>
                      
                      <div style={styles.infoRow}>
                        <span style={styles.infoIcon}>📁</span>
                        <span>{event.category}</span>
                      </div>
                    </div>

                    <div style={styles.cardFooter}>
                      <div style={styles.buttonGroup}>
                        <button
                          style={styles.approveButton}
                          onClick={() => handleStatusChange(event._id, "approved")}
                        >
                          Approve
                        </button>
                        <button
                          style={styles.declineButton}
                          onClick={() => handleStatusChange(event._id, "declined")}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #434190, #2c2e8f)",
    padding: "2rem",
    fontFamily: "'Inter', sans-serif",
  },
  mainContent: {
    maxWidth: "1400px",
    margin: "0 auto",
    position: "relative",
  },
  logo: {
    position: "absolute",
    top: "1.5rem",
    right: "2rem",
    width: "60px",
    height: "60px",
    cursor: "pointer",
    transition: "transform 0.2s ease",
    ":hover": {
      transform: "scale(1.05)",
    },
    backgroundColor: "white",
    borderRadius: "50%",
    padding: "5px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
  },
  header: {
    marginBottom: "2.5rem",
    paddingBottom: "1rem",
    textAlign: "center",
    color: "white",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "800",
    marginBottom: "0.5rem",
  },
  subtitle: {
    fontSize: "1.2rem",
    opacity: 0.9,
    marginTop: "0",
  },
  message: {
    padding: "1rem",
    borderRadius: "0.5rem",
    marginBottom: "1.5rem",
    textAlign: "center",
    fontWeight: "500",
    maxWidth: "800px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    padding: "2rem",
    color: "white",
  },
  loadingSpinner: {
    width: "40px",
    height: "40px",
    border: "4px solid rgba(255,255,255,0.3)",
    borderTopColor: "white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    fontSize: "1.2rem",
    marginTop: "1rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "2rem",
    padding: "1rem",
  },
  noEvents: {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "2rem",
    color: "white",
    fontSize: "1.2rem",
  },
  card: {
    background: "white",
    borderRadius: "1rem",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
    padding: "1.5rem",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    minHeight: "320px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1rem",
  },
  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: "700",
    margin: "0",
    color: "#1e293b",
  },
  statusBadge: (status) => ({
    backgroundColor: status === "pending" ? "#fff3cd" : status === "approved" ? "#d4edda" : "#f8d7da",
    color: status === "pending" ? "#856404" : status === "approved" ? "#155724" : "#721c24",
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    fontSize: "0.875rem",
    fontWeight: "600",
  }),
  cardBody: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    marginBottom: "1.5rem",
  },
  cardDescription: {
    color: "#64748b",
    fontSize: "0.95rem",
    margin: "0 0 1rem 0",
    lineHeight: "1.5",
  },
  infoRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.95rem",
    color: "#475569",
  },
  infoIcon: {
    opacity: "0.7",
  },
  cardFooter: {
    marginTop: "auto",
  },
  buttonGroup: {
    display: "flex",
    gap: "0.75rem",
  },
  approveButton: {
    padding: "0.5rem 1rem",
    background: "linear-gradient(135deg, #4CAF50, #2E7D32)",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontWeight: "600",
    flex: "1",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    ":hover": {
      background: "linear-gradient(135deg, #2E7D32, #1B5E20)",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
    },
  },
  declineButton: {
    padding: "0.5rem 1rem",
    background: "linear-gradient(135deg, #f44336, #c62828)",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontWeight: "600",
    flex: "1",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    ":hover": {
      background: "linear-gradient(135deg, #c62828, #b71c1c)",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
    },
  },
};

export default PendingEventsPage;