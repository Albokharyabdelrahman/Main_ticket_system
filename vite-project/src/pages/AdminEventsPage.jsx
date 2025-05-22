
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [eventToUpdate, setEventToUpdate] = useState(null);
  const [updateAction, setUpdateAction] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const API_BASE = "http://localhost:7000/api/v1/events";

  const fetchEvents = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE}/all`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setEvents(response.data);
    } catch (err) {
      setError("Failed to load events.");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const updateEventStatus = async (eventId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE}/${eventId}`,
        { status: newStatus },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true,
        }
      );
      fetchEvents(); // refresh list
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to update event status.");
    }
  };

  const handleStatusUpdateClick = (eventId, action) => {
    setEventToUpdate(eventId);
    setUpdateAction(action);
    setShowModal(true);
  };

  const filteredEvents = events.filter(event => {
    // Status filter
    const statusMatch = filter === "all" || event.status === filter;
    
    // Search term filter (case insensitive)
    const searchMatch = 
      searchTerm === "" || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return statusMatch && searchMatch;
  });

  const confirmStatusUpdate = async () => {
    if (!eventToUpdate) return;
    
    const newStatus = updateAction === "approve" ? "approved" : "declined";
    await updateEventStatus(eventToUpdate, newStatus);
    setShowModal(false);
  };

  // Temporary edit handler
  const handleEditEvent = (eventId) => {
    navigate(`/events/${eventId}/edit`);
  };

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
    },
    confirmButton: {
      padding: '0.5rem 1rem',
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: '500',
    },
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
    backButton: {
      position: "absolute",
      top: "1.5rem",
      right: "2rem",
      padding: "0.5rem 1.25rem",
      background: "linear-gradient(135deg, #ff9800, #ff7043)",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      ":hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
      },
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
      justifyContent: "center",
      marginBottom: "2rem",
      gap: "1rem",
      flexWrap: "wrap",
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
    searchBar: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      backgroundColor: "#fff",
      borderRadius: "0.75rem",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      paddingLeft: "2.5rem",
      width: "100%",
      maxWidth: "400px",
    },
    searchIcon: {
      position: "absolute",
      left: "1rem",
      width: "1.2rem",
      height: "1.2rem",
      color: "#64748b",
    },
    searchInputModern: {
      width: "100%",
      padding: "0.75rem 1rem",
      fontSize: "1rem",
      border: "none",
      outline: "none",
      borderRadius: "0.75rem",
      fontFamily: "'Poppins', sans-serif",
      color: "#1e293b",
      backgroundColor: "transparent",
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
    },
    cardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "1rem",
    },
    cardTitle: {
      fontSize: "1.5rem",
      fontWeight: "700",
      margin: "0",
      color: "#1e293b",
    },
    statusBadge: {
      color: "white",
      padding: "0.25rem 0.75rem",
      borderRadius: "9999px",
      fontSize: "0.875rem",
      fontWeight: "600",
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
      justifyContent: "flex-end",
    },
    editButton: {
      padding: "0.5rem 1.25rem",
      background: "linear-gradient(135deg, #ff9800, #ff7043)",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      marginRight: "0.5rem",
      ":hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
        background: "linear-gradient(135deg, #ff8f00, #ff5722)",
      },
    },
    actionButtons: {
      display: "flex",
      gap: "0.5rem",
    },
    approveButton: {
      padding: "0.5rem 1.25rem",
      backgroundColor: "#38a169",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      ":hover": {
        backgroundColor: "#2f855a",
        transform: "translateY(-2px)",
        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
      },
    },
    declineButton: {
      padding: "0.5rem 1.25rem",
      backgroundColor: "#e53e3e",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      ":hover": {
        backgroundColor: "#c53030",
        transform: "translateY(-2px)",
        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
      },
    },
  };

  return (
    <div style={styles.pageContainer}>
      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmStatusUpdate}
        title={`${updateAction === 'approve' ? 'Approve' : 'Decline'} Event`}
        message={`Are you sure you want to ${updateAction} this event?`}
      />
      
      <div style={styles.mainContent}>
        <button 
          style={styles.backButton} 
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div style={styles.header}>
          <h1 style={styles.title}>Events Management</h1>
          <p style={styles.subtitle}>Manage all events in the system</p>
        </div>

        <div style={styles.filterContainer}>
          <div style={styles.searchBar}>
            <svg style={styles.searchIcon} viewBox="0 0 24 24">
              <path fill="currentColor" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.41,13.73L20.39,19.71L19,21.12L13.03,15.14C11.89,16.14 10.41,16.73 8.8,16.73A6.5,6.5 0 0,1 2.3,10.23A6.5,6.5 0 0,1 9.5,3M9.5,5A4.5,4.5 0 0,0 5,9.5A4.5,4.5 0 0,0 9.5,14A4.5,4.5 0 0,0 14,9.5A4.5,4.5 0 0,0 9.5,5Z" />
            </svg>
            <input
              type="text"
              placeholder="Search events..."
              style={styles.searchInputModern}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            style={styles.filterSelect}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Events</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
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
              <div key={event._id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <h2 style={styles.cardTitle}>{event.title}</h2>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: event.status === 'approved' ? '#38a169' : 
                                     event.status === 'declined' ? '#e53e3e' : '#3182ce'
                  }}>
                    {event.status}
                  </span>
                </div>
                <div style={styles.cardBody}>
                  <div style={styles.infoRow}>
                    <span style={styles.infoIcon}>📅</span>
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoIcon}>📍</span>
                    <span>{event.location || "Location not specified"}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoIcon}>🎫</span>
                    <span>{event.totalTickets || 0} tickets available</span>
                  </div>
                </div>
                <div style={styles.cardFooter}>
                  <button 
                    style={styles.editButton}
                    onClick={() => handleEditEvent(event._id)}
                  >
                    Edit
                  </button>
                  {event.status === "pending" && (
                    <div style={styles.actionButtons}>
                      <button 
                        style={styles.approveButton} 
                        onClick={() => handleStatusUpdateClick(event._id, "approve")}
                      >
                        Approve
                      </button>
                      <button 
                        style={styles.declineButton} 
                        onClick={() => handleStatusUpdateClick(event._id, "decline")}
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div style={styles.noEvents}>
              {loading ? "" : "No events found matching your criteria."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEventsPage;