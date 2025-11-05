import { Link } from 'react-router-dom';
import { getValidToken } from '../utils/token.js';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Home() {
  const nav = useNavigate();
  useEffect(() => { if (getValidToken()) nav('/repository'); }, []); // Go to repository
  return (
    <div> {/* Removed padding, App.jsx handles it */}
      <section style={hero}>
        <h1>Organize, Share & Master Your Notes</h1>
        <p>All-in-one student workspace with AI powered insights.</p>
        <div style={{marginTop:20,display:'flex', justifyContent: 'center', gap:12}}>
          <Link to="/upload" style={btn}>Upload Note</Link>
          <Link to="/repository" style={btn}>Find Notes</Link>
          <Link to="/exam" style={btn}>Start Exam Mode</Link>
        </div>
      </section>
    </div>
  );
}

const hero = { 
  background:'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
  color:'#fff',
  padding:'4rem 2rem',
  borderRadius:12,
  textAlign:'center' 
};

// Updated button style to match purple theme
const btn = { 
  background:'#6e48ff',
  color:'#fff',
  padding:'10px 18px',
  borderRadius:6,
  textDecoration:'none',
  fontWeight:600 
};