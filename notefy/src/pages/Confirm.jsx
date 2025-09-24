// frontend/src/pages/Confirm.jsx
import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { confirmSignUp } from 'aws-amplify/auth';

export default function Confirm() {
  const { state } = useLocation();          // email passed from Signup/Login
  const navigate = useNavigate();
  const [code, setCode] = useState('');

  const email = state?.email || '';

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!code.trim()) return alert('Enter the 6-digit code');
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      alert('Account confirmed! Redirecting to login…');
      navigate('/login');
    } catch (err) {
      alert(err.message || 'Invalid or expired code');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 400, margin: 'auto' }}>
      <h2>Confirm your account</h2>
      <p>We sent a 6-digit code to <strong>{email}</strong></p>

      <form onSubmit={handleConfirm}>
        <input
          type="text"
          inputMode="numeric"
          pattern="\d{6}"
          maxLength={6}
          placeholder="123456"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button type="submit">Confirm</button>
      </form>

      <p>
        Didn’t receive it?{' '}
        {/* optional: resend button calls Auth.resendSignUpCode() */}
        <Link to="/login">Back to login</Link>
      </p>
    </div>
  );
}