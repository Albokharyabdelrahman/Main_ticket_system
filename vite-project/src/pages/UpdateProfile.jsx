import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "./logo.png"; // adjust path as needed

const API_BASE_URL = "http://localhost:7000/api/v1";

// Floating ticket positions (same as dashboard)
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

export default function UpdateProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    password: "",
    profilePicture: "",
    birthdate: "",
    phone: "",
    country: "",
    gender: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/profile`, {
          withCredentials: true,
        });
        const u = res.data.user;
       setProfile({
  name: u.name || "",
  email: u.email || "",
  password: "",
  profilePicture: u.profilePicture || "", // Base64 string
  birthdate: u.birthdate ? new Date(u.birthdate).toISOString().split('T')[0] : "",
  phone: u.phone || "",
  country: u.country || "",
  gender: u.gender || "",
});

      } catch (err) {
        setError("Failed to load profile.");
      }
    })();
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

  const handleChange = (e) =>
    setProfile((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const payload = {};
    if (profile.name.trim()) payload.name = profile.name.trim();
    if (profile.email.trim()) payload.email = profile.email.trim();
    if (profile.password.trim()) payload.password = profile.password.trim();
    if (profile.profilePicture.trim())
      payload.profilePicture = profile.profilePicture.trim();
    if (profile.birthdate) payload.birthdate = profile.birthdate;
    if (profile.phone.trim()) payload.phone = profile.phone.trim();
    if (profile.country.trim()) payload.country = profile.country.trim();
    if (profile.gender) payload.gender = profile.gender;

    if (Object.keys(payload).length === 0) {
      setError("Fill at least one field to update.");
      return;
    }

    try {
      await axios.put(`${API_BASE_URL}/users/profile`, payload, {
        withCredentials: true,
      });
      setMessage("Profile updated successfully.");
      setProfile((p) => ({ ...p, password: "" }));
      navigate(-1)

    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'Inter', sans-serif", position: 'relative', overflow: 'hidden' }}>
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
      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <img
          src={logo}
          alt="Logo"
          style={{ position: 'absolute', top: 20, right: 20, width: 100, height: 'auto', cursor: 'pointer' }}
          onClick={() => navigate(-1)}
        />
        <h1 style={{
          marginBottom: 24,
          fontWeight: 700,
          fontSize: 38,
          textAlign: 'center',
          fontFamily: 'inherit',
          color: '#111',
          letterSpacing: 0.2,
        }}>Update Profile</h1>
        {/* Profile Picture Display */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
          {profile.profilePicture ? (
            <img
              src={`data:image/jpeg;base64,${profile.profilePicture}`}
              alt="Profile"
              style={{ width: 110, height: 110, borderRadius: '50%', objectFit: 'cover', border: '4px solid #a78bfa', boxShadow: '0 2px 12px #a78bfa55', marginBottom: 8, background: '#fff' }}
            />
          ) : (
            <div style={{ width: 110, height: 110, borderRadius: '50%', background: '#ede9fe', color: '#7c3aed', fontSize: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #a78bfa', boxShadow: '0 2px 12px #a78bfa55', marginBottom: 8 }}>
              <span role="img" aria-label="avatar">👤</span>
            </div>
          )}
        </div>
        {message && <p style={{ color: '#b2f2bb', fontWeight: 600, textAlign: 'center', marginBottom: 15 }}>{message}</p>}
        {error && <p style={{ color: '#ff7b7b', fontWeight: 600, textAlign: 'center', marginBottom: 15 }}>{error}</p>}
        <div style={{
          width: '100%',
          maxWidth: 500,
          background: '#fff',
          borderRadius: '2.2rem',
          boxShadow: '0 8px 32px #a78bfa33',
          border: '2.5px solid #a78bfa',
          padding: '40px 30px',
          color: '#4b2997',
          fontFamily: 'inherit',
          fontWeight: 400,
          fontSize: 20,
          marginBottom: 32,
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <label htmlFor="name" style={{ fontWeight: 400, fontSize: 22, color: '#4b2997', display: 'flex', flexDirection: 'column', marginBottom: 8 }}>
              Name:
              <input
                id="name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                style={{ marginTop: 10, padding: 16, fontSize: 20, borderRadius: 12, border: '1.5px solid #a78bfa', backgroundColor: '#fff', color: '#222', outline: 'none', fontWeight: 400 }}
                autoComplete="name"
              />
            </label>
            <label htmlFor="email" style={{ fontWeight: 400, fontSize: 22, color: '#4b2997', display: 'flex', flexDirection: 'column', marginBottom: 8 }}>
              Email:
              <input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                style={{ marginTop: 10, padding: 16, fontSize: 20, borderRadius: 12, border: '1.5px solid #a78bfa', backgroundColor: '#fff', color: '#222', outline: 'none', fontWeight: 400 }}
                autoComplete="email"
              />
            </label>
            <label htmlFor="birthdate" style={{ fontWeight: 400, fontSize: 22, color: '#4b2997', display: 'flex', flexDirection: 'column', marginBottom: 8 }}>
              Birthdate:
              <input
                id="birthdate"
                name="birthdate"
                type="date"
                value={profile.birthdate}
                onChange={handleChange}
                style={{ marginTop: 10, padding: 16, fontSize: 20, borderRadius: 12, border: '1.5px solid #a78bfa', backgroundColor: '#fff', color: '#222', outline: 'none', fontWeight: 400 }}
              />
            </label>
            <label htmlFor="phone" style={{ fontWeight: 400, fontSize: 22, color: '#4b2997', display: 'flex', flexDirection: 'column', marginBottom: 8 }}>
              Phone:
              <input
                id="phone"
                name="phone"
                type="tel"
                value={profile.phone}
                onChange={handleChange}
                style={{ marginTop: 10, padding: 16, fontSize: 20, borderRadius: 12, border: '1.5px solid #a78bfa', backgroundColor: '#fff', color: '#222', outline: 'none', fontWeight: 400 }}
                autoComplete="tel"
              />
            </label>
            <label htmlFor="country" style={{ fontWeight: 400, fontSize: 22, color: '#4b2997', display: 'flex', flexDirection: 'column', marginBottom: 8 }}>
              Country:
              <input
                id="country"
                name="country"
                type="text"
                value={profile.country}
                onChange={handleChange}
                style={{ marginTop: 10, padding: 16, fontSize: 20, borderRadius: 12, border: '1.5px solid #a78bfa', backgroundColor: '#fff', color: '#222', outline: 'none', fontWeight: 400 }}
                autoComplete="country"
              />
            </label>
            <label htmlFor="gender" style={{ fontWeight: 400, fontSize: 22, color: '#4b2997', display: 'flex', flexDirection: 'column', marginBottom: 8 }}>
              Gender:
              <select
                id="gender"
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                style={{ marginTop: 10, padding: 16, fontSize: 20, borderRadius: 12, border: '1.5px solid #a78bfa', backgroundColor: '#fff', color: '#222', outline: 'none', fontWeight: 400 }}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label htmlFor="password" style={{ fontWeight: 400, fontSize: 22, color: '#4b2997', display: 'flex', flexDirection: 'column', marginBottom: 8 }}>
              Password (leave blank to keep current):
              <input
                id="password"
                name="password"
                type="password"
                value={profile.password}
                onChange={handleChange}
                style={{ marginTop: 10, padding: 16, fontSize: 20, borderRadius: 12, border: '1.5px solid #a78bfa', backgroundColor: '#fff', color: '#222', outline: 'none', fontWeight: 400 }}
                autoComplete="new-password"
              />
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 0, marginTop: 0 }}>
              <label htmlFor="profilePicture" style={{
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
                {profile.profilePicture ? 'Change Profile Picture' : 'Choose Profile Picture'}
                <input
                  id="profilePicture"
                  name="profilePicture"
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setProfile((p) => ({
                        ...p,
                        profilePicture: reader.result.split(",")[1], // base64 string only
                      }));
                    };
                    reader.readAsDataURL(file);
                  }}
                  style={{ display: 'none' }}
                />
              </label>
              {profile.profilePicture && (
                <span style={{ display: 'block', fontSize: 13, color: '#7c3aed', marginTop: 4, fontWeight: 500 }}>Image selected</span>
              )}
            </div>
            <button type="submit" style={{
              marginTop: 10,
              padding: '14px 0',
              background: 'linear-gradient(90deg, #a78bfa 0%, #7c3aed 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: 16,
              border: 'none',
              borderRadius: 10,
              cursor: 'pointer',
              transition: 'background 0.3s ease',
            }}>
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
