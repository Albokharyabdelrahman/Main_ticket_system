import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link,useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

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

  return (
    <div style={styles.pageContainer}>
      <div style={{ display: "flex", flex: 1 }}>
        <aside style={styles.sidebar}>
           <div style={styles.profilePictureContainer}>
          {profile && profile.profilePic ? (
           <img
             src={profile.profilePic}
             alt="Profile"
            style={styles.profilePicture}
             />
              ) : (
                <div style={styles.defaultProfileIcon}>👤</div> // Optional icon emoji
              )     }
          </div>

          <div style={styles.sidebarHeader}>
            <h2 style={styles.sidebarTitle}>Organizer Profile</h2>
          </div>
          {error && <p style={styles.error}>{error}</p>}
          {profile && (
            <div style={styles.profileInfo}>
              <div style={styles.profileItem}>
                <span style={styles.profileLabel}>Name:</span>
                <span style={styles.profileValue}>{profile.name}</span>
              </div>
              <div style={styles.profileItem}>
                <span style={styles.profileLabel}>Email:</span>
                <span style={styles.profileValue}>{profile.email}</span>
              </div>
              <div style={styles.profileItem}>
                <span style={styles.profileLabel}>Role:</span>
                <span style={styles.profileValue}>{profile.role}</span>
              </div>
              <div style={styles.profileItem}>
                <span style={styles.profileLabel}>Id:</span>
                <span style={styles.profileValue}>{profile._id}</span>
              </div>

              <button
                onClick={handleUpdateProfile}
                style={styles.updateProfileButton}
              >
                Update Profile
              </button>

              <button onClick={handleLogout} style={styles.logoutButton}>
                <span style={styles.logoutText}>Log Out</span>
                <span style={styles.logoutIcon}>→</span>
              </button>
            </div>
          )}
        </aside>

        <main style={styles.contentArea}>
          <div style={styles.header}>
            <h1 style={styles.title}>
              Welcome back,{" "}
              <span style={styles.highlight}>{profile?.name || "Organizer"}</span>!
            </h1>
            <img src={logo} alt="BookedIn Logo" style={styles.logo} />
          </div>

          <div style={styles.dashboardButtons}>
            <button style={styles.actionButton} onClick={handleCreateEvent}>
              <span style={styles.buttonIcon}>🎪</span>
              <span>Create Event</span>
            </button>
            <button style={styles.actionButton} onClick={handleViewEvents}>
              <span style={styles.buttonIcon}>📋</span>
              <span>View My Events</span>
            </button>
            <button style={styles.actionButton} onClick={handleEventAnalytics}>
              <span style={styles.buttonIcon}>📊</span>
              <span>Events Analytics</span>
            </button>
            <button style={styles.actionButton} onClick={handleViewAllEvents}>
              <span style={styles.buttonIcon}>📋</span>
              <span>View All Events</span>
            </button>
          </div>

          <div style={styles.contentCard}>
          
            
            <div style={{ 
              height: '1px', 
              backgroundColor: '#e2e8f0', 
              margin: '20px 0' 
            }} />
            
            <h4 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#1e293b',
              marginBottom: '15px'
            }}>
              Event Performance Insight
            </h4>
            
            <RandomAnalyticsCard />
          </div>
        </main>
      </div>

      <footer style={styles.footer}>
  <p style={styles.footerText}>© 2025 BookedIn. All rights reserved.</p>
  <div style={styles.footerLinks}>
    <Link to="/contact" style={styles.footerLink}>
      Contact
    </Link>
    <span style={styles.footerDivider}>|</span>
    <Link to="/privacy" style={styles.footerLink}>
      Privacy
    </Link>
    <span style={styles.footerDivider}>|</span>
    <Link to="/about" style={styles.footerLink}>
      About
    </Link>
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