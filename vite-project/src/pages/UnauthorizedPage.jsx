import React from "react";
import { Link } from "react-router-dom";

const UnauthorizedPage = () => (
  <div style={styles.container}>
    <div style={styles.content}>
      <h1 style={styles.title}>403 - Unauthorized Access</h1>
      <p style={styles.message}>You don't have permission to view this page</p>
      <div style={styles.icon}>
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <Link to="/" style={styles.button}>
        Return to Home
      </Link>
    </div>
  </div>
);

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e3a8a)",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  content: {
    textAlign: "center",
    maxWidth: "500px",
    padding: "40px",
    borderRadius: "12px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(8px)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "16px",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
  },
  message: {
    fontSize: "1.2rem",
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: "32px",
    lineHeight: "1.6",
  },
  icon: {
    margin: "0 auto 30px",
    color: "rgba(255, 255, 255, 0.8)",
  },
  button: {
    display: "inline-block",
    padding: "12px 24px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#fff",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "600",
    transition: "all 0.3s ease",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    ":hover": {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      transform: "translateY(-2px)",
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
    },
  },
};

export default UnauthorizedPage;