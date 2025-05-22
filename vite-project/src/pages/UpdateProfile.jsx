import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "./logo.png"; // adjust path as needed

const API_BASE_URL = "http://localhost:7000/api/v1";

export default function UpdateProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    password: "",
    profilePicture: "",
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
});

      } catch (err) {
        setError("Failed to load profile.");
      }
    })();
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
    <div style={styles.container}>
      <img
        src={logo}
        alt="Logo"
        style={styles.logo}
        onClick={() => navigate(-1)}
      />

      <h1 style={styles.heading}>Update Profile</h1>

      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label htmlFor="name" style={styles.label}>
            Name:
            <input
              id="name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              style={styles.input}
              autoComplete="name"
            />
          </label>

          <label htmlFor="email" style={styles.label}>
            Email:
            <input
              id="email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleChange}
              style={styles.input}
              autoComplete="email"
            />
          </label>

          <label htmlFor="password" style={styles.label}>
            Password (leave blank to keep current):
            <input
              id="password"
              name="password"
              type="password"
              value={profile.password}
              onChange={handleChange}
              style={styles.input}
              autoComplete="new-password"
            />
          </label>

          <label htmlFor="profilePicture" style={styles.label}>
  Upload Profile Picture:
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
    style={styles.input}
  />
</label>


          <button type="submit" style={styles.button}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: "relative",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "20px",
    color: "#fff",
  },
  logo: {
    position: "absolute",
    top: 20,
    right: 20,
    width: "100px",
    height: "auto",
    cursor: "pointer",
  },
  heading: {
    marginBottom: 24,
    fontWeight: "700",
    fontSize: "36px",
    textAlign: "center",
    color: "#fff",
  },
  formContainer: {
    width: "100%",
    maxWidth: "500px",
    background: "linear-gradient(135deg, #434190, #2c2e8f)", 
    borderRadius: "16px",
    padding: "40px 30px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    color: "#fff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  label: {
    fontWeight: "600",
    fontSize: "16px",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
  },
  input: {
    marginTop: "6px",
    padding: "12px",
    fontSize: "15px",
    borderRadius: "8px",
    border: "1px solid #ffffff88",
    backgroundColor: "#fff",
    color: "#000",
    outline: "none",
  },
  button: {
    marginTop: "10px",
    padding: "14px 0",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    fontWeight: "700",
    fontSize: "16px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
  buttonHover: {
    background: "linear-gradient(135deg, #434190, #2c2e8f)",
  },
  success: {
    color: "#b2f2bb",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: "15px",
  },
  error: {
    color: "#ff7b7b",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: "15px",
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
    transition: "all 0.2s ease",
    boxShadow: "0 4px 6px rgba(255, 152, 0, 0.3)",
    ":hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 8px rgba(255, 152, 0, 0.4)",
    },
  },
};
