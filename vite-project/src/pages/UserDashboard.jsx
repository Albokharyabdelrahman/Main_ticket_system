import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
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
    return UserArr; 
  } catch (e) {
    console.error("Invalid token:", e);
    return null;
  }
}

const API_BASE_URL = "http://localhost:7000/api/v1";

const UserDashboard = () => {

const currentUserArr = getCurrentUserIdFromCookie();
  const currentRole = currentUserArr[1];
  if (currentRole !== "User") {
    return (
      <div style={{
        color: "#dc2626",
        fontWeight: "bold",
        padding: 40,
        textAlign: "center",
        fontSize: 22
      }}>
        You are not allowed to view this. Get out.
      </div>
    );
  }



  const { logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [randomEvents, setRandomEvents] = useState([]);
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

  useEffect(() => {
    const fetchRandomEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/events`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        
        if (res.data.length > 0) {
          const upcomingEvents = res.data.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate > new Date();
          });

          const shuffled = [...upcomingEvents].sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, 2);
          setRandomEvents(selected);
        }
      } catch (err) {
        console.log("Could not fetch events", err);
      }
    };
    fetchRandomEvents();
  }, []);

  const handleLogout = async () => {
    try {
      const BASE_URL = "http://localhost:5173/login";
      await axios.get(`${BASE_URL}`, { withCredentials: true });
      localStorage.removeItem("token");
      logout();
      window.location.href = BASE_URL;
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleUpdateProfile = () => navigate("/update-profile");
  const handleBookTickets = () => navigate("/book-tickets");
  const handleViewBookings = () => navigate("/my-bookings");
  const handleFindBooking = () => navigate("/find-booking");

  const formatDate = (dateString) => {
    if (!dateString) return "📅 Date to be announced";
    try {
      const options = { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return `📅 ${new Date(dateString).toLocaleDateString(undefined, options)}`;
    } catch (e) {
      return "📅 Date to be announced";
    }
  };

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
            <h2 style={styles.sidebarTitle}>User Profile</h2>
          </div>
          {error && <p style={styles.error}>{error}</p>}
          {profile && (
            <div style={styles.profileInfo}>
              <div style={styles.profileItem}>
                <span style={styles.profileLabel}>Name:</span>
                <span style={styles.profileValue}>{profile.name}</span>
              </div>
              <div style={styles.profileItem}>
                <span style={styles.profileLabel}> Email:</span>
                <span style={styles.profileValue}>{profile.email}</span>
              </div>
              <div style={styles.profileItem}>
                <span style={styles.profileLabel}> Role:</span>
                <span style={styles.profileValue}>{profile.role}</span>
              </div>
              <div style={styles.profileItem}>
                <span style={styles.profileLabel}> Id:</span>
                <span style={styles.profileValue}>{profile._id}</span>
              </div>

              <button
                onClick={handleUpdateProfile}
                style={styles.updateProfileButton}
              >
                Update Profile
              </button>

              <button onClick={handleLogout} style={styles.logoutButton}>
                <span style={styles.logoutText}> Log Out</span>
                <span style={styles.logoutIcon}>→</span>
              </button>
            </div>
          )}
        </aside>

        <main style={styles.contentArea}>
          <div style={styles.header}>
            <h1 style={styles.title}>
              👋 Welcome back,{" "}
              <span style={styles.highlight}>{profile?.name || "User"}</span>!
            </h1>
            <img src={logo} alt="BookedIn Logo" style={styles.logo} />
          </div>

          <div style={styles.dashboardButtons}>
            <button style={styles.actionButton} onClick={handleBookTickets}>
              <span style={styles.buttonIcon}>🎫</span>
              <span>Book Tickets</span>
            </button>
            <button style={styles.actionButton} onClick={handleViewBookings}>
              <span style={styles.buttonIcon}>📋</span>
              <span>View My Bookings</span>
            </button>
            <button style={styles.actionButton} onClick={handleFindBooking}>
              <span style={styles.buttonIcon}>🔍</span>
              <span>Find Booking</span>
            </button>
          </div>

          <div style={styles.contentGrid}>
            {randomEvents.length > 0 ? (
              randomEvents.map((event) => (
                <div key={event._id} style={styles.bookingCard}>
                  <h3 style={styles.cardTitle}>🎪 {event.title}</h3>
                  <div style={styles.bookingDetails}>
                    <div style={styles.bookingImageContainer}>
                      {event.image ? (
                        <img 
                          src={event.image} 
                          alt={event.title} 
                          style={styles.bookingImage}
                        />
                      ) : (
                        <div style={styles.bookingImagePlaceholder}>
                          <span style={styles.placeholderIcon}>🎭</span>
                        </div>
                      )}
                    </div>
                    <div style={styles.bookingInfo}>
                      <h4 style={styles.eventTitle}>✨ {event.title}</h4>
                      <p style={styles.bookingText}>
                        {formatDate(event.date)}
                      </p>
                      <p style={styles.bookingText}>
                        📍 {event.location || "Venue to be confirmed"}
                      </p>
                      <p style={styles.bookingText}>
                        🎟️ {event.availableTickets} tickets available
                      </p>
                      <p style={styles.bookingText}>
                        💰 ${event.price} per ticket
                      </p>
                      <button 
                        style={styles.viewBookingButton}
                        onClick={() => navigate(`/book-tickets?eventId=${event._id}`)}
                      >
                        ⚡ Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div style={styles.bookingCard}>
                  <h3 style={styles.cardTitle}>😔 No Upcoming Events</h3>
                  <p style={styles.cardText}>🔍 Check back later for new events</p>
                </div>
                <div style={styles.bookingCard}>
                  <h3 style={styles.cardTitle}>🌟 Discover Events</h3>
                  <p style={styles.cardText}>🎉 Browse our collection of exciting events</p>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      <footer style={styles.footer}>
        <p style={styles.footerText}>© 2025 BookedIn. All rights reserved.</p>
        <div style={styles.footerLinks}>
          <a href="#" style={styles.footerLink}>
             Contact
          </a>
          <span style={styles.footerDivider}>|</span>
          <a href="#" style={styles.footerLink}>
             Privacy
          </a>
          <span style={styles.footerDivider}>|</span>
          <a href="#" style={styles.footerLink}>
            ℹAbout
          </a>
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
    fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
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
    display: "flex",
    alignItems: "center",
    gap: "5px",
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
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
    display: "flex",
    alignItems: "center",
    gap: "5px",
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
    display: "flex",
    alignItems: "center",
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
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "40px",
  },
  bookingCard: {
    padding: "25px 30px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    ":hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
    }
  },
  bookingDetails: {
    display: "flex",
    gap: "20px",
    marginTop: "15px",
  },
  bookingImageContainer: {
    width: "120px",
    height: "120px",
    flexShrink: 0,
  },
  bookingImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "8px",
  },
  bookingImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f1f5f9",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderIcon: {
    fontSize: "40px",
  },
  bookingInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  eventTitle: {
    margin: "0 0 12px 0",
    fontSize: "18px",
    fontWeight: "700",
    color: "#1e293b",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  bookingText: {
    margin: "0 0 10px 0",
    fontSize: "15px",
    color: "#475569",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  cardTitle: {
    margin: "0 0 12px",
    fontSize: "20px",
    fontWeight: "700",
    color: "#1e293b",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  cardText: {
    margin: 0,
    fontSize: "16px",
    color: "#475569",
    lineHeight: "1.5",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  viewBookingButton: {
    marginTop: "15px",
    padding: "12px 20px",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    fontFamily: "'Poppins', sans-serif",
    alignSelf: "flex-start",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    ":hover": {
      backgroundColor: "#4338ca",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    },
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
    display: "flex",
    alignItems: "center",
    gap: "5px",
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
};

export default UserDashboard;