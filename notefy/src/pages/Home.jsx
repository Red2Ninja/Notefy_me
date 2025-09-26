import { Link } from 'react-router-dom';
import { getValidToken } from '../utils/token';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
export default function Home() {
  const nav = useNavigate();
  useEffect(() => { if (getValidToken()) nav('/dashboard'); }, []);
  return (
    <div style={{padding:'2rem'}}>
      <section style={hero}>
        <h1>Organize, Share & Master Your Notes</h1>
        <p>All-in-one student workspace with AI powered insights.</p>
        <div style={{marginTop:20,display:'flex',gap:12}}>
          <Link to="/upload" style={btn}>Upload Note</Link>
          <Link to="/repository" style={btn}>Find Notes</Link>
          <Link to="/exam" style={btn}>Start Exam Mode</Link>
        </div>
      </section>
    </div>
  );
}
const hero = { background:'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',color:'#fff',padding:'4rem 2rem',borderRadius:12,textAlign:'center' };
const btn = { background:'#fff',color:'#764ba2',padding:'10px 18px',borderRadius:6,textDecoration:'none',fontWeight:600 };