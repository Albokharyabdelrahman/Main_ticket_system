import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import './home.css';

// Import your images
import event1 from "../assets/event1.jpg";
import event2 from "../assets/event2.jpg";
import event3 from "../assets/event3.jpg";
import event4 from "../assets/event4.jpg";

export default function Home() {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Image array for the carousel
  const carouselImages = [
    {
      src: event1,
      alt: "Music concert with crowd",
      caption: "Experience live music like never before"
    },
    {
      src: event2,
      alt: "Conference speakers",
      caption: "Learn from industry leaders"
    },
    {
      src: event3,
      alt: "Food festival",
      caption: "Taste culinary delights from around the world"
    },
    {
      src: event4,
      alt: "Art exhibition",
      caption: "Discover amazing artworks"
    }
  ];

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // Define styles object for the footer
  const styles = {
    footer: {
      padding: "25px 40px",
      backgroundColor: "#3f51b5",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "white",
      fontSize: "14px",
    },
    footerText: {
      margin: 0,
    },
    footerLinks: {
      display: "flex",
      gap: "15px",
      alignItems: "center",
    },
    footerLink: {
      color: "white",
      textDecoration: "none",
      display: "flex",
      alignItems: "center",
      gap: "5px",
      transition: "opacity 0.2s ease",
    },
    footerDivider: {
      color: "white",
    },
  };

  return (
    <div className="home-wrapper">
      {/* Clean White Header */}
      <header className="main-header">
        <div className="header-container">
          <div className="logo-container">
            <img src={logo} alt="BookedIn Logo" className="header-logo" />
            <span className="brand-name">BookedIn</span>
          </div>

          <div className="header-actions">
            <a href="/login" className="header-button">Login</a>
            <a href="/register" className="header-button primary">Register</a>
          </div>
        </div>
      </header>

      <div className="home-container">
        <div className="home-header" style={{ paddingTop: '30px' }}>
          <h1 className="home-title">
            Discover <span className="highlight">Amazing</span> Events
          </h1>
          <p className="home-tagline">Find and book tickets to the best events in your city</p>
        </div>

        <div className="home-content">
          {/* Image Carousel - Size controlled by CSS variables */}
          <div className="right-side">
            <div className="image-carousel">
              {carouselImages.map((image, index) => (
                <div 
                  key={index}
                  className={`carousel-image ${index === currentImageIndex ? 'active' : ''}`}
                  style={{ backgroundImage: `url(${image.src})` }}
                >
                  <div className="carousel-caption">
                    <p>{image.caption}</p>
                  </div>
                </div>
              ))}
              <div className="carousel-dots">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>
            
            {/* Improved Explore Button */}
            <button
              onClick={() => navigate("/public-event")}
              className="explore-btn"
            >
              <span className="explore-text">Explore All Events</span>
              <span className="explore-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.4697 8.53033C13.1768 8.23744 13.1768 7.76256 13.4697 7.46967C13.7626 7.17678 14.2374 7.17678 14.5303 7.46967L18.5303 11.4697C18.8232 11.7626 18.8232 12.2374 18.5303 12.5303L14.5303 16.5303C14.2374 16.8232 13.7626 16.8232 13.4697 16.5303C13.1768 16.2374 13.1768 15.7626 13.4697 15.4697L16.1893 12.75H6.5C6.08579 12.75 5.75 12.4142 5.75 12C5.75 11.5858 6.08579 11.25 6.5 11.25H16.1893L13.4697 8.53033Z" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>

  <footer className="custom-footer">
  <p className="footer-text">© 2025 BookedIn. All rights reserved.</p>
  <div className="footer-links">
    <Link to="/contact" className="footer-link">Contact</Link>
    <span className="footer-divider">|</span>
    <Link to="/privacy" className="footer-link">Privacy</Link>
    <span className="footer-divider">|</span>
    <Link to="/about" className="footer-link">About</Link>
  </div>
</footer>

    </div>
  );
}