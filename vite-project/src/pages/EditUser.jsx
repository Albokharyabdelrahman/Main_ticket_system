import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../assets/logo.png";

const API_BASE_URL = "http://localhost:7000/api/v1";

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

export default function EditUser() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    role: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
    (async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/${userId}`, {
          withCredentials: true,
        });
        setUser({
          role: res.data.role || "",
        });
      } catch (err) {
        setError("Failed to load user data.");
      }
    })();
  }, [userId]);

  const handleChange = (e) =>
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      await axios.put(`${API_BASE_URL}/users/${userId}`, { role: user.role }, {
        withCredentials: true,
      });
      setMessage("User role updated successfully!");
      navigate(-1);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this user?")) return;

    setError("");
    setMessage("");
    setIsDeleting(true);

    try {
      await axios.delete(`${API_BASE_URL}/users/${userId}`, {
        withCredentials: true,
      });
      setMessage("User deleted successfully!");
      setTimeout(() => navigate(-1), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

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
          <div style={{ background: '#fff', borderRadius: '50%', width: 70, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px #a78bfa22', cursor: 'pointer' }} onClick={handleBack}>
            <img src={logo} alt="Logo" style={{ width: 48, height: 48, borderRadius: '50%', boxShadow: '0 2px 8px #a78bfa', objectFit: 'cover' }} />
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: '#fff', textShadow: '0 2px 8px #a78bfa' }}>Edit User Role</h1>
        </div>
      </div>
      {/* Main Card */}
      <div style={{ width: '100%', maxWidth: 600, margin: '0 auto', background: 'rgba(124, 58, 237, 0.18)', borderRadius: 24, padding: '40px 30px', boxShadow: '0 4px 24px #a78bfa33', color: '#fff', backdropFilter: 'blur(14px)', position: 'relative', zIndex: 1 }}>
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '1rem', marginBottom: 24, backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: 12, fontSize: 15, fontWeight: 500 }}>
            <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24">
              <path fill="currentColor" d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" />
            </svg>
            {error}
          </div>
        )}

        {message && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '1rem', marginBottom: 24, backgroundColor: '#dcfce7', color: '#166534', borderRadius: 12, fontSize: 15, fontWeight: 500 }}>
            <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
            </svg>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#7c3aed' }}>Role</span>
              <select
                name="role"
                value={user.role}
                onChange={handleChange}
                style={{ padding: '12px 16px', fontSize: 16, borderRadius: 12, border: 'none', outline: 'none', boxShadow: '0 0 8px rgba(124, 58, 237, 0.18)', backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#333', transition: 'box-shadow 0.3s ease' }}
                required
              >
                <option value="">Select a role</option>
                <option value="Admin">Admin</option>
                <option value="Organizer">Organizer</option>
                <option value="User">User</option>
              </select>
            </label>
          </div>

          <button 
            type="submit" 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '14px 28px', fontSize: 16, borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', color: 'white', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)', transition: 'background 0.3s ease' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span>Saving...</span>
            ) : (
              <>
                <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24">
                  <path fill="currentColor" d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3M19 19H5V5H16.17L19 7.83V19M12 12C10.34 12 9 13.34 9 15S10.34 18 12 18 15 16.66 15 15 13.66 12 12 12M6 6H15V10H6V6Z" />
                </svg>
                <span>Update Role</span>
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: 32, padding: '24px', backgroundColor: '#fff7ed', borderRadius: 16, borderTop: '1px solid #fed7aa' }}>
          <h3 style={{ margin: 0, marginBottom: 16, fontSize: 20, fontWeight: 700, color: '#9a3412' }}>Danger Zone</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ margin: 0, fontSize: 15, color: '#9a3412' }}>
              Deleting a user is permanent and cannot be undone.
            </p>
            <button
              type="button"
              onClick={handleDelete}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '14px 28px', fontSize: 16, borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #ff9800, #ff7043)', color: 'white', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)', transition: 'background 0.3s ease' }}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span>Deleting...</span>
              ) : (
                <>
                  <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                  </svg>
                  <span>Delete User</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}