import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

// Minimal SVG icons
const PhoneIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M6.5 3.5A2 2 0 0 0 4.5 5.5v2A2 2 0 0 0 6.5 9.5h.09a1 1 0 0 1 .95.68l.7 2.1a1 1 0 0 1-.23 1.04l-1.13 1.13a16.06 16.06 0 0 0 6.36 6.36l1.13-1.13a1 1 0 0 1 1.04-.23l2.1.7a1 1 0 0 1 .68.95v.09a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2A2 2 0 0 0 21.5 17.5h-.09a1 1 0 0 1-.95-.68l-.7-2.1a1 1 0 0 1 .23-1.04l1.13-1.13a16.06 16.06 0 0 0-6.36-6.36l-1.13 1.13a1 1 0 0 1-1.04.23l-2.1-.7a1 1 0 0 1-.68-.95v-.09a2 2 0 0 0-2-2h-2z" stroke="#222" strokeWidth="1.5"/></svg>
);
const CalendarIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3" stroke="#222" strokeWidth="1.5"/><path d="M16 3v4M8 3v4" stroke="#222" strokeWidth="1.5" strokeLinecap="round"/><path d="M3 9h18" stroke="#222" strokeWidth="1.5"/></svg>
);
const GenderIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="10" r="4" stroke="#222" strokeWidth="1.5"/><path d="M12 14v5" stroke="#222" strokeWidth="1.5" strokeLinecap="round"/><path d="M9 19h6" stroke="#222" strokeWidth="1.5" strokeLinecap="round"/></svg>
);
const LocationIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 21s-6-5.686-6-10A6 6 0 0 1 18 11c0 4.314-6 10-6 10z" stroke="#222" strokeWidth="1.5"/><circle cx="12" cy="11" r="2.5" stroke="#222" strokeWidth="1.5"/></svg>
);
const MailIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3" stroke="#222" strokeWidth="1.5"/><path d="M3 7l9 6 9-6" stroke="#222" strokeWidth="1.5"/></svg>
);

// Floating ticket positions (copied from UserDashboard)
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

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("http://localhost:7000/api/v1/users/profile", { withCredentials: true });
        setUser(res.data.user);
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    // Floating ticket animation (copied from UserDashboard)
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

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 40% 20%, #a78bfa 0%, #fff 100%)' }}><div style={{ width: 48, height: 48, border: '5px solid #a78bfa', borderTop: '5px solid #fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /></div>;
  if (error || !user) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 40% 20%, #a78bfa 0%, #fff 100%)', color: '#7c3aed', fontSize: 22 }}>{error || "No user found."}</div>;

  // Format member since
  const memberSince = user.createdAt ? new Date(user.createdAt).getFullYear() : "-";
  // Format birthdate
  const birthdate = user.birthdate ? new Date(user.birthdate).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : "-";
  // Profile picture logic
  let profilePic = user.profilePicture || user.profilePic || "";
  if (profilePic && !profilePic.startsWith("http")) profilePic = `data:image/jpeg;base64,${profilePic}`;
  if (!profilePic) profilePic = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#fff',
      fontFamily: 'Inter, Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden',
      paddingBottom: 60,
    }}>
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
      {/* Logo as back button */}
      <div style={{ position: 'absolute', top: 32, left: 32, cursor: 'pointer', zIndex: 10 }} onClick={() => navigate(-1)}>
        <img src={logo} alt="BookedIn Logo" style={{ width: 48, height: 48, borderRadius: '50%' }} />
      </div>
      <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 60 }}>
        <div style={{
          maxWidth: 900,
          width: '100%',
          background: 'rgba(255,255,255,0.98)',
          borderRadius: '2.2rem',
          boxShadow: '0 8px 32px #a78bfa33',
          border: '2.5px solid #a78bfa',
          padding: '48px 40px 36px 40px',
          display: 'flex',
          alignItems: 'center',
          gap: 48,
          position: 'relative',
        }}>
          {/* Profile Pic and Name */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 220 }}>
            <img src={profilePic} alt="Profile" style={{ width: 160, height: 160, borderRadius: '50%', objectFit: 'cover', background: '#fff', boxShadow: '0 2px 16px #a78bfa55', marginBottom: 10, border: '4px solid #fff' }} />
            <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'Georgia, Times New Roman, Times, serif', marginBottom: 2, textAlign: 'center' }}>{user.name}</div>
            <div style={{ color: '#888', fontSize: 18, fontWeight: 400, textAlign: 'center' }}>Member Since {memberSince}</div>
            <button
              style={{
                marginTop: 18,
                background: 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 14,
                padding: '10px 32px',
                fontWeight: 700,
                fontSize: 16,
                boxShadow: '0 2px 8px #a78bfa22',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onClick={() => navigate('/update-profile')}
            >
              Update Profile
            </button>
          </div>
          {/* Info Grid */}
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px 36px', alignItems: 'center', justifyContent: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 19 }}>
              <MailIcon />
              <span style={{ color: user.email ? '#222' : '#888' }}>{user.email || 'No email provided'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 19 }}>
              <PhoneIcon />
              <span style={{ color: user.phone ? '#222' : '#888' }}>{user.phone || 'No phone provided'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 19 }}>
              <CalendarIcon />
              <span style={{ color: birthdate !== '-' ? '#222' : '#888' }}>{birthdate}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 19 }}>
              <GenderIcon />
              <span style={{ color: user.gender ? '#222' : '#888' }}>{user.gender || 'Not specified'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 19, gridColumn: '1 / span 2' }}>
              <LocationIcon />
              <span style={{ color: user.country ? '#222' : '#888' }}>{user.country || 'No country specified'}</span>
            </div>
          </div>
        </div>
        {/* View My Bookings and Find Booking Buttons */}
        <div style={{ textAlign: 'center', marginTop: 38, display: 'flex', justifyContent: 'center', gap: 24 }}>
          <button
            style={{
              background: 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 16,
              padding: '16px 44px',
              fontWeight: 700,
              fontSize: 18,
              boxShadow: '0 2px 8px #a78bfa22',
              cursor: 'pointer',
              transition: 'background 0.2s',
              marginTop: 8,
            }}
            onClick={() => navigate('/my-bookings')}
          >
            View My Bookings
          </button>
          <button
            style={{
              background: 'linear-gradient(90deg, #ede9fe 0%, #a78bfa 100%)',
              color: '#7c3aed',
              border: 'none',
              borderRadius: 16,
              padding: '16px 44px',
              fontWeight: 700,
              fontSize: 18,
              boxShadow: '0 2px 8px #a78bfa22',
              cursor: 'pointer',
              transition: 'background 0.2s',
              marginTop: 8,
            }}
            onClick={() => navigate('/find-booking')}
          >
            Find Booking
          </button>
        </div>
      </div>
    </div>
  );
} 