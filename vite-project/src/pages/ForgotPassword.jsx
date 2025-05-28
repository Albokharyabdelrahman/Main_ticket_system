import React, { useState } from "react";
import axios from "axios";
import logo from "../assets/logo.png"; // Update this path

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [mode, setMode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submitButtonStyle = {
    marginTop: "16px",
    padding: "12px 0",
    width: "100%",
    background: "#764ba2",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background 0.2s",
    opacity: isLoading ? 0.7 : 1,
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setSuccess("");
  setError("");

  if (!mode) {
    setError("Please select an action.");
    return;
  }

  setIsLoading(true);

  try {
    const response = await axios.put("http://localhost:7000/api/v1/forgetPassword", {
      email,
      otp: otp ? Number(otp) : undefined, // Convert to number (or undefined if empty)
      newPassword,
      mode,
    });
    setSuccess(response.data.message || "Success!");
    setError("");
  } catch (err) {
    const msg = err.response?.data?.message || err.response?.data?.error || "Unknown error";
    setError(msg);
    setSuccess("");
  }
  setIsLoading(false);
};

  // Paste your styles object here  
  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #667eea, #764ba2)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: "20px",
    },
    logoContainer: {
      textAlign: "center",
      marginBottom: "25px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    logoImage: {
      width: "200px",
      height: "auto",
      marginBottom: "15px",
    },
    brandContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    brandName: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "white",
      letterSpacing: "1.2px",
      marginBottom: "4px",
      textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
      fontFamily: "'Arial Black', sans-serif",
    },
    brandTagline: {
      fontSize: "12px",
      color: "white",
      letterSpacing: "2.5px",
      textTransform: "uppercase",
      fontFamily: "Arial, sans-serif",
    },
    form: {
      backgroundColor: "white",
      padding: "40px 30px",
      borderRadius: "10px",
      boxShadow: "0 8px 16px rgba(0,0,0,0.25)",
      width: "320px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    title: {
      marginBottom: "24px",
      color: "#333",
      textAlign: "center",
    },
    input: {
      padding: "12px",
      marginBottom: "16px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "16px",
      outlineColor: "#764ba2",
      width: "100%",
      boxSizing: "border-box",
    },
    error: {
      marginBottom: "12px",
      color: "#e74c3c",
      textAlign: "center",
      fontWeight: "bold",
    },
    secondaryActions: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "10px",
      width: "100%",
    },
    textButton: {
      background: "none",
      border: "none",
      color: "#764ba2",
      cursor: "pointer",
      fontSize: "14px",
      textDecoration: "underline",
      padding: "0",
    },
    divider: {
      color: "#764ba2",
      fontSize: "14px",
    },
    footer: {
      marginTop: "40px",
      textAlign: "center",
      color: "white",
      padding: "20px 10px",
      borderTop: "1px solid rgba(255, 255, 255, 0.2)",
      width: "100%",
      maxWidth: "400px",
    },
    footerText: {
      fontSize: "12px",
      marginBottom: "8px",
      color: "rgba(255,255,255,0.85)",
    },
    footerLinks: {
      display: "flex",
      justifyContent: "center",
      gap: "10px",
      fontSize: "12px",
      flexWrap: "wrap",
    },
    footerLink: {
      color: "white",
      textDecoration: "underline",
      cursor: "pointer",
    },
    footerDivider: {
      color: "white",
      fontSize: "12px",
    },
  };

  return (
    <div style={styles.container}>
      {/* Logo and branding */}
      <div style={styles.logoContainer}>
        <img
          src={logo}
          alt="Ticket Logo"
          style={styles.logoImage}
        />
        <div style={styles.brandContainer}>
          <div style={styles.brandName}>BOOKEDIN</div>
          <div style={styles.brandTagline}>CLICK.BOOK.ENJOY</div>
        </div>
      </div>

      {/* Forgot Password Form */}
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Forgot Password</h2>
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={{ ...styles.error, color: "green" }}>{success}</div>}

        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          style={styles.input}
          type="number"
          placeholder="OTP (if verifying)"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="New Password (if verifying)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        {/* Radio buttons for mode selection */}
        <div style={{
          width: "100%",
          marginBottom: 10,
          display: "flex",
          justifyContent: "center",
          gap: "24px",
        }}>
          <label style={{ fontSize: '15px', color: '#764ba2', cursor: "pointer" }}>
            <input
              type="radio"
              value="send"
              checked={mode === "send"}
              onChange={() => setMode("send")}
              style={{ marginRight: "8px" }}
            />
            Send OTP
          </label>
          <label style={{ fontSize: '15px', color: '#764ba2', cursor: "pointer" }}>
            <input
              type="radio"
              value="verify"
              checked={mode === "verify"}
              onChange={() => setMode("verify")}
              style={{ marginRight: "8px" }}
            />
            Verify OTP
          </label>
        </div>

        <button
          type="submit"
          style={submitButtonStyle}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Submit"}
        </button>
        
        {mode && (
          <div style={{ marginTop: "12px", fontSize: "14px", fontWeight: "bold", color: "#764ba2" }}>
            Current mode: <span style={{ fontWeight: "normal" }}>
              {mode === "send" ? "Send" : mode === "verify" ? "Verify" : ""}
            </span>
          </div>
        )}
      </form>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>© 2025 BookedIn. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ForgotPassword;