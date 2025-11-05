import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Make sure Link is imported
import { signIn, signOut, fetchAuthSession } from 'aws-amplify/auth';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signOut(); // Sign out any existing session first
      await signIn({ username: email, password }); // Sign-in
      const { tokens } = await fetchAuthSession(); // Grab tokens
      if (!tokens) throw new Error('No tokens returned');
      
      const token = tokens.accessToken.toString();
      localStorage.setItem('token', token); // Store the token
      navigate('/dashboard'); // Navigate to the repository
    } catch (err) {
      alert(err.message || 'Login failed');
    }
  };

  return (
    <div style={loginContainer}>
      <div style={loginBox}>
        <h2 style={{ color: '#fff' }}>Welcome to Notefy</h2>
        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          <label style={label}>Enter a username</label>
          <input
            type="email"
            placeholder="medhasriram245@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <label style={label}>Password (demo)</label>
          <input
            type="password"
            placeholder="••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>Continue</button>
        </form>

        {/* --- HERE IS THE RESTORED SIGN UP LINK --- */}
        <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#aaa' }}>
          No account? <Link to="/signup" style={{ color: '#6e48ff', textDecoration: 'none' }}>Sign up</Link>
        </p>
        {/* --- END OF FIX --- */}

      </div>
    </div>
  );
}

// Styles to match the screenshot
const loginContainer = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
  boxSizing: 'border-box',
};

const loginBox = {
  width: '100%',
  maxWidth: '500px',
  padding: '2rem',
  background: '#2a2a2a', // Dark box background
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
};

const label = {
  color: 'rgba(255, 255, 255, 0.7)',
  width: '100%',
  marginBottom: '0.25rem',
  textAlign: 'left',
  fontSize: '0.9rem',
};

const inputStyle = {
  background: '#ffffff', // White input
  color: '#000000',
  border: 'none',
  width: '100%',
  padding: '1rem',
  borderRadius: '4px',
  boxSizing: 'border-box',
  marginBottom: '1rem',
  fontSize: '1rem',
};

const buttonStyle = {
  background: '#6e48ff', // Purple button
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
  padding: '1rem',
  borderRadius: '4px',
  fontWeight: 600,
  fontSize: '1rem',
  width: '100%',
  boxSizing: 'border-box',
};

export default Login;