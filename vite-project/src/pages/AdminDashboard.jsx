import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import UserRow from "../components/UserRow";
import { Link } from "react-router-dom"; 

function getCurrentUserIdFromCookie() {
  const cookie = document.cookie
    .split("; ")
    .find(row => row.startsWith("token="));
  if (!cookie) return null;

  const token = cookie.split("=")[1];
  if (!token || !token.includes(".")) return null;

  try {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    const UserArr=[decodedPayload.userId,decodedPayload.role||"Rando"];
    return UserArr;
  } catch (e) {
    console.error("Invalid token:", e);
    return null;
  }
}

const API_BASE_URL = "http://localhost:7000/api/v1";

// Add purple theme CSS variables and modern styles
const purpleTheme = {
  "--primary-purple": "#7c3aed",
  "--secondary-purple": "#a78bfa",
  "--accent-purple": "#c4b5fd",
  "--glass-bg": "rgba(124, 58, 237, 0.15)",
  "--glass-border": "rgba(124, 58, 237, 0.25)",
  "--header-gradient": "linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)",
};

// Floating ticket positions
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

const AdminDashboard = () => {
  const { logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [editingObj, setEditingObj] = useState(null);
  const [editingType, setEditingType] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:7000/api/v1/users/profile",
          {
            withCredentials: true,
          }
        );
        setProfile(res.data.user);
      } catch (err) {
        setError("Failed to load profile. Please try again.");
      }
    };
    fetchProfile();
  }, []);

  // Apply theme variables to root
  useEffect(() => {
    Object.entries(purpleTheme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, []);

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

  const handleLogout = async () => {
    try {
      const BASE_URL = "http://localhost:5173/login";
      await axios.post("http://localhost:7000/api/v1/logout", null, {
        withCredentials: true,
      })
      localStorage.removeItem("token");
      logout(); 
      window.location.href = BASE_URL;
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleUpdateProfile = () => navigate('/update-profile');

  const promptAndCall = async (message, apiCall) => {
    const id = window.prompt(message);
    if (id) {
      try {
        const res = await apiCall(id);
        setQuickActionMsg(JSON.stringify(res.data));
      } catch (err) {
        setQuickActionMsg("ERROR: " + (err.response?.data?.message || err.message));
      }
    }
  };

  // EVENTS
  const getAllEvents = async () => {
    navigate("/admin/events");
  };

  const updateEvent = () => {
    navigate('/update-event'); 
  };

  const deleteEvent = () => {
    navigate('/delete-event'); 
  };
  
  // USERS
  const viewProfile = async () => {
    navigate('/user-profiles');
  };

  const updateUserProfile = () =>
    navigate("/user-profile");
    
  const getUserProfile = () =>
    navigate("/user-getProfile");
 

  return (
    <div className="dashboard-root" style={{ minHeight: "100vh", background: "#fff", padding: 0, margin: 0, position: 'relative', overflow: 'hidden' }}>
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
      <div className="dashboard-header" style={{
        background: "var(--header-gradient)",
        color: "white",
        padding: "2.5rem 2rem 4rem 2rem",
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
        position: "relative",
        marginBottom: 40,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={logo} alt="Logo" style={{ width: 60, height: 60, borderRadius: "50%", marginRight: 24, boxShadow: "0 2px 8px #a78bfa" }} />
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0 }}>Welcome back, <span style={{ color: "#fff", textShadow: "0 2px 8px #a78bfa" }}>{profile?.name || "Admin"}</span>!</h1>
              <div style={{ fontSize: 18, opacity: 0.85 }}>Manage your platform with admin controls.</div>
            </div>
          </div>
          <div>
            <button onClick={handleLogout} style={{ background: "var(--primary-purple)", color: "#fff", border: "none", borderRadius: 20, padding: "0.75rem 2rem", fontWeight: 600, fontSize: 16, boxShadow: "0 2px 8px #a78bfa", cursor: "pointer" }}>Log Out</button>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Sidebar + Main */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 40, maxWidth: 1400, margin: "-60px auto 0 auto", padding: "0 24px 48px 24px" }}>
        {/* Sidebar/Profile Card */}
        <aside style={{ minWidth: 320, maxWidth: 340, background: "rgba(124, 58, 237, 0.18)", border: "1.5px solid #a78bfa", borderRadius: 28, boxShadow: "0 4px 24px #a78bfa33", padding: 36, marginTop: 32, display: "flex", flexDirection: "column", alignItems: "center", backdropFilter: "blur(14px)", position: "relative", color: '#fff' }}>
          <div style={{ background: "#fff", borderRadius: "50%", padding: 6, marginBottom: 16, boxShadow: "0 2px 8px #a78bfa22" }}>
            {profile && profile.profilePic ? (
              <img src={profile.profilePic} alt="Profile" style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", border: "3px solid var(--primary-purple)" }} />
            ) : (
              <div style={{ width: 90, height: 90, borderRadius: "50%", background: "#ede9fe", color: "#7c3aed", fontSize: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>👤</div>
            )}
          </div>
          <h2 style={{ color: "var(--primary-purple)", fontWeight: 700, margin: "8px 0 0 0", textAlign: "center" }}>{profile?.name || "Admin"}</h2>
          <div style={{ color: "#6d28d9", fontSize: 15, marginBottom: 8, textAlign: "center" }}>{profile?.email}</div>
          <div style={{ color: "#a78bfa", fontSize: 14, marginBottom: 8 }}>Role: {profile?.role}</div>
          <div style={{ color: "#a78bfa", fontSize: 13, marginBottom: 16, wordBreak: "break-all" }}>ID: {profile?._id}</div>
          {error && <p style={{ color: "#f87171", fontWeight: 600 }}>{error}</p>}
          <button onClick={handleUpdateProfile} style={{ background: "var(--primary-purple)", color: "#fff", border: "none", borderRadius: 16, padding: "0.5rem 1.5rem", fontWeight: 600, fontSize: 15, marginBottom: 14, cursor: "pointer", width: "100%" }}>Update Profile</button>
        </aside>

        {/* Main Dashboard Content */}
        <main style={{ flex: 1, minWidth: 340, display: "flex", flexDirection: "column", gap: 32 }}>
          {/* Event Management Section */}
          <div className="dashboard-events" style={{ marginBottom: 0, background: "rgba(124, 58, 237, 0.18)", borderRadius: 24, boxShadow: "0 2px 8px #a78bfa11", padding: 24, border: "1.5px solid #a78bfa", marginTop: 32, color: '#fff', backdropFilter: 'blur(14px)' }}>
            <h2 style={{ color: "var(--primary-purple)", marginBottom: 20 }}>Event Management</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
              <button onClick={getAllEvents} style={{ 
                background: "var(--glass-bg)", 
                border: "1.5px solid var(--glass-border)", 
                borderRadius: 16, 
                padding: "1rem", 
                color: "#fff", 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center", 
                gap: 12, 
                fontSize: 16, 
                fontWeight: 600,
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px #a78bfa22"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(124, 58, 237, 0.25)";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "var(--glass-bg)";
                e.target.style.transform = "translateY(0)";
              }}>
                <span style={{ fontSize: 24 }}>📋</span>
                <span>Get All Events</span>
              </button>
              <button onClick={updateEvent} style={{ 
                background: "var(--glass-bg)", 
                border: "1.5px solid var(--glass-border)", 
                borderRadius: 16, 
                padding: "1rem", 
                color: "#fff", 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center", 
                gap: 12, 
                fontSize: 16, 
                fontWeight: 600,
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px #a78bfa22"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(124, 58, 237, 0.25)";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "var(--glass-bg)";
                e.target.style.transform = "translateY(0)";
              }}>
                <span style={{ fontSize: 24 }}>✏️</span>
                <span>Update Event</span>
              </button>
              <button onClick={deleteEvent} style={{ 
                background: "var(--glass-bg)", 
                border: "1.5px solid var(--glass-border)", 
                borderRadius: 16, 
                padding: "1rem", 
                color: "#fff", 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center", 
                gap: 12, 
                fontSize: 16, 
                fontWeight: 600,
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px #a78bfa22"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(124, 58, 237, 0.25)";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "var(--glass-bg)";
                e.target.style.transform = "translateY(0)";
              }}>
                <span style={{ fontSize: 24 }}>🗑️</span>
                <span>Delete Event</span>
              </button>
            </div>
          </div>

          {/* User Management Section */}
          <div className="dashboard-users" style={{ background: "rgba(124, 58, 237, 0.18)", borderRadius: 24, border: "1.5px solid #a78bfa", boxShadow: "0 4px 24px #a78bfa11", padding: 24, color: '#fff', backdropFilter: 'blur(14px)' }}>
            <h2 style={{ color: "var(--primary-purple)", marginBottom: 20 }}>User Management</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
              <button onClick={viewProfile} style={{ 
                background: "var(--glass-bg)", 
                border: "1.5px solid var(--glass-border)", 
                borderRadius: 16, 
                padding: "1rem", 
                color: "#fff", 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center", 
                gap: 12, 
                fontSize: 16, 
                fontWeight: 600,
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px #a78bfa22"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(124, 58, 237, 0.25)";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "var(--glass-bg)";
                e.target.style.transform = "translateY(0)";
              }}>
                <span style={{ fontSize: 24 }}>👥</span>
                <span>View All Profiles</span>
              </button>
              <button onClick={getUserProfile} style={{ 
                background: "var(--glass-bg)", 
                border: "1.5px solid var(--glass-border)", 
                borderRadius: 16, 
                padding: "1rem", 
                color: "#fff", 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center", 
                gap: 12, 
                fontSize: 16, 
                fontWeight: 600,
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px #a78bfa22"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(124, 58, 237, 0.25)";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "var(--glass-bg)";
                e.target.style.transform = "translateY(0)";
              }}>
                <span style={{ fontSize: 24 }}>🔍</span>
                <span>Get User Profile</span>
              </button>
              <button onClick={updateUserProfile} style={{ 
                background: "var(--glass-bg)", 
                border: "1.5px solid var(--glass-border)", 
                borderRadius: 16, 
                padding: "1rem", 
                color: "#fff", 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center", 
                gap: 12, 
                fontSize: 16, 
                fontWeight: 600,
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px #a78bfa22"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(124, 58, 237, 0.25)";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "var(--glass-bg)";
                e.target.style.transform = "translateY(0)";
              }}>
                <span style={{ fontSize: 24 }}>🔄</span>
                <span>Update User Profile</span>
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Footer (modern glassy) */}
      <footer style={{ background: "rgba(124, 58, 237, 0.18)", borderTopLeftRadius: 32, borderTopRightRadius: 32, boxShadow: "0 -2px 16px #a78bfa22", padding: "18px 0 10px 0", marginTop: 32, textAlign: "center", color: "#7c3aed", fontSize: 15, zIndex: 2, position: "relative" }}>
        <div style={{ marginBottom: 6 }}>&copy; 2025 BookedIn. All rights reserved.</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 18, alignItems: "center", fontSize: 15 }}>
          <Link to="/contact" style={{ color: "#7c3aed", textDecoration: "none", fontWeight: 500 }}>Contact</Link>
          <span style={{ color: "#a78bfa" }}>|</span>
          <Link to="/privacy" style={{ color: "#7c3aed", textDecoration: "none", fontWeight: 500 }}>Privacy</Link>
          <span style={{ color: "#a78bfa" }}>|</span>
          <Link to="/about" style={{ color: "#7c3aed", textDecoration: "none", fontWeight: 500 }}>About</Link>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;