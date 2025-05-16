import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const API_BASE_URL = "http://localhost:7000/api/v1";

const UserDashboard = () => {
  const { logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
  const res = await axios.get(`${API_BASE_URL}/users/profile`, {
    withCredentials: true, // 🔥 This tells Axios to send cookies
  });

        console.log("DEBUG: Profile fetch successful:", res.data);
        setProfile(res.data.user);
      } catch (err) {
        console.error("DEBUG: Profile fetch error:", err);
        if (err.response) {
          console.error("DEBUG: Server responded with:", err.response.status, err.response.data);
        }
        setError("Failed to load profile. Please try again.");
      }
    };

    fetchProfile();
  }, []);

 const handleLogout = async () => {
  try {
  const BASE_URL = "http://localhost:5173/login";
  await axios.get(`${BASE_URL}`, { withCredentials: true }); // ✅ fixed extra }
  localStorage.removeItem("token");
  logout(); // Clear context state
  window.location.href = BASE_URL; // Redirect to base URL
} catch (err) {
  console.error("Logout failed:", err);
}

};


   return (
    <div style={styles.pageContainer}>
      <aside style={styles.sidebar}>
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
              <span style={styles.profileLabel}>Email:</span>
              <span style={styles.profileValue}>{profile.email}</span>
            </div>
            <div style={styles.profileItem}>
              <span style={styles.profileLabel}>Role:</span>
              <span style={styles.profileValue}>{profile.role}</span>
            </div>
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
            Welcome back, <span style={styles.highlight}>{profile?.name || "User"}</span>!
          </h1>
          <img src={logo} alt="BookedIn Logo" style={styles.logo} />
        </div>
        
        <div style={styles.dashboardButtons}>
          <button style={styles.actionButton}>
            <span style={styles.buttonIcon}>🎫</span>
            <span>Book Tickets</span>
          </button>
          <button style={styles.actionButton}>
            <span style={styles.buttonIcon}>📋</span>
            <span>View My Bookings</span>
          </button>
          <button style={styles.actionButton}>
            <span style={styles.buttonIcon}>🔍</span>
            <span>Find Booking</span>
          </button>
        </div>
        
        <div style={styles.contentCard}>
          <h3 style={styles.cardTitle}>Quick Actions</h3>
          <p style={styles.cardText}>
            Get started with these options or explore more features from the menu.
          </p>
        </div>
      </main>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    backgroundColor: "#f8fafc",
  },
  sidebar: {
    width: "300px",
    background: "linear-gradient(145deg, #4f46e5, #7c3aed)",
    color: "#ffffff",
    padding: "0",
    display: "flex",
    flexDirection: "column",
    boxShadow: "4px 0 15px rgba(0, 0, 0, 0.1)",
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
  logoutButton: {
    marginTop: "40px",
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
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
    }
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
    padding: "18px 25px",
    backgroundColor: "#ffffff",
    color: "#4f46e5",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    boxShadow: "0 4px 6px rgba(79, 70, 229, 0.1)",
    transition: "all 0.3s ease",
    flex: 1,
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 12px rgba(79, 70, 229, 0.15)",
    }
  },
  buttonIcon: {
    fontSize: "20px",
  },
  contentCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0 0 15px 0",
  },
  cardText: {
    fontSize: "15px",
    color: "#64748b",
    lineHeight: "1.6",
    margin: "0",
  },
  logo: {
    width: "120px",
    height: "auto",
  },
  error: {
    backgroundColor: "rgba(239, 68, 68, 0.9)",
    padding: "12px 16px",
    borderRadius: "8px",
    fontWeight: "500",
    marginBottom: "20px",
    fontSize: "14px",
    color: "white",
  },
};

export default UserDashboard;