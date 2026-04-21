import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import sportsImg from "../assets/category-sports.jpg";
import musicImg from "../assets/category-music.jpg";
import talksImg from "../assets/category-talks.jpg";
import comedyImg from "../assets/category-comedy.jpg";
import theatreImg from "../assets/category-theatre.jpg";
import { AuthContext } from "../context/AuthContext";
import "../App.css";

const CATEGORY_DATA = [
  { name: "Sports", image: sportsImg },
  { name: "Music", image: musicImg },
  { name: "Talks", image: talksImg },
  { name: "Comedy", image: comedyImg },
  { name: "Theatre", image: theatreImg },
];

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

const SearchIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="7" stroke="#888" strokeWidth="2"/>
    <path d="M20 20l-3-3" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export default function UserDashboard() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchInputRef = useRef();

  // Floating logo particles setup
  const numParticles = 18;
  const particles = Array.from({ length: numParticles });

  useEffect(() => {
    axios.get("http://localhost:7000/api/v1/events/future")
      .then(res => setEvents(res.data || []))
      .catch(() => setEvents([]));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:7000/api/v1/users/profile", { withCredentials: true })
      .then(res => setProfile(res.data.user))
      .catch(() => setProfile(null));
  }, []);

  // Event switching every 8 seconds (no fade)
  useEffect(() => {
    if (events.length === 0) return;
    const interval = setInterval(() => {
      setCurrentEventIndex(idx => (idx + 1) % events.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [events]);

  // Category counts
  useEffect(() => {
    const catCounts = {};
    CATEGORY_DATA.forEach(cat => {
      catCounts[cat.name] = events.filter(e => (e.category || '').toLowerCase() === cat.name.toLowerCase()).length;
    });
    setCategoryCounts(catCounts);
  }, [events]);

  // Live search logic (optional, can be removed if not needed)
  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    const filtered = events.filter(e => {
      const term = searchTerm.toLowerCase();
      return (
        (e.title && e.title.toLowerCase().includes(term)) ||
        (e.location && e.location.toLowerCase().includes(term)) ||
        (e.category && e.category.toLowerCase().includes(term))
        );
    });
    setSearchResults(filtered.slice(0, 6));
    setShowDropdown(filtered.length > 0);
  }, [searchTerm, events]);

  useEffect(() => {
    function handleClick(e) {
      if (searchInputRef.current && !searchInputRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Theme
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-purple', '#7c3aed');
    document.documentElement.style.setProperty('--secondary-purple', '#a78bfa');
    document.documentElement.style.setProperty('--accent-purple', '#c4b5fd');
    document.documentElement.style.setProperty('--glass-bg', 'rgba(124, 58, 237, 0.15)');
    document.documentElement.style.setProperty('--glass-border', 'rgba(124, 58, 237, 0.25)');
    document.documentElement.style.setProperty('--header-gradient', 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)');
  }, []);

  // Floating ticket animation
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes ticketFloat {
        0% { transform: translateY(0) scale(1) rotate(-8deg); opacity: 0.22; }
        100% { transform: translateY(-30px) scale(1.08) rotate(8deg); opacity: 0.28; }
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const featured = events[currentEventIndex] || {};
  const eventDate = featured.date ? new Date(featured.date) : null;

  // User action buttons
  const userButtons = [
    { label: "Book Tickets", onClick: () => navigate("/book-tickets") },
    { label: "View My Bookings", onClick: () => navigate("/my-bookings") },
    { label: "Find Booking", onClick: () => navigate("/find-booking") },
  ];

  return (
    <div className="home-wrapper home-bg-white" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', background: '#fff' }}>
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
      {/* Header from Home with search bar, profile, and welcome message */}
      <header className="modern-header">
        <div className="modern-header-inner">
          <div className="modern-header-left">
            <img src={logo} alt="BookedIn Logo" className="modern-header-logo" />
            <span className="modern-header-brand">BookedIn</span>
          </div>
          <div className="modern-header-center">
            <div className="modern-header-search" ref={searchInputRef} style={{ position: 'relative' }}>
              <SearchIcon />
              <input
                type="text"
                placeholder="Search for events..."
                className="modern-header-search-input"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                autoComplete="off"
                style={{ zIndex: 20 }}
              />
              {showDropdown && (
                <div style={{
                  position: 'absolute',
                  top: 38,
                  left: 0,
                  width: '100%',
                  background: 'rgba(255,255,255,0.98)',
                  borderRadius: 16,
                  boxShadow: '0 4px 24px #a78bfa22',
                  zIndex: 30,
                  padding: '0.5rem 0',
                  border: '1.5px solid #a78bfa33',
                  maxHeight: 320,
                  overflowY: 'auto',
                }}>
                  {searchResults.map(ev => (
                    <div
                      key={ev._id}
                      onClick={() => { setShowDropdown(false); setSearchTerm(""); navigate(`/event/${ev._id}`); }}
                      style={{
                        padding: '0.7rem 1.2rem',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        borderBottom: '1px solid #f3e8ff',
                        transition: 'background 0.15s',
                      }}
                      onMouseDown={e => e.preventDefault()}
                      onMouseOver={e => e.currentTarget.style.background = '#f3e8ff'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ fontWeight: 600, color: '#7c3aed', fontSize: 16 }}>{ev.title}</span>
                      <span style={{ color: '#666', fontSize: 13 }}>{ev.location} {ev.date ? '| ' + new Date(ev.date).toLocaleDateString() : ''}</span>
                    </div>
                  ))}
                  {searchResults.length === 0 && (
                    <div style={{ padding: '0.7rem 1.2rem', color: '#aaa', fontSize: 15 }}>No results found.</div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="modern-header-right" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            {/* Profile picture clickable */}
            {profile && profile.profilePic ? (
              <img
                src={profile.profilePic}
                alt="Profile"
                style={{ width: 70, height: 70, borderRadius: '50%', objectFit: 'cover', border: '3px solid #a78bfa', background: '#fff', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
                onClick={() => navigate('/profile')}
                onMouseOver={e => e.currentTarget.style.boxShadow = '0 0 0 4px #a78bfa44'}
                onMouseOut={e => e.currentTarget.style.boxShadow = ''}
              />
            ) : (
              <div
                style={{ width: 70, height: 70, borderRadius: '50%', background: '#ede9fe', color: '#7c3aed', fontSize: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
                onClick={() => navigate('/profile')}
                onMouseOver={e => e.currentTarget.style.boxShadow = '0 0 0 4px #a78bfa44'}
                onMouseOut={e => e.currentTarget.style.boxShadow = ''}
              >👤</div>
            )}
            {/* User name clickable */}
            <span
              style={{ color: '#7c3aed', fontWeight: 700, fontSize: 20, cursor: 'pointer', transition: 'text-shadow 0.2s' }}
              onClick={() => navigate('/profile')}
              onMouseOver={e => e.currentTarget.style.textShadow = '0 2px 8px #a78bfa44'}
              onMouseOut={e => e.currentTarget.style.textShadow = ''}
            >{profile?.name || 'User'}</span>
            <button onClick={() => { logout(); localStorage.removeItem("token"); window.location.href = "/login"; }} style={{ background: 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)', color: '#fff', border: 'none', borderRadius: 14, padding: '12px 32px', fontWeight: 700, fontSize: 16, boxShadow: '0 2px 8px #a78bfa22', cursor: 'pointer', transition: 'background 0.2s', minWidth: 120 }}>Log Out</button>
          </div>
        </div>
      </header>
      {/* Welcome message below header */}
      <div style={{ textAlign: 'center', marginTop: 18, marginBottom: 8 }}>
        <span style={{ color: '#7c3aed', fontWeight: 800, fontSize: 28, letterSpacing: 0.2 }}>Welcome{profile ? `, ${profile.name}` : ''}!</span>
      </div>
      {/* User action buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 18, margin: '32px 0 24px 0', flexWrap: 'wrap' }}>
        {userButtons.map(btn => (
          <button
            key={btn.label}
            onClick={btn.onClick}
            className="refined-book-btn"
            style={{
              background: 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)',
              color: '#fff',
              padding: '1.35rem 3.2rem',
              fontSize: '1.35rem',
              minWidth: 240,
              borderRadius: '2.5rem',
              fontWeight: 700,
              boxShadow: '0 4px 16px #a78bfa33',
              margin: '0 4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>
      {/* Hero Event Section */}
      {featured && featured.title && (
        <section className="hero-glassy-card hero-glassy-card-home refined-hero" style={{ maxWidth: '1100px', minHeight: '500px', width: '1100px', height: '340px', margin: '0 auto', display: 'flex', alignItems: 'stretch', overflow: 'hidden', position: 'relative' }}>
          <div className="hero-info-card">
            <h1 className="hero-title refined-title">{featured.title}</h1>
            <div className="hero-meta refined-meta">
              {eventDate && (
                <>
                  <span>{eventDate.toLocaleString('en-US', { month: 'short', day: '2-digit' })} | {eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  <br />
                  <span>{featured.location}</span>
                </>
              )}
            </div>
            <div className="refined-organizer-block">
              <span className="refined-organized-by">Organized by</span><br />
              <div className="refined-organizer-row">
                {featured.organizerProfilePic ? (
                  <img
                    src={featured.organizerProfilePic}
                    alt="Organizer profile"
                    className="refined-organizer-profile"
                    style={{ width: '140px', height: '60px', objectFit: 'cover', borderRadius: '1rem', background: '#fff' }}
                  />
                ) : null}
              </div>
            </div>
            <div className="refined-hero-btns">
              <button
                className="refined-book-btn"
                onClick={() => navigate(`/event/${featured._id}`)}
                style={{
                  background: 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)',
                  color: '#fff',
                }}
              >
                <span className="refined-book-btn-icon">🎟️</span> View Details
              </button>
            </div>
          </div>
          <div className="hero-image-container hero-image-container-home refined-image-container">
            {featured.image ? (
              <img src={featured.image} alt={featured.title} className="hero-image refined-hero-image" />
            ) : (
              <img src={logo} alt="BookedIn" className="hero-image refined-hero-image" style={{ objectFit: "contain", background: "#f6f6f6" }} />
            )}
          </div>
        </section>
      )}
      {/* Upcoming Events Section */}
      <section className="upcoming-events-section">
        <h2 className="upcoming-events-title">Upcoming Events</h2>
        <div className="upcoming-events-carousel">
          <button className="carousel-arrow" onClick={() => setCurrentEventIndex(idx => Math.max(0, idx - 1))} disabled={currentEventIndex === 0}>&larr;</button>
          <div className="upcoming-events-cards">
            {events.slice(currentEventIndex, currentEventIndex + 3).map(event => {
              const eventDate = event.date ? new Date(event.date) : null;
              return (
                <div className="upcoming-event-card" key={event._id} onClick={() => navigate(`/event/${event._id}`)} style={{ cursor: 'pointer' }}>
                  <div className="upcoming-event-image-wrapper">
                    {event.image ? (
                      <img src={event.image} alt={event.title} className="upcoming-event-image" />
                    ) : (
                      <div className="upcoming-event-image-fallback" />
                    )}
                  </div>
                  <div className="upcoming-event-info">
                    <div className="upcoming-event-title">{event.title}</div>
                    <div className="upcoming-event-date">
                      {eventDate && eventDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      {eventDate && ' | ' + eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="upcoming-event-location">{event.location}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="carousel-arrow" onClick={() => setCurrentEventIndex(idx => Math.min(events.length - 3, idx + 1))} disabled={currentEventIndex >= events.length - 3}>&rarr;</button>
        </div>
        <div className="upcoming-events-explore-btn-wrapper">
          <button className="upcoming-events-explore-btn" onClick={() => navigate("/book-tickets")}>Explore All Events</button>
        </div>
      </section>
      {/* Top Categories Section (limit to 4 cards) */}
      <section className="top-categories-section">
        <h2 className="top-categories-title">Explore Top Categories For Fun Things To Do</h2>
        <div className="top-categories-carousel">
          {CATEGORY_DATA.slice(0, 4).map(cat => (
            <div className="top-category-card" key={cat.name} onClick={() => navigate(`/events/category/${encodeURIComponent(cat.name)}`)}>
              <div className="top-category-image-wrapper">
                <img src={cat.image} alt={cat.name} className="top-category-image" />
              </div>
              <div className="top-category-info">
                <div className="top-category-name">{cat.name}</div>
                <div className="top-category-count">{categoryCounts[cat.name] || 0} Events</div>
                <span className="top-category-arrow">&rarr;</span>
              </div>
            </div>
          ))}
          </div>
      </section>
      {/* Footer (modern glassy, same as Home) */}
      <div className="footer-glassy-outer">
        <footer className="footer-glassy-purple">
          <div className="footer-glassy-inner">
            <div className="footer-glassy-brand">
              BookedIn
              <div className="footer-glassy-slogan">click.book.enjoy</div>
            </div>
            <div className="footer-glassy-links">
              <div className="footer-glassy-col">
                <a href="/public-event">All Tickets on Sale</a>
                <a href="/public-event">Hot Events</a>
              </div>
              <div className="footer-glassy-col">
                <a href="/about">About Us</a>
                <a href="/contact">Contact Us</a>
                <a href="/policies">Policies</a>
                <a href="/privacy">Privacy Policy</a>
                <a href="/faqs">FAQs</a>
              </div>
            </div>
            <a href="/contact" className="footer-glassy-help-btn">
              <span className="footer-glassy-help-icon">?</span>
              <span className="footer-glassy-help-text">Need some help? Contact us</span>
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}