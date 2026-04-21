import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import logo from "./logo.png";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const API_BASE_URL = "http://localhost:7000/api/v1/users";

const EventAnalytics = () => {
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/events/analytics`, {
          withCredentials: true,
        });
        if (res.data.analytics) {
          setAnalytics(res.data.analytics);
        } else {
          setError(res.data.message || "No analytics found.");
        }
      } catch (err) {
        setError("Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const Spinner = () => (
    <div style={styles.spinnerContainer}>
      <div style={styles.spinner}></div>
      <p>Loading analytics...</p>
    </div>
  );

  // Floating ticket positions (same as dashboard)
  const ticketPositions = [
    { top: 40, left: 60, size: 120, rot: -8, delay: 0 },
    { top: 120, left: 320, size: 100, rot: 12, delay: 1 },
    { top: 300, left: 180, size: 90, rot: 6, delay: 2 },
    { top: 500, left: 80, size: 110, rot: -10, delay: 3 },
    { top: 80, right: 120, size: 130, rot: 8, delay: 1.5 },
    { top: 260, right: 60, size: 100, rot: -6, delay: 2.5 },
    { bottom: 120, left: 200, size: 140, rot: 10, delay: 2 },
    { bottom: 60, right: 180, size: 110, rot: -12, delay: 3.5 },
    { bottom: 200, right: 60, size: 100, rot: 4, delay: 1.2 },
    { bottom: 40, left: 60, size: 120, rot: 0, delay: 2.8 },
    { top: 180, left: 600, size: 100, rot: 7, delay: 2.2 },
    { bottom: 300, right: 320, size: 90, rot: -7, delay: 1.7 },
    { top: 400, right: 400, size: 110, rot: 5, delay: 2.9 },
  ];

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes ticketFloat {
        0% { transform: translateY(0) scale(1) rotate(-8deg); opacity: 0.22; }
        100% { transform: translateY(-30px) scale(1.08) rotate(8deg); opacity: 0.28; }
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'Inter', sans-serif", position: 'relative', overflow: 'hidden' }}>
      {/* Floating ticket background */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
        {ticketPositions.map((pos, i) => (
          <img
            key={i}
            src={logo}
            alt="ticket"
            style={{
              position: 'absolute',
              opacity: 0.22,
              filter: 'blur(1.5px) drop-shadow(0 2px 12px #a78bfa88)',
              userSelect: 'none',
              zIndex: 0,
              pointerEvents: 'none',
              width: pos.size,
              height: 'auto',
              top: pos.top,
              left: pos.left,
              right: pos.right,
              bottom: pos.bottom,
              transform: `rotate(${pos.rot}deg)`,
              animation: 'ticketFloat 8s ease-in-out infinite alternate',
              animationDelay: `${pos.delay}s`,
            }}
            draggable={false}
          />
        ))}
      </div>
      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 1, padding: '2.5rem 2.5rem 2.5rem 2.5rem', maxWidth: '1400px', margin: '0 auto' }}>
        <img
          src={logo}
          alt="Logo"
          style={styles.logo}
          onClick={() => navigate(-1)}
        />
        <h1 style={{
          ...styles.title,
          background: 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textFillColor: 'transparent',
          textShadow: '0 4px 16px #a78bfa33',
        }}>Event Analytics</h1>
        {loading && <Spinner />}
        {error && <div style={styles.error}>{error}</div>}
        <div style={{ ...styles.grid, gap: '2.5rem', padding: '0 0 2rem 0' }}>
          {analytics.map((event, idx) => (
            <div key={event.eventId} style={{
              ...styles.card,
              background: 'rgba(124, 58, 237, 0.18)',
              border: '1.5px solid #a78bfa',
              boxShadow: '0 8px 32px 0 rgba(124, 58, 237, 0.18), 0 1.5px 8px #a78bfa44',
              backdropFilter: 'blur(14px)',
              color: '#fff',
            }}>
              <h2 style={{ ...styles.cardTitle, color: '#fff', textShadow: '0 2px 8px #a78bfa55' }}>{event.title}</h2>
              <div style={styles.chartWrapper}>
                <div style={styles.chartBox}>
                  <h4 style={{ ...styles.chartLabel, color: '#a78bfa' }}>Revenue</h4>
                  <Bar
                    data={{
                      labels: ["Revenue"],
                      datasets: [
                        {
                          label: "EGP",
                          data: [event.revenue],
                          backgroundColor: [
                            "#a78bfa",
                            "#7c3aed",
                            "#6366f1",
                            "#38bdf8"
                          ],
                          borderRadius: 8,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: { legend: { display: false } },
                      scales: {
                        y: { beginAtZero: true },
                      },
                    }}
                  />
                </div>
                <div style={styles.chartBox}>
                  <h4 style={{ ...styles.chartLabel, color: '#a78bfa' }}>% Booked</h4>
                  <Pie
                    data={{
                      labels: ["Booked", "Available"],
                      datasets: [
                        {
                          data: [
                            parseFloat(event.percentageBooked),
                            100 - parseFloat(event.percentageBooked),
                          ],
                          backgroundColor: [
                            "#a78bfa",
                            "#38bdf8"
                          ],
                          borderWidth: 2,
                          borderColor: '#fff',
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: { legend: { position: "bottom" } },
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "'Inter', sans-serif",
    background: "transparent",
    minHeight: "100vh",
    color: "white",
    position: "relative",
  },
  logo: {
    position: "absolute",
    top: 20,
    right: 20,
    width: "80px",
    height: "auto",
    cursor: "pointer",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "2rem",
    color: "#ffffff",
    textAlign: "center",
  },
  error: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    padding: "1rem",
    borderRadius: "0.5rem",
    marginBottom: "1rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    backgroundColor: "white",
    color: "#1e293b",
    padding: "1.5rem",
    borderRadius: "0.75rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    marginBottom: "1rem",
    color: "#1e293b",
  },
  chartWrapper: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  chartBox: {
    flex: "1 1 150px",
    minWidth: "150px",
    maxWidth: "200px",
  },
  chartLabel: {
    fontSize: "0.875rem",
    fontWeight: "500",
    marginBottom: "0.5rem",
    color: "#475569",
    textAlign: "center",
  },
  spinnerContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "200px",
  },
  spinner: {
    border: "6px solid #a78bfa",
    borderTop: "6px solid #7c3aed",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    animation: "spin 1s linear infinite",
  },
};

export default EventAnalytics;
