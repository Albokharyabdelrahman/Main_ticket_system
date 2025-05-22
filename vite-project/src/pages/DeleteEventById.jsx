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
          <p><strong>Location:</strong> {eventData.location}</p>
          <p><strong>Date:</strong> {new Date(eventData.date).toLocaleString()}</p>
          <p><strong>Status:</strong> {eventData.status}</p>
          
          <div style={styles.buttonGroup}>
            <button 
              onClick={() => setIsConfirming(true)} 
              style={{ ...styles.button, backgroundColor: '#e53e3e' }}
            >
              Delete Event
            </button>
            <button 
              onClick={() => {
                setEventData(null);
                setEventId("");
              }} 
              style={{ ...styles.button, backgroundColor: '#718096' }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div style={styles.card}>
          <h2 style={styles.eventTitle}>Confirm Deletion</h2>
          <p>Are you sure you want to delete this event?</p>
          <p><strong>{eventData.title}</strong></p>
          
          <div style={styles.buttonGroup}>
            <button 
              onClick={handleDelete} 
              style={{ ...styles.button, backgroundColor: '#e53e3e' }}
            >
              Confirm Delete
            </button>
            <button 
              onClick={() => setIsConfirming(false)} 
              style={{ ...styles.button, backgroundColor: '#718096' }}
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
    transition: "background 0.3s ease",
  },
  card: {
    marginTop: "20px",
    maxWidth: "600px",
    marginLeft: "auto",
    marginRight: "auto",
    padding: "30px 28px",
    borderRadius: "20px",
    background: "rgba(255, 255, 255, 0.95)",
    boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
    textAlign: "left",
    color: "#333",
  },
  eventTitle: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "16px",
    color: "#4a3b9d",
  },
  error: {
    color: "#ff6b6b",
    fontWeight: "700",
    marginTop: "20px",
    textShadow: "0 1px 2px rgba(0,0,0,0.25)",
  },
};

export default DeleteEventById;