import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:7000/api/v1";

const UserProfiles = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/`, {
          withCredentials: true,
        });
        setUsers(res.data);
      } catch (err) {
        setError("Failed to load user profiles.");
      }
    };
    fetchUsers();
  }, []);

  const handleEdit = (userId) => {
    navigate(`/edit-user/${userId}`);
  };

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <h1 style={styles.title}>User Management</h1>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          ← Back to Dashboard
        </button>
      </header>

      {error && <div style={styles.errorAlert}>{error}</div>}

      <div style={styles.usersContainer}>
        {users.length === 0 ? (
          <div style={styles.emptyState}>
            <svg style={styles.emptyIcon} viewBox="0 0 24 24">
              <path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
            </svg>
            <p>No user profiles found</p>
          </div>
        ) : (
          users.map((user) => (
            <div 
              key={user._id} 
              style={styles.userCard}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={styles.userAvatar}>
                {user.name.charAt(0).toUpperCase()}
              </div>
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
              <button
                style={styles.editButton}
                onClick={() => handleEdit(user._id)}
              >
                Edit Profile
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    padding: "2rem",
    fontFamily: "'Inter', sans-serif",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  title: {
    color: "#1e293b",
    fontSize: "2rem",
    fontWeight: "700",
    margin: 0,
  },
  backButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "0.375rem",
    cursor: "pointer",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    transition: "all 0.2s ease",
  },
  errorAlert: {
    padding: "1rem",
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    borderRadius: "0.375rem",
    marginBottom: "1.5rem",
    fontWeight: "500",
  },
  usersContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem",
  },
  userCard: {
    backgroundColor: "white",
    borderRadius: "0.75rem",
    padding: "1.5rem",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  userAvatar: {
    width: "3rem",
    height: "3rem",
    borderRadius: "9999px",
    backgroundColor: "#4f46e5",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.25rem",
    fontWeight: "600",
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  userName: {
    margin: 0,
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#1e293b",
  },
  userEmail: {
    margin: 0,
    fontSize: "0.875rem",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  userRole: {
    margin: 0,
    fontSize: "0.875rem",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  userId: {
    margin: 0,
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
  editButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "0.375rem",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "0.875rem",
    transition: "all 0.2s ease",
    marginTop: "0.5rem",
    alignSelf: "flex-start",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    padding: "2rem",
    backgroundColor: "white",
    borderRadius: "0.75rem",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    gridColumn: "1 / -1",
  },
  emptyIcon: {
    width: "3rem",
    height: "3rem",
    color: "#94a3b8",
  },
};

export default UserProfiles;