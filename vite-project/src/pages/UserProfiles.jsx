import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

const UserProfiles = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/users/`, {
          withCredentials: true,
        });
        setUsers(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load user profiles.");
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const Spinner = () => (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "2rem 0" }}>
      <div style={{ border: "4px solid rgba(255, 255, 255, 0.3)", borderRadius: "50%", borderTop: "4px solid #a78bfa", width: 40, height: 40, animation: "spin 1s linear infinite" }}></div>
    </div>
  );

  const handleEdit = (userId) => {
    navigate(`/edit-user/${userId}`);
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
          <div style={{ background: '#fff', borderRadius: '50%', width: 70, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px #a78bfa22', cursor: 'pointer' }} onClick={() => navigate(-1)}>
            <img src={logo} alt="Logo" style={{ width: 48, height: 48, borderRadius: '50%', boxShadow: '0 2px 8px #a78bfa', objectFit: 'cover' }} />
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: '#fff', textShadow: '0 2px 8px #a78bfa' }}>User Management</h1>
        </div>
      </div>
      {/* Main Card */}
      <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto', background: 'rgba(124, 58, 237, 0.18)', borderRadius: 24, padding: '40px 30px', boxShadow: '0 4px 24px #a78bfa33', color: '#fff', backdropFilter: 'blur(14px)', position: 'relative', zIndex: 1 }}>
        {error && <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: 12, marginBottom: 24, fontWeight: 500 }}>{error}</div>}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 48, color: '#7c3aed' }}>
            <Spinner />
            <p>Loading user profiles...</p>
          </div>
        ) : users.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 48, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 16, color: '#7c3aed', fontWeight: 600 }}>
            <svg style={{ width: 48, height: 48, color: '#a78bfa' }} viewBox="0 0 24 24">
              <path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
            </svg>
            <p>No user profiles found</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {users.map((user) => (
              <div 
                key={user._id} 
                style={{ background: '#fff', borderRadius: 18, padding: 24, boxShadow: '0 2px 8px #a78bfa22', color: '#7c3aed', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start', transition: 'all 0.3s ease', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #a78bfa, #7c3aed)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700 }}>{user.name.charAt(0).toUpperCase()}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#7c3aed' }}>{user.name}</h3>
                  <p style={{ margin: 0, fontSize: 15, color: '#6d28d9', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6M20 6L12 11L4 6H20M20 18H4V8L12 13L20 8V18Z" />
                    </svg>
                    {user.email}
                  </p>
                  <p style={{ margin: 0, fontSize: 15, color: '#6d28d9', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12,3L2,12H5V20H19V12H22L12,3M12,7.7C14.1,7.7 15.8,9.4 15.8,11.5C15.8,13.6 14.1,15.3 12,15.3C9.9,15.3 8.2,13.6 8.2,11.5C8.2,9.4 9.9,7.7 12,7.7M7,18V16H17V18H7Z" />
                    </svg>
                    {user.role || "No role specified"}
                  </p>
                  <p style={{ margin: 0, fontSize: 13, color: '#a78bfa', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A9,9 0 0,0 21,12A9,9 0 0,0 12,3M12,19A7,7 0 0,1 5,12A7,7 0 0,1 12,5A7,7 0 0,1 19,12A7,7 0 0,1 12,19M12,16.5C14.21,16.5 16,14.71 16,12.5C16,10.29 14.21,8.5 12,8.5C9.79,8.5 8,10.29 8,12.5C8,14.71 9.79,16.5 12,16.5M12,10.5C13.1,10.5 14,11.4 14,12.5C14,13.6 13.1,14.5 12,14.5C10.9,14.5 10,13.6 10,12.5C10,11.4 10.9,10.5 12,10.5Z" />
                    </svg>
                    ID: {user._id}
                  </p>
                </div>
                <button
                  style={{ padding: '0.5rem 1rem', background: 'linear-gradient(135deg, #ff9800, #ff7043)', color: 'white', border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 600, fontSize: 15, transition: 'all 0.2s ease', marginTop: 8, alignSelf: 'flex-start', boxShadow: '0 2px 8px #a78bfa22' }}
                  onClick={() => handleEdit(user._id)}
                >
                  Edit Profile
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfiles;