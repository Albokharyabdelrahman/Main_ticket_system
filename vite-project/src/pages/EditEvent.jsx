import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../assets/logo.png";

const API_BASE_URL = "http://localhost:7000/api/v1";

// Purple theme variables
const purpleTheme = {
  "--primary-purple": "#7c3aed",
  "--secondary-purple": "#a78bfa",
  "--accent-purple": "#c4b5fd",
  "--glass-bg": "rgba(124, 58, 237, 0.15)",
  "--glass-border": "rgba(124, 58, 237, 0.25)",
  "--header-gradient": "linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)",
};

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
    category: "",
    image: null,
    imagePreview: null,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Object.entries(purpleTheme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
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
          category: e.category || "",
          image: null,
          imagePreview: e.image || null,
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEvent((prev) => ({
      ...prev,
      image: file,
      imagePreview: URL.createObjectURL(file),
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
      category: event.category,
    };
    try {
      let config = { withCredentials: true };
      let url = `${API_BASE_URL}/events/${id}`;
      if (event.image) {
        const formData = new FormData();
        formData.append('title', event.title.trim());
        formData.append('date', event.date);
        formData.append('location', event.location.trim());
        formData.append('totalTickets', totalTicketsNum);
        formData.append('price', Number(event.price));
        formData.append('category', event.category);
        formData.append('image', event.image);
        await axios.put(url, formData, { ...config, headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await axios.put(url, payload, config);
      }
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

  const categories = [
    "Music",
    "Sports",
    "Arts",
    "Comedy",
    "Talks",
    "Food & Drink",
    "Business",
    "Technology",
    "Education",
    "Health",
    "Other"
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#fff", position: 'relative', overflow: 'hidden', padding: 0, margin: 0 }}>
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
      {/* Header */}
      <div style={{ background: "var(--header-gradient)", color: "white", padding: "2.5rem 2rem 4rem 2rem", borderBottomLeftRadius: 40, borderBottomRightRadius: 40, boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)", position: "relative", marginBottom: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ background: '#fff', borderRadius: '50%', width: 70, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px #a78bfa22', cursor: 'pointer' }} onClick={() => navigate(-1)}>
            <img src={logo} alt="Logo" style={{ width: 48, height: 48, borderRadius: '50%', boxShadow: '0 2px 8px #a78bfa', objectFit: 'cover' }} />
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: '#fff', textShadow: '0 2px 8px #a78bfa' }}>Edit Event</h1>
        </div>
      </div>
      {/* Form Card */}
      <div style={{ width: '100%', maxWidth: 500, margin: '0 auto', background: 'rgba(124, 58, 237, 0.18)', borderRadius: 24, padding: '40px 30px', boxShadow: '0 4px 24px #a78bfa33', color: '#fff', backdropFilter: 'blur(14px)', position: 'relative', zIndex: 1 }}>
        {message && <p style={{ color: '#90ee90', fontWeight: 600, marginBottom: 10 }}>{message}</p>}
        {error && <p style={{ color: '#ff6b6b', fontWeight: 600, marginBottom: 10 }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {event.imagePreview && (
            <div style={{ marginBottom: 24, textAlign: 'center' }}>
              <img src={event.imagePreview} alt="Event" style={{ maxWidth: 220, maxHeight: 120, borderRadius: 12, boxShadow: '0 2px 8px #a78bfa22', background: '#fff' }} />
            </div>
          )}
          <label htmlFor="image" style={{ fontWeight: 600, fontSize: 16, color: '#7c3aed', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 12 }}>
            <span style={{
              display: 'inline-block',
              padding: '10px 22px',
              background: 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)',
              color: '#fff',
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 15,
              cursor: 'pointer',
              boxShadow: '0 2px 8px #a78bfa22',
              border: 'none',
              marginBottom: 6,
              transition: 'background 0.2s',
            }}>
              Change Image
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </span>
          </label>
          <label htmlFor="title" style={{ fontWeight: 600, fontSize: 16, color: '#7c3aed', display: 'flex', flexDirection: 'column' }}>
            Title:
            <input
              id="title"
              name="title"
              value={event.title}
              onChange={handleChange}
              style={{ marginTop: 6, padding: 12, fontSize: 15, borderRadius: 12, border: '1.5px solid var(--glass-border)', backgroundColor: '#fff', color: '#7c3aed', outline: 'none', fontWeight: 500 }}
              autoComplete="off"
              required
            />
          </label>
          <label htmlFor="category" style={{ fontWeight: 600, fontSize: 16, color: '#7c3aed', display: 'flex', flexDirection: 'column' }}>
            Category:
            <select
              id="category"
              name="category"
              value={event.category}
              onChange={handleChange}
              style={{ marginTop: 6, padding: 12, fontSize: 15, borderRadius: 12, border: '1.5px solid var(--glass-border)', backgroundColor: '#fff', color: '#7c3aed', outline: 'none', fontWeight: 500 }}
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </label>
          <label htmlFor="date" style={{ fontWeight: 600, fontSize: 16, color: '#7c3aed', display: 'flex', flexDirection: 'column' }}>
            Date:
            <input
              id="date"
              name="date"
              type="date"
              value={event.date}
              onChange={handleChange}
              style={{ marginTop: 6, padding: 12, fontSize: 15, borderRadius: 12, border: '1.5px solid var(--glass-border)', backgroundColor: '#fff', color: '#7c3aed', outline: 'none', fontWeight: 500 }}
              required
            />
          </label>
          <label htmlFor="location" style={{ fontWeight: 600, fontSize: 16, color: '#7c3aed', display: 'flex', flexDirection: 'column' }}>
            Location:
            <input
              id="location"
              name="location"
              value={event.location}
              onChange={handleChange}
              style={{ marginTop: 6, padding: 12, fontSize: 15, borderRadius: 12, border: '1.5px solid var(--glass-border)', backgroundColor: '#fff', color: '#7c3aed', outline: 'none', fontWeight: 500 }}
              autoComplete="off"
              required
            />
          </label>
          <label htmlFor="price" style={{ fontWeight: 600, fontSize: 16, color: '#7c3aed', display: 'flex', flexDirection: 'column' }}>
            Price:
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={event.price}
              onChange={handleChange}
              style={{ marginTop: 6, padding: 12, fontSize: 15, borderRadius: 12, border: '1.5px solid var(--glass-border)', backgroundColor: '#fff', color: '#7c3aed', outline: 'none', fontWeight: 500 }}
              autoComplete="off"
              required
            />
          </label>
          <label htmlFor="totalTickets" style={{ fontWeight: 600, fontSize: 16, color: '#7c3aed', display: 'flex', flexDirection: 'column' }}>
            Tickets Total:
            <input
              id="totalTickets"
              name="totalTickets"
              type="number"
              min="0"
              value={event.totalTickets}
              onChange={handleChange}
              style={{ marginTop: 6, padding: 12, fontSize: 15, borderRadius: 12, border: '1.5px solid var(--glass-border)', backgroundColor: '#fff', color: '#7c3aed', outline: 'none', fontWeight: 500 }}
              required
            />
          </label>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
            <button type="submit" style={{ marginTop: 10, padding: '14px 0', flex: 1, background: 'var(--primary-purple)', color: 'white', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 12, cursor: 'pointer', transition: 'background 0.3s ease', boxShadow: '0 2px 8px #a78bfa22' }}>
              Save Changes
            </button>
            <button 
              type="button" 
              style={{ marginTop: 10, padding: '14px 0', flex: 1, background: 'linear-gradient(135deg, #ff9800, #ff7043)', color: 'white', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 12, cursor: 'pointer', transition: 'background 0.3s ease', boxShadow: '0 2px 8px #a78bfa22' }}
              onClick={() => setIsConfirming(true)}
            >
              Delete Event
            </button>
          </div>
        </form>
        {isConfirming && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: '#fff', padding: 30, borderRadius: 16, maxWidth: 400, width: '90%', textAlign: 'center', boxShadow: '0 8px 32px #a78bfa22', border: '1.5px solid var(--glass-border)' }}>
              <h3 style={{ color: 'var(--primary-purple)' }}>Confirm Deletion</h3>
              <p style={{ color: '#7c3aed' }}>Are you sure you want to delete this event? This action cannot be undone.</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 15, marginTop: 20 }}>
                <button 
                  style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #ff9800, #ff7043)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
                  onClick={handleDelete}
                >
                  Delete
                </button>
                <button 
                  style={{ padding: '10px 20px', backgroundColor: 'var(--primary-purple)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
                  onClick={() => setIsConfirming(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}