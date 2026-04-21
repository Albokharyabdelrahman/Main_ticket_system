import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import ticketImg from "../assets/logo.png";

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
    const UserArr=[decodedPayload.userId,decodedPayload.role||"RandomValue"];
    return UserArr; // <--- THIS is the correct field
  } catch (e) {
    console.error("Invalid token:", e);
    return null;
  }
}

const API_BASE_URL = "http://localhost:7000/api/v1";

const OrganizerDashboard = () => {
// const currentUserArr = getCurrentUserIdFromCookie();
//   const currentRole = currentUserArr[1];
//   if (currentRole !== "Organizer") {
//     return (
//       <div style={{
//         color: "#dc2626",
//         fontWeight: "bold",
//         padding: 40,
//         textAlign: "center",
//         fontSize: 22
//       }}>
//         You are not allowed to view this. Get out.
//       </div>
//     );
//   }


  const { logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/profile`, {
          withCredentials: true,
        });
        setProfile(res.data.user);
      } catch (err) {
        setError("Failed to load profile. Please try again.");
      }
    };
    fetchProfile();
  }, []);

  const RandomAnalyticsCard = () => {
    const [randomEvent, setRandomEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [analyticsError, setAnalyticsError] = useState("");

    useEffect(() => {
      const fetchRandomEvent = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/users/events/analytics`, {
            withCredentials: true,
          });
          
          if (res.data.analytics && res.data.analytics.length > 0) {
            const randomIndex = Math.floor(Math.random() * res.data.analytics.length);
            setRandomEvent(res.data.analytics[randomIndex]);
          } else {
            setAnalyticsError("No events found to analyze");
          }
        } catch (err) {
          console.error("Analytics fetch error:", err);
          if (err.response) {
            if (err.response.status === 500) {
              setAnalyticsError("Server error loading analytics");
            } else {
              setAnalyticsError(`Error: ${err.response.status}`);
            }
          } else {
            setAnalyticsError("Failed to load analytics");
          }
        } finally {
          setLoading(false);
        }
      };
      
      fetchRandomEvent();
    }, []);

    if (loading) return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <span>Loading insights...</span>
      </div>
    );

    if (analyticsError) return (
      <div style={styles.noDataContainer}>
        <div style={styles.noDataIcon}>📊</div>
        <p>No event data available</p>
      </div>
    );

    if (!randomEvent) return (
      <div style={styles.noDataContainer}>
        <div style={styles.noDataIcon}>📊</div>
        <p>No event data available</p>
      </div>
    );

    return (
      <div style={styles.analyticsCard}>
        <h4 style={styles.analyticsCardTitle}>Event Insight: {randomEvent.title}</h4>
        <div style={styles.analyticsMetrics}>
          <div style={styles.metric}>
            <span style={styles.metricLabel}>Revenue</span>
            <span style={styles.metricValue}>EGP {randomEvent.revenue}</span>
          </div>
          <div style={styles.metric}>
            <span style={styles.metricLabel}>% Booked</span>
            <span style={styles.metricValue}>{randomEvent.percentageBooked}%</span>
          </div>
        </div>
      </div>
    );
  };

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


  const handleUpdateProfile = () => navigate("/update-profile");
  const handleCreateEvent = () => navigate("/create-event");
  const handleViewEvents = () => navigate("/my-events");
  const handleViewAllEvents = () => navigate("/public-event");
  const handleEventAnalytics = () => navigate("/my-events/analytics");

  // --- Glassy ticket background ---
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

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Inter', sans-serif", position: "relative", overflow: "hidden" }}>
      {/* Animated Ticket Images Background */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }}>
        {ticketPositions.map((pos, i) => (
          <img
            key={i}
            src={ticketImg}
            alt="ticket"
            style={{
              position: "absolute",
              opacity: 0.22,
              filter: "blur(1.5px) drop-shadow(0 2px 12px #a78bfa88)",
              userSelect: "none",
              zIndex: 0,
              pointerEvents: "none",
              width: pos.size,
              height: "auto",
              top: pos.top,
              left: pos.left,
              right: pos.right,
              bottom: pos.bottom,
              transform: `rotate(${pos.rot}deg)`,
              animation: "ticketFloat 8s ease-in-out infinite alternate",
              animationDelay: `${pos.delay}s`,
            }}
            draggable={false}
          />
        ))}
      </div>
      {/* Header */}
      <div style={{
        background: "linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)",
        color: "white",
        padding: "2.5rem 2rem 4rem 2rem",
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
        position: "relative",
        marginBottom: 40,
        zIndex: 1,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={logo} alt="Logo" style={{ width: 60, height: 60, borderRadius: "50%", marginRight: 24, boxShadow: "0 2px 8px #a78bfa" }} />
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0 }}>Welcome back, <span style={{ color: "#fff", textShadow: "0 2px 8px #a78bfa" }}>{profile?.name || "Organizer"}</span>!</h1>
              <div style={{ fontSize: 18, opacity: 0.85 }}>Manage your events and analytics.</div>
            </div>
          </div>
          <div>
            <button onClick={handleLogout} style={{ background: "#7c3aed", color: "#fff", border: "none", borderRadius: 20, padding: "0.75rem 2rem", fontWeight: 600, fontSize: 16, boxShadow: "0 2px 8px #a78bfa", cursor: "pointer" }}>Log Out</button>
          </div>
        </div>
      </div>
      {/* Main Layout */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 40, maxWidth: 1400, margin: "-60px auto 0 auto", padding: "0 24px 48px 24px", position: "relative", zIndex: 1 }}>
        {/* Sidebar/Profile Card */}
        <aside style={{ minWidth: 320, maxWidth: 340, background: "var(--glass-bg)", border: "1.5px solid var(--glass-border)", borderRadius: 28, boxShadow: "0 4px 24px #a78bfa33", padding: 36, marginTop: 32, display: "flex", flexDirection: "column", alignItems: "center", backdropFilter: "blur(8px)", position: "relative" }}>
          <div style={{ background: "#fff", borderRadius: "50%", padding: 6, marginBottom: 16, boxShadow: "0 2px 8px #a78bfa22" }}>
            {profile && profile.profilePic ? (
              <img src={profile.profilePic} alt="Profile" style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", border: "3px solid var(--primary-purple)" }} />
            ) : (
              <div style={{ width: 90, height: 90, borderRadius: "50%", background: "#ede9fe", color: "#7c3aed", fontSize: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>👤</div>
            )}
          </div>
          <h2 style={{ color: "var(--primary-purple)", fontWeight: 700, margin: "8px 0 0 0", textAlign: "center" }}>{profile?.name || "Organizer"}</h2>
          <div style={{ color: "#6d28d9", fontSize: 15, marginBottom: 8, textAlign: "center" }}>{profile?.email}</div>
          <div style={{ color: "#a78bfa", fontSize: 14, marginBottom: 8 }}>Role: {profile?.role}</div>
          <div style={{ color: "#a78bfa", fontSize: 13, marginBottom: 16, wordBreak: "break-all" }}>ID: {profile?._id}</div>
          {error && <p style={{ color: "#f87171", fontWeight: 600 }}>{error}</p>}
          <button onClick={handleUpdateProfile} style={{ background: "var(--primary-purple)", color: "#fff", border: "none", borderRadius: 16, padding: "0.5rem 1.5rem", fontWeight: 600, fontSize: 15, marginBottom: 14, cursor: "pointer", width: "100%" }}>Update Profile</button>
        </aside>
        {/* Main Content */}
        <main style={{ flex: 1, minWidth: 340, display: "flex", flexDirection: "column", gap: 32 }}>
          {/* Dashboard Buttons in Glassy Card */}
          <div style={{ background: "var(--glass-bg)", borderRadius: 24, border: "1.5px solid var(--glass-border)", boxShadow: "0 4px 24px #a78bfa22", padding: 28, marginBottom: 32, marginTop: 32, display: "flex", gap: 24, justifyContent: "center", alignItems: "center" }}>
            <button style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, padding: "16px 0", fontSize: 16, fontWeight: 600, color: "#fff", background: "linear-gradient(90deg, #a78bfa 0%, #7c3aed 100%)", border: "none", borderRadius: 16, cursor: "pointer", transition: "all 0.2s", boxShadow: "0 2px 8px #a78bfa22", justifyContent: "center", outline: "none" }} onMouseOver={e => e.currentTarget.style.boxShadow = '0 6px 18px #a78bfa44'} onMouseOut={e => e.currentTarget.style.boxShadow = '0 2px 8px #a78bfa22'} onClick={handleCreateEvent}><span role="img" aria-label="tent">🎪</span>Create Event</button>
            <button style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, padding: "16px 0", fontSize: 16, fontWeight: 600, color: "#fff", background: "linear-gradient(90deg, #a78bfa 0%, #7c3aed 100%)", border: "none", borderRadius: 16, cursor: "pointer", transition: "all 0.2s", boxShadow: "0 2px 8px #a78bfa22", justifyContent: "center", outline: "none" }} onMouseOver={e => e.currentTarget.style.boxShadow = '0 6px 18px #a78bfa44'} onMouseOut={e => e.currentTarget.style.boxShadow = '0 2px 8px #a78bfa22'} onClick={handleViewEvents}><span role="img" aria-label="clipboard">📋</span>View My Events</button>
            <button style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, padding: "16px 0", fontSize: 16, fontWeight: 600, color: "#fff", background: "linear-gradient(90deg, #a78bfa 0%, #7c3aed 100%)", border: "none", borderRadius: 16, cursor: "pointer", transition: "all 0.2s", boxShadow: "0 2px 8px #a78bfa22", justifyContent: "center", outline: "none" }} onMouseOver={e => e.currentTarget.style.boxShadow = '0 6px 18px #a78bfa44'} onMouseOut={e => e.currentTarget.style.boxShadow = '0 2px 8px #a78bfa22'} onClick={handleEventAnalytics}><span role="img" aria-label="chart">📊</span>Events Analytics</button>
            <button style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, padding: "16px 0", fontSize: 16, fontWeight: 600, color: "#fff", background: "linear-gradient(90deg, #a78bfa 0%, #7c3aed 100%)", border: "none", borderRadius: 16, cursor: "pointer", transition: "all 0.2s", boxShadow: "0 2px 8px #a78bfa22", justifyContent: "center", outline: "none" }} onMouseOver={e => e.currentTarget.style.boxShadow = '0 6px 18px #a78bfa44'} onMouseOut={e => e.currentTarget.style.boxShadow = '0 2px 8px #a78bfa22'} onClick={handleViewAllEvents}><span role="img" aria-label="clipboard">📋</span>View All Events</button>
          </div>
          {/* Analytics Card */}
          <div style={{ background: "var(--glass-bg)", borderRadius: 24, border: "1.5px solid var(--glass-border)", boxShadow: "0 4px 24px #a78bfa22", padding: 32, marginBottom: 32 }}>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: "#7c3aed", marginBottom: 18 }}>Event Performance Insight</h4>
            <RandomAnalyticsCard />
          </div>
        </main>
      </div>
      {/* Footer (modern glassy) */}
      <footer style={{ background: "var(--glass-bg)", borderTopLeftRadius: 32, borderTopRightRadius: 32, boxShadow: "0 -2px 16px #a78bfa22", padding: "18px 0 10px 0", marginTop: 32, textAlign: "center", color: "#7c3aed", fontSize: 15, zIndex: 2, position: "relative" }}>
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

const styles = {
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    backgroundColor: "#f8fafc",
  },
  sidebar: {
    width: "300px",
    background: "linear-gradient(135deg, #434190, #2c2e8f)",
    color: "#ffffff",
    padding: "0",
    display: "flex",
    flexDirection: "column",
    boxShadow: "4px 0 15px rgba(0, 0, 0, 0.1)",
  },
  profilePictureContainer: {
    display: "flex",
    justifyContent: "center",
    padding: "20px 0",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  },
  profilePicture: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid white",
    boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)",
  },
  defaultProfileIcon: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "white",
    fontSize: "48px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "3px solid white",
    boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)",
    userSelect: "none",
  },
  sidebarHeader: {
    padding: "30px 25px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  },
  sidebarTitle: {
    fontSize: "20px",
    fontWeight: "600",
    margin: "0",
    color: "#ffffff",
    letterSpacing: "0.5px",
  },
  profileInfo: {
    padding: "25px",
    flex: 1,
  },
  profileItem: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "20px",
  },
  profileLabel: {
    fontSize: "13px",
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: "5px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  profileValue: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#ffffff",
  },
  updateProfileButton: {
    marginTop: "20px",
    padding: "12px 20px",
    background: "linear-gradient(135deg, #ff9800, #ff7043)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    width: "100%",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
  },
  logoutButton: {
    marginTop: "20px",
    padding: "12px 20px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "all 0.3s ease",
  },
  logoutText: {
    marginRight: "10px",
  },
  logoutIcon: {
    fontSize: "18px",
  },
  contentArea: {
    flex: 1,
    padding: "40px 50px",
    background: "#f8fafc",
    position: "relative",
    overflowY: "auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "40px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    margin: "0",
    color: "#1e293b",
    lineHeight: "1.3",
  },
  highlight: {
    color: "#4f46e5",
  },
  dashboardButtons: {
    display: "flex",
    gap: "20px",
    marginBottom: "40px",
  },
  actionButton: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "18px 24px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#4f46e5",
    backgroundColor: "white",
    border: "2px solid #4f46e5",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 6px 12px rgba(79, 70, 229, 0.2)",
  },
  buttonIcon: {
    fontSize: "24px",
  },
  contentCard: {
    padding: "25px 30px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.05)",
  },
  cardTitle: {
    margin: "0 0 12px",
    fontSize: "20px",
    fontWeight: "700",
    color: "#1e293b",
  },
  cardText: {
    margin: 0,
    fontSize: "16px",
    color: "#475569",
    lineHeight: "1.5",
  },
  footer: {
    padding: "25px 40px",
    backgroundColor: "#3f51b5",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "white",
    fontSize: "14px",
  },
  footerText: {
    margin: 0,
  },
  footerLinks: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
  footerLink: {
    color: "white",
    textDecoration: "none",
  },
  footerDivider: {
    color: "white",
  },
  error: {
    color: "#f87171",
    padding: "10px 25px",
    fontWeight: "600",
  },
  logo: {
    height: "50px",
    objectFit: "contain",
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '20px',
    color: '#64748b',
  },
  loadingSpinner: {
    width: '20px',
    height: '20px',
    border: '3px solid rgba(79, 70, 229, 0.2)',
    borderTop: '3px solid #4f46e5',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  errorContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '20px',
    backgroundColor: '#fef2f2',
    borderRadius: '8px',
    color: '#b91c1c',
  },
  errorIcon: {
    fontSize: '20px',
  },
  noDataContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '20px',
    color: '#64748b',
  },
  noDataIcon: {
    fontSize: '20px',
  },
  analyticsCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    borderLeft: '4px solid #4f46e5',
  },
  analyticsCardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '15px',
  },
  analyticsMetrics: {
    display: 'flex',
    gap: '20px',
    marginBottom: '15px',
  },
  metric: {
    flex: 1,
  },
  metricLabel: {
    fontSize: '14px',
    color: '#64748b',
    display: 'block',
    marginBottom: '5px',
  },
  metricValue: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
  },
};

export default OrganizerDashboard;