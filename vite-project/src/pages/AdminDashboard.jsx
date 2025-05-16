import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const API_BASE_URL = "http://localhost:7000/api/v1";

const AdminDashboard = () => {
  const { logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [quickActionMsg, setQuickActionMsg] = useState("");
  const [editingObj, setEditingObj] = useState(null);      // the object (user/event) being edited
  const [editingType, setEditingType] = useState(null);    // 'event' or 'user'
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

  const handleLogout = async () => {
    const BASE_URL = "http://localhost:5173/login";
    await axios.get(BASE_URL, { withCredentials: true });
    localStorage.removeItem("token");
    logout();
    window.location.href = BASE_URL;
  };

  // Helper for buttons with prompt for :id
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
    try {
      const res = await axios.get(
        "http://localhost:7000/api/v1/events/all",
        { withCredentials: true }
      );
      setQuickActionMsg(JSON.stringify(res.data));
    } catch (err) {
      setQuickActionMsg("ERROR: " + (err.response?.data?.message || err.message));
    }
  };

const updateEvent = () =>
  promptAndCall("Enter event ID to update:", async (id) => {
    const res = await axios.get(
      `http://localhost:7000/api/v1/events/${id}`,
      { withCredentials: true }
    );
    setEditingType("event");
    setEditingObj(res.data); // Or use proper path to event object if wrapped
    setQuickActionMsg("");
    return res;
  });

  const deleteEvent = () =>
    promptAndCall("Enter event ID to delete:", async (id) =>
      axios.delete(
        `http://localhost:7000/api/v1/events/${id}`,
        { withCredentials: true }
      )
    );

  // USERS
  const viewProfile = async () => {
    try {
      const res = await axios.get(
        "http://localhost:7000/api/v1/users/",
        { withCredentials: true }
      );
      setQuickActionMsg(JSON.stringify(res.data));
    } catch (err) {
      setQuickActionMsg("ERROR: " + (err.response?.data?.message || err.message));
    }
  };

  const updateUserProfile = () =>
  promptAndCall("Enter user ID to update profile:", async (id) => {
    const res = await axios.get(
      `http://localhost:7000/api/v1/users/${id}`,
      { withCredentials: true }
    );
    setEditingType("user");
    setEditingObj(res.data); // Or use proper path to user object if wrapped
    setQuickActionMsg("");
    return res;
  });

  const getUserProfile = () =>
    promptAndCall("Enter user ID to get profile:", async (id) =>
      axios.get(
        `http://localhost:7000/api/v1/users/${id}`,
        { withCredentials: true }
      )
    );

  const deleteUser = () =>
    promptAndCall("Enter user ID to delete:", async (id) =>
      axios.delete(
        `http://localhost:7000/api/v1/users/${id}`,
        { withCredentials: true }
      )
    );

  return (
    <div style={styles.pageContainer}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.sidebarTitle}>Admin Profile</h2>
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
          {profile?.profilePic ? (
  <img
    src={profile.profilePic}
    alt="Profile"
    style={{
      width: 60,
      height: 60,
      borderRadius: "50%",
      objectFit: "cover",
      boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
      border: "2px solid #4f46e5",
      marginLeft: 12
    }}
  />
) : (
  <img src={logo} alt="BookedIn Logo" style={styles.logo} />
)}
        </div>
        <div style={styles.contentCard}>
          <h3 style={styles.cardTitle}>Quick Actions</h3>
          <div style={{display: "flex", flexDirection: "column", gap: "12px"}}>

            {/* Events */}
            <button style={styles.actionButton} onClick={getAllEvents}>
              Get All Events
            </button>
            <button style={styles.actionButton} onClick={updateEvent}>
              Update Event
            </button>
            <button style={styles.actionButton} onClick={deleteEvent}>
              Delete an Event
            </button>

            {/* Users */}
            <button style={styles.actionButton} onClick={viewProfile}>
              View All Profiles
            </button>
            <button style={styles.actionButton} onClick={getUserProfile}>
              Get profile of a user
            </button>
            <button style={styles.actionButton} onClick={updateUserProfile}>
              Upate profile of a user
            </button>
            <button style={styles.actionButton} onClick={deleteUser}>
              Delete a user
            </button>
          </div>
          {/* Result/Feedback */}

         {/* Editable form if updating an event or user */}
{editingObj && (
  <div style={{
    marginTop: 16,
    background: "#f1f5f9",
    padding: 12,
    borderRadius: 8,
    color: "#333",
    fontSize: "13px",
    maxHeight: 350,
    overflowY: "auto"
  }}>
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          if (editingType === "event") {
            await axios.put(
              `http://localhost:7000/api/v1/events/${editingObj._id}`,
              editingObj,
              { withCredentials: true }
            );
            setEditingObj(null);
            setEditingType(null);
            setQuickActionMsg("Event updated successfully!");
          } else if (editingType === "user") {
            await axios.put(
              `http://localhost:7000/api/v1/users/${editingObj._id}`,
              editingObj,
              { withCredentials: true }
            );
            setEditingObj(null);
            setEditingType(null);
            setQuickActionMsg("User updated successfully!");
          }
        } catch (err) {
          setQuickActionMsg("ERROR: " + (err.response?.data?.message || err.message));
        }
      }}
    >
      {Object.entries(editingObj).map(([k, v]) => {
        // Skip password and MongoDB internal fields, etc
        if (
          k === "__v" ||
          k === "createdAt" ||
          k === "updatedAt" ||
          k === "password"
        ) return null;
        return (
          <div key={k} style={{ marginBottom: 8 }}>
            <label style={{ color: "#64748b", textTransform: "capitalize", marginRight: 8 }}>
              {k}
            </label>

            {k === "profilePic" ? (
  <div style={{display: "flex", alignItems: "center", gap: 10}}>
    <input
      type="file"
      accept="image/*"
      style={{marginBottom: 8}}
      onChange={async e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
          setEditingObj(obj => ({ ...obj, profilePic: reader.result }));
        };
        reader.readAsDataURL(file);
      }}
    />
    {v && (
      <img
        src={v}
        alt="Preview"
        style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: "1px solid #ccc"}}
      />
    )}
  </div>
) : (
  <input
    type="text"
    value={v}
    style={{
      border: "1px solid #e5e7eb",
      borderRadius: 4,
      padding: 4,
      minWidth: 180
    }}
    onChange={e => setEditingObj(obj => ({ ...obj, [k]: e.target.value }))}
  />
)}

          </div>
        );
      })}
      <button type="submit" style={{
        marginTop: 12,
        padding: '8px 16px',
        background: "#4f46e5",
        color: "#fff",
        border: "none",
        borderRadius: 4,
        fontWeight: "600",
        cursor: "pointer"
      }}>Save</button>
      <button type="button" onClick={() => {setEditingObj(null); setEditingType(null);}} style={{
        marginLeft: 12,
        padding: '8px 16px',
        background: "#64748b",
        color: "#fff",
        border: "none",
        borderRadius: 4,
        fontWeight: "600",
        cursor: "pointer"
      }}>Cancel</button>
    </form>
  </div>
)}

{/* Pretty JSON renderer if not editing */}
{!editingObj && quickActionMsg && (
  <div style={{
    marginTop: 16,
    background: "#f1f5f9",
    padding: 12,
    borderRadius: 8,
    color: "#333",
    fontSize: "13px",
    maxHeight: 350,
    overflowY: "auto"
  }}>
    {(() => {
      let parsed;
      try {
        parsed = JSON.parse(quickActionMsg);
      } catch (e) {
        // It's likely an error message string
        return quickActionMsg;
      }
      if (Array.isArray(parsed)) {
        return parsed.map((item, idx) => (
          <div
            key={item._id || idx}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: 10,
              marginBottom: 10,
              background: "#fff"
            }}
          >
            {Object.entries(item).map(([k, v]) => (
              <div key={k} style={{
                marginBottom: 2,
                fontSize: k === "name" ? "15px" : "13px",
                fontWeight: k === "name" ? "600" : "400"
              }}>
                <span style={{
                  color: "#64748b",
                  textTransform: "capitalize"
                }}>{k}</span>: <span style={{ color: "#334155" }}>{v + ""}</span>
              </div>
            ))}
          </div>
        ));
      } else if (typeof parsed === "object") {
        return (
          <div style={{
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: 10,
            background: "#fff"
          }}>
            {Object.entries(parsed).map(([k, v]) => (
              <div key={k}>
                <span style={{ color: "#64748b", textTransform: "capitalize" }}>{k}</span>: <span style={{ color: "#334155" }}>{v + ""}</span>
              </div>
            ))}
          </div>
        );
      } else {
        return JSON.stringify(parsed);
      }
    })()}
  </div>
)}

        </div>
      </main>
    </div>
  );
};

// (Keep styles object as in your original code)
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
  error: {
    backgroundColor: "rgba(239, 68, 68, 0.9)",
    padding: "12px 16px",
    borderRadius: "8px",
    fontWeight: "500",
    marginBottom: "20px",
    fontSize: "14px",
    color: "white",
  },
  logo: {
    width: "120px",
    height: "auto",
  },
};

export default AdminDashboard;