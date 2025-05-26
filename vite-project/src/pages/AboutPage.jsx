import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const AboutPage = () => {
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
        <h1 style={styles.title}>About BookedIn</h1>

        <div style={styles.aboutCard}>
          <div style={styles.heroSection}>
            <h2 style={styles.heroTitle}>Your Gateway to Unforgettable Events</h2>
            <p style={styles.heroText}>
              BookedIn is the premier platform for discovering and booking tickets 
              to the most exciting events in your city and beyond.
            </p>
          </div>

          <div style={styles.missionSection}>
            <h2 style={styles.sectionTitle}>Our Mission</h2>
            <p style={styles.sectionText}>
              We believe everyone should have access to amazing experiences. Our mission 
              is to connect people with events that inspire, entertain, and create 
              lasting memories.
            </p>
          </div>

          <div style={styles.featuresSection}>
            <h2 style={styles.sectionTitle}>Why Choose BookedIn?</h2>
            <div style={styles.featuresGrid}>
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>🎯</div>
                <h3 style={styles.featureTitle}>Curated Selection</h3>
                <p style={styles.featureText}>
                  We handpick the best events so you don't have to.
                </p>
              </div>
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>⚡</div>
                <h3 style={styles.featureTitle}>Instant Booking</h3>
                <p style={styles.featureText}>
                  Secure your tickets in just a few clicks.
                </p>
              </div>
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>🔒</div>
                <h3 style={styles.featureTitle}>Secure Payments</h3>
                <p style={styles.featureText}>
                  Your transactions are always protected.
                </p>
              </div>
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>📱</div>
                <h3 style={styles.featureTitle}>Mobile Friendly</h3>
                <p style={styles.featureText}>
                  Book on the go with our optimized platform.
                </p>
              </div>
            </div>
          </div>

          <div style={styles.teamSection}>
            <h2 style={styles.sectionTitle}>Our Team</h2>
            <p style={styles.sectionText}>
              We're a passionate group of event enthusiasts, tech experts, and customer 
              service professionals dedicated to making your event experience seamless.
            </p>
          </div>
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
    maxWidth: "1000px",
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
  aboutCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "40px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  heroSection: {
    textAlign: "center",
    marginBottom: "40px",
    paddingBottom: "40px",
    borderBottom: "1px solid #e2e8f0",
  },
  heroTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#4f46e5",
    marginBottom: "20px",
  },
  heroText: {
    fontSize: "18px",
    color: "#475569",
    lineHeight: "1.6",
    maxWidth: "700px",
    margin: "0 auto",
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "20px",
  },
  sectionText: {
    fontSize: "16px",
    color: "#475569",
    lineHeight: "1.6",
    marginBottom: "30px",
  },
  featuresSection: {
    marginBottom: "40px",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginTop: "30px",
  },
  featureCard: {
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    padding: "25px",
    textAlign: "center",
  },
  featureIcon: {
    fontSize: "40px",
    marginBottom: "15px",
  },
  featureTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "10px",
  },
  featureText: {
    fontSize: "14px",
    color: "#64748b",
    lineHeight: "1.5",
  },
  teamSection: {
    paddingTop: "40px",
    borderTop: "1px solid #e2e8f0",
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

export default AboutPage;
