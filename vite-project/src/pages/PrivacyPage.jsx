import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const PrivacyPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          ← Back
        </button>
        <img src={logo} alt="BookedIn Logo" style={styles.logo} />
      </header>

      <main style={styles.mainContent}>
        <h1 style={styles.title}>Privacy Policy</h1>

        <div style={styles.contentCard}>
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>1. Information We Collect</h2>
            <p style={styles.sectionText}>
              We collect information you provide directly to us when you create an account, 
              purchase tickets, or contact us. This may include your name, email address, 
              payment information, and event preferences.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>2. How We Use Your Information</h2>
            <p style={styles.sectionText}>
              We use the information we collect to:
            </p>
            <ul style={styles.list}>
              <li>Process transactions and send you tickets</li>
              <li>Communicate with you about events and updates</li>
              <li>Improve our services and website</li>
              <li>Prevent fraud and ensure security</li>
              <li>Personalize your experience based on your preferences</li>
            </ul>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>3. Data Security</h2>
            <p style={styles.sectionText}>
              We implement appropriate security measures to protect your personal 
              information. All payment transactions are encrypted using SSL technology.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>4. Your Rights</h2>
            <p style={styles.sectionText}>
              You have the right to access, correct, or delete your personal information. 
              You can update your account details at any time through your profile settings.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>5. Changes to This Policy</h2>
            <p style={styles.sectionText}>
              We may update this Privacy Policy from time to time. We will notify you of 
              significant changes by posting the new policy on our website.
            </p>
          </section>

          <p style={styles.lastUpdated}>
            Last updated: {new Date().toLocaleDateString()}
          </p>
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
    backgroundColor: "transparent",
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
  contentCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "40px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  section: {
    marginBottom: "30px",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "15px",
  },
  sectionText: {
    fontSize: "16px",
    color: "#475569",
    lineHeight: "1.6",
    marginBottom: "15px",
  },
  list: {
    paddingLeft: "20px",
    margin: "15px 0",
    color: "#475569",
  },
  lastUpdated: {
    fontSize: "14px",
    color: "#64748b",
    textAlign: "right",
    marginTop: "40px",
    fontStyle: "italic",
  },
  footer: {
    padding: "20px 40px",
    backgroundColor: "transparent",
    color: "white",
    textAlign: "center",
    fontSize: "14px",
  },
  footerText: {
    margin: 0,
  },
};

export default PrivacyPage;
