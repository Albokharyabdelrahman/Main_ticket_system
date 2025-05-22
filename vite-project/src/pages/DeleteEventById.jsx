import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const DeleteEventById = () => {
  const [eventId, setEventId] = useState("");
  const [eventData, setEventData] = useState(null);
  const [error, setError] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const navigate = useNavigate();

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
    <div style={styles.container}>
      <div style={styles.logoContainer} onClick={() => navigate(-1)}>
        <img src={logo} alt="Logo" style={styles.logo} />
      </div>

      <h1 style={styles.heading}>Delete Event</h1>
      
      {!eventData ? (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Enter Event ID"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Find Event
          </button>
        </form>
      ) : !isConfirming ? (
        <div style={styles.card}>
          <h2 style={styles.eventTitle}>{eventData.title}</h2>
          
          <div style={styles.eventDetail}>
            <span style={styles.detailLabel}>Location:</span>
            <span style={styles.detailValue}>{eventData.location}</span>
          </div>
          
          <div style={styles.eventDetail}>
            <span style={styles.detailLabel}>Date:</span>
            <span style={styles.detailValue}>
              {new Date(eventData.date).toLocaleString()}
            </span>
          </div>
          
          <div style={styles.eventDetail}>
            <span style={styles.detailLabel}>Status:</span>
            <span style={styles.detailValue}>{eventData.status}</span>
          </div>
          
          <div style={styles.buttonGroup}>
            <button 
              onClick={() => setIsConfirming(true)} 
              style={styles.deleteButton}
            >
              Delete Event
            </button>
            <button 
              onClick={() => {
                setEventData(null);
                setEventId("");
              }} 
              style={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div style={styles.card}>
          <div style={styles.warningIcon}>⚠️</div>
          <h2 style={styles.eventTitle}>Confirm Deletion</h2>
          <p style={styles.confirmationText}>
            Are you sure you want to permanently delete<br />
            <strong>"{eventData.title}"</strong>?
          </p>
          
          <div style={styles.buttonGroup}>
            <button 
              onClick={handleDelete} 
              style={styles.deleteButton}
            >
              Confirm Delete
            </button>
            <button 
              onClick={() => setIsConfirming(false)} 
              style={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
    padding: "40px 20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "linear-gradient(135deg, #434190, #2c2e8f)",
    minHeight: "100vh",
    textAlign: "center",
    color: "#fff",
  },
  logoContainer: {
    position: "absolute",
    top: "20px",
    right: "60px",
    cursor: "pointer",
    width: "100px",
    height: "100px",
    userSelect: "none",
  },
  logo: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  heading: {
    fontSize: "36px",
    fontWeight: "700",
    marginBottom: "32px",
    color: "#f0f0f0",
    textShadow: "0 2px 5px rgba(0,0,0,0.3)",
  },
  form: {
    marginBottom: "32px",
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    flexWrap: "wrap",
  },
  input: {
    padding: "14px 16px",
    fontSize: "16px",
    borderRadius: "12px",
    border: "none",
    width: "320px",
    outline: "none",
    boxShadow: "0 0 8px rgba(255, 255, 255, 0.6)",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    color: "#333",
    transition: "box-shadow 0.3s ease",
  },
  button: {
    padding: "14px 28px",
    fontSize: "16px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #ff9800, #ff7043)",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(92, 79, 207, 0.7)",
    transition: "all 0.3s ease",
  },
  card: {
    marginTop: "20px",
    maxWidth: "600px",
    marginLeft: "auto",
    marginRight: "auto",
    padding: "30px 28px",
    borderRadius: "20px",
    background: "linear-gradient(145deg, #ffffff, #f9f9f9)",
    boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
    textAlign: "center",
    color: "#333",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  eventTitle: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "24px",
    color: "#4a3b9d",
    textAlign: "center",
    paddingBottom: "16px",
    borderBottom: "2px solid #e2e8f0",
  },
  eventDetail: {
    margin: "12px 0",
    fontSize: "16px",
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 20px",
    backgroundColor: "rgba(74, 59, 157, 0.05)",
    borderRadius: "10px",
    alignItems: "center",
  },
  detailLabel: {
    fontWeight: "600",
    color: "#4a3b9d",
    fontSize: "15px",
  },
  detailValue: {
    color: "#4a5568",
    fontWeight: "500",
    textAlign: "right",
    maxWidth: "60%",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "32px",
    flexWrap: "wrap",
  },
  deleteButton: {
    padding: "14px 28px",
    fontSize: "16px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #ff9800, #ff7043)",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(229, 62, 62, 0.3)",
    transition: "all 0.3s ease",
    minWidth: "180px",
    ":hover": {
      background: "linear-gradient(135deg, #c53030, #9b2c2c)",
      transform: "translateY(-2px)",
      boxShadow: "0 6px 16px rgba(229, 62, 62, 0.4)",
    },
  },
  cancelButton: {
    padding: "14px 28px",
    fontSize: "16px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #718096, #4a5568)",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(113, 128, 150, 0.3)",
    transition: "all 0.3s ease",
    minWidth: "180px",
    ":hover": {
      background: "linear-gradient(135deg, #4a5568, #2d3748)",
      transform: "translateY(-2px)",
      boxShadow: "0 6px 16px rgba(113, 128, 150, 0.4)",
    },
  },
  confirmationText: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#4a5568",
    margin: "24px 0",
    lineHeight: "1.6",
  },
  warningIcon: {
    fontSize: "48px",
    color: "#e53e3e",
    marginBottom: "16px",
    filter: "drop-shadow(0 2px 4px rgba(229, 62, 62, 0.3))",
  },
  error: {
    color: "#ff6b6b",
    fontWeight: "700",
    marginTop: "20px",
    textShadow: "0 1px 2px rgba(0,0,0,0.25)",
    fontSize: "16px",
    maxWidth: "600px",
    marginLeft: "auto",
    marginRight: "auto",
    padding: "12px 20px",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: "8px",
  },
};

export default DeleteEventById;