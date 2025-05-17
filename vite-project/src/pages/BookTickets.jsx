import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "./logo.png";
import { useNavigate } from "react-router-dom";

const EventsTable = () => {
  const [events, setEvents] = useState([]);
  const [ticketsInput, setTicketsInput] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [message, setMessage] = useState({ text: "", type: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:7000/api/v1/events", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setEvents(response.data);
      } catch (err) {
        console.error("Error fetching events:", err);
        setMessage({ text: "Failed to load events.", type: "error" });
      }
    };

    fetchEvents();
  }, []);

  const handleLogoClick = () => {
    window.location.href = "/UserDashboard";
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

    const bookingData = {
      eventId: event._id,
      ticketsBooked,
      totalPrice: event.price * ticketsBooked,
    };

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:7000/api/v1/bookings",
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

  // Redirect to event detail page
  const handleRowClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

        .container {
          background: linear-gradient(135deg, #667eea, #764ba2);
          min-height: 100vh;
          padding: 50px 30px 30px;
          font-family: 'Poppins', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }
        .logo {
          position: absolute;
          top: 20px;
          right: 30px;
          width: 100px;
          height: auto;
          user-select: none;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .logo:hover {
          transform: scale(1.05);
        }
        h1 {
          color: white;
          font-weight: 700;
          font-size: 2rem;
          margin-bottom: 10px;
          user-select: none;
        }
        .filters {
          margin-bottom: 20px;
          display: flex;
          gap: 15px;
          width: 100%;
          max-width: 1100px;
          justify-content: flex-start;
        }
        .search-input, .category-select {
          padding: 8px 12px;
          font-size: 1rem;
          border-radius: 6px;
          border: none;
          outline: none;
          box-shadow: 0 0 5px rgba(0,0,0,0.1);
        }
        .events-table {
          width: 100%;
          max-width: 1100px;
          border-collapse: separate;
          border-spacing: 0;
          background: white;
          border-radius: 12px;
          box-shadow: 0 5px 18px rgba(0,0,0,0.12);
          overflow: hidden;
        }
        .events-table th, .events-table td {
          color: black;
          border-bottom: 1px solid rgba(102,126,234,0.15);
          border-right: 1px solid rgba(102,126,234,0.15);
          padding: 14px 18px;
          text-align: left;
          vertical-align: middle;
          user-select: none;
        }
        .events-table th:last-child,
        .events-table td:last-child {
          border-right: none;
        }
        .events-table tbody tr:last-child td {
          border-bottom: none;
        }
        .events-table th {
          background: linear-gradient(135deg, #6b46c1, #553c9a);
          font-weight: 600;
          font-size: 1.05rem;
          user-select: none;
        }
        .events-table tbody tr:hover {
          background-color: #f0ebff;
          cursor: pointer;
        }
        .book-btn {
          background: linear-gradient(135deg, #5a67d8, #434190);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.3s ease;
          white-space: nowrap;
          user-select: none;
        }
        .book-btn:hover {
          background: linear-gradient(135deg, #434190, #2c2e8f);
        }
        .tickets-input {
          width: 60px;
          padding: 6px 8px;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          margin-right: 8px;
          text-align: center;
        }
        .message {
          margin-bottom: 20px;
          padding: 10px 15px;
          max-width: 1100px;
          width: 100%;
          border-radius: 6px;
          font-weight: 500;
          font-size: 1rem;
          box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        }
        .message.success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        .message.error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
      `}</style>

      <div className="container">
        <img
          src={logo}
          alt="Logo"
          className="logo"
          onClick={handleLogoClick}
          title="Go to Dashboard"
        />
        <h1>Available Events</h1>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="filters">
          <input
            type="text"
            placeholder="Search events..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search events"
          />
          <select
            className="category-select"
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

        <table className="events-table" aria-label="Events table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Location</th>
              <th>Date</th>
              <th>Time</th>
              <th>Organizer</th>
              <th>Category</th>
              <th>Available Tickets</th>
              <th>Capacity</th>
              <th>Price ($)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan="11" style={{ textAlign: "center" }}>
                  {events.length === 0 ? "Loading events..." : "No matching events found."}
                </td>
              </tr>
            ) : (
              filteredEvents.map((event) => {
                const eventDate = new Date(event.date);
                return (
                  <tr
                    key={event._id}
                    onClick={(e) => {
                      // Prevent row click if clicking inside input or button
                      if (
                        e.target.tagName !== "INPUT" &&
                        e.target.tagName !== "BUTTON"
                      ) {
                        handleRowClick(event._id);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                    title="Click to view event details"
                  >
                    <td>{event.title}</td>
                    <td>{event.description}</td>
                    <td>{event.location}</td>
                    <td>{eventDate.toLocaleDateString()}</td>
                    <td>
                      {eventDate.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td>N/A</td>
                    <td>{event.category}</td>
                    <td>{event.availableTickets}</td>
                    <td>{event.totalTickets}</td>
                    <td>{event.price}</td>
                    <td
                      onClick={(e) => e.stopPropagation()} // stop row click when interacting with action buttons/inputs
                    >
                      <input
                        type="number"
                        min="1"
                        max={event.availableTickets}
                        className="tickets-input"
                        value={ticketsInput[event._id] || ""}
                        onChange={(e) =>
                          handleInputChange(event._id, e.target.value)
                        }
                        placeholder="Tickets"
                      />
                      <button
                        className="book-btn"
                        onClick={() => handleBook(event)}
                        disabled={event.availableTickets === 0}
                      >
                        Book
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default EventsTable;
