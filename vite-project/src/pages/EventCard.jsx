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
        setError("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!event) return <p>No event found.</p>;

  const eventDate = new Date(event.date);
  const createdAt = new Date(event.createdAt);
  const updatedAt = new Date(event.updatedAt);

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "10px" }}>← Back</button>

      <h1>{event.title}</h1>
      <img
        src={`http://localhost:7000/images/${event.image}`} 
        alt={event.title}
        style={{ width: "100%", maxHeight: "300px", objectFit: "cover", borderRadius: "8px" }}
      />
      <p><strong>Description:</strong> {event.description}</p>
      <p><strong>Category:</strong> {event.category}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Date:</strong> {eventDate.toLocaleDateString()}</p>
      <p><strong>Time:</strong> {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
      <p><strong>Price:</strong> ${event.price}</p>
      <p><strong>Available Tickets:</strong> {event.availableTickets}</p>
      <p><strong>Total Tickets:</strong> {event.totalTickets}</p>
      <p><strong>Status:</strong> {event.status}</p>
      <p><strong>Organizer ID:</strong> {event.organizerId}</p>
      <p><strong>Created At:</strong> {createdAt.toLocaleString()}</p>
      <p><strong>Updated At:</strong> {updatedAt.toLocaleString()}</p>
    </div>
  );
};

export default EventCard;
