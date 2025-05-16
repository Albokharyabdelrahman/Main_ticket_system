import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// Provide your logo image here (as import or URL string)
import logo from './logo.png';// <-- Make sure this path matches your project

export default function Login() {
  // State variables
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hover, setHover] = useState(false); // For button hover effect
  const navigate = useNavigate();

  // Input change handler
  function handleChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  // Forgot Password
  function handleForgotPassword() {
    // Add your forgot password logic here or redirect as needed
    alert("Forgot password feature coming soon!");
  }

  // Register Redirect
  function handleRegisterRedirect() {
    navigate("/register"); // Or your register route
  }

  // Submit handler
  async function handleSubmit(e) {
  e.preventDefault();
  setError("");
  setSuccess("");
  setIsLoading(true);

  try {
    // Send login request (set cookie)
    await axios.post("http://localhost:7000/api/v1/login", data, {
      withCredentials: true,
    });

    // Fetch profile to get role
    const res = await axios.get("http://localhost:7000/api/v1/users/profile", {
      withCredentials: true,
    });

    const role = res.data.user.role;
    setSuccess("Login successful! Redirecting...");

    // Redirect based on role
    setTimeout(() => {
      if (role === "Admin") navigate("/AdminDashboard");
      else if (role === "Organizer") navigate("/OrganizerDashboard");
      else navigate("/UserDashboard");
    }, 1500);
  } catch (err) {
    setError(err.response?.data?.error || "Login failed");
  } finally {
    setIsLoading(false);
  }
}


  // Button style based on hover and loading state
  const buttonStyle = {
    background: hover
      ? "linear-gradient(90deg, #764ba2 0%, #667eea 100%)"
      : "linear-gradient(135deg, #667eea, #764ba2)",
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

      {/* Login Form */}
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Login</h2>
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={{ ...styles.error, color: "green" }}>{success}</div>}

        {/* Email */}
        <input
          style={styles.input}
          type="email"
          name="email"
          placeholder="Email"
          value={data.email}
          onChange={handleChange}
          required
          autoComplete="username"
        />

        {/* Password */}
        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Password"
          value={data.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
        />

        {/* Submit Button */}
        <button
          type="submit"
          style={buttonStyle}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Log In"}
        </button>

        {/* Secondary Actions */}
        <div style={styles.secondaryActions}>
          <button
            type="button"
            onClick={handleForgotPassword}
            style={styles.textButton}
          >
            Forgot Password?
          </button>
          <span style={styles.divider}>|</span>
          <button
            type="button"
            onClick={handleRegisterRedirect}
            style={styles.textButton}
          >
            Create Account
          </button>
        </div>
      </form>

      {/* Footer */}
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

// Styles object
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