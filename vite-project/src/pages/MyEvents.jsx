import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const API_BASE_URL = "http://localhost:7000/api/v1/users";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
      <div style={modalStyles.overlay}>
        <div style={modalStyles.modal}>
          <h3 style={modalStyles.title}>{title}</h3>
          <p style={modalStyles.message}>{message}</p>
          <div style={modalStyles.buttons}>
            <button 
              style={modalStyles.cancelButton} 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              style={modalStyles.confirmButton}
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  const modalStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modal: {
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      maxWidth: '400px',
      width: '90%',
    },
    title: {
      marginTop: 0,
      color: '#1e293b',
      fontSize: '1.25rem',
      fontWeight: '600',
    },
    message: {
      margin: '1rem 0',
      color: '#475569',
      lineHeight: '1.5',
    },
    buttons: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '1rem',
      marginTop: '1.5rem',
    },
    cancelButton: {
      padding: '0.5rem 1rem',
      backgroundColor: '#f1f5f9',
      color: '#475569',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      ':hover': {
        backgroundColor: '#e2e8f0',
      },
    },
    confirmButton: {
      padding: '0.5rem 1rem',
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      ':hover': {
        backgroundColor: '#dc2626',
      },
    },
  };

  const handleDeleteClick = (eventId) => {
    setEventToDelete(eventId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;
    
    const updatedEvents = events.filter((event) => event._id !== eventToDelete);
    setEvents(updatedEvents);
    setFilteredEvents(updatedEvents);
    setShowModal(false);

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:7000/api/v1/events/${eventToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
    } catch (err) {
      alert(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to delete the event."
      );
      setEvents(events);
      setFilteredEvents(events);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/events`, {
          withCredentials: true,
        });
        if (res.data.events) {
          setEvents(res.data.events);
          setFilteredEvents(res.data.events);
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

  useEffect(() => {
    const filtered = events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           event.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || 
                          event.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
    setFilteredEvents(filtered);
  }, [searchTerm, statusFilter, events]);

  return (
    <div style={styles.pageContainer}>
      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={async () => {
          await confirmDelete();
          window.location.reload();
        }}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
      />
      <div style={styles.mainContent}>
        <img
          src={logo}
          alt="Logo"
          style={styles.logo}
          onClick={() => navigate(-1)}
        />
        <div style={styles.header}>
          <h1 style={styles.title}>My Events</h1>
          <p style={styles.subtitle}>Manage your upcoming events</p>
        </div>

        <div style={styles.filterContainer}>
          <input
            type="text"
            placeholder="🔍 Search events..."
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            style={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Declined">Declined</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {loading && (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <p style={styles.loadingText}>Loading events...</p>
          </div>
        )}
        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.grid}>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              
              <div key={event.id} style={styles.card}>
                {/* Status Badge */}
                <div style={{ 
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: event.status === 'Approved' ? '#38a169' : 
                                 event.status === 'Declined' ? '#e53e3e' : '#3182ce',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  zIndex: 1
                }}>
                  {event.status}
                </div>

                <div style={{ 
                  ...styles.cardHeader, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  gap: '1rem' 
                }}>
                  <div style={{ padding: '1rem' }}>
                  jsx
{event.image ? (
  <img
    src={event.image} // Use DIRECTLY without processing
    alt="Event"
    style={{
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '2px solid #fff'
    }}
  />
) : (
                      <div
                        style={{
                          width: '100px',
                          height: '100px',
                          borderRadius: '50%',
                          backgroundColor: '#f0f0f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        No Image
                      </div>
                    )}
                  </div>
                </div>

                <div style={styles.cardBody}>
                  {event.image && (
                    <img
                      src={event.image}
                      alt="Event"
                      style={{ 
                        width: '60px', 
                        height: '60px', 
                        objectFit: 'cover', 
                        borderRadius: '6px'
                      }}
                    />
                  )}
                  <div style={styles.infoRow}>
                    <div style={styles.infoRow}>
                      <span style={styles.infoIcon}>🎭</span>
                      <span>{event.title}</span>
                    </div>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoIcon}>📅</span>
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoIcon}>📍</span>
                    <span>{event.location}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoIcon}>🎟️</span>
                    <span>{event.tickets.available} / {event.tickets.total} tickets available</span>
                  </div>
                </div>

                {/* BUTTONS - SIDE BY SIDE */}
                <div style={styles.cardFooter}>
                  <p style={styles.timestamp}>Created: {new Date(event.createdAt).toLocaleDateString()}</p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      style={{
                        ...styles.editButton, 
                        background: 'linear-gradient(135deg, #434190, #2c2e8f)'
                      }} 
                      onClick={() => navigate(`/events/${event.id}/edit`)}
                    >
                      Edit Event
                    </button>
                    <button 
                      style={{
                        ...styles.deleteButton, 
                        background: 'linear-gradient(135deg, #ff9800, #ff7043)'
                      }} 
                      onClick={() => handleDeleteClick(event.id)}
                    >
                      Delete Event
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={styles.noEvents}>
              {events.length === 0 ? "You haven't created any events yet." : "No matching events found."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #434190, #2c2e8f)",
    padding: "2rem",
    fontFamily: "'Poppins', sans-serif",
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
    backgroundColor: "white",
    borderRadius: "50%",
    padding: "5px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    ":hover": {
      transform: "scale(1.05)",
    }
  },
  header: {
    marginBottom: "1.5rem",
    paddingBottom: "1rem",
    textAlign: "center",
    color: "white",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "800",
    marginBottom: "0.5rem",
    color: "#ff9800",
    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
  subtitle: {
    fontSize: "1.2rem",
    opacity: 0.9,
    marginTop: "0",
    color: "#e2e8f0",
  },
  filterContainer: {
    display: "flex",
    gap: "1rem",
    marginBottom: "2rem",
    maxWidth: "800px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  searchInput: {
    flex: 1,
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    borderRadius: "0.5rem",
    border: "none",
    outline: "none",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    fontFamily: "'Poppins', sans-serif",
  },
  filterSelect: {
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    borderRadius: "0.5rem",
    border: "none",
    outline: "none",
    minWidth: "200px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    fontFamily: "'Poppins', sans-serif",
    cursor: "pointer",
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
  error: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    padding: "1rem",
    borderRadius: "0.5rem",
    marginBottom: "1.5rem",
    textAlign: "center",
    fontWeight: "500",
    maxWidth: "800px",
    margin: "0 auto",
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
    minHeight: "280px",
    position: "relative",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1rem",
  },
  cardBody: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    marginBottom: "1.5rem",
  },
  infoRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    fontSize: "0.95rem",
    color: "#475569",
  },
  infoIcon: {
    opacity: "0.8",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  timestamp: {
    fontSize: "0.75rem",
    color: "#64748b",
    margin: "0",
  },
  editButton: {
    padding: "0.5rem 1.25rem",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    ":hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
    },
  },
  deleteButton: {
    padding: "0.5rem 1.25rem",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    ":hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
    },
  },
   bookingImageContainer: {
    width: "120px",
    height: "120px",
    flexShrink: 0,
  },
};

export default MyEvents;