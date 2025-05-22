import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import UserRow from "../components/UserRow";

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
    const UserArr=[decodedPayload.userId,decodedPayload.role||"Rando"];
    return UserArr; // <--- THIS is the correct field
  } catch (e) {
    console.error("Invalid token:", e);
    return null;
  }
}

const API_BASE_URL = "http://localhost:7000/api/v1";

const AdminDashboard = () => {
const currentUserArr = getCurrentUserIdFromCookie();
  const currentRole = currentUserArr[1];
  if (currentRole !== "Admin") {
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
  }  const { logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [quickActionMsg, setQuickActionMsg] = useState("");
  const [editingObj, setEditingObj] = useState(null);
  const [editingType, setEditingType] = useState(null);
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


  const handleUpdateProfile = () => navigate('/update-profile');

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
  navigate("/admin/events");
  };

 const updateEvent = () => {
  navigate('/update-event'); 
};

    const deleteEvent = () => {
  navigate('/delete-event'); 
};
  

  // USERS
  const viewProfile = async () => {
   navigate('/user-profiles');
  };

 
  const updateUserProfile = () =>
  navigate("/user-profile");
    

 const getUserProfile = () =>
    navigate("/user-getProfile");
 

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
              <span style={styles.highlight}>{profile?.name || "Admin"}</span>!
            </h1>
            <img src={logo} alt="BookedIn Logo" style={styles.logo} />
          </div>

          <div style={styles.dashboardButtons}>
            <button style={styles.actionButton} onClick={getAllEvents}>
              <span style={styles.buttonIcon}>📋</span>
              <span>Get All Events</span>
            </button>
            <button style={styles.actionButton} onClick={updateEvent}>
              <span style={styles.buttonIcon}>✏️</span>
              <span>Update Event</span>
            </button>
            <button style={styles.actionButton} onClick={deleteEvent}>
              <span style={styles.buttonIcon}>🗑️</span>
              <span>Delete Event</span>
            </button>
            <button style={styles.actionButton} onClick={viewProfile}>
              <span style={styles.buttonIcon}>👥</span>
              <span>View All Profiles</span>
            </button>
            <button style={styles.actionButton} onClick={getUserProfile}>
              <span style={styles.buttonIcon}>🔍</span>
              <span>Get User Profile</span>
            </button>
            <button style={styles.actionButton} onClick={updateUserProfile}>
              <span style={styles.buttonIcon}>🔄</span>
              <span>Update User Profile</span>
            </button>
           
          </div>

          <div style={styles.contentCard}>
            <h3 style={styles.cardTitle}>Admin Actions</h3>
            
            {editingObj && (
              <div style={styles.editingContainer}>
                {editingType === "event" ? (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        await axios.put(
                          `http://localhost:7000/api/v1/events/${editingObj._id}`,
                          editingObj,
                          { withCredentials: true }
                        );
                        setEditingObj(null);
                        setEditingType(null);
                        setQuickActionMsg("Event updated successfully!");
                      } catch (err) {
                        setQuickActionMsg("ERROR: " + (err.response?.data?.message || err.message));
                      }
                    }}
                  >
                    {Object.entries(editingObj).map(([k, v]) => {
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
                          {k === "image" ? (
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
                                    setEditingObj(obj => ({ ...obj, image: reader.result }));
                                  };
                                  reader.readAsDataURL(file);
                                }}
                              />
                              {v && (
                                <img
                                  src={v}
                                  alt="Preview"
                                  style={{ width: 40, height: 40, borderRadius: "8px", objectFit: "cover", border: "1px solid #ccc"}}
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
                    <button type="submit" style={styles.saveButton}>
                      Save
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {setEditingObj(null); setEditingType(null);}} 
                      style={styles.cancelButton}
                    >
                      Cancel
                    </button>
                  </form>
                ) : editingType === "user" ? (
                  <UserRow
                    user={editingObj}
                    onSave={async (updatedUser) => {
                      try {
                        await axios.put(
                          `http://localhost:7000/api/v1/users/${updatedUser._id}`,
                          updatedUser,
                          { withCredentials: true }
                        );
                        setEditingObj(null);
                        setEditingType(null);
                        setQuickActionMsg("User updated successfully!");

                        const currentUserId = getCurrentUserIdFromCookie();
                        if (updatedUser._id === currentUserId) {
                          if (updatedUser.role === "User") {
                            navigate("/UserDashboard");
                          } else if (updatedUser.role === "Organizer") {
                            navigate("OrganizerDashboard");
                          } else if (updatedUser.role === "admin") {
                            // Stay on admin dashboard
                          }
                        }
                      } catch (err) {
                        setQuickActionMsg("ERROR: " + (err.response?.data?.message || err.message));
                      }
                    }}
                    onCancel={() => {
                      setEditingObj(null);
                      setEditingType(null);
                    }}
                    onDelete={async (deletedUser) => {
                      try {
                        await axios.delete(
                          `http://localhost:7000/api/v1/users/${deletedUser._id}`,
                          { withCredentials: true }
                        );
                        setEditingObj(null);
                        setEditingType(null);
                        setQuickActionMsg("User deleted successfully!");
                      } catch (err) {
                        setQuickActionMsg("ERROR: " + (err.response?.data?.message || err.message));
                      }
                    }}
                  />
                ) : null}
              </div>
            )}

            {!editingObj && quickActionMsg && (
              <div style={styles.resultContainer}>
                {(() => {
                  let parsed;
                  try {
                    parsed = JSON.parse(quickActionMsg);
                  } catch (e) {
                    return quickActionMsg;
                  }
                  if (Array.isArray(parsed)) {
                    return parsed.map((item, idx) => (
                      <div
                        key={item._id || idx}
                        style={styles.resultItem}
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
                      <div style={styles.resultItem}>
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
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  },
  actionButton: {
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
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0 0 15px 0",
  },
  editingContainer: {
    marginTop: 16,
    background: "#f1f5f9",
    padding: 12,
    borderRadius: 8,
    color: "#333",
    fontSize: "13px",
    maxHeight: 350,
    overflowY: "auto"
  },
  resultContainer: {
    marginTop: 16,
    background: "#f1f5f9",
    padding: 12,
    borderRadius: 8,
    color: "#333",
    fontSize: "13px",
    maxHeight: 350,
    overflowY: "auto"
  },
  resultItem: {
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    background: "#fff"
  },
  saveButton: {
    marginTop: 12,
    padding: '8px 16px',
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    fontWeight: "600",
    cursor: "pointer"
  },
  cancelButton: {
    marginLeft: 12,
    padding: '8px 16px',
    background: "#64748b",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    fontWeight: "600",
    cursor: "pointer"
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

export default AdminDashboard;