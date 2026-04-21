import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

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

  // Add purple theme CSS variables and modern styles
  const purpleTheme = {
    "--primary-purple": "#7c3aed",
    "--secondary-purple": "#a78bfa",
    "--accent-purple": "#c4b5fd",
    "--glass-bg": "rgba(124, 58, 237, 0.15)",
    "--glass-border": "rgba(124, 58, 237, 0.25)",
    "--header-gradient": "linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)",
  };

  // Floating ticket positions
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

  // Apply theme variables to root
  useEffect(() => {
    Object.entries(purpleTheme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, []);

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
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(124, 58, 237, 0.2)',
      maxWidth: '400px',
      width: '90%',
      border: '1.5px solid var(--glass-border)',
    },
    title: {
      marginTop: 0,
      color: 'var(--primary-purple)',
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
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '500',
    },
    confirmButton: {
      padding: '0.5rem 1rem',
      backgroundColor: 'var(--primary-purple)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '500',
    },
  };

  return (
    <div className="dashboard-root" style={{ minHeight: "100vh", background: "#fff", padding: 0, margin: 0, position: 'relative', overflow: 'hidden' }}>
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
      <div className="dashboard-header" style={{
        background: "var(--header-gradient)",
        color: "white",
        padding: "2.5rem 2rem 4rem 2rem",
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
        position: "relative",
        marginBottom: 40,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img 
              src={logo} 
              alt="Logo" 
              style={{ width: 60, height: 60, borderRadius: "50%", marginRight: 24, boxShadow: "0 2px 8px #a78bfa", cursor: "pointer" }} 
              onClick={() => navigate("/AdminDashboard")}
            />
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0 }}>Events Management</h1>
              <div style={{ fontSize: 18, opacity: 0.85 }}>Manage all events in the system</div>
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: '50%', width: 70, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 24, boxShadow: '0 2px 8px #a78bfa22', cursor: 'pointer' }} onClick={() => navigate("/AdminDashboard")}> 
            <img 
              src={logo} 
              alt="Logo" 
              style={{ width: 48, height: 48, borderRadius: "50%", boxShadow: "0 2px 8px #a78bfa", objectFit: 'cover' }} 
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1400, margin: "-60px auto 0 auto", padding: "0 24px 48px 24px" }}>
        <ConfirmationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={confirmStatusUpdate}
          title={`${updateAction === 'approve' ? 'Approve' : 'Decline'} Event`}
          message={`Are you sure you want to ${updateAction} this event?`}
        />

        {/* Filters Section */}
        <div style={{ background: "rgba(124, 58, 237, 0.18)", borderRadius: 24, border: "1.5px solid #a78bfa", boxShadow: "0 4px 24px #a78bfa11", padding: 24, marginBottom: 32, marginTop: 96, color: '#fff', backdropFilter: 'blur(14px)' }}>
          <h2 style={{ color: "var(--primary-purple)", marginBottom: 20 }}>Search & Filter</h2>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1, minWidth: 300 }}>
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem 0.75rem 3rem",
                  fontSize: 16,
                  border: "1.5px solid var(--glass-border)",
                  borderRadius: 16,
                  background: "rgba(255, 255, 255, 0.9)",
                  color: "#1e293b",
                  outline: "none",
                  boxShadow: "0 2px 8px #a78bfa22"
                }}
              />
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#7c3aed", fontSize: 18 }}>🔍</span>
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                padding: "0.75rem 1rem",
                fontSize: 16,
                border: "1.5px solid var(--glass-border)",
                borderRadius: 16,
                background: "rgba(255, 255, 255, 0.9)",
                color: "#1e293b",
                outline: "none",
                cursor: "pointer",
                minWidth: 200,
                boxShadow: "0 2px 8px #a78bfa22"
              }}
            >
              <option value="all">All Events</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="declined">Declined</option>
            </select>
          </div>
        </div>

        {loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 48, color: "#7c3aed" }}>
            <div style={{ width: 40, height: 40, border: "4px solid #a78bfa", borderTopColor: "#7c3aed", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
            <p style={{ fontSize: 18, fontWeight: 600 }}>Loading events...</p>
          </div>
        )}
        
        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "#dc2626", padding: 16, borderRadius: 16, marginBottom: 24, textAlign: "center", fontWeight: 600, border: "1.5px solid rgba(239, 68, 68, 0.3)" }}>
            {error}
          </div>
        )}

        {/* Events Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 24 }}>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div key={event._id} style={{
                background: "rgba(124, 58, 237, 0.18)",
                border: "1.5px solid #a78bfa",
                borderRadius: 24,
                boxShadow: "0 4px 24px #a78bfa11",
                padding: 24,
                color: '#fff',
                backdropFilter: 'blur(14px)',
                transition: "all 0.3s ease",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-4px)";
                e.target.style.boxShadow = "0 8px 32px #a78bfa22";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 24px #a78bfa11";
              }}>
                {event.image && (
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    style={{
                      width: "100%",
                      height: 200,
                      objectFit: "cover",
                      borderRadius: 16,
                      marginBottom: 16,
                      border: "1.5px solid var(--glass-border)"
                    }}
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = "https://via.placeholder.com/350x200?text=No+Image";
                    }}
                  />
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <h3 style={{ color: "var(--primary-purple)", fontSize: 20, fontWeight: 700, margin: 0 }}>{event.title}</h3>
                  <span style={{
                    color: "white",
                    padding: "0.25rem 0.75rem",
                    borderRadius: 20,
                    fontSize: 14,
                    fontWeight: 600,
                    backgroundColor: event.status === 'approved' ? '#38a169' : 
                                     event.status === 'declined' ? '#e53e3e' : '#3182ce'
                  }}>
                    {event.status}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ color: "#a78bfa", fontSize: 16 }}>📅</span>
                    <span style={{ color: "#fff", fontSize: 15 }}>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ color: "#a78bfa", fontSize: 16 }}>📍</span>
                    <span style={{ color: "#fff", fontSize: 15 }}>{event.location || "Location not specified"}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ color: "#a78bfa", fontSize: 16 }}>🎫</span>
                    <span style={{ color: "#fff", fontSize: 15 }}>{event.totalTickets || 0} Total Tickets</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ color: "#a78bfa", fontSize: 16 }}>💰</span>
                    <span style={{ color: "#fff", fontSize: 15 }}>{event.price || 0} EGP</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ color: "#a78bfa", fontSize: 16 }}>🆔</span>
                    <span style={{ color: "#fff", fontSize: 13, wordBreak: "break-all" }}>ID: {event._id}</span>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button 
                    onClick={() => handleEditEvent(event._id)}
                    style={{
                      background: "var(--primary-purple)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 12,
                      padding: "0.5rem 1rem",
                      fontWeight: 600,
                      fontSize: 14,
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#6d28d9";
                      e.target.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "var(--primary-purple)";
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    Edit
                  </button>
                  {event.status === "pending" && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <button 
                        onClick={() => handleStatusUpdateClick(event._id, "approve")}
                        style={{
                          background: "#38a169",
                          color: "#fff",
                          border: "none",
                          borderRadius: 12,
                          padding: "0.5rem 1rem",
                          fontWeight: 600,
                          fontSize: 14,
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = "#2f855a";
                          e.target.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "#38a169";
                          e.target.style.transform = "translateY(0)";
                        }}
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleStatusUpdateClick(event._id, "decline")}
                        style={{
                          background: "#e53e3e",
                          color: "#fff",
                          border: "none",
                          borderRadius: 12,
                          padding: "0.5rem 1rem",
                          fontWeight: 600,
                          fontSize: 14,
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = "#c53030";
                          e.target.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "#e53e3e";
                          e.target.style.transform = "translateY(0)";
                        }}
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div style={{ 
              gridColumn: "1 / -1", 
              textAlign: "center", 
              padding: 48, 
              color: "#7c3aed", 
              fontSize: 18, 
              fontWeight: 600,
              background: "rgba(124, 58, 237, 0.18)",
              borderRadius: 24,
              border: "1.5px solid #a78bfa"
            }}>
              {loading ? "" : "No events found matching your criteria."}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: "rgba(124, 58, 237, 0.18)", borderTopLeftRadius: 32, borderTopRightRadius: 32, boxShadow: "0 -2px 16px #a78bfa22", padding: "18px 0 10px 0", marginTop: 32, textAlign: "center", color: "#7c3aed", fontSize: 15, zIndex: 2, position: "relative" }}>
        <div style={{ marginBottom: 6 }}>&copy; 2025 BookedIn. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default AdminEventsPage;