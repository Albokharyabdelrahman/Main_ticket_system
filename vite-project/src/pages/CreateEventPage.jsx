import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.png";

const API_BASE_URL = "http://localhost:7000/api/v1/events";

// Floating ticket positions (same as dashboard)
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
    date: "",
    time: "",
    image: null,
    maxTicketsPerPerson: ""
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData({ ...formData, image: file });
  };

  const validateTickets = () => {
    if (parseInt(formData.availableTickets) > parseInt(formData.totalTickets)) {
      setError("Available tickets cannot be more than total tickets!");
      return false;
    }
    return true;
  };

  const validateDate = () => {
    if (!formData.date) {
      setError("Please select an event date");
      return false;
    }

    const eventDateTime = new Date(`${formData.date}T${formData.time || "00:00"}`);
    if (eventDateTime < new Date()) {
      setError("Event date must be in the future");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!formData.image) {
      setError("Please select an event image");
      return;
    }

    if (!validateDate() || !validateTickets()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      // Append all fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('availableTickets', formData.availableTickets);
      formDataToSend.append('totalTickets', formData.totalTickets);
      formDataToSend.append('date', new Date(`${formData.date}T${formData.time}`).toISOString());
      formDataToSend.append('image', formData.image);
      formDataToSend.append('maxTicketsPerPerson', formData.maxTicketsPerPerson);

      const response = await axios.post(API_BASE_URL, formDataToSend, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201) {
        setSuccessMessage("Event created successfully!");
        setFormData({
          title: "",
          location: "",
          price: "",
          category: "",
          description: "",
          availableTickets: "",
          totalTickets: "",
          date: "",
          time: "",
          image: null,
          maxTicketsPerPerson: ""
        });
        setTimeout(() => navigate(-1), 2000);
      }
    } catch (err) {
      console.error("Event creation error:", err);
      if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors)
          .map(error => error.message)
          .join(', ');
        setError(errorMessages);
      } else {
        setError(err.response?.data?.message || "Failed to create event. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    "Music",
    "Sports",
    "Arts",
    "Comedy",
    "Food & Drink",
    "Business",
    "Technology",
    "Education",
    "Health",
    "Other"
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'Inter', sans-serif", position: 'relative', overflow: 'hidden' }}>
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
      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
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
                <span style={styles.errorIcon}>❌</span>
                {error}
              </div>
            )}
            
            {successMessage && (
              <div style={styles.successAlert}>
                <span style={styles.successIcon}>✅</span>
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

                    <div style={styles.formRow}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Date*</label>
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          style={styles.input}
                          required
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>Time*</label>
                        <input
                          type="time"
                          name="time"
                          value={formData.time}
                          onChange={handleChange}
                          style={styles.input}
                          required
                        />
                      </div>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Event Image*</label>
                      <div style={styles.fileInputContainer}>
                        <label style={{
                          ...styles.fileInputLabel,
                          color: '#000',
                          border: error && !formData.image ? '1px solid #e53e3e' : '1px solid #e2e8f0'
                        }}>
                          {formData.image ? formData.image.name : "Choose an image"}
                          <input
                            type="file"
                            name="image"
                            onChange={handleImageChange}
                            style={styles.fileInput}
                            accept="image/*"
                          />
                        </label>
                        {error && !formData.image && (
                          <div style={{ color: '#e53e3e', fontSize: '0.75rem' }}>
                            Please select an image
                          </div>
                        )}
                      </div>
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
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Maximum Tickets Per Person</label>
                      <input
                        type="number"
                        name="maxTicketsPerPerson"
                        value={formData.maxTicketsPerPerson}
                        onChange={handleChange}
                        style={styles.input}
                        min="1"
                        placeholder="e.g. 5"
                      />
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
                      🎉 Launch Event
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
const styles = {
  pageContainer: {
    padding: "2rem",
    fontFamily: "'Inter', sans-serif",
    background: "transparent",
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
    fontSize: '2.8rem',
    fontWeight: 900,
    margin: '0 0 0.5rem 0',
    background: 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textFillColor: 'transparent',
    textShadow: '0 4px 16px #a78bfa33',
    lineHeight: '1.2',
  },
  titleUnderline: {
    height: '4px',
    width: '60%',
    background: 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)',
    borderRadius: '2px',
  },
  subtitle: {
    fontSize: '1.15rem',
    color: '#a78bfa',
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
    background: 'rgba(124, 58, 237, 0.18)',
    borderRadius: '16px',
    padding: '2.5rem',
    boxShadow: '0 8px 32px 0 rgba(124, 58, 237, 0.18), 0 1.5px 8px #a78bfa44',
    zIndex: 1,
    border: '1.5px solid #a78bfa',
    backdropFilter: 'blur(14px)',
    color: '#fff',
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
    background: 'linear-gradient(90deg, #ede9fe 0%, #a78bfa 100%)',
    color: '#7c3aed',
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
      filter: 'brightness(1.08)',
    }
  },
  submitButton: {
    padding: '0.875rem 2rem',
    background: 'linear-gradient(90deg, #a78bfa 0%, #7c3aed 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9375rem',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px #a78bfa33',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    ':hover': {
      filter: 'brightness(1.08)',
      boxShadow: '0 6px 20px #a78bfa44',
    },
    ':active': {
      filter: 'brightness(1)',
    },
    ':disabled': {
      background: 'linear-gradient(90deg, #c4b5fd 0%, #a78bfa 100%)',
      cursor: 'not-allowed',
      filter: 'none',
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
  fileInputContainer: {
    width: '100%',
    marginBottom: '16px',
  },

  fileInputLabel: {
    display: 'block',
    padding: '0.875rem 1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '0.9375rem',
    backgroundColor: '#f8fafc',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: '#000000', // Black text color
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    ':hover': {
      backgroundColor: '#edf2f7',
    }
  },
  
  fileInput: {
    display: 'none',
  },
  
};

export default CreateEventPage;