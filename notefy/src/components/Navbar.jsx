// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiLogOut, FiBarChart2, FiGrid } from 'react-icons/fi';
import { signOut } from 'aws-amplify/auth';
import toast from 'react-hot-toast';
import './Navbar.css';

// isDynamic: Is this the hiding navbar?
// isVisible: Is the mouse hovering at the top?
// setIsNavVisible: The function to hide the nav
export default function Navbar({ isDynamic = false, isVisible = true, setIsNavVisible }) {
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

  let barStyle = {
    ...bar,
    ...(isDynamic && {
      transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
      transform: isVisible ? 'translateY(0%)' : 'translateY(-100%)',
      opacity: isVisible ? 1 : 0,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', 
      borderBottom: '1px solid #333'
    }),
    ...(!isDynamic && {
      background: '#1f1f1f',
      borderBottom: '1px solid #333',
    })
  };

  // This function is called when the mouse leaves the navbar area
  const handleMouseLeave = () => {
    if (isDynamic) {
      setIsNavVisible(false);
    }
  };

  return (
    // The onMouseLeave handler is added here
    <header style={barStyle} onMouseLeave={handleMouseLeave}>
      <div style={left}>
        <Link to="/dashboard" style={logoStyle}>Notefy</Link>
      </div>
      
      <nav style={navLinks}>
        <Link to="/dashboard" style={linkStyle}><FiGrid /> Dashboard</Link>
        <Link to="/repository" style={linkStyle}>Repository</Link>
        <Link to="/tasks" style={linkStyle}>Tasks</Link>
        <Link to="/collab" style={linkStyle}>Collaborate</Link>
        <Link to="/exam" style={linkStyle}>Exam Mode</Link>
      </nav>
      
      <div style={right}>
        <div className="dropdown">
          <Link to="#" style={profileLinkStyle}>Profile <FiUser /></Link>
          <div className="dropdown-content">
            <Link to="/profile"><FiBarChart2 /> My Profile & Stats</Link>
            <a href="#" onClick={logout}><FiLogOut /> Logout</a>
          </div>
        </div>
      </div>
    </header>
  );
}

// --- STYLES ---

const bar = { 
  position: 'fixed', 
  top: 0,
  left: 0,
  right: 0,
  zIndex: 999,
  background: 'rgba(31, 31, 31, 0.85)',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  padding: '1.5rem 2.4rem'
};
const left = { 
  display: 'flex',
  alignItems: 'center', 
  flex: 1
};
const logoStyle = {
  fontSize: 22,
  fontWeight: 700,
  color: '#ffffff', 
  textDecoration: 'none',
  marginRight: '1.5rem'
};
const navLinks = { 
  display: 'flex',
  gap: '1.5rem',
  fontSize: 15,
  justifyContent: 'center',
  flex: 1
};
const linkStyle = {
  color: 'rgba(255, 255, 255, 0.7)',
  textDecoration: 'none',
  fontSize: '0.9rem',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  transition: 'color 0.2s'
};
const right = { 
  display: 'flex',
  justifyContent: 'flex-end',
  flex: 1
};
const profileLinkStyle = {
  ...linkStyle,
  color: 'rgba(255, 255, 255, 0.9)',
  gap: '0.5rem'
};