import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "./logo.png";
import ticketImg from "./logo.png";
import AnimatedLogo from "../components/AnimatedLogo";

// Icon Components
const Icons = {
  ticket: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 10V6c0-1.11-.9-2-2-2H4c-1.1 0-1.99.89-1.99 2v4c1.1 0 2 .9 2 2s-.9 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2z"/>
    </svg>
  ),
  calendar: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
    </svg>
  ),
  location: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  ),
  tickets: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 10V6c0-1.11-.9-2-2-2H4c-1.1 0-1.99.89-1.99 2v4c1.1 0 2 .9 2 2s-.9 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2z"/>
    </svg>
  ),
  theater: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 4h-2v-2h2v2zm0 4h-2v-2h2v2zm0-8h-2V7h2v2z"/>
    </svg>
  ),
  search: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
      <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  filter: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
    </svg>
  ),
  home: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  )
};

const API_BASE_URL = "http://localhost:7000/api/v1";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <h3 style={modalStyles.title}>{title}</h3>
        <p style={modalStyles.message}>{message}</p>
        <div style={modalStyles.buttons}>
          <button 
            style={{ ...modalStyles.button, ...modalStyles.cancelButton }}
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            style={{ ...modalStyles.button, ...modalStyles.confirmButton }}
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
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    maxWidth: '450px',
    width: '90%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
    animation: 'modalSlideIn 0.3s ease-out',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '1rem',
    color: '#1e293b',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  message: {
    fontSize: '1.1rem',
    marginBottom: '2rem',
    color: '#475569',
    lineHeight: '1.6',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    borderRadius: '0.75rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    ':hover': {
      backgroundColor: '#e2e8f0',
    },
  },
  confirmButton: {
    backgroundColor: '#7c3aed',
    color: 'white',
    ':hover': {
      backgroundColor: '#6d28d9',
    },
  },
};

const formatDate = (dateString) => {
  if (!dateString) return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ color: '#7c3aed' }}>{Icons.calendar()}</span>
      Date to be announced
    </span>
  );
  try {
    const options = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return (
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: '#7c3aed' }}>{Icons.calendar()}</span>
        {new Date(dateString).toLocaleDateString(undefined, options)}
      </span>
    );
  } catch (e) {
    return (
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: '#7c3aed' }}>{Icons.calendar()}</span>
        Date to be announced
      </span>
    );
  }
};

const BookTickets = () => {
  const [events, setEvents] = useState([]);
  const [ticketsInput, setTicketsInput] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/events`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setEvents(response.data);
      } catch (err) {
        console.error("Error fetching events:", err);
        setMessage({ text: "Failed to load events. Please try again later.", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleLogoClick = () => {
    navigate("/UserDashboard");
  };

  const handleInputChange = (eventId, value) => {
    setTicketsInput((prev) => ({
      ...prev,
      [eventId]: value,
    }));
  };

  const handleBook = async (event) => {
    const inputVal = ticketsInput[event._id];
    const ticketsBooked = Number(inputVal);

    if (
      !inputVal ||
      isNaN(ticketsBooked) ||
      ticketsBooked <= 0 ||
      ticketsBooked > event.availableTickets
    ) {
      setMessage({
        text: "Please enter a valid number of tickets within the available range.",
        type: "error",
      });
      return;
    }

    const totalPrice = event.price * ticketsBooked;
    setConfirmationMessage(
      `You're about to book ${ticketsBooked} ticket(s) for "${event.title}"\n\nTotal: $${totalPrice}\n\nWould you like to proceed with this booking?`
    );
    setCurrentBooking({
      event,
      ticketsBooked,
      totalPrice,
    });
    setModalOpen(true);
  };

  const handleConfirmBooking = async () => {
    setModalOpen(false);
    
    const { event, ticketsBooked, totalPrice } = currentBooking;
    const bookingData = {
      eventId: event._id,
      ticketsBooked,
      totalPrice,
    };

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_BASE_URL}/bookings`,
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setMessage({
        text: `Successfully booked ${ticketsBooked} ticket(s) for "${event.title}"!`,
        type: "success",
      });

      setEvents((prevEvents) =>
        prevEvents.map((e) =>
          e._id === event._id
            ? { ...e, availableTickets: e.availableTickets - ticketsBooked }
            : e
        )
      );

      setTicketsInput((prev) => ({ ...prev, [event._id]: "" }));
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || err.response?.data?.message || "Booking failed. Please try again.";
      setMessage({ text: errorMsg, type: "error" });
      console.error("Booking error:", err);
    }
  };

  const categories = ["All", ...new Set(events.map((e) => e.category))];

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || event.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const styles = {
    pageContainer: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
      padding: "1.5rem",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      position: "relative",
      overflow: "hidden",
    },
    ticketBg: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: 0,
      pointerEvents: "none",
    },
    ticketImg: {
      position: "absolute",
      opacity: 0.15,
      filter: "blur(1px) drop-shadow(0 2px 8px #a78bfa44)",
      userSelect: "none",
      zIndex: 0,
      pointerEvents: "none",
      transition: "opacity 0.3s",
      animation: "ticketFloat 10s ease-in-out infinite alternate",
      willChange: "transform, opacity",
    },
    mainContent: {
      maxWidth: "1400px",
      margin: "0 auto",
      position: "relative",
      zIndex: 1,
    },
    header: {
      marginBottom: "2rem",
      paddingBottom: "1rem",
      textAlign: "center",
      color: "#4b2997",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      fontSize: "2.5rem",
      fontWeight: "800",
      textShadow: "0 2px 4px rgba(124, 58, 237, 0.1)",
    },
    ticketHeaderIcon: {
      fontSize: 42,
      marginRight: 8,
      verticalAlign: "middle",
      color: "#7c3aed",
    },
    headerContainer: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '1.5rem',
      boxShadow: '0 8px 32px rgba(124, 58, 237, 0.15)',
      border: '2px solid rgba(124, 58, 237, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 2rem',
      margin: '1rem auto 2rem auto',
      maxWidth: '1500px',
      minHeight: 80,
      position: 'relative',
      zIndex: 10,
      gap: 32,
      backdropFilter: 'blur(10px)',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
    },
    headerLogo: {
      width: 56,
      height: 56,
      borderRadius: '50%',
      background: '#fff',
      boxShadow: '0 4px 16px rgba(124, 58, 237, 0.2)',
      objectFit: 'contain',
      cursor: 'pointer',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      padding: '4px',
    },
    headerBrand: {
      fontWeight: 800,
      fontSize: 28,
      color: '#4b2997',
      letterSpacing: 0.2,
      marginLeft: 6,
    },
    headerCenter: {
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      flex: 1,
      justifyContent: 'center',
    },
    searchBar: {
      position: 'relative',
      width: 380,
      background: 'rgba(248, 250, 252, 0.8)',
      borderRadius: '1.2rem',
      display: 'flex',
      alignItems: 'center',
      boxShadow: '0 2px 12px rgba(124, 58, 237, 0.1)',
      border: '2px solid rgba(124, 58, 237, 0.1)',
      transition: 'all 0.2s ease',
    },
    searchBarFocused: {
      border: '2px solid #7c3aed',
      boxShadow: '0 4px 20px rgba(124, 58, 237, 0.2)',
    },
    searchIcon: {
      position: 'absolute',
      left: 18,
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#a78bfa',
      fontSize: 20,
      opacity: 0.8,
      zIndex: 2,
    },
    searchInput: {
      width: '100%',
      padding: '1rem 1.2rem 1rem 3rem',
      fontSize: '1.1rem',
      borderRadius: '1.2rem',
      border: 'none',
      outline: 'none',
      background: 'transparent',
      color: '#4b2997',
      fontWeight: 500,
      boxShadow: 'none',
    },
    filterSelect: {
      padding: '1rem 1.2rem',
      fontSize: '1rem',
      borderRadius: '1rem',
      border: '2px solid rgba(124, 58, 237, 0.1)',
      outline: 'none',
      minWidth: '180px',
      boxShadow: '0 2px 12px rgba(124, 58, 237, 0.1)',
      background: 'rgba(255, 255, 255, 0.8)',
      color: '#4b2997',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
    },
    homeButton: {
      padding: '0.75rem 1rem',
      background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '1rem',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '1rem',
      transition: 'all 0.2s ease',
      boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
      gap: "2rem",
      padding: "1rem",
    },
    noEvents: {
      gridColumn: "1 / -1",
      textAlign: "center",
      padding: "4rem 2rem",
      color: "#7c3aed",
      fontSize: "1.5rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 20,
      background: 'rgba(255, 255, 255, 0.8)',
      borderRadius: '1.5rem',
      boxShadow: '0 8px 32px rgba(124, 58, 237, 0.1)',
      border: '2px solid rgba(124, 58, 237, 0.1)',
    },
    noEventsIcon: {
      fontSize: 80,
      opacity: 0.3,
      marginBottom: 12,
      color: "#7c3aed",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    card: {
      background: "rgba(255, 255, 255, 0.95)",
      borderRadius: "1.5rem",
      boxShadow: "0 8px 32px rgba(124, 58, 237, 0.15)",
      border: "2px solid rgba(124, 58, 237, 0.1)",
      padding: "0",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      display: "flex",
      flexDirection: "column",
      minHeight: "440px",
      overflow: "hidden",
      position: "relative",
      willChange: "transform, box-shadow",
      backdropFilter: 'blur(10px)',
    },
    cardHover: {
      transform: "translateY(-12px) scale(1.02)",
      boxShadow: "0 20px 60px rgba(124, 58, 237, 0.25)",
      border: "2px solid rgba(124, 58, 237, 0.2)",
      zIndex: 2,
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
    message: {
      padding: "1.2rem 1.5rem",
      borderRadius: "1rem",
      marginBottom: "2rem",
      textAlign: "center",
      fontWeight: "600",
      maxWidth: "800px",
      marginLeft: "auto",
      marginRight: "auto",
      fontSize: "1.1rem",
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
      border: "2px solid transparent",
    },
    messageSuccess: {
      backgroundColor: "rgba(220, 252, 231, 0.9)",
      color: "#166534",
      border: "2px solid rgba(34, 197, 94, 0.2)",
    },
    messageError: {
      backgroundColor: "rgba(254, 226, 226, 0.9)",
      color: "#991b1b",
      border: "2px solid rgba(239, 68, 68, 0.2)",
    },
    loadingContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "2.5rem",
      padding: "6rem 2rem",
      color: "#7c3aed",
      minHeight: "500px",
      background: 'rgba(255, 255, 255, 0.8)',
      borderRadius: '1.5rem',
      boxShadow: '0 8px 32px rgba(124, 58, 237, 0.1)',
      border: '2px solid rgba(124, 58, 237, 0.1)',
    },
    loadingTextContainer: {
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
    },
    loadingText: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#7c3aed",
      margin: "0",
      textShadow: "0 2px 4px rgba(124, 58, 237, 0.1)",
    },
    loadingSubtext: {
      fontSize: "1.1rem",
      color: "#6b7280",
      margin: "0",
      fontStyle: "italic",
    },
    cardImageContainer: {
      width: "100%",
      height: "200px",
      borderTopLeftRadius: "1.5rem",
      borderTopRightRadius: "1.5rem",
      overflow: "hidden",
      marginBottom: "0",
      position: "relative",
    },
    cardImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.3s ease",
    },
    cardImagePlaceholder: {
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(124, 58, 237, 0.1)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "#7c3aed",
      fontSize: "3rem",
    },
    cardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "1rem",
      padding: "1.5rem 1.5rem 0.75rem 1.5rem",
    },
    cardTitle: {
      fontSize: "1.4rem",
      fontWeight: "800",
      margin: "0",
      color: "#4b2997",
      lineHeight: "1.3",
      flex: "1",
      marginRight: "1rem",
    },
    priceBadge: {
      backgroundColor: "rgba(124, 58, 237, 0.1)",
      color: "#7c3aed",
      padding: "0.5rem 1rem",
      borderRadius: "9999px",
      fontSize: "1.1rem",
      fontWeight: "800",
      boxShadow: "0 2px 8px rgba(124, 58, 237, 0.2)",
      border: "2px solid rgba(124, 58, 237, 0.2)",
      whiteSpace: "nowrap",
    },
    cardBody: {
      flex: "1",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      marginBottom: "1.5rem",
      padding: "0 1.5rem",
    },
    cardDescription: {
      color: "#6d28d9",
      fontSize: "1rem",
      margin: "0 0 1rem 0",
      lineHeight: "1.6",
    },
    infoRow: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      fontSize: "1rem",
      color: "#4b2997",
      padding: "0.5rem 0",
    },
    infoIcon: {
      opacity: "0.8",
      color: "#7c3aed",
      display: "flex",
      alignItems: "center",
      flexShrink: 0,
    },
    cardFooter: {
      marginTop: "auto",
      padding: "0 1.5rem 1.5rem 1.5rem",
    },
    viewDetailsButton: {
      width: "100%",
      padding: "1rem 1.5rem",
      background: "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)",
      color: "white",
      border: "none",
      borderRadius: "1rem",
      cursor: "pointer",
      fontWeight: "700",
      fontSize: "1.1rem",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 16px rgba(124, 58, 237, 0.3)",
      position: "relative",
      overflow: "hidden",
    },
    viewDetailsButtonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 24px rgba(124, 58, 237, 0.4)",
    },
    resultsCount: {
      textAlign: "center",
      marginBottom: "2rem",
      color: "#6b7280",
      fontSize: "1.1rem",
      fontWeight: "500",
      background: "rgba(255, 255, 255, 0.8)",
      padding: "1rem 2rem",
      borderRadius: "1rem",
      boxShadow: "0 4px 16px rgba(124, 58, 237, 0.1)",
      border: "2px solid rgba(124, 58, 237, 0.1)",
    },
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes ticketFloat {
        0% { transform: translateY(0) scale(1) rotate(-5deg); opacity: 0.15; }
        100% { transform: translateY(-20px) scale(1.05) rotate(5deg); opacity: 0.25; }
      }
      
      @keyframes modalSlideIn {
        from {
          opacity: 0;
          transform: scale(0.9) translateY(-20px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .card-animation {
        animation: fadeInUp 0.6s ease-out;
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

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

  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div style={styles.pageContainer}>
      <div style={styles.ticketBg}>
        {ticketPositions.map((pos, i) => (
          <img
            key={i}
            src={ticketImg}
            alt="ticket"
            style={{
              ...styles.ticketImg,
              top: pos.top,
              left: pos.left,
              right: pos.right,
              bottom: pos.bottom,
              width: pos.size,
              height: "auto",
              transform: `rotate(${pos.rot}deg)`,
              animationDelay: `${pos.delay}s`,
            }}
            draggable={false}
          />
        ))}
      </div>
      <div style={styles.mainContent}>
        <div style={styles.header}>
          <span style={styles.ticketHeaderIcon}>
            {Icons.ticket()}
          </span>
          Discover Amazing Events
        </div>
        
        <div style={styles.headerContainer}>
          <div style={styles.headerLeft}>
            <img 
              src={logo} 
              alt="BookedIn Logo" 
              style={styles.headerLogo} 
              onClick={handleLogoClick}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.1)';
                e.target.style.boxShadow = '0 8px 24px rgba(124, 58, 237, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 4px 16px rgba(124, 58, 237, 0.2)';
              }}
            />
            <span style={styles.headerBrand}>BookedIn</span>
          </div>
          
          <div style={styles.headerCenter}>
            <div style={{
              ...styles.searchBar,
              ...(searchFocused ? styles.searchBarFocused : {})
            }}>
              <span style={styles.searchIcon}>
                {Icons.search()}
              </span>
              <input
                type="text"
                placeholder="Search for events, venues, or categories..."
                style={styles.searchInput}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                aria-label="Search events"
              />
            </div>
            
            <select
              style={styles.filterSelect}
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              aria-label="Filter by category"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          
          <button
            style={styles.homeButton}
            onClick={() => navigate("/UserDashboard")}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 24px rgba(124, 58, 237, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 16px rgba(124, 58, 237, 0.3)';
            }}
          >
            {Icons.home()}
            Dashboard
          </button>
        </div>

        {message.text && (
          <div style={{ 
            ...styles.message, 
            ...(message.type === "success" ? styles.messageSuccess : styles.messageError)
          }}>
            {message.text}
          </div>
        )}

        {loading ? (
          <div style={styles.loadingContainer}>
            <AnimatedLogo size={160} show={true} loop={true} duration={1200} />
            <div style={styles.loadingTextContainer}>
              <p style={styles.loadingText}>
                <span style={{ marginRight: 8, color: '#7c3aed' }}>{Icons.ticket()}</span>
                Finding amazing events for you...
              </p>
              <p style={styles.loadingSubtext}>This will just take a moment</p>
            </div>
          </div>
        ) : (
          <>

            
            <div style={styles.grid}>
              {filteredEvents.length === 0 ? (
                <div style={styles.noEvents}>
                  <span style={styles.noEventsIcon}>
                    {Icons.ticket()}
                  </span>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem' }}>
                      No events found
                    </h3>
                    <p style={{ margin: 0, opacity: 0.8 }}>
                      {searchTerm || categoryFilter !== "All" 
                        ? "Try adjusting your search or filters"
                        : "Check back soon for new events!"
                      }
                    </p>
                  </div>
                </div>
              ) : (
                filteredEvents.map((event, idx) => {
                  const eventDate = new Date(event.date);
                  return (
                    <div
                      key={event._id}
                      className="card-animation"
                      style={{
                        ...styles.card,
                        ...(hoveredCard === idx ? styles.cardHover : {}),
                        animationDelay: `${idx * 0.1}s`
                      }}
                      onMouseEnter={() => setHoveredCard(idx)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div style={styles.cardImageContainer}>
                        {event.image ? (
                          <img 
                            src={event.image} 
                            alt={event.title} 
                            style={{
                              ...styles.cardImage,
                              transform: hoveredCard === idx ? 'scale(1.05)' : 'scale(1)'
                            }}
                          />
                        ) : (
                          <div style={styles.cardImagePlaceholder}>
                            <span>{Icons.theater()}</span>
                          </div>
                        )}
                      </div>
                      
                      <div style={styles.cardHeader}>
                        <h2 style={styles.cardTitle}>{event.title}</h2>
                        <span style={styles.priceBadge}>${event.price}</span>
                      </div>
                      
                      <div style={styles.cardBody}>
                        <div style={styles.infoRow}>
                          <span>{formatDate(event.date)}</span>
                        </div>
                        
                        <div style={styles.infoRow}>
                          <span style={styles.infoIcon}>
                            {Icons.location()}
                          </span>
                          <span>{event.location || "Venue to be confirmed"}</span>
                        </div>
                        
                        <div style={styles.infoRow}>
                          <span style={styles.infoIcon}>
                            {Icons.tickets()}
                          </span>
                          <span>
                            {event.availableTickets} ticket{event.availableTickets !== 1 ? 's' : ''} available
                          </span>
                        </div>
                      </div>

                      <div style={styles.cardFooter}>
                        <button
                          style={{
                            ...styles.viewDetailsButton,
                            ...(hoveredCard === idx ? styles.viewDetailsButtonHover : {})
                          }}
                          onClick={() => navigate(`/event/${event._id}`)}
                          onMouseEnter={(e) => {
                            if (hoveredCard !== idx) {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 8px 24px rgba(124, 58, 237, 0.4)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (hoveredCard !== idx) {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = '0 4px 16px rgba(124, 58, 237, 0.3)';
                            }
                          }}
                        >
                          View Details & Book
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmBooking}
        title="Confirm Your Booking"
        message={confirmationMessage}
      />
    </div>
  );
};

export default BookTickets;