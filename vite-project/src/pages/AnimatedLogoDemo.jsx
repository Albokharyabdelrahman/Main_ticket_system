import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedLogo from '../components/AnimatedLogo';
import logo from '../assets/logo.png';
import './Home.css';

const AnimatedLogoDemo = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const triggerAnimation = () => {
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 3000);
  };

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <div className="home-wrapper home-bg-white" style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Back Logo */}
      <div className="category-logo-circle" style={{ position: 'absolute', top: 32, left: 32, cursor: 'pointer', zIndex: 10 }} onClick={() => navigate(-1)}>
        <img src={logo} alt="BookedIn Logo" style={{ width: 40, height: 40, borderRadius: '50%' }} />
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', padding: '60px 20px 40px 20px' }}>
        <h1 style={{ fontSize: 32, color: '#7c3aed', marginBottom: 16 }}>Animated Logo Demo</h1>
        <p style={{ color: '#666', fontSize: 16, marginBottom: 40 }}>
          Watch tickets fly in from different parts of the page to form the BookedIn logo
        </p>
      </div>

      {/* Demo Section */}
      <div style={{ 
        maxWidth: 800, 
        margin: '0 auto', 
        padding: '0 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 40
      }}>
        
        {/* Basic Animation Demo */}
        <div style={{ 
          background: '#f8fafc', 
          borderRadius: 20, 
          padding: 40, 
          textAlign: 'center',
          border: '2px solid #e5e7eb'
        }}>
          <h2 style={{ fontSize: 24, color: '#7c3aed', marginBottom: 16 }}>Basic Animation</h2>
          <p style={{ color: '#666', marginBottom: 24 }}>Click the button to trigger the animation</p>
          
          <button
            onClick={triggerAnimation}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
              marginBottom: 24,
              transition: 'all 0.3s ease'
            }}
          >
            Start Animation
          </button>

          <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AnimatedLogo size={120} show={showAnimation} loop={true} />
          </div>
        </div>

        {/* Loading Simulation */}
        <div style={{ 
          background: '#f8fafc', 
          borderRadius: 20, 
          padding: 40, 
          textAlign: 'center',
          border: '2px solid #e5e7eb'
        }}>
          <h2 style={{ fontSize: 24, color: '#7c3aed', marginBottom: 16 }}>Loading Simulation</h2>
          <p style={{ color: '#666', marginBottom: 24 }}>Simulate a loading state with the animated logo</p>
          
          <button
            onClick={simulateLoading}
            disabled={isLoading}
            style={{
              padding: '12px 24px',
              background: isLoading ? '#9ca3af' : 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 16,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginBottom: 24,
              transition: 'all 0.3s ease'
            }}
          >
            {isLoading ? 'Loading...' : 'Simulate Loading'}
          </button>

          <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isLoading ? (
              <AnimatedLogo size={120} show={true} loop={true} />
            ) : (
              <div style={{ 
                width: 120, 
                height: 120, 
                background: '#f3f4f6', 
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9ca3af',
                fontSize: 14
              }}>
                Ready to load
              </div>
            )}
          </div>
        </div>

        {/* Continuous Animation */}
        <div style={{ 
          background: '#f8fafc', 
          borderRadius: 20, 
          padding: 40, 
          textAlign: 'center',
          border: '2px solid #e5e7eb'
        }}>
          <h2 style={{ fontSize: 24, color: '#7c3aed', marginBottom: 16 }}>Continuous Animation</h2>
          <p style={{ color: '#666', marginBottom: 24 }}>Watch the animation loop continuously</p>
          
          <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AnimatedLogo size={120} show={true} loop={true} />
          </div>
        </div>

        {/* Different Sizes */}
        <div style={{ 
          background: '#f8fafc', 
          borderRadius: 20, 
          padding: 40, 
          textAlign: 'center',
          border: '2px solid #e5e7eb'
        }}>
          <h2 style={{ fontSize: 24, color: '#7c3aed', marginBottom: 16 }}>Different Sizes</h2>
          <p style={{ color: '#666', marginBottom: 24 }}>The animation works at various sizes</p>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-around', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 20
          }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#666', marginBottom: 8 }}>Small (80px)</p>
              <AnimatedLogo size={80} show={showAnimation} loop={true} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#666', marginBottom: 8 }}>Medium (120px)</p>
              <AnimatedLogo size={120} show={showAnimation} loop={true} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#666', marginBottom: 8 }}>Large (160px)</p>
              <AnimatedLogo size={160} show={showAnimation} loop={true} />
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div style={{ 
          background: '#f0f9ff', 
          borderRadius: 20, 
          padding: 40, 
          border: '2px solid #bae6fd'
        }}>
          <h2 style={{ fontSize: 24, color: '#0369a1', marginBottom: 16 }}>How to Use</h2>
          <div style={{ textAlign: 'left', color: '#0369a1' }}>
            <p style={{ marginBottom: 12 }}><strong>Import:</strong></p>
            <code style={{ 
              background: '#fff', 
              padding: '8px 12px', 
              borderRadius: 8, 
              display: 'block',
              marginBottom: 16,
              fontSize: 14
            }}>
              import AnimatedLogo from '../components/AnimatedLogo';
            </code>
            
            <p style={{ marginBottom: 12 }}><strong>Basic Usage:</strong></p>
            <code style={{ 
              background: '#fff', 
              padding: '8px 12px', 
              borderRadius: 8, 
              display: 'block',
              marginBottom: 16,
              fontSize: 14
            }}>
              {`<AnimatedLogo size={120} show={isLoading} />`}
            </code>
            
            <p style={{ marginBottom: 12 }}><strong>Props:</strong></p>
            <ul style={{ marginLeft: 20, marginBottom: 16 }}>
              <li><strong>size:</strong> Logo size in pixels (default: 120)</li>
              <li><strong>show:</strong> Boolean to trigger animation (default: true)</li>
              <li><strong>duration:</strong> Animation duration in ms (default: 2000)</li>
            </ul>
            
            <p style={{ marginBottom: 12 }}><strong>Replace Spinner:</strong></p>
            <code style={{ 
              background: '#fff', 
              padding: '8px 12px', 
              borderRadius: 8, 
              display: 'block',
              fontSize: 14
            }}>
              {`{isLoading ? <AnimatedLogo size={80} show={true} /> : <YourContent />}`}
            </code>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        textAlign: 'center', 
        padding: '40px 20px', 
        marginTop: 60,
        color: '#666'
      }}>
        <p>Ready to replace your spinners with this animated logo?</p>
        <button
          onClick={() => navigate(-1)}
          style={{
            marginTop: 16,
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default AnimatedLogoDemo; 