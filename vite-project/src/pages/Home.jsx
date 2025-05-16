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
        <h1 className="home-title">Welcome to Main Ticket System 🎟️</h1>
        <p className="home-description">
          Simplify your event ticketing experience. Whether you're an attendee,
          organizer, or administrator – our system provides secure, streamlined,
          and reliable event access and management.
        </p>

        <div className="home-buttons">
            <Link to="/login" className="home-button">Login</Link>
            <Link to="/register" className="home-button">Register</Link>
            <button onClick={() => navigate("/public-event")} className="explore-btn">
  Explore Event
</button>


            <Link to="/forgot-password" className="home-button">Forgot Password</Link>
        </div>


        <img src={communication} alt="Communication Graphic" className="home-image" />
      </div>

      <footer>
        &copy; {new Date().getFullYear()} Main Ticket System | Crafted with ❤️
      </footer>
    </>
  );
}
