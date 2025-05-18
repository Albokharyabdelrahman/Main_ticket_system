import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = "http://localhost:7000/api/v1/events";

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setEvents(response.data);
    } catch (err) {
      setError("Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const updateEventStatus = async (eventId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE}/${eventId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      fetchEvents(); // refresh list
    } catch (err) {
      alert("Failed to update event status.");
    }
  };

  const filteredEvents =
    filter === "all" ? events : events.filter((e) => e.status === filter);

  return (
    <>
      <style>{`
        .container {
          background: linear-gradient(135deg, #434190, #2c2e8f);
          min-height: 100vh;
          padding: 40px 20px 60px;
          font-family: 'Poppins', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          color: white;
          position: relative;
        }

        .back-button {
          position: absolute;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #ff9800, #ff7043);
          color: white;
          padding: 10px 18px;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(255, 152, 0, 0.7);
        }

        h1 {
          font-weight: 700;
          font-size: 2.2rem;
          margin-bottom: 20px;
        }

        .filter-container {
          margin-bottom: 25px;
          width: 100%;
          max-width: 900px;
          display: flex;
          justify-content: flex-start;
          gap: 15px;
        }

        select {
          padding: 10px 15px;
          font-size: 1rem;
          border-radius: 8px;
          border: none;
        }

        table {
          width: 100%;
          max-width: 900px;
          border-collapse: separate;
          border-spacing: 0 10px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          background: white;
          border-radius: 12px;
          overflow: hidden;
          color: #333;
        }

        thead tr {
          background:linear-gradient(135deg, #ff9800, #ff7043);
          color: white;
          font-weight: 600;
        }

        th, td {
          padding: 12px 20px;
        }

        tbody tr {
          background: #fff;
          border-radius: 8px;
        }

        button {
          padding: 8px 14px;
          border-radius: 6px;
          border: none;
          font-weight: 600;
          cursor: pointer;
        }

        .approve-btn {
          background-color: #2196f3; /* blue */
          color: white;
          margin-right: 10px;
        }

        .decline-btn {
          background-color: #ff9800; /* orange */
          color: white;
        }

        .no-events {
          padding: 30px 0;
          text-align: center;
          color: #fff;
          font-size: 1.1rem;
          font-weight: 600;
        }
      `}</style>

      <div className="container">
        <button className="back-button" onClick={() => window.history.back()}>
          ← Back
        </button>

        <h1>Admin Events Management</h1>

        <div className="filter-container">
          <label htmlFor="status-filter">Filter by status: </label>
          <select
            id="status-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="declined">Declined</option>
          </select>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="no-events">No events found.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event._id}>
                  <td>{event.title}</td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>{event.status}</td>
                  <td>
                    <button
                      className="approve-btn"
                      onClick={() =>
                        updateEventStatus(event._id, "approved")
                      }
                      disabled={event.status === "approved"}
                    >
                      Approve
                    </button>
                    <button
                      className="decline-btn"
                      onClick={() =>
                        updateEventStatus(event._id, "declined")
                      }
                      disabled={event.status === "declined"}
                    >
                      Decline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default AdminEventsPage;
