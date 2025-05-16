import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "./logo.png"; // Update the path if needed

export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hoverLogin, setHoverLogin] = useState(false);
  const [hoverGuest, setHoverGuest] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  function handleForgotPassword() {
    alert("Forgot password feature coming soon!");
  }

  function handleRegisterRedirect() {
    navigate("/register");
  }

  function handleContinueAsGuest() {
    navigate("/guest");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
    try {
      await axios.post("http://localhost:7000/api/v1/login", data, {
        withCredentials: true,
      });

      const res = await axios.get("http://localhost:7000/api/v1/users/profile", {
        withCredentials: true,
      });

      const role = res.data.user.role;
      setSuccess("Login successful! Redirecting...");
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

  const loginButtonStyle = {
    background: hoverLogin
      ? "linear-gradient(90deg, #764ba2 0%, #667eea 100%)"
      : "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    padding: "12px",
    fontSize: "16px",
    border: "none",
    borderRadius: "6px",
    width: "100%",
    marginBottom: "16px",
    cursor: isLoading ? "not-allowed" : "pointer",
    opacity: isLoading ? 0.8 : 1,
    transition: "background 0.2s, opacity 0.2s",
    fontWeight: "bold",
    boxShadow: hoverLogin
      ? "0 4px 10px rgba(118, 75, 162, 0.18)"
      : "0 2px 6px rgba(102,126,234,0.09)",
  };

  const guestButtonStyle = {
    background: hoverGuest
      ? "linear-gradient(90deg, #ff8c00 0%, #ff7f50 100%)"
      : "linear-gradient(135deg, #ffa500, #ff7f50)",
    color: "white",
    padding: "12px",
    fontSize: "16px",
    border: "none",
    borderRadius: "6px",
    width: "100%",
    marginBottom: "24px",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: hoverGuest
      ? "0 4px 10px rgba(255, 140, 0, 0.25)"
      : "0 2px 6px rgba(255,165,0,0.15)",
    transition: "background 0.2s",
  };

  return (
    <div style={styles.container}>
      <div style={styles.logoContainer}>
        <img src={logo} alt="Ticket Logo" style={styles.logoImage} />
        <div style={styles.brandContainer}>
          <div style={styles.brandName}>BOOKEDIN</div>
          <div style={styles.brandTagline}>CLICK.BOOK.ENJOY</div>
        </div>
      </div>

      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Login</h2>
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={{ ...styles.error, color: "green" }}>{success}</div>}

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

        <button
          type="submit"
          style={loginButtonStyle}
          onMouseEnter={() => setHoverLogin(true)}
          onMouseLeave={() => setHoverLogin(false)}
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Log In"}
        </button>

        <button
          type="button"
          style={guestButtonStyle}
          onClick={handleContinueAsGuest}
          onMouseEnter={() => setHoverGuest(true)}
          onMouseLeave={() => setHoverGuest(false)}
        >
          Continue as Guest
        </button>

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
            About
          </a>
        </div>
      </footer>
    </div>
  );
}

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
    padding: 0,
    fontWeight: "600",
  },
  divider: {
    color: "#764ba2",
    fontWeight: "600",
  },
  footer: {
    marginTop: "30px",
    color: "white",
    fontSize: "12px",
    textAlign: "center",
  },
  footerText: {
    marginBottom: "6px",
  },
  footerLinks: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  footerLink: {
    color: "white",
    textDecoration: "none",
    fontWeight: "600",
  },
  footerDivider: {
    color: "white",
  },
};
