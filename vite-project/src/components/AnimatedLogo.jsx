import { useEffect, useState } from 'react';
import logo from '../assets/logo.png';

const AnimatedLogo = ({ size = 120, duration = 2000, show = true, loop = true }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (show) {
      startAnimation();
    }
  }, [show]);

  useEffect(() => {
    if (loop && show) {
      const interval = setInterval(() => {
        startAnimation();
      }, duration + 1000); // Add 1 second pause between loops

      return () => clearInterval(interval);
    }
  }, [loop, show, duration]);

  const startAnimation = () => {
    setIsAnimating(true);
    
    // Create individual ticket elements that will fly in
    const ticketCount = 8; // Number of tickets to animate
    const newTickets = [];
    
    for (let i = 0; i < ticketCount; i++) {
      newTickets.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        delay: i * 150, // Stagger the animation
        rotation: Math.random() * 360,
        scale: 0.3 + Math.random() * 0.4
      });
    }
    
    setTickets(newTickets);
    
    // Reset animation after completion
    setTimeout(() => {
      setIsAnimating(false);
    }, duration + ticketCount * 150);
  };

  if (!show) return null;

  return (
    <div style={{ 
      position: 'relative', 
      width: size, 
      height: size, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      margin: '0 auto'
    }}>
      {/* Final combined logo */}
      <div style={{
        position: 'absolute',
        opacity: isAnimating ? 0 : 1,
        transform: isAnimating ? 'scale(0.8)' : 'scale(1)',
        transition: 'all 0.5s ease',
        zIndex: 10
      }}>
        <img 
          src={logo} 
          alt="BookedIn Logo" 
          style={{ 
            width: size, 
            height: 'auto',
            borderRadius: 16,
            filter: 'drop-shadow(0 4px 12px rgba(124, 58, 237, 0.3))'
          }} 
        />
      </div>

      {/* Animated individual tickets */}
      {tickets.map((ticket) => (
        <div
          key={`${ticket.id}-${Date.now()}`}
          style={{
            position: 'fixed',
            left: ticket.x,
            top: ticket.y,
            width: size * 0.15,
            height: size * 0.15,
            transform: `translate(-50%, -50%) scale(${ticket.scale}) rotate(${ticket.rotation}deg)`,
            animation: `flyToLogo${ticket.id} ${duration}ms ease-out ${ticket.delay}ms forwards`,
            zIndex: 5
          }}
        >
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
            borderRadius: 8,
            position: 'relative',
            boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Ticket perforations */}
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '60%',
              height: '60%',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 2
            }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} style={{
                  width: '100%',
                  height: 1,
                  background: 'rgba(255, 255, 255, 0.6)',
                  borderRadius: 0.5
                }} />
              ))}
            </div>
            
            {/* Ticket icon */}
            <span style={{
              fontSize: size * 0.08,
              color: 'white',
              fontWeight: 'bold',
              zIndex: 1
            }}>
              🎫
            </span>
          </div>
        </div>
      ))}

      {/* CSS Animations */}
      <style jsx>{`
        ${tickets.map((ticket) => `
          @keyframes flyToLogo${ticket.id} {
            0% {
              transform: translate(-50%, -50%) scale(${ticket.scale}) rotate(${ticket.rotation}deg);
              opacity: 1;
            }
            50% {
              opacity: 0.8;
            }
            100% {
              transform: translate(-50%, -50%) scale(0) rotate(0deg);
              opacity: 0;
            }
          }
        `).join('')}
      `}</style>
    </div>
  );
};

export default AnimatedLogo; 