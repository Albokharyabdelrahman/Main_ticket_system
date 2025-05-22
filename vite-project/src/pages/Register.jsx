import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "./logo.png"; // <-- Make sure this path matches your project


const ROLE_OPTIONS = [
  { label: "Standard User", value: "User" },
  { label: "Organizer", value: "Organizer" },
];

export default function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    profilePicture: null
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    setData({ ...data, role: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setData({ ...data, profilePicture: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("role", data.role);
      if (data.profilePicture) {
        formData.append("profilePicture", data.profilePicture);
      }

      await axios.post("http://localhost:7000/api/v1/register", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });

      setSuccess("Registration successful! Redirecting to dashboard...");
      setTimeout(() => navigate("/Login"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // Hover effects for the button
  const buttonStyle = {
    background: hover ? "linear-gradient(90deg, #764ba2 0%, #667eea 100%)" : "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    padding: "12px",
    fontSize: "16px",
    border: "none",
    borderRadius: "6px",
    width: "100%",
    marginBottom: "18px",
    cursor: isLoading ? "not-allowed" : "pointer",
    opacity: isLoading ? 0.8 : 1,
    transition: "background 0.2s, opacity 0.2s",
    fontWeight: "bold",
    boxShadow: hover
      ? "0 4px 10px rgba(118, 75, 162, 0.18)"
      : "0 2px 6px rgba(102,126,234,0.09)",
  };

  return (
    <div style={styles.container}>
      <div style={styles.logoContainer}>
        <img 
          src={logo}
          alt="BOOKEDIN Logo"
          style={styles.logoImage}
        />
        <div style={styles.brandContainer}>
          <div style={styles.brandName}>BOOKEDIN</div>
          <div style={styles.brandTagline}>CLICK.BOOK.ENJOY</div>
        </div>
      </div>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Register</h2>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={{ ...styles.error, color: "green" }}>{success}</div>}

        <input
          style={styles.input}
          type="text"
          name="name"
          placeholder="Full Name"
          value={data.name}
          onChange={handleChange}
          required
        />

        <input
          style={styles.input}
          type="email"
          name="email"
          placeholder="Email"
          value={data.email}
          onChange={handleChange}
          required
        />

        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Password"
          value={data.password}
          onChange={handleChange}
          required
        />

        <select
          style={styles.input}
          name="role"
          value={data.role}
          onChange={handleRoleChange}
          required
        >
          <option value="">Select Role</option>
          {ROLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <div style={styles.fileInputContainer}>
          <label style={styles.fileInputLabel}>
            Profile Picture
            <input
              type="file"
              name="profilePicture"
              onChange={handleImageChange}
              style={styles.fileInput}
              accept="image/*"
            />
          </label>
          {data.profilePicture && (
            <span style={styles.fileName}>{data.profilePicture.name}</span>
          )}
        </div>

        <button
          type="submit"
          style={buttonStyle}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Register"}
        </button>

        <div style={styles.secondaryActions}>
          <button
            type="button"
            onClick={() => navigate("/login")}
            style={styles.textButton}
          >
            Already have an account? Login
          </button>
        </div>
      </form>
      <footer style={styles.footer}>
        <p style={styles.footerText}>© 2025 BookedIn. All rights reserved.</p>
        <div style={styles.footerLinks}>
          <a href="#" style={styles.footerLink}>Contact</a>
          <span style={styles.footerDivider}>|</span>
          <a href="#" style={styles.footerLink}>Privacy</a>
          <span style={styles.footerDivider}>|</span>
          <a href="#" style={styles.footerLink}>About</a>
        </div>
      </footer>
    </div>
  );
}

// Styles object (same as reference)
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
  fileInputContainer: {
    width: "100%",
    marginBottom: "16px",
  },
  fileInputLabel: {
    display: "block",
    marginBottom: "8px",
    color: "#333",
    fontSize: "14px",
  },
  fileInput: {
    width: "100%",
    marginTop: "4px",
  },
  fileName: {
    display: "block",
    fontSize: "12px",
    color: "#666",
    marginTop: "4px",
  },
  secondaryActions: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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