import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import './home.css';

import event1 from "../assets/event1.jpg";
import event2 from "../assets/conference.jpg";
import event3 from "../assets/event3.jpg";
import event4 from "../assets/event4.jpg";
import event5 from "../assets/event5.jpg";
import event6 from "../assets/event6.jpeg";

export default function Home() {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLogoHovering, setIsLogoHovering] = useState(false);
  const [isMainLogoHovering, setIsMainLogoHovering] = useState(false);

  const carouselImages = [
    { src: event1, alt: "Music concert", caption: "Experience live music like never before" },
    { src: event2, alt: "Conference", caption: "Learn from industry leaders" },
    { src: event6, alt: "Stadium", caption: "Join the excitement of live sports" },
    { src: event3, alt: "Food festival", caption: "Taste culinary delights from around the world" },
    { src: event4, alt: "Performance", caption: "Enjoy a night of unforgettable performances" },
    { src: event5, alt: "Football", caption: "Cheer for your favorite team" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  return (
    <div className="home-wrapper">
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: Math.random() * 0.5 + 0.3
          }} />
        ))}
      </div>

      <header className="main-header">
        <div className="header-container">
          <div className="logo-container"
            onMouseEnter={() => setIsLogoHovering(true)}
            onMouseLeave={() => setIsLogoHovering(false)}>
            <img
              src={logo}
              alt="BookedIn Logo"
              className={`header-logo ${isLogoHovering ? 'spin' : ''}`}
            />
            <span className="brand-name">
              {"BookedIn".split("").map((char, i) => (
                <span key={i} className="letter-bounce">{char}</span>
              ))}
            </span>
          </div>

          <div className="header-actions">
            <a href="/login" className="header-button hover-scale">Login</a>
            <a href="/register" className="header-button primary hover-scale">Register</a>
          </div>
        </div>
      </header>

      <div className="home-container" style={{ paddingTop: "4rem", paddingBottom: "1rem" }}>
        <div className="main-logo-container" style={{ width: "100px", height: "100px" }}
          onMouseEnter={() => setIsMainLogoHovering(true)}
          onMouseLeave={() => setIsMainLogoHovering(false)}>
          <img
            src={logo}
            alt="BookedIn Logo"
            className={`main-logo ${isMainLogoHovering ? 'pulse' : 'float'}`}
          />
          <div className="logo-orbits">
            <div className="orbit orbit-1"></div>
            <div className="orbit orbit-2"></div>
            <div className="orbit orbit-3"></div>
          </div>
        </div>

        <div className="home-header" style={{ marginBottom: "2rem" }}>
          <h1 className="home-title" style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
            <span className="title-word title-word-1">BookedIn</span>
          </h1>
          <p className="home-tagline typing-animation">Click.Book.Enjoy</p>
        </div>

        <div className="home-content">
          <div className="right-side">
            <div className="card-carousel-wrapper" style={{ marginBottom: "2rem" }}>
              <div className="card-carousel">
                {carouselImages.map((image, index) => (
                  <div
                    key={index}
                    className={`carousel-card ${index === currentImageIndex ? 'active' : ''} 
                      ${index < currentImageIndex ? 'prev' : ''} 
                      ${index > currentImageIndex ? 'next' : ''}`}
                    style={{ backgroundImage: `url(${image.src})` }}
                  >
                    <div className="card-content">
                      <div className="card-caption">
                        <p>{image.caption}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="carousel-dots">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate("/public-event")}
              className="explore-btn hover-grow"
            >
              <span className="explore-text">Explore All Events</span>
              <span className="explore-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.4697 8.53033C13.1768 8.23744 13.1768 7.76256 13.4697 7.46967C13.7626 7.17678 14.2374 7.17678 14.5303 7.46967L18.5303 11.4697C18.8232 11.7626 18.8232 12.2374 18.5303 12.5303L14.5303 16.5303C14.2374 16.8232 13.7626 16.8232 13.4697 16.5303C13.1768 16.2374 13.1768 15.7626 13.4697 15.4697L16.1893 12.75H6.5C6.08579 12.75 5.75 12.4142 5.75 12C5.75 11.5858 6.08579 11.25 6.5 11.25H16.1893L13.4697 8.53033Z" />
                </svg>
              </span>
              <span className="btn-particles">
                {[...Array(8)].map((_, i) => (
                  <span key={i} className="btn-particle" />
                ))}
              </span>
            </button>
          </div>
        </div>
      </div>

      <footer className="custom-footer">
        <p className="footer-text">© 2025 BookedIn. All rights reserved.</p>
        <div className="footer-links">
          <Link to="/contact" className="footer-link hover-underline">Contact</Link>
          <span className="footer-divider">•</span>
          <Link to="/privacy" className="footer-link hover-underline">Privacy</Link>
          <span className="footer-divider">•</span>
          <Link to="/about" className="footer-link hover-underline">About</Link>
        </div>
      </footer>
    </div>
  );
}
