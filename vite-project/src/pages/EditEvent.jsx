import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../assets/logo.png"; // adjust path as needed

const API_BASE_URL = "http://localhost:7000/api/v1";

export default function EditEvent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isConfirming, setIsConfirming] = useState(false);

  const [event, setEvent] = useState({
    title: "",
    date: "",
    location: "",
    totalTickets: "",
    price: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/events/${id}`, {
          withCredentials: true,
        });
        const e = res.data.event || res.data;

        setEvent({
          title: e.title || "",
          date: e.date ? e.date.split("T")[0] : "",
          location: e.location || "",
          totalTickets: e.totalTickets !== undefined ? String(e.totalTickets) : "",
          price: e.price !== undefined ? String(e.price) : "",
        });
      } catch (err) {
        setError("Failed to load event.");
        console.error("Fetch event error:", err);
      }
    })();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const totalTicketsNum = Number(event.totalTickets);
    const priceNum = Number(event.price);

    if (
      !event.title.trim() ||
      !event.date ||
      !event.location.trim() ||
      isNaN(totalTicketsNum) ||
      totalTicketsNum < 0 ||
      isNaN(priceNum) ||
      priceNum < 0
    ) {
      setError("Please fill all fields correctly. Tickets and price must be zero or more.");
      return;
    }

    const payload = {
      title: event.title.trim(),
      date: event.date,
      location: event.location.trim(),
      totalTickets: totalTicketsNum,
      price: Number(event.price),
    };

    try {
      await axios.put(`${API_BASE_URL}/events/${id}`, payload, {
        withCredentials: true,
      });
      setMessage("Event updated successfully.");
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
      console.error("Update event error:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${API_BASE_URL}/events/${id.trim()}`,
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
      <img
        src={logo}
        alt="Logo"
        style={styles.logo}
        onClick={() => navigate(-1)}
      />

      <h1 style={styles.heading}>Edit Event</h1>

      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label htmlFor="title" style={styles.label}>
            Title:
            <input
              id="title"
              name="title"
              value={event.title}
              onChange={handleChange}
              style={styles.input}
              autoComplete="off"
              required
            />
          </label>

          <label htmlFor="date" style={styles.label}>
            Date:
            <input
              id="date"
              name="date"
              type="date"
              value={event.date}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </label>

          <label htmlFor="location" style={styles.label}>
            Location:
            <input
              id="location"
              name="location"
              value={event.location}
              onChange={handleChange}
              style={styles.input}
              autoComplete="off"
              required
            />
          </label>

          <label htmlFor="price" style={styles.label}>
            Price:
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={event.price}
              onChange={handleChange}
              style={styles.input}
              autoComplete="off"
              required
            />
          </label>

          <label htmlFor="totalTickets" style={styles.label}>
            Tickets Total:
            <input
              id="totalTickets"
              name="totalTickets"
              type="number"
              min="0"
              value={event.totalTickets}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </label>

          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.button}>
              Save Changes
            </button>
            
            <button 
              type="button" 
              style={styles.deleteButton}
              onClick={() => setIsConfirming(true)}
            >
              Delete Event
            </button>
          </div>
        </form>
      </div>

      {isConfirming && (
        <div style={styles.confirmationModal}>
          <div style={styles.confirmationContent}>
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this event? This action cannot be undone.</p>
            <div style={styles.confirmationButtons}>
              <button 
                style={styles.confirmDeleteButton}
                onClick={handleDelete}
              >
                Delete
              </button>
              <button 
                style={styles.cancelButton}
                onClick={() => setIsConfirming(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    position: "relative",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "20px",
    color: "#fff",
  },
  logo: {
    position: "absolute",
    top: 20,
    right: 20,
    width: "100px",
    height: "auto",
    cursor: "pointer",
  },
  heading: {
    marginBottom: 24,
    fontWeight: "700",
    fontSize: "36px",
    textAlign: "center",
    color: "#fff",
  },
  formContainer: {
    width: "100%",
    maxWidth: "500px",
    background: "linear-gradient(135deg, #434190, #2c2e8f)",
    borderRadius: "16px",
    padding: "40px 30px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    color: "#fff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  label: {
    fontWeight: "600",
    fontSize: "16px",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
  },
  input: {
    marginTop: "6px",
    padding: "12px",
    fontSize: "15px",
    borderRadius: "8px",
    border: "1px solid #ffffff88",
    backgroundColor: "#fff",
    color: "#000",
    outline: "none",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
  },
  button: {
    marginTop: "10px",
    padding: "14px 0",
    flex: 1,
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    fontWeight: "700",
    fontSize: "16px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
  deleteButton: {
    marginTop: "10px",
    padding: "14px 0",
    flex: 1,
    background: "linear-gradient(135deg, #ff9800, #ff7043)",
    color: "white",
    fontWeight: "700",
    fontSize: "16px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "background 0.3s ease",
    ":hover": {
      background: "linear-gradient(135deg, #ff7043, #ff5722)",
    }
  },
  success: {
    color: "#90ee90",
    fontWeight: "600",
    marginBottom: "10px",
  },
  error: {
    color: "#ff6b6b",
    fontWeight: "600",
    marginBottom: "10px",
  },
  confirmationModal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  confirmationContent: {
    backgroundColor: "#2c2e8f",
    padding: "30px",
    borderRadius: "10px",
    maxWidth: "400px",
    width: "90%",
    textAlign: "center",
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
  },
  confirmationButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "20px",
  },
  confirmDeleteButton: {
    padding: "10px 20px",
    background: "linear-gradient(135deg, #ff9800, #ff7043)",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "600",
  },
  cancelButton: {
    padding: "10px 20px",
    backgroundColor: "#434190",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "600",
  },
};