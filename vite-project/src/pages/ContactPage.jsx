import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const ContactPage = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

const handleSubmit = (e) => {
  e.preventDefault();
  setSubmitted(true);

  setTimeout(() => {
    setSubmitted(false);
    navigate(-1); // Redirect after 2 seconds
  }, 2000);
};


  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          ← Back
        </button>
        <img src={logo} alt="BookedIn Logo" style={styles.logo} />
      </header>

      <main style={styles.mainContent}>
        <h1 style={styles.title}>Contact Us</h1>

        <div style={styles.contactCard}>
          <h2 style={styles.cardTitle}>📩 Get in Touch</h2>
          <p style={styles.cardText}>
            Have questions or feedback? We'd love to hear from you!
          </p>

          <div style={styles.contactInfo}>
            <div style={styles.contactItem}>
              <span style={styles.contactIcon}>📧</span>
              <span>Email: support@bookedin.com</span>
            </div>
            <div style={styles.contactItem}>
              <span style={styles.contactIcon}>📞</span>
              <span>Phone: +1 (555) 123-4567</span>
            </div>
            <div style={styles.contactItem}>
              <span style={styles.contactIcon}>🏢</span>
              <span>Address: 123 Event Street, Showtown, ST 12345</span>
            </div>
          </div>

          <form style={styles.contactForm} onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label htmlFor="name" style={styles.formLabel}>Name</label>
              <input
                type="text"
                id="name"
                style={styles.formInput}
                placeholder="Your name"
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.formLabel}>Email</label>
              <input
                type="email"
                id="email"
                style={styles.formInput}
                placeholder="Your email"
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="message" style={styles.formLabel}>Message</label>
              <textarea
                id="message"
                style={styles.formTextarea}
                placeholder="Your message"
                rows="5"
              />
            </div>
            <button type="submit" style={styles.submitButton}>
              Send Message
            </button>
            {submitted && (
              <p style={styles.confirmationMessage}>✅ Your message has been sent!</p>
            )}
          </form>
        </div>
      </main>

      <footer style={styles.footer}>
        <p style={styles.footerText}>© 2025 BookedIn. All rights reserved.</p>
      </footer>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    fontFamily: "'Poppins', sans-serif",
    background: "linear-gradient(135deg, #0f172a, #1e3a8a)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    backgroundColor: "linear-gradient(135deg, #0f172a, #1e3a8a)",
    color: "white",
  },
  backButton: {
    padding: "8px 16px",
    backgroundColor: "#1e3a8a",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    color: "white",
  },
  logo: {
    height: "40px",
  },
  mainContent: {
    flex: 1,
    padding: "40px",
    maxWidth: "800px",
    margin: "0 auto",
    width: "100%",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: "30px",
    textAlign: "center",
  },
  contactCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  cardTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  cardText: {
    fontSize: "16px",
    color: "#475569",
    marginBottom: "30px",
    lineHeight: "1.6",
  },
  contactInfo: {
    marginBottom: "30px",
    paddingBottom: "30px",
    borderBottom: "1px solid #e2e8f0",
  },
  contactItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "15px",
    fontSize: "16px",
    color: "#334155",
  },
  contactIcon: {
    fontSize: "20px",
  },
  contactForm: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  formLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#334155",
  },
  formInput: {
    padding: "12px 16px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "16px",
  },
  formTextarea: {
    padding: "12px 16px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "16px",
    resize: "vertical",
  },
  submitButton: {
    padding: "14px 24px",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    alignSelf: "flex-start",
  },
  confirmationMessage: {
    color: "#16a34a",
    fontWeight: "600",
    marginTop: "10px",
  },
  footer: {
    padding: "20px 40px",
    backgroundColor: "#0f172a",
    color:"linear-gradient(135deg, #0f172a, #1e3a8a)",
    textAlign: "center",
    fontSize: "14px",
  },
  footerText: {
    margin: 0,
  },
};

export default ContactPage;
