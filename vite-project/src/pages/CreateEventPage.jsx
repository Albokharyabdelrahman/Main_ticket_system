import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import logo from "../assets/logo.png";

const API_BASE_URL = "http://localhost:7000/api/v1/events";

const CreateEventPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    category: "",
    description: "",
    availableTickets: "",
    totalTickets: "",
    image: ""
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await axios.post(API_BASE_URL, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        navigate(-1, { state: { success: "Event created successfully!" } });
      }
    } catch (err) {
      console.error("Event creation error:", err);
      setError(err.response?.data?.error || "Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    "Music",
    "Sports",
    "Arts",
    "Food & Drink",
    "Business",
    "Technology",
    "Education",
    "Health",
    "Other"
  ];

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Create New Event</h1>
          <p style={styles.subtitle}>Fill out the form to list your event</p>
        </div>
        <img src={logo} alt="BookedIn Logo" style={styles.logo} />
      </div>

      <div style={styles.formContainer}>
        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formSection}>
            <h3 style={styles.sectionTitle}>Event Information</h3>
            <div style={styles.formGroup}>
              <label style={styles.label}>Event Title*</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                style={styles.input}
                required
                placeholder="Enter event title"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description*</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                style={styles.textarea}
                required
                rows="5"
                placeholder="Enter detailed event description..."
              />
            </div>
          </div>

          <div style={styles.formSection}>
            <h3 style={styles.sectionTitle}>Event Details</h3>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Location*</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  style={styles.input}
                  required
                  placeholder="Enter event location"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Category*</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  style={styles.select}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Price ($)*</label>
                <div style={styles.priceInputContainer}>
                  <span style={styles.currencySymbol}>$</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    style={{...styles.input, paddingLeft: '30px'}}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>

          <div style={styles.formSection}>
            <h3 style={styles.sectionTitle}>Ticket Information</h3>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Total Tickets*</label>
                <input
                  type="number"
                  name="totalTickets"
                  value={formData.totalTickets}
                  onChange={handleChange}
                  style={styles.input}
                  required
                  min="1"
                  placeholder="100"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Available Tickets*</label>
                <input
                  type="number"
                  name="availableTickets"
                  value={formData.availableTickets}
                  onChange={handleChange}
                  style={styles.input}
                  required
                  min="0"
                  placeholder="100"
                />
              </div>
            </div>
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span style={styles.buttonContent}>
                  <span style={styles.spinner}></span>
                  Creating...
                </span>
              ) : (
                <span style={styles.buttonContent}>Create Event</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    padding: "30px 40px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "30px",
    background: "linear-gradient(135deg, #434190, #2c2e8f)",
    padding: "25px 30px",
    borderRadius: "12px",
    color: "white",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    margin: "0 0 8px 0",
    color: "white",
  },
  subtitle: {
    fontSize: "16px",
    margin: "0",
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "400",
  },
  logo: {
    height: "50px",
    objectFit: "contain",
    marginLeft: "20px",
  },
  formContainer: {
    maxWidth: "900px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.05)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  },
  formSection: {
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: "25px",
    marginBottom: "10px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#2c2e8f",
    margin: "0 0 20px 0",
    paddingBottom: "10px",
    borderBottom: "2px solid #e2e8f0",
  },
  formRow: {
    display: "flex",
    gap: "20px",
    marginBottom: "15px",
  },
  formGroup: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#334155",
  },
  input: {
    padding: "12px 16px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "15px",
    transition: "all 0.2s ease",
    width: "100%",
    boxSizing: "border-box",
    ":focus": {
      outline: "none",
      borderColor: "#4f46e5",
      boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)",
    },
  },
  priceInputContainer: {
    position: "relative",
  },
  currencySymbol: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#64748b",
    fontWeight: "500",
  },
  select: {
    padding: "12px 16px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "15px",
    backgroundColor: "white",
    transition: "all 0.2s ease",
    width: "100%",
    ":focus": {
      outline: "none",
      borderColor: "#4f46e5",
      boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)",
    },
  },
  textarea: {
    padding: "12px 16px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "15px",
    fontFamily: "'Inter', sans-serif",
    resize: "vertical",
    minHeight: "120px",
    transition: "all 0.2s ease",
    width: "100%",
    ":focus": {
      outline: "none",
      borderColor: "#4f46e5",
      boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)",
    },
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "15px",
    marginTop: "20px",
  },
  cancelButton: {
    padding: "14px 28px",
    backgroundColor: "#ffffff",
    color: "#64748b",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#f1f5f9",
    },
  },
  submitButton: {
    padding: "14px 28px",
    background: "linear-gradient(135deg, #ff9800, #ff7043)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 12px rgba(255, 152, 0, 0.2)",
    ":hover": {
      background: "linear-gradient(135deg, #ff8f00, #ff5722)",
    },
    ":disabled": {
      background: "linear-gradient(135deg, #ffb74d, #ff8a65)",
      cursor: "not-allowed",
    },
  },
  buttonContent: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  spinner: {
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    width: "16px",
    height: "16px",
    animation: "spin 1s linear infinite",
  },
  errorAlert: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    padding: "14px 16px",
    borderRadius: "8px",
    marginBottom: "25px",
    fontSize: "14px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
};

export default CreateEventPage;