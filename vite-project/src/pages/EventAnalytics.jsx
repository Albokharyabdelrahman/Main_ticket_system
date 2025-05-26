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

  return (
    <div style={styles.container}>
      <img
        src={logo}
        alt="Logo"
        style={styles.logo}
        onClick={() => navigate(-1)}
      />

      <h1 style={styles.title}>Event Analytics</h1>

      {loading && <Spinner />}
      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.grid}>
        {analytics.map((event) => (
          <div key={event.eventId} style={styles.card}>
            <h2 style={styles.cardTitle}>{event.title}</h2>

            <div style={styles.chartWrapper}>
              <div style={styles.chartBox}>
                <h4 style={styles.chartLabel}>Revenue</h4>
                <Bar
                  data={{
                    labels: ["Revenue"],
                    datasets: [
                      {
                        label: "EGP",
                        data: [event.revenue],
                        backgroundColor: "#f97316",
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
                <h4 style={styles.chartLabel}>% Booked</h4>
                <Pie
                  data={{
                    labels: ["Booked", "Available"],
                    datasets: [
                      {
                        data: [
                          parseFloat(event.percentageBooked),
                          100 - parseFloat(event.percentageBooked),
                        ],
                        backgroundColor: ["#10b981", "#e5e7eb"],
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
  );
};

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "'Inter', sans-serif",
    background: "linear-gradient(135deg, #434190, #2c2e8f)",
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
    border: "6px solid #f3f3f3",
    borderTop: "6px solid #f97316",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    animation: "spin 1s linear infinite",
  },
};

export default EventAnalytics;
