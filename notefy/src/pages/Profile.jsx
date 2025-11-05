// src/pages/Profile.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';
import toast from 'react-hot-toast';
import Analytics from './Analytics'; // Import the Analytics component
import { FiLogOut } from 'react-icons/fi';

export default function Profile() {
  const nav = useNavigate();

  const logout = async () => {
    try {
      await signOut();
      localStorage.clear();
      toast.success('Logged out');
      nav('/');
    } catch (error) {
      console.error('Error signing out: ', error);
      toast.error('Failed to log out');
    }
  };

  return (
    <div style={profileContainer}>
      <div style={profileHeader}>
        <h1 style={{ color: '#fff', margin: 0 }}>My Profile</h1>
        <button onClick={logout} style={logoutButton}>
          <FiLogOut /> Logout
        </button>
      </div>

      <div style={analyticsWrapper}>
        {/* We render the entire Analytics page component right here */}
        <Analytics />
      </div>
    </div>
  );
}

// --- STYLES ---
const profileContainer = {
  maxWidth: '1000px',
  margin: '0 auto'
};

const profileHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid #333',
  paddingBottom: '1.5rem',
  marginBottom: '1.5rem'
};

const logoutButton = {
  background: '#b91c1c',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
  padding: '0.75rem 1.5rem',
  borderRadius: '4px',
  fontWeight: 600,
  fontSize: '0.9rem',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const analyticsWrapper = {
  background: '#2a2a2a',
  border: '1px solid #333',
  borderRadius: '8px',
  padding: '2rem'
};