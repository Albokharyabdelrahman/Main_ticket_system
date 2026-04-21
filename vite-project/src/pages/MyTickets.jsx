import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import logo from "./logo.png";
import ticketImg from "../assets/logo.png";
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
  money: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  ),
  id: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  ),
  search: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
      <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  home: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  ),
  cancel: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>
  ),
  check: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
    </svg>
  ),
  arrowBack: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
    </svg>
  ),
  person: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  )
};

const MyTickets = () => {
  const [booking, setBooking] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [confirmCancelTicket, setConfirmCancelTicket] = useState(null);
  const [hoveredTicket, setHoveredTicket] = useState(null);

  const navigate = useNavigate();
  const { bookingId } = useParams();

  useEffect(() => {
    const fetchBookingAndTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch booking details
        const bookingResponse = await axios.get(
          `http://localhost:7000/api/v1/bookings/${bookingId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setBooking(bookingResponse.data);
        
        // Fetch real tickets from database
        const ticketsResponse = await axios.get(
          `http://localhost:7000/api/v1/tickets/booking/${bookingId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        
        // Transform tickets to match frontend format
        const realTickets = ticketsResponse.data.map((ticket, index) => ({
          id: ticket._id,
          ticketNumber: index + 1,
          status: ticket.status === 'valid' ? 'Active' : 'Cancelled',
          price: bookingResponse.data.totalPrice / ticketsResponse.data.length,
          bookingId: bookingResponse.data._id,
          issuedAt: ticket.issuedAt,
          qrCodeData: ticket.qrCodeData
        }));
        
        setTickets(realTickets);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.error ||
            err.response?.data?.message ||
            "Failed to fetch booking details. Please try again later."
        );
        setLoading(false);
      }
    };
    fetchBookingAndTickets();
  }, [bookingId]);

  const handleCancelTicket = async (ticketId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `http://localhost:7000/api/v1/tickets/booking/${bookingId}/cancel`,
        { ticketId },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      
      setSuccessMessage(response.data.message);
      setError(null);
      
      // If entire booking was cancelled, update booking status
      if (response.data.bookingCancelled) {
        setBooking(prev => ({ ...prev, status: "Cancelled" }));
        // Update all tickets to cancelled
        setTickets(prev => prev.map(ticket => ({ ...ticket, status: "Cancelled" })));
      } else {
        // Remove the cancelled ticket from the list
        setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
        
        // Update booking with new ticket count and price
        setBooking(prev => ({
          ...prev,
          ticketsBooked: response.data.remainingTickets,
          totalPrice: (prev.totalPrice / (prev.ticketsBooked)) * response.data.remainingTickets
        }));
      }
      
      setConfirmCancelTicket(null);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to cancel ticket. Please try again."
      );
      setSuccessMessage(null);
      setConfirmCancelTicket(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date to be announced";
    try {
      const date = new Date(dateString);
      return (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#7c3aed' }}>{Icons.calendar()}</span>
          {date.toLocaleDateString()} • {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      );
    } catch (e) {
      return "Date to be announced";
    }
  };

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
      maxWidth: "1200px",
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
    backButton: {
      padding: '0.75rem 1rem',
      background: 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '1rem',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '1rem',
      transition: 'all 0.2s ease',
      boxShadow: '0 4px 16px rgba(107, 114, 128, 0.3)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
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
    successMessage: {
      backgroundColor: "rgba(220, 252, 231, 0.9)",
      color: "#166534",
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
      border: "2px solid rgba(34, 197, 94, 0.2)",
    },
    errorMessage: {
      backgroundColor: "rgba(254, 226, 226, 0.9)",
      color: "#991b1b",
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
    bookingInfo: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '1.5rem',
      boxShadow: '0 8px 32px rgba(124, 58, 237, 0.15)',
      border: '2px solid rgba(124, 58, 237, 0.1)',
      padding: '2rem',
      marginBottom: '2rem',
      backdropFilter: 'blur(10px)',
    },
    bookingTitle: {
      fontSize: '2rem',
      fontWeight: '800',
      color: '#4b2997',
      marginBottom: '1rem',
      textAlign: 'center',
    },
    bookingDetails: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '1.5rem',
    },
    detailItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      fontSize: '1.1rem',
      color: '#4b2997',
      padding: '0.75rem',
      background: 'rgba(124, 58, 237, 0.05)',
      borderRadius: '0.75rem',
    },
    detailIcon: {
      color: '#7c3aed',
      opacity: 0.8,
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
    },
    ticketsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "2rem",
      padding: "1rem",
    },
    ticketCard: {
      background: "rgba(255, 255, 255, 0.95)",
      borderRadius: "1.5rem",
      boxShadow: "0 8px 32px rgba(124, 58, 237, 0.15)",
      border: "2px solid rgba(124, 58, 237, 0.1)",
      padding: "2rem",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      display: "flex",
      flexDirection: "column",
      minHeight: "280px",
      position: "relative",
      willChange: "transform, box-shadow",
      backdropFilter: 'blur(10px)',
    },
    ticketCardHover: {
      transform: "translateY(-12px) scale(1.02)",
      boxShadow: "0 20px 60px rgba(124, 58, 237, 0.25)",
      border: "2px solid rgba(124, 58, 237, 0.2)",
      zIndex: 2,
    },
    ticketHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1.5rem",
    },
    ticketNumber: {
      fontSize: "1.5rem",
      fontWeight: "800",
      color: "#4b2997",
      margin: "0",
    },
    ticketStatus: {
      color: "white",
      padding: "0.5rem 1rem",
      borderRadius: "9999px",
      fontSize: "0.9rem",
      fontWeight: "700",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
      whiteSpace: "nowrap",
    },
    ticketBody: {
      flex: "1",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      marginBottom: "1.5rem",
    },
    ticketInfo: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      fontSize: "1rem",
      color: "#4b2997",
      padding: "0.5rem 0",
    },
    ticketIcon: {
      opacity: "0.8",
      color: "#7c3aed",
      display: "flex",
      alignItems: "center",
      flexShrink: 0,
    },
    ticketFooter: {
      marginTop: "auto",
      display: "flex",
      justifyContent: "center",
    },
    cancelTicketButton: {
      padding: "1rem 1.5rem",
      background: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
      color: "white",
      border: "none",
      borderRadius: "1rem",
      cursor: "pointer",
      fontWeight: "700",
      fontSize: "1.1rem",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 16px rgba(239, 68, 68, 0.3)",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    cancelTicketButtonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 24px rgba(239, 68, 68, 0.4)",
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
      backdropFilter: 'blur(4px)',
    },
    modal: {
      background: "#fff",
      padding: "2rem",
      borderRadius: "1.5rem",
      maxWidth: "450px",
      width: "90%",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
      border: "2px solid rgba(124, 58, 237, 0.1)",
      animation: 'modalSlideIn 0.3s ease-out',
    },
    modalText: {
      color: "#4b2997",
      fontSize: "1.2rem",
      textAlign: "center",
      marginBottom: "2rem",
      fontWeight: "600",
      lineHeight: "1.5",
    },
    modalButtons: {
      display: "flex",
      justifyContent: "center",
      gap: "1rem",
    },
    modalButtonCancel: {
      padding: "0.75rem 1.5rem",
      background: "#f1f5f9",
      color: "#475569",
      border: "none",
      borderRadius: "0.75rem",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "1rem",
      transition: "all 0.2s ease",
    },
    modalButtonConfirm: {
      padding: "0.75rem 1.5rem",
      background: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
      color: "white",
      border: "none",
      borderRadius: "0.75rem",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "1rem",
      transition: "all 0.2s ease",
      boxShadow: "0 4px 16px rgba(239, 68, 68, 0.3)",
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
      
      .ticket-animation {
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

  if (loading) {
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
          <div style={styles.loadingContainer}>
            <AnimatedLogo size={160} show={true} loop={true} duration={1200} />
            <div style={styles.loadingTextContainer}>
              <p style={styles.loadingText}>
                <span style={{ marginRight: 8, color: '#7c3aed' }}>{Icons.ticket()}</span>
                Loading your tickets...
              </p>
              <p style={styles.loadingSubtext}>This will just take a moment</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.mainContent}>
          <div style={styles.errorMessage}>
            <span style={{ marginRight: 8, color: '#dc2626' }}>{Icons.cancel()}</span>
            {error}
          </div>
          <div style={{ textAlign: 'center' }}>
            <button
              style={styles.backButton}
              onClick={() => navigate("/my-bookings")}
            >
              {Icons.arrowBack()}
              Back to Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  const event = booking?.eventId || {};
  const status = (booking?.status || "").toLowerCase();
  const statusColor = status === "confirmed"
    ? "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)"
    : status === "cancelled"
      ? "linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)"
      : "linear-gradient(135deg, #d69e2e 0%, #f6e05e 100%)";

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
          My Tickets
        </div>
        
        {successMessage && (
          <div style={styles.successMessage}>
            <span style={{ marginRight: 8, color: '#16a34a' }}>{Icons.check()}</span>
            {successMessage}
          </div>
        )}
        
        <div style={styles.headerContainer}>
          <div style={styles.headerLeft}>
            <img 
              src={logo} 
              alt="BookedIn Logo" 
              style={styles.headerLogo} 
              onClick={() => navigate("/UserDashboard")}
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
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              style={styles.backButton}
              onClick={() => navigate("/my-bookings")}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 24px rgba(107, 114, 128, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 16px rgba(107, 114, 128, 0.3)';
              }}
            >
              {Icons.arrowBack()}
              Back to Bookings
            </button>
            
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
        </div>

        {booking && (
          <div style={styles.bookingInfo}>
            <h1 style={styles.bookingTitle}>{event.title || "Event Title N/A"}</h1>
            <div style={styles.bookingDetails}>
              <div style={styles.detailItem}>
                <span style={styles.detailIcon}>
                  {Icons.location()}
                </span>
                <span>{event.location || "Location not specified"}</span>
              </div>
              
              {event.date && (
                <div style={styles.detailItem}>
                  {formatDate(event.date)}
                </div>
              )}
              
              <div style={styles.detailItem}>
                <span style={styles.detailIcon}>
                  {Icons.ticket()}
                </span>
                <span>{booking.ticketsBooked} ticket{booking.ticketsBooked !== 1 ? 's' : ''} total</span>
              </div>
              
              <div style={styles.detailItem}>
                <span style={styles.detailIcon}>
                  {Icons.money()}
                </span>
                <span>Total: ${booking.totalPrice ? booking.totalPrice.toFixed(2) : "0.00"}</span>
              </div>
              
              <div style={styles.detailItem}>
                <span style={styles.detailIcon}>
                  {Icons.id()}
                </span>
                <span>Booking ID: {booking._id.slice(-8)}</span>
              </div>
              
              <div style={styles.detailItem}>
                <span style={styles.detailIcon}>
                  {Icons.person()}
                </span>
                <span>Status: {booking.status || "Unknown"}</span>
              </div>
            </div>
          </div>
        )}
        
        <div style={styles.ticketsGrid}>
          {tickets.map((ticket, idx) => {
            const ticketStatus = ticket.status === "Cancelled" 
              ? "linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)"
              : "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)";
            
            return (
              <div
                key={ticket.id}
                className="ticket-animation"
                style={{
                  ...styles.ticketCard,
                  ...(hoveredTicket === idx ? styles.ticketCardHover : {}),
                  animationDelay: `${idx * 0.1}s`
                }}
                onMouseEnter={() => setHoveredTicket(idx)}
                onMouseLeave={() => setHoveredTicket(null)}
              >
                <div style={styles.ticketHeader}>
                  <h2 style={styles.ticketNumber}>Ticket #{ticket.ticketNumber}</h2>
                  <span style={{ 
                    ...styles.ticketStatus,
                    background: ticketStatus
                  }}>
                    {ticket.status}
                  </span>
                </div>
                
                <div style={styles.ticketBody}>
                  <div style={styles.ticketInfo}>
                    <span style={styles.ticketIcon}>
                      {Icons.ticket()}
                    </span>
                    <span>Ticket ID: {ticket.id.slice(-8)}</span>
                  </div>
                  
                  <div style={styles.ticketInfo}>
                    <span style={styles.ticketIcon}>
                      {Icons.money()}
                    </span>
                    <span>Price: ${ticket.price.toFixed(2)}</span>
                  </div>
                  
                  <div style={styles.ticketInfo}>
                    <span style={styles.ticketIcon}>
                      {Icons.calendar()}
                    </span>
                    <span>Event: {event.title || "N/A"}</span>
                  </div>
                  
                  {event.date && (
                    <div style={styles.ticketInfo}>
                      <span style={styles.ticketIcon}>
                        {Icons.calendar()}
                      </span>
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
                
                <div style={styles.ticketFooter}>
                  {ticket.status !== "Cancelled" && booking.status !== "Cancelled" && (
                    <button
                      style={{
                        ...styles.cancelTicketButton,
                        ...(hoveredTicket === idx ? styles.cancelTicketButtonHover : {})
                      }}
                      onClick={() => setConfirmCancelTicket(ticket.id)}
                      onMouseEnter={(e) => {
                        if (hoveredTicket !== idx) {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 8px 24px rgba(239, 68, 68, 0.4)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (hoveredTicket !== idx) {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 4px 16px rgba(239, 68, 68, 0.3)';
                        }
                      }}
                    >
                      {Icons.cancel()}
                      Cancel Ticket
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {confirmCancelTicket && (
          <div style={styles.modalOverlay} onClick={() => setConfirmCancelTicket(null)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <p style={styles.modalText}>
                Are you sure you want to cancel Ticket #{confirmCancelTicket.split('-ticket-')[1]}? 
                This action cannot be undone.
              </p>
              <div style={styles.modalButtons}>
                <button
                  style={styles.modalButtonCancel}
                  onClick={() => setConfirmCancelTicket(null)}
                >
                  Keep Ticket
                </button>
                <button
                  style={styles.modalButtonConfirm}
                  onClick={() => handleCancelTicket(confirmCancelTicket)}
                >
                  {Icons.cancel()}
                  Cancel Ticket
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets; 