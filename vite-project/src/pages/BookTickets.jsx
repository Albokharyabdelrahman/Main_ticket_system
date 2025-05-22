import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "./logo.png";

const API_BASE_URL = "http://localhost:7000/api/v1";

const EventsTable = () => {
  const [events, setEvents] = useState([]);
  const [ticketsInput, setTicketsInput] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(true);
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
        setMessage({ text: "Failed to load events.", type: "error" });
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
      text: "Please enter a valid number of tickets within available range.",
      type: "error",
    });
    return;
  }

  const totalPrice = event.price * ticketsBooked;
  const confirmPurchase = window.confirm(
    `Total for ${ticketsBooked} ticket(s): EGP:${totalPrice}\n\nDo you want to proceed with the purchase?`
  );

  if (!confirmPurchase) {
    setMessage({
      text: "Booking cancelled.",
      type: "info",
    });
    return;
  }

  const bookingData = {
    eventId: event._id,
    ticketsBooked,
    totalPrice,
  };
  // ... rest of the function
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
        text: `Successfully booked ${ticketsBooked} ticket(s)!`,
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
        err.response?.data?.error || err.response?.data?.message || "Booking failed.";
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

  return (
    <div style={styles.pageContainer}>
      <div style={styles.mainContent}>
        <img
          src={logo}
          alt="Logo"
          style={styles.logo}
          onClick={handleLogoClick}
        />
        <div style={styles.header}>
          <h1 style={styles.title}>Available Events</h1>
          <p style={styles.subtitle}>Discover and book your next experience</p>
        </div>

        {message.text && (
          <div style={{ 
            ...styles.message, 
            backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da",
            color: message.type === "success" ? "#155724" : "#721c24"
          }}>
            {message.text}
          </div>
        )}

        <div style={styles.filters}>
          <input
            type="text"
            placeholder="Search events..."
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search events"
          />
          <select
            style={styles.categorySelect}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter by category"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <p style={styles.loadingText}>Loading events...</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {filteredEvents.length === 0 ? (
              <div style={styles.noEvents}>
                {events.length === 0 ? "No events available." : "No matching events found."}
              </div>
            ) : (
              filteredEvents.map((event) => {
                const eventDate = new Date(event.date);
                return (
                  <div
                    key={event._id}
                    style={styles.card}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                  >
                    <div style={styles.cardHeader}>
                      <h2 style={styles.cardTitle}>{event.title}</h2>
                      <span style={styles.priceBadge}>${event.price}</span>
                    </div>
                    
                    <div style={styles.cardBody}>
                      <p style={styles.cardDescription}>{event.description}</p>
                      
                      <div style={styles.infoRow}>
                        <span style={styles.infoIcon}>📅</span>
                        <span>{eventDate.toLocaleDateString()}</span>
                        <span style={{ margin: "0 8px" }}>•</span>
                        <span>{eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                      
                      <div style={styles.infoRow}>
                        <span style={styles.infoIcon}>📍</span>
                        <span>{event.location}</span>
                      </div>
                      
                      <div style={styles.infoRow}>
                        <span style={styles.infoIcon}>🎟️</span>
                        <span>{event.availableTickets} / {event.totalTickets} available</span>
                      </div>
                      
                      <div style={styles.infoRow}>
                        <span style={styles.infoIcon}>📁</span>
                        <span>{event.category}</span>
                      </div>
                    </div>

                    <div style={styles.cardFooter}>
                      <div style={styles.ticketInputContainer}>
                        <input
                          type="number"
                          min="1"
                          max={event.availableTickets}
                          style={styles.ticketsInput}
                          value={ticketsInput[event._id] || ""}
                          onChange={(e) => handleInputChange(event._id, e.target.value)}
                          placeholder="Tickets"
                        />
                        <button
                          style={styles.bookButton}
                          onClick={() => handleBook(event)}
                          disabled={event.availableTickets === 0}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
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
  message: {
    padding: "1rem",
    borderRadius: "0.5rem",
    marginBottom: "1.5rem",
    textAlign: "center",
    fontWeight: "500",
    maxWidth: "800px",
    marginLeft: "auto",
    marginRight: "auto",
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
  categorySelect: {
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    borderRadius: "0.5rem",
    border: "none",
    outline: "none",
    minWidth: "200px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    padding: "2rem",
    color: "white",
  },
  loadingSpinner: {
    width: "40px",
    height: "40px",
    border: "4px solid rgba(255,255,255,0.3)",
    borderTopColor: "white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    fontSize: "1.2rem",
    marginTop: "1rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "2rem",
    padding: "1rem",
  },
  noEvents: {
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
    minHeight: "320px",
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
  priceBadge: {
    backgroundColor: "#f0f4ff",
    color: "#4338ca",
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
  cardDescription: {
    color: "#64748b",
    fontSize: "0.95rem",
    margin: "0 0 1rem 0",
    lineHeight: "1.5",
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
  },
  ticketInputContainer: {
    display: "flex",
    gap: "0.75rem",
    alignItems: "center",
  },
  ticketsInput: {
    padding: "0.5rem 0.75rem",
    fontSize: "1rem",
    borderRadius: "0.5rem",
    border: "1px solid #e2e8f0",
    outline: "none",
    width: "80px",
    textAlign: "center",
  },
  bookButton: {
    padding: "0.5rem 1rem",
    background: "linear-gradient(135deg, #ff9800, #ff7043)",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontWeight: "600",
    flex: "1",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    ":hover": {
      background: "linear-gradient(135deg, #ff7043, #ff5722)",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
    },
    ":disabled": {
      background: "#cbd5e1",
      cursor: "not-allowed",
      transform: "none",
      boxShadow: "none",
    }
  },
};

export default EventsTable;