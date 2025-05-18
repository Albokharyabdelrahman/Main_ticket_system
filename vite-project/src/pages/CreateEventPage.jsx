import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import logo from "../assets/logo.png";

const API_BASE_URL = "http://localhost:7000/api/v1/events";

const CreateEventPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
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
  const [successMessage, setSuccessMessage] = useState(location.state?.success || "");

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

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
      setSuccessMessage("Event created successfully!");
      // Clear form
      setFormData({
        title: "",
        location: "",
        price: "",
        category: "",
        description: "",
        availableTickets: "",
        totalTickets: "",
        image: ""
      });
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate(-1); // Or navigate('/') to go home
      }, 2000);
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
          <div style={styles.titleContainer}>
            <h1 style={styles.title}>Create New Event</h1>
            <div style={styles.titleUnderline}></div>
          </div>
          <p style={styles.subtitle}>Craft your perfect event experience</p>
        </div>
        <img 
          src={logo} 
          alt="Logo" 
          style={styles.logo} 
          onClick={() => navigate(-1)}
        />
      </div>

      <div style={styles.formCard}>
        {error && (
          <div style={styles.errorAlert}>
            <span style={styles.errorIcon}>⚠️</span>
            {error}
          </div>
        )}
        
        {successMessage && (
          <div style={styles.successAlert}>
            <span style={styles.successIcon}>✓</span>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formColumns}>
            {/* Left Column */}
            <div style={styles.formColumn}>
              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>
                  <span style={styles.sectionNumber}>1</span>
                  Event Basics
                </h3>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Event Title*</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    style={styles.input}
                    required
                    placeholder="e.g. Summer Music Festival"
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
                    placeholder="Tell attendees what to expect..."
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div style={styles.formColumn}>
              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>
                  <span style={styles.sectionNumber}>2</span>
                  Event Details
                </h3>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Location*</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    style={styles.input}
                    required
                    placeholder="Venue or address"
                  />
                </div>

                <div style={styles.formRow}>
                  <div style={{...styles.formGroup, flex: 2}}>
                    <label style={styles.label}>Category*</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      style={styles.select}
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{...styles.formGroup, flex: 1}}>
                    <label style={styles.label}>Price ($)*</label>
                    <div style={styles.priceInputContainer}>
                      <span style={styles.currencySymbol}>$</span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        style={{...styles.input, paddingLeft: '32px'}}
                        required
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                    </div>
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
                    placeholder="https://example.com/event-image.jpg"
                  />
                </div>
              </div>

              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>
                  <span style={styles.sectionNumber}>3</span>
                  Tickets
                </h3>
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
                    <label style={styles.label}>Available*</label>
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
            </div>
          </div>

          <div style={styles.formFooter}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={styles.cancelButton}
            >
              ← Back
            </button>
            <button
              type="submit"
              style={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span style={styles.buttonContent}>
                  <span style={styles.spinner}></span>
                  Creating Event...
                </span>
              ) : (
                <span style={styles.buttonContent}>
                  🚀 Launch Event
                </span>
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
    padding: "2rem",
    fontFamily: "'Inter', sans-serif",
    background: "linear-gradient(135deg, #434190, #2c2e8f)",
    minHeight: "100vh",
    position: "relative",
  },
  header: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    zIndex: 2,
    maxWidth: '1400px',
    margin: '0 auto 2rem',
  },
  headerContent: {
    flex: 1,
  },
  titleContainer: {
    position: 'relative',
    display: 'inline-block',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    margin: '0 0 0.5rem 0',
    color: 'white',
    lineHeight: '1.2',
  },
  titleUnderline: {
    height: '4px',
    width: '60%',
    background: 'linear-gradient(90deg, #ff9800, #ff7043)',
    borderRadius: '2px',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: 'rgba(255,255,255,0.9)',
    margin: '0',
    fontWeight: '500',
  },
  logo: {
    height: '50px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
    ':hover': {
      transform: 'scale(1.1) rotate(-5deg)',
    }
  },
  formCard: {
    position: 'relative',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '2.5rem',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
    zIndex: 1,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formColumns: {
    display: 'flex',
    gap: '2rem',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
    }
  },
  formColumn: {
    flex: 1,
  },
  formSection: {
    marginBottom: '2rem',
    position: 'relative',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#2d3748',
    margin: '0 0 1.5rem 0',
    display: 'flex',
    alignItems: 'center',
  },
  sectionNumber: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    backgroundColor: '#2c2e8f',
    color: 'white',
    borderRadius: '50%',
    fontSize: '0.9rem',
    fontWeight: '700',
    marginRight: '0.75rem',
  },
  formRow: {
    display: 'flex',
    gap: '1rem',
    '@media (max-width: 480px)': {
      flexDirection: 'column',
    }
  },
  formGroup: {
    marginBottom: '1.25rem',
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.875rem 1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '0.9375rem',
    transition: 'all 0.2s ease',
    backgroundColor: '#f8fafc',
    ':focus': {
      outline: 'none',
      borderColor: '#4f46e5',
      boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.1)',
      backgroundColor: 'white',
    },
    '::placeholder': {
      color: '#a0aec0',
    }
  },
  priceInputContainer: {
    position: 'relative',
  },
  currencySymbol: {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#718096',
    fontWeight: '500',
  },
  select: {
    width: '100%',
    padding: '0.875rem 1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '0.9375rem',
    backgroundColor: '#f8fafc',
    appearance: 'none',
    transition: 'all 0.2s ease',
    ':focus': {
      outline: 'none',
      borderColor: '#4f46e5',
      boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.1)',
      backgroundColor: 'white',
    }
  },
  textarea: {
    width: '100%',
    minHeight: '120px',
    padding: '0.875rem 1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '0.9375rem',
    fontFamily: "'Inter', sans-serif",
    resize: 'vertical',
    transition: 'all 0.2s ease',
    backgroundColor: '#f8fafc',
    ':focus': {
      outline: 'none',
      borderColor: '#4f46e5',
      boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.1)',
      backgroundColor: 'white',
    },
    '::placeholder': {
      color: '#a0aec0',
    }
  },
  formFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #edf2f7',
  },
  cancelButton: {
    padding: '0.875rem 1.5rem',
    backgroundColor: 'transparent',
    color: '#4a5568',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9375rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    ':hover': {
      backgroundColor: '#edf2f7',
    }
  },
  submitButton: {
    padding: '0.875rem 2rem',
    background: 'linear-gradient(135deg, #ff9800, #ff7043)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9375rem',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(255, 152, 0, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(255, 152, 0, 0.4)',
    },
    ':active': {
      transform: 'translateY(0)',
    },
    ':disabled': {
      background: 'linear-gradient(135deg, #ffb74d, #ff8a65)',
      cursor: 'not-allowed',
      transform: 'none',
    }
  },
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  spinner: {
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    width: '16px',
    height: '16px',
    animation: 'spin 1s linear infinite',
  },
  errorAlert: {
    backgroundColor: '#fff5f5',
    color: '#c53030',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    borderLeft: '4px solid #f56565',
  },
  errorIcon: {
    fontSize: '1.2rem',
  },
  successAlert: {
    backgroundColor: '#f0fff4',
    color: '#2f855a',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    borderLeft: '4px solid #48bb78',
  },
  successIcon: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
};

export default CreateEventPage;