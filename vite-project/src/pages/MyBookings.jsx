import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "./logo.png";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("confirmed");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:7000/api/v1/users/bookings",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.error ||
            err.response?.data?.message ||
            "Failed to fetch bookings."
        );
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleDelete = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:7000/api/v1/bookings/${bookingId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setSuccessMessage(response.data.message || "Booking cancelled successfully");
      setError(null);
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      setConfirmDeleteId(null);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to cancel booking."
      );
      setSuccessMessage(null);
      setConfirmDeleteId(null);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const event = booking.eventId || {};
    const matchesSearch = event.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || booking.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div style={styles.pageContainer}>
      <div style={styles.mainContent}>
        <img
          src={logo}
          alt="Logo"
          style={styles.logo}
          onClick={() => navigate("/UserDashboard")}
        />
        <div style={styles.header}>
          <h1 style={styles.title}>My Bookings</h1>
          <p style={styles.subtitle}>Manage your upcoming events</p>
        </div>

        {successMessage && (
          <div style={styles.successMessage}>{successMessage}</div>
        )}
        {error && <div style={styles.errorMessage}>{error}</div>}
        {loading && <div style={styles.loadingMessage}>Loading bookings...</div>}

            <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search by event name..."
          style={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          style={styles.statusSelect}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option> {/* Keep "All" option */}
          <option value="Confirmed">Confirmed</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

        {!loading && !error && (
          <div style={styles.grid}>
            {filteredBookings.length === 0 ? (
              <div style={styles.noBookings}>
                {bookings.length === 0 ? "You have no bookings yet." : "No matching bookings found."}
              </div>
            ) : (
              filteredBookings.map((booking) => {
                const event = booking.eventId || {};
                const eventDate = event.date ? new Date(event.date) : null;
                const statusColor = booking.status === "Confirmed" 
                  ? "#38a169" 
                  : booking.status === "Pending" 
                    ? "#d69e2e" 
                    : "#e53e3e";

                return (
                  <div
                    key={booking._id}
                    style={styles.card}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                  >
                    <div style={styles.cardHeader}>
  <h2 style={styles.cardTitle}>{event.title || "N/A"}</h2>
  <span style={{ 
    ...styles.statusBadge,
    backgroundColor: statusColor
  }}>
    {booking.status || "N/A"}
  </span>
</div>

<div style={styles.cardBody}>
  <div style={styles.infoRow}>
    <span style={styles.infoIcon}>📍</span>
    <span>{event.location || "Location not specified"}</span>
  </div>
  
  {eventDate && (
    <div style={styles.infoRow}>
      <span style={styles.infoIcon}>📅</span>
      <span>{eventDate.toLocaleDateString()}</span>
      <span style={{ margin: "0 8px" }}>•</span>
      <span>{eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
    </div>
  )}
  
  <div style={styles.infoRow}>
    <span style={styles.infoIcon}>🎟️</span>
    <span>{booking.ticketsBooked} ticket{booking.ticketsBooked !== 1 ? 's' : ''} booked</span>
  </div>
  
  <div style={styles.infoRow}>
    <span style={styles.infoIcon}>💰</span>
    <span>Total: ${booking.totalPrice ? booking.totalPrice.toFixed(2) : "0.00"}</span>
  </div>

  <div style={styles.infoRow}>
    <span style={styles.infoIcon}>🆔</span>
    <span>Booking ID: {booking._id}</span>
  </div>
</div>

                    

                    <div style={styles.cardFooter}>
                      {booking.status !== "Cancelled" && (
                        <button
                          style={styles.cancelButton}
                          onClick={() => setConfirmDeleteId(booking._id)}
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {confirmDeleteId && (
          <div style={styles.modalOverlay} onClick={() => setConfirmDeleteId(null)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <p style={styles.modalText}>Are you sure you want to cancel this booking?</p>
              <div style={styles.modalButtons}>
                <button
                  style={styles.modalButtonCancel}
                  onClick={() => setConfirmDeleteId(null)}
                >
                  No
                </button>
                <button
                  style={styles.modalButtonConfirm}
                  onClick={() => handleDelete(confirmDeleteId)}
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
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
  successMessage: {
    backgroundColor: "#d4edda",
    color: "#155724",
    padding: "1rem",
    borderRadius: "0.5rem",
    marginBottom: "1.5rem",
    textAlign: "center",
    fontWeight: "500",
    maxWidth: "800px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  errorMessage: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "1rem",
    borderRadius: "0.5rem",
    marginBottom: "1.5rem",
    textAlign: "center",
    fontWeight: "500",
    maxWidth: "800px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  loadingMessage: {
    color: "white",
    textAlign: "center",
    fontSize: "1.2rem",
    marginBottom: "2rem",
  },
  filters: {
    marginBottom: "2rem",
    display: "flex",
    gap: "1rem",
    width: "100%",
    maxWidth: "800px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  searchInput: {
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    borderRadius: "0.5rem",
    border: "none",
    outline: "none",
    flex: "1",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  statusSelect: {
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    borderRadius: "0.5rem",
    border: "none",
    outline: "none",
    minWidth: "200px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "2rem",
    padding: "1rem",
  },
  noBookings: {
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
    fontSize: "1.25rem",
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
    gap: "0.5rem",
    fontSize: "0.95rem",
    color: "#475569",
  },
  infoIcon: {
    opacity: "0.7",
  },
  cardFooter: {
    marginTop: "auto",
    display: "flex",
    justifyContent: "center",
  },
  cancelButton: {
    padding: "0.5rem 1rem",
    background: "linear-gradient(135deg, #ff9800, #ff7043)",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    ":hover": {
      background: "linear-gradient(135deg, #ff7043, #ff5722)",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
    },
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "white",
    padding: "2rem",
    borderRadius: "1rem",
    maxWidth: "400px",
    width: "90%",
    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
  },
  modalText: {
    color: "#1e293b",
    fontSize: "1.1rem",
    textAlign: "center",
    marginBottom: "2rem",
  },
  modalButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
  },
  modalButtonCancel: {
    padding: "0.5rem 1rem",
    background: "#e2e8f0",
    color: "#1e293b",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
    ":hover": {
      background: "#cbd5e1",
    },
  },
  modalButtonConfirm: {
    padding: "0.5rem 1rem",
    background: "linear-gradient(135deg, #ff9800, #ff7043)",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
    ":hover": {
      background: "linear-gradient(135deg, #ff7043, #ff5722)",
    },
  },
};

export default MyBookings;