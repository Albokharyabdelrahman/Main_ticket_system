import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import logo from "../assets/logo.png";
import sportsImg from "../assets/category-sports.jpg";
import musicImg from "../assets/category-music.jpg";
import talksImg from "../assets/category-talks.jpg";
import comedyImg from "../assets/category-comedy.jpg";
import theatreImg from "../assets/category-theatre.jpg";
import { useEvents } from "../hooks/useEvents";
import "./home.css";

// Icons (SVG inline for globe/user)
const GlobeIcon = () => (
  <svg width="26" height="26" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#222" strokeWidth="1.7"/><ellipse cx="12" cy="12" rx="4.5" ry="10" stroke="#222" strokeWidth="1.7"/><path d="M2 12h20" stroke="#222" strokeWidth="1.7"/><path d="M4 6.5h16M4 17.5h16" stroke="#222" strokeWidth="1.2"/></svg>
);
const UserIcon = () => (
  <svg width="26" height="26" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="4" stroke="#222" strokeWidth="1.7"/><path d="M4 20c0-3.3137 3.134-6 7-6s7 2.6863 7 6" stroke="#222" strokeWidth="1.7"/></svg>
);
const SearchIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke="#888" strokeWidth="2"/><path d="M20 20l-3-3" stroke="#888" strokeWidth="2" strokeLinecap="round"/></svg>
);

// Loading skeleton component
const EventCardSkeleton = () => (
  <div className="upcoming-event-card" style={{ opacity: 0.7 }}>
    <div className="upcoming-event-image-wrapper">
      <div className="upcoming-event-image-fallback" style={{ 
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'loading 1.5s infinite'
      }} />
    </div>
    <div className="upcoming-event-info">
      <div style={{ height: '20px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '8px', animation: 'loading 1.5s infinite' }} />
      <div style={{ height: '16px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '8px', width: '60%', animation: 'loading 1.5s infinite' }} />
      <div style={{ height: '16px', background: '#f0f0f0', borderRadius: '4px', width: '80%', animation: 'loading 1.5s infinite' }} />
    </div>
  </div>
);

const HeroSkeleton = () => (
  <section className="hero-glassy-card hero-glassy-card-home refined-hero" style={{ maxWidth: '1100px', minHeight: '500px', width: '1100px', height: '340px', margin: '0 auto', display: 'flex', alignItems: 'stretch', overflow: 'hidden', position: 'relative' }}>
    <div className="hero-info-card">
      <div style={{ height: '40px', background: '#f0f0f0', borderRadius: '8px', marginBottom: '16px', width: '80%', animation: 'loading 1.5s infinite' }} />
      <div style={{ height: '20px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '8px', width: '60%', animation: 'loading 1.5s infinite' }} />
      <div style={{ height: '20px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '16px', width: '40%', animation: 'loading 1.5s infinite' }} />
      <div style={{ height: '60px', background: '#f0f0f0', borderRadius: '8px', marginBottom: '16px', width: '140px', animation: 'loading 1.5s infinite' }} />
      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ height: '40px', background: '#f0f0f0', borderRadius: '8px', width: '120px', animation: 'loading 1.5s infinite' }} />
        <div style={{ height: '40px', background: '#f0f0f0', borderRadius: '8px', width: '100px', animation: 'loading 1.5s infinite' }} />
      </div>
    </div>
    <div className="hero-image-container hero-image-container-home refined-image-container">
      <div style={{ 
        width: '100%', 
        height: '100%', 
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'loading 1.5s infinite'
      }} />
    </div>
  </section>
);

function UpcomingEvents({ events, loading }) {
  const [startIdx, setStartIdx] = useState(0);
  const cardsToShow = 3;
  const navigate = useNavigate();

  const handlePrev = () => {
    setStartIdx(idx => Math.max(0, idx - 1));
  };
  const handleNext = () => {
    setStartIdx(idx => Math.min(events.length - cardsToShow, idx + 1));
  };

  const visibleEvents = events.slice(startIdx, startIdx + cardsToShow);

  return (
    <section className="upcoming-events-section">
      <h2 className="upcoming-events-title">Upcoming Events</h2>
      <div className="upcoming-events-carousel">
        <button className="carousel-arrow" onClick={handlePrev} disabled={startIdx === 0}>&larr;</button>
        <div className="upcoming-events-cards">
          {loading ? (
            // Show skeleton loading
            Array.from({ length: cardsToShow }).map((_, index) => (
              <EventCardSkeleton key={index} />
            ))
          ) : (
            visibleEvents.map(event => {
              const eventDate = event.date ? new Date(event.date) : null;
              return (
                <div className="upcoming-event-card" key={event._id} onClick={() => navigate(`/public-event-details/${event._id}`)} style={{ cursor: 'pointer' }}>
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
            })
          )}
        </div>
        <button className="carousel-arrow" onClick={handleNext} disabled={startIdx >= events.length - cardsToShow}>&rarr;</button>
      </div>
      <div className="upcoming-events-explore-btn-wrapper">
        <a href="/public-event" className="upcoming-events-explore-btn">Explore All Events</a>
      </div>
    </section>
  );
}

const CATEGORY_DATA = [
  { name: "Sports", image: sportsImg },
  { name: "Music", image: musicImg },
  { name: "Talks", image: talksImg },
  { name: "Comedy", image: comedyImg },
  { name: "Theatre", image: theatreImg },
];

function TopCategories({ events, loading }) {
  const navigate = useNavigate();
  const [startIdx, setStartIdx] = useState(0);
  const cardsToShow = 4;

  // Memoize category counts to avoid recalculation
  const counts = useMemo(() => {
    if (loading || !events.length) return {};
    const catCounts = {};
    CATEGORY_DATA.forEach(cat => {
      catCounts[cat.name] = events.filter(e => (e.category || '').toLowerCase() === cat.name.toLowerCase()).length;
    });
    return catCounts;
  }, [events, loading]);

  const handlePrev = () => setStartIdx(idx => Math.max(0, idx - 1));
  const handleNext = () => setStartIdx(idx => Math.min(CATEGORY_DATA.length - cardsToShow, idx + 1));
  const visibleCategories = CATEGORY_DATA.slice(startIdx, startIdx + cardsToShow);

  return (
    <section className="top-categories-section">
      <h2 className="top-categories-title">Explore Top Categories For Fun Things To Do</h2>
      <div className="top-categories-carousel">
        <button className="carousel-arrow" onClick={handlePrev} disabled={startIdx === 0}>&larr;</button>
        <div className="top-categories-cards">
          {visibleCategories.map(cat => (
            <div className="top-category-card" key={cat.name} onClick={() => navigate(`/events/category/${encodeURIComponent(cat.name)}`)}>
              <div className="top-category-image-wrapper">
                <img src={cat.image} alt={cat.name} className="top-category-image" />
              </div>
              <div className="top-category-info">
                <div className="top-category-name">{cat.name}</div>
                <div className="top-category-count">
                  {loading ? (
                    <div style={{ 
                      height: '16px', 
                      background: '#f0f0f0', 
                      borderRadius: '4px', 
                      width: '60px',
                      animation: 'loading 1.5s infinite'
                    }} />
                  ) : (
                    `${counts[cat.name] || 0} Events`
                  )}
                </div>
                <span className="top-category-arrow">&rarr;</span>
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-arrow" onClick={handleNext} disabled={startIdx >= CATEGORY_DATA.length - cardsToShow}>&rarr;</button>
      </div>
    </section>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [organizerPic, setOrganizerPic] = useState(null);
  const [organizerPicLoading, setOrganizerPicLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchInputRef = useRef();

  // Use the optimized hook for fetching events
  const { events, loading, error } = useEvents('/future', {
    params: { limit: 20 } // Limit to 20 events for better performance
  });

  // Floating logo particles setup
  const numParticles = 18;
  const particles = Array.from({ length: numParticles });

  // Event switching every 8 seconds (no fade)
  useEffect(() => {
    if (events.length === 0) return;
    const interval = setInterval(() => {
      setCurrentEventIndex(idx => (idx + 1) % events.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [events]);

  // Fetch organizer profile picture if not present
  useEffect(() => {
    const featured = events[currentEventIndex] || {};
    // Organizer profile pic logic
    if (featured.organizerId) {
      if (typeof featured.organizerId === 'object' && featured.organizerId.profilePic) {
        setOrganizerPic(featured.organizerId.profilePic);
        setOrganizerPicLoading(false);
      } else if (typeof featured.organizerId === 'string') {
        setOrganizerPicLoading(true);
        axios.get(`/api/v1/events/organizer-profile-pic/${featured.organizerId}`)
          .then(res => {
            if (res.data && res.data.profilePic) setOrganizerPic(res.data.profilePic);
            else setOrganizerPic(null);
            setOrganizerPicLoading(false);
          })
          .catch(() => {
            setOrganizerPic(null);
            setOrganizerPicLoading(false);
          });
      } else {
        setOrganizerPic(null);
        setOrganizerPicLoading(false);
      }
    } else {
      setOrganizerPic(null);
      setOrganizerPicLoading(false);
    }
  }, [events, currentEventIndex]);

  // Live search logic
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
    setSearchResults(filtered.slice(0, 6)); // Show up to 6 results
    setShowDropdown(filtered.length > 0);
  }, [searchTerm, events]);

  // Hide dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (searchInputRef.current && !searchInputRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const featured = events[currentEventIndex] || {};
  const eventDate = featured.date ? new Date(featured.date) : null;

  return (
    <div className="home-wrapper home-bg-white">
      {/* Loading animation CSS */}
      <style>{`
        @keyframes loading {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>

      {/* Floating logo particles */}
      <div className="particles">
        {particles.map((_, i) => (
          <img
            key={i}
            src={logo}
            alt="logo particle"
            className="particle-logo"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 32 + 32}px`,
              height: "auto",
              opacity: Math.random() * 0.18 + 0.08,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
            }}
            draggable={false}
          />
        ))}
      </div>

      {/* Header */}
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
                      onClick={() => { setShowDropdown(false); setSearchTerm(""); navigate(`/public-event-details/${ev._id}`); }}
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
          <div className="modern-header-right">
            <Link to="/public-event" className="modern-header-link">Events</Link>
            <Link to="/contact" className="modern-header-link">Contact & Support</Link>
            <span className="modern-header-icon" onClick={() => navigate('/about')} style={{ cursor: 'pointer' }}><GlobeIcon /></span>
            <span className="modern-header-icon" onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}><UserIcon /></span>
          </div>
        </div>
      </header>

      {/* Hero Event Section */}
      {loading ? (
        <HeroSkeleton />
      ) : (
        featured && featured.title && (
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
                      style={{ width: '140px', height: '60px', objectFit: 'cover', borderRadius: '1rem', boxShadow: '0 2px 8px #a78bfa22', background: '#fff' }}
                    />
                  ) : featured.organizerLogo ? (
                    <img
                      src={featured.organizerLogo}
                      alt="Organizer logo"
                      className="refined-organizer-logo"
                      style={{ width: '140px', height: '60px', objectFit: 'contain', borderRadius: '1rem', boxShadow: '0 2px 8px #a78bfa22', background: '#fff' }}
                    />
                  ) : null}
                </div>
              </div>
              <div className="refined-hero-btns">
                <button
                  className="refined-book-btn"
                  onClick={() => navigate("/login")}
                  style={{
                    background: 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)',
                    color: '#fff',
                  }}
                >
                  <span className="refined-book-btn-icon">🎟️</span> Book Now
                </button>
                <button className="refined-more-btn" onClick={() => navigate(`/public-event-details/${featured._id}`)}>More Info</button>
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
        )
      )}

      {/* Upcoming Events Section */}
      <div style={{ marginTop: "3.5rem" }}>
        <UpcomingEvents events={events} loading={loading} />
      </div>

      {/* Top Categories Section */}
      <div style={{ marginTop: "3.5rem" }}>
        <TopCategories events={events} loading={loading} />
      </div>

      {/* Glassy Purple CTA Section */}
      <section className="cta-glassy-purple-section">
        <div className="cta-glassy-purple-card">
          <div className="cta-icon-wrapper">
            <svg width="80" height="80" fill="none" viewBox="0 0 48 48">
              <circle cx="24" cy="16" r="10" stroke="#6b46c1" strokeWidth="3"/>
              <path d="M8 40c0-6.627 7.163-12 16-12s16 5.373 16 12" stroke="#6b46c1" strokeWidth="3"/>
            </svg>
          </div>
          <h2 className="cta-title">Login Or Signup To Gain Additional Benefits</h2>
          <p className="cta-desc">Get your own personal profile, follow artists you love and more when you sign up for a BookedIn account</p>
          <button className="cta-btn" onClick={() => navigate('/login')}>Login / Signup <span style={{marginLeft:'0.7rem',fontSize:'1.3rem'}}>&rarr;</span></button>
        </div>
      </section>

      {/* Glassy Purple Footer */}
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
