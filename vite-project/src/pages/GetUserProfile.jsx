
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const GetUserProfile = () => {
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!userId.trim()) {
      setError("Please enter a User ID.");
      return;
    }

    try {
      // Verify the user exists first
      await axios.get(
        `http://localhost:7000/api/v1/users/${userId.trim()}`,
        { withCredentials: true }
      );
      
      // Redirect to edit page if found
      navigate(`user-View-Profile`);
    } catch (err) {
      setError(err.response?.data?.message || "User not found or you don't have permission");
      console.error("Error fetching user:", err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.logoContainer} onClick={() => navigate(-1)}>
        <img src={logo} alt="Logo" style={styles.logo} />
      </div>

      <h1 style={styles.heading}>Update Profile</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Find User
        </button>
      </form>

      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
    padding: "40px 20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "linear-gradient(135deg, #434190, #2c2e8f)",
    minHeight: "100vh",
    textAlign: "center",
    color: "#fff",
  },
  logoContainer: {
    position: "absolute",
    top: "20px",
    right: "60px",
    cursor: "pointer",
    width: "100px",
    height: "100px",
    userSelect: "none",
  },
  logo: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  heading: {
    fontSize: "36px",
    fontWeight: "700",
    marginBottom: "32px",
    color: "#f0f0f0",
    textShadow: "0 2px 5px rgba(0,0,0,0.3)",
  },
  form: {
    marginBottom: "32px",
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    flexWrap: "wrap",
  },
  input: {
    padding: "14px 16px",
    fontSize: "16px",
    borderRadius: "12px",
    border: "none",
    width: "320px",
    outline: "none",
    boxShadow: "0 0 8px rgba(255, 255, 255, 0.6)",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    color: "#333",
    transition: "box-shadow 0.3s ease",
  },
  button: {
    padding: "14px 28px",
    fontSize: "16px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #ff9800, #ff7043)",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(92, 79, 207, 0.7)",
    transition: "background 0.3s ease",
  },
  card: {
    marginTop: "20px",
    maxWidth: "600px",
    marginLeft: "auto",
    marginRight: "auto",
    padding: "30px 28px",
    borderRadius: "20px",
    background: "rgba(255, 255, 255, 0.95)",
    boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
    textAlign: "left",
    color: "#333",
  },
  eventTitle: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "16px",
    color: "#4a3b9d",
  },
  error: {
    color: "#ff6b6b",
    fontWeight: "700",
    marginTop: "20px",
    textShadow: "0 1px 2px rgba(0,0,0,0.25)",
  },
};

export default GetUserProfile;
