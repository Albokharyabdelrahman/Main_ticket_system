import React from "react";
import { useNavigate } from "react-router-dom";

export default function GuestDashboard() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1>Welcome, Guest!</h1>
      <p>You are currently browsing as a guest user.</p>
      <button style={styles.button} onClick={() => navigate("/")}>
        Return to Login
      </button>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #ffa500, #ff7f50)",
    color: "white",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "20px",
    textAlign: "center",
  },
  button: {
    marginTop: "20px",
    padding: "12px 24px",
    background: "white",
    color: "#ff7f50",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(255,127,80,0.4)",
  },
};
