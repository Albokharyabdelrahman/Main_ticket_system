import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "./logo.png"; // Adjust path as needed

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:7000/api/v1/users/bookings",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.error ||
            err.response?.data?.message ||
            "Failed to fetch bookings."
        );
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleDelete = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:7000/api/v1/bookings/${bookingId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      alert(response.data.message || "Booking cancelled successfully");
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
    } catch (err) {
      alert(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to cancel booking."
      );
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const event = booking.eventId || {};
    const matchesSearch = event.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
        .container {
          background: linear-gradient(135deg, #667eea, #764ba2);
          min-height: 100vh;
          padding: 50px 30px 30px;
          font-family: 'Poppins', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          color: white;
        }
        h1 {
          color: white;
          font-weight: 700;
          font-size: 2rem;
          margin-bottom: 30px;
          user-select: none;
        }
        .logo {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 100px;
          height: auto;
          cursor: pointer;
        }
        .filter-container {
          margin-bottom: 20px;
          display: flex;
          gap: 15px;
          width: 100%;
          max-width: 1100px;
          justify-content: flex-start;
        }
        .search-input, .status-select {
          font-size: 1rem;
          padding: 8px 12px;
          border-radius: 6px;
          border: none;
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          outline: none;
          color: #333;
          background: #f0ebff;
          transition: background 0.3s ease;
        }
        .search-input:focus, .status-select:focus {
          background: white;
          box-shadow: 0 0 6px rgba(102, 126, 234, 0.8);
        }
        .bookings-table {
          width: 100%;
          max-width: 1100px;
          border-collapse: separate;
          border-spacing: 0;
          background: white;
          border-radius: 12px;
          box-shadow: 0 5px 18px rgba(0,0,0,0.12);
          overflow: hidden;
          color: #333;
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
        }
        .bookings-table th, .bookings-table td {
          border-bottom: 1px solid rgba(102,126,234,0.15);
          border-right: 1px solid rgba(102,126,234,0.15);
          padding: 14px 18px;
          text-align: left;
          vertical-align: middle;
        }
        .bookings-table th:last-child,
        .bookings-table td:last-child {
          border-right: none;
        }
        .bookings-table tbody tr:last-child td {
          border-bottom: none;
        }
        .bookings-table th {
          background: linear-gradient(135deg, #6b46c1, #553c9a);
          color: white;
          font-weight: 600;
          font-size: 1.05rem;
          user-select: none;
        }
        .bookings-table tbody tr:hover {
          background-color: #f0ebff;
        }
        .no-bookings {
          text-align: center;
          padding: 40px 0;
          color: white;
          font-weight: 600;
          font-size: 1.2rem;
        }
        .error-message {
          color: #ff6b6b;
          font-weight: 600;
          margin-bottom: 20px;
        }
        .loading-message {
          color: white;
          font-weight: 600;
          margin-bottom: 20px;
        }
        .delete-btn {
          background: linear-gradient(135deg, #5a67d8, #434190);
          color: white;
          border: none;
          padding: 6px 14px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.3s ease;
          white-space: nowrap;
        }
        .delete-btn:hover {
          background: linear-gradient(135deg, #434190, #2c2e8f);
        }
      `}</style>

      <div className="container">
        <img
          src={logo}
          alt="Logo"
          className="logo"
          onClick={() => navigate("/UserDashboard")}
        />
        <h1>My Bookings</h1>

        <div className="filter-container">
          <input
            type="text"
            placeholder="Search by event name..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="status-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {loading && <div className="loading-message">Loading bookings...</div>}
        {error && <div className="error-message">{error}</div>}

        {!loading && !error && (
          <>
            {filteredBookings.length === 0 ? (
              <div className="no-bookings">No bookings found.</div>
            ) : (
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>Event Name</th>
                    <th>Status</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Tickets Booked</th>
                    <th>Total Price ($)</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => {
                    const event = booking.eventId || {};
                    const eventDate = event.date ? new Date(event.date) : null;
                    return (
                      <tr key={booking._id}>
                        <td>{event.title || "N/A"}</td>
                        <td>{booking.status || "N/A"}</td>
                        <td>{event.location || "N/A"}</td>
                        <td>{eventDate ? eventDate.toLocaleDateString() : "N/A"}</td>
                        <td>
                          {eventDate
                            ? eventDate.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "N/A"}
                        </td>
                        <td>{booking.ticketsBooked}</td>
                        <td>{booking.totalPrice ? booking.totalPrice.toFixed(2) : "N/A"}</td>
                        <td>
                          {booking.status !== "Cancelled" && (
                            <button
                              className="delete-btn"
                              onClick={() => handleDelete(booking._id)}
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default MyBookings;
