import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE_URL = "http://localhost:7000/api/v1";

export default function EditUser() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/${userId}`, {
          withCredentials: true,
        });
        setUser({
          name: res.data.name || "",
          email: res.data.email || "",
          role: res.data.role || "",
        });
      } catch (err) {
        setError("Failed to load user data.");
      }
    })();
  }, [userId]);

  const handleChange = (e) =>
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      await axios.put(`${API_BASE_URL}/users/${userId}`, user, {
        withCredentials: true,
      });
      setMessage("User updated successfully!");
      navigate(-1);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this user?")) return;

    setError("");
    setMessage("");
    setIsDeleting(true);

    try {
      await axios.delete(`${API_BASE_URL}/users/${userId}`, {
        withCredentials: true,
      });
      setMessage("User deleted successfully!");
      setTimeout(() => navigate(-1), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.heading}>Edit User Profile</h2>
          <div style={styles.divider}></div>
        </div>

        {error && (
          <div style={styles.alertError}>
            <svg style={styles.alertIcon} viewBox="0 0 24 24">
              <path fill="currentColor" d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" />
            </svg>
            {error}
          </div>
        )}

        {message && (
          <div style={styles.alertSuccess}>
            <svg style={styles.alertIcon} viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
            </svg>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.labelText}>Full Name</span>
              <input
                name="name"
                value={user.name}
                onChange={handleChange}
                style={styles.input}
                required
                placeholder="John Doe"
              />
            </label>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.labelText}>Email Address</span>
              <input
                name="email"
                type="email"
                value={user.email}
                onChange={handleChange}
                style={styles.input}
                required
                placeholder="john@example.com"
              />
            </label>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.labelText}>Role</span>
              <input
                name="role"
                value={user.role}
                onChange={handleChange}
                style={styles.input}
                placeholder="e.g., Admin, User"
              />
            </label>
          </div>

          <div style={styles.buttonGroup}>
            <button 
              type="submit" 
              style={styles.primaryButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span style={styles.buttonText}>Saving...</span>
              ) : (
                <>
                  <svg style={styles.buttonIcon} viewBox="0 0 24 24">
                    <path fill="currentColor" d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3M19 19H5V5H16.17L19 7.83V19M12 12C10.34 12 9 13.34 9 15S10.34 18 12 18 15 16.66 15 15 13.66 12 12 12M6 6H15V10H6V6Z" />
                  </svg>
                  <span style={styles.buttonText}>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div style={styles.dangerZone}>
          <h3 style={styles.dangerZoneTitle}>Danger Zone</h3>
          <div style={styles.dangerZoneContent}>
            <p style={styles.dangerZoneText}>
              Deleting a user is permanent and cannot be undone.
            </p>
            <button
              type="button"
              onClick={handleDelete}
              style={styles.deleteButton}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span style={styles.buttonText}>Deleting...</span>
              ) : (
                <>
                  <svg style={styles.buttonIcon} viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                  </svg>
                  <span style={styles.buttonText}>Delete User</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "2rem",
    backgroundColor: "#f8fafc",
  },
  card: {
    width: "100%",
    maxWidth: "600px",
    backgroundColor: "white",
    borderRadius: "0.75rem",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  header: {
    padding: "1.5rem 2rem",
    borderBottom: "1px solid #e2e8f0",
  },
  heading: {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#1e293b",
  },
  divider: {
    height: "4px",
    width: "60px",
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    marginTop: "0.5rem",
    borderRadius: "2px",
  },
  form: {
    padding: "2rem",
  },
  inputGroup: {
    marginBottom: "1.5rem",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  labelText: {
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#475569",
  },
  input: {
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    borderRadius: "0.375rem",
    border: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
    transition: "all 0.2s ease",
    outline: "none",
  },
  buttonGroup: {
    marginTop: "1.5rem",
  },
  primaryButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    width: "100%",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "0.375rem",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  buttonText: {
    display: "inline-flex",
    alignItems: "center",
  },
  buttonIcon: {
    width: "1.25rem",
    height: "1.25rem",
  },
  alertError: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "1rem",
    margin: "0 2rem",
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    fontWeight: "500",
  },
  alertSuccess: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "1rem",
    margin: "0 2rem",
    backgroundColor: "#dcfce7",
    color: "#166534",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    fontWeight: "500",
  },
  alertIcon: {
    width: "1.25rem",
    height: "1.25rem",
  },
  dangerZone: {
    marginTop: "2rem",
    padding: "1.5rem 2rem",
    backgroundColor: "#fff1f2",
    borderTop: "1px solid #fecaca",
  },
  dangerZoneTitle: {
    margin: 0,
    marginBottom: "1rem",
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#9f1239",
  },
  dangerZoneContent: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  dangerZoneText: {
    margin: 0,
    fontSize: "0.875rem",
    color: "#881337",
  },
  deleteButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    width: "100%",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#e11d48",
    color: "white",
    border: "none",
    borderRadius: "0.375rem",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
};