import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EventCard = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:7000/api/v1/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setEvent(response.data);
      } catch (err) {
        setError("? Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading)
    return <p style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>? Loading event details...</p>;
  if (error)
    return <p style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>{error}</p>;
  if (!event)
    return <p style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>? No event found.</p>;

  const eventDate = new Date(event.date);
  const createdAt = new Date(event.createdAt);
  const updatedAt = new Date(event.updatedAt);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        background: "linear-gradient(135deg, #434190, #2c2e8f)",
        position: "relative",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Logo */}
      <img
        src="/logo.png"
        alt="Logo"
        onClick={() => navigate("/book-tickets")}
        style={{
          position: "absolute",
          top: "20px",
          right: "70px",
          height: "100px",
          width: "100px",
          cursor: "pointer",
        }}
      />

      {/* Page Title */}
      <h2
        style={{
          textAlign: "center",
          color: "white",
          fontWeight: "bold",
          fontSize: "2.5rem",
          marginBottom: "30px",
        }}
      >
        ?? Event Details
      </h2>

      {/* Event Card */}
      <div
        style={{
          background: "linear-gradient(135deg,rgb(124, 144, 160),rgb(71, 77, 83))",
          maxWidth: "650px",
          margin: "0 auto",
          padding: "35px",
          borderRadius: "16px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
          color: "white",
          fontWeight: "bold",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            marginBottom: "25px",
            backgroundColor: "#5a67d8",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1rem",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#434190")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#5a67d8")}
        >
          ?? Back
        </button>

        <h1 style={{ marginBottom: "20px", fontSize: "2.2rem" }}>??? {event.title}</h1>
        <img
          src={`http://localhost:7000/images/${event.image}`}
          alt={event.title}
          style={{ width: "100%", maxHeight: "300px", objectFit: "cover", borderRadius: "10px", marginBottom: "25px" }}
        />

        <p>?? <strong>Description:</strong> {event.description}</p>
        <p>??? <strong>Category:</strong> {event.category}</p>
        <p>?? <strong>Location:</strong> {event.location}</p>
        <p>?? <strong>Date:</strong> {eventDate.toLocaleDateString()}</p>
        <p>? <strong>Time:</strong> {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        <p>?? <strong>Price:</strong> ${event.price}</p>
        <p>?? <strong>Available Tickets:</strong> {event.availableTickets}</p>
        <p>??? <strong>Total Tickets:</strong> {event.totalTickets}</p>
        <p>?? <strong>Status:</strong> {event.status}</p>
        <p>?? <strong>Organizer ID:</strong> {event.organizerId}</p>
        <p>?? <strong>Created At:</strong> {createdAt.toLocaleString()}</p>
        <p>?? <strong>Updated At:</strong> {updatedAt.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default EventCard;
