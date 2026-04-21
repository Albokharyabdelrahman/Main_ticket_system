import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function VerifyEmail() {
  const query = useQuery();
  const token = query.get('token');
  const email = query.get('email');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.get(`http://localhost:7000/api/v1/verify-email`, {
        params: { token, email, otp },
      });
      setMessage(res.data || 'Email verified successfully! You can now log in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage(err.response?.data || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed', fontSize: 22 }}>Invalid verification link.</div>;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 40% 20%, #a78bfa 0%, #fff 100%)' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 36, borderRadius: 18, boxShadow: '0 4px 24px #a78bfa33', minWidth: 340, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <h2 style={{ color: '#7c3aed', marginBottom: 8 }}>Verify Your Email</h2>
        <div style={{ color: '#555', marginBottom: 8 }}>Enter the OTP sent to your email to complete verification.</div>
        <input
          type="text"
          value={otp}
          onChange={e => setOtp(e.target.value)}
          placeholder="Enter OTP"
          maxLength={6}
          required
          style={{ padding: 12, borderRadius: 8, border: '1.5px solid #a78bfa', fontSize: 18, marginBottom: 8 }}
        />
        <button type="submit" disabled={loading} style={{ background: 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 0', fontWeight: 700, fontSize: 18, cursor: 'pointer', marginBottom: 8 }}>
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>
        {message && <div style={{ color: message.includes('success') ? 'green' : 'red', fontWeight: 500 }}>{message}</div>}
      </form>
    </div>
  );
} 