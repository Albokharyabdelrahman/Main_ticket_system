import { Link, useNavigate } from "react-router-dom";
import communication from "../assets/communication.JPG";
import React from "react";
import './home.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <nav>
        <div>Main Ticket System</div>
        <div>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/forgot-password">Forgot Password</Link>
        </div>
      </nav>

      <div className="home-container">
        {/* Keep title and description on top */}
        <h1 className="glow-on-hover">WELCOME TO BOOKEDIN 🎟️</h1>
        <p className="home-description">
          Simplify your event ticketing experience. Whether you're an attendee,
          organizer, or administrator – our system provides secure, streamlined,
          and reliable event access and management.
        </p>

        <div className="home-content">
          {/* Left side: login, register, forgot password */}
          <div className="left-buttons">
            <Link to="/login" className="home-button">Login</Link>
            <Link to="/register" className="home-button">Register</Link>
            <Link to="/forgot-password" className="home-button">Forgot Password</Link>
          </div>

          {/* Right side: explore button + image */}
          <div className="right-side">
            <button
              onClick={() => navigate("/public-event")}
              className="explore-btn"
            >
              Explore Event
            </button>
            <img
              src={communication}
              alt="Communication Graphic"
              className="home-image"
            />
          </div>
        </div>
      </div>

      <footer>
        &copy; {new Date().getFullYear()} Main Ticket System | Crafted with ❤️
      </footer>
    </>
  );
}
