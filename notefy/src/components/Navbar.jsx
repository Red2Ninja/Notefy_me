import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiUser, FiLogOut } from 'react-icons/fi';
import { signOut } from 'aws-amplify/auth';
import toast from 'react-hot-toast';

export default function Navbar() {
  const nav = useNavigate();
  const logout = async () => {
    await signOut();
    localStorage.clear();
    toast.success('Logged out');
    nav('/');
  };
  return (
    <header style={bar}>
      <div style={left}>
        <Link to="/" style={{fontSize:22,fontWeight:700,color:'#0a1628'}}>Notefy</Link>
        <div style={searchBox}>
          <FiSearch />
          <input placeholder="Search notes, subjects, course codes…" />
        </div>
      </div>
      <nav style={navLinks}>
        <Link to="/repository">Notes Repository</Link>
        <Link to="/tasks">Tasks</Link>
        <Link to="/collab">Collaborate</Link>
        <Link to="/analytics">Analytics</Link>
        <Link to="/exam">Exam Mode</Link>
      </nav>
      <div style={right}>
        <div className="dropdown">
          <FiUser style={{cursor:'pointer'}} />
          <div className="dropdown-content">
            <Link to="/profile">Profile</Link>
            <button onClick={logout} style={{background:'none',border:0}}><FiLogOut /> Logout</button>
          </div>
        </div>
      </div>
    </header>
  );
}

const bar = { position:'sticky',top:0,zIndex:999,background:'#fff',boxShadow:'0 2px 4px #0001',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'.6rem 1.2rem' };
const left = { display:'flex',alignItems:'center',gap:12 };
const searchBox = { display:'flex',alignItems:'center',gap:6,background:'#f3f5f7',borderRadius:20,padding:'4px 12px',marginLeft:12 };
const navLinks = { display:'flex',gap:18,fontSize:15 };
const right = { marginLeft:'auto' };