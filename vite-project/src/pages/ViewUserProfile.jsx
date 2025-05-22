import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewUserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:7000/api/v1/users/profile", {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div style={styles.loading}>Loading profile...</div>;
  if (error) return <div style={styles.errorAlert}>{error}</div>;

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <h1 style={styles.title}>View Profile</h1>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          ← Back to Dashboard
        </button>
      </header>

      <div style={styles.userCard}>
        {user.profilePic && (
          <img src={user.profilePic} alt="Profile" style={styles.profileImage} />
        )}
        <div style={styles.userInfo}>
          <h3 style={styles.userName}>{user.name}</h3>
          <p style={styles.userEmail}>
            <svg style={styles.infoIcon} viewBox="0 0 24 24">
              <path fill="currentColor" d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6M20 6L12 11L4 6H20M20 18H4V8L12 13L20 8V18Z" />
            </svg>
            {user.email}
          </p>
          <p style={styles.userRole}>
            <svg style={styles.infoIcon} viewBox="0 0 24 24">
              <path fill="currentColor" d="M12,3L2,12H5V20H19V12H22L12,3M12,7.7C14.1,7.7 15.8,9.4 15.8,11.5C15.8,13.6 14.1,15.3 12,15.3C9.9,15.3 8.2,13.6 8.2,11.5C8.2,9.4 9.9,7.7 12,7.7M7,18V16H17V18H7Z" />
            </svg>
            {user.role || "No role specified"}
          </p>
          <p style={styles.userId}>
            <svg style={styles.infoIcon} viewBox="0 0 24 24">
              <path fill="currentColor" d="M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A9,9 0 0,0 21,12A9,9 0 0,0 12,3M12,19A7,7 0 0,1 5,12A7,7 0 0,1 12,5A7,7 0 0,1 19,12A7,7 0 0,1 12,19M12,16.5C14.21,16.5 16,14.71 16,12.5C16,10.29 14.21,8.5 12,8.5C9.79,8.5 8,10.29 8,12.5C8,14.71 9.79,16.5 12,16.5M12,10.5C13.1,10.5 14,11.4 14,12.5C14,13.6 13.1,14.5 12,14.5C10.9,14.5 10,13.6 10,12.5C10,11.4 10.9,10.5 12,10.5Z" />
            </svg>
            ID: {user._id}
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    padding: "2rem",
    fontFamily: "'Inter', sans-serif",
    background: "linear-gradient(135deg, #434190, #2c2e8f)",
    minHeight: "100vh",
    color: "white",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  title: {
    color: "white",
    fontSize: "2rem",
    fontWeight: "700",
    margin: 0,
    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
  backButton: {
    padding: "0.5rem 1rem",
    background: "linear-gradient(135deg, #ff9800, #ff7043)",
    color: "white",
    border: "none",
    borderRadius: "0.375rem",
    cursor: "pointer",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    boxShadow: "0 4px 6px rgba(255, 152, 0, 0.3)",
  },
  userCard: {
    backgroundColor: "white",
    borderRadius: "0.75rem",
    padding: "2rem",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    maxWidth: "500px",
    margin: "0 auto",
    color: "#1e293b",
  },
  profileImage: {
    width: "100px",
    height: "100px",
    borderRadius: "9999px",
    objectFit: "cover",
    marginBottom: "1rem",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    border: "3px solid #4ca1af",
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  userName: {
    fontSize: "1.5rem",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "0.5rem",
  },
  userEmail: {
    fontSize: "0.875rem",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  userRole: {
    fontSize: "0.875rem",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  userId: {
    fontSize: "0.75rem",
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  infoIcon: {
    width: "1rem",
    height: "1rem",
  },
  errorAlert: {
    padding: "1rem",
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    borderRadius: "0.375rem",
    marginBottom: "1.5rem",
    fontWeight: "500",
    textAlign: "center",
  },
  loading: {
    color: "#fff",
    fontSize: "18px",
    textAlign: "center",
    marginTop: "40px",
  },
};

export default ViewUserProfile;
