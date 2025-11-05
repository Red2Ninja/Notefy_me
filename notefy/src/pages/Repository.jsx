// src/pages/Repository.jsx
import { useEffect, useState } from 'react';
import API from '../api.js';
import { FiEye, FiTrash2, FiShare2, FiXCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Repository() {
  const [list, setList] = useState([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    fetchData();
  }, [q]);

  const fetchData = async () => {
    try {
      const { data } = await API.get('/notes/search', { params: { q } });
      setList(data);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
      setList([]);
    }
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await API.delete(`/notes/${noteId}`);
      toast.success("Note deleted!");
      fetchData();
    } catch (err) {
      toast.error("Delete failed: " + (err.response?.data?.error || err.message));
    }
  };

  const handleShare = async (note) => {
    if (!window.confirm("Make this note public for all users in Collaborate?")) return;
    try {
      await API.patch(`/notes/${note.id}/share`);
      toast.success("Note shared to Collaborate!");
      fetchData(); // Refresh list to show new status
    } catch (err) {
      toast.error("Share failed: " + (err.response?.data?.error || err.message));
    }
  };

  const handleUnshare = async (note) => {
    if (!window.confirm("Make this note private again?")) return;
    try {
      await API.patch(`/notes/${note.id}/unshare`);
      toast.success("Note made private.");
      fetchData(); // Refresh list
    } catch (err) {
      toast.error("Failed: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <> 
      <h2 style={pageTitle}>My Notes Repository</h2>
      <div style={filterContainer}>
        <input 
          placeholder="Keyword…" 
          value={q} 
          onChange={e=>setQ(e.target.value)} 
          style={inputStyle} 
        />
      </div>

      <main style={gridContainer}>
        {list.length === 0 && (
          <p style={{color: '#888'}}>You haven't uploaded any notes yet.</p>
        )}
        {list.map(n=>(
          <div key={n.id} style={card}>
            <div style={{ flex: 1 }}>
              {n.isPublic === 'true' && <span style={publicBadge}>Public</span>}
              <h4 style={cardTitle}>{n.fileName}</h4>
              <small style={cardSubtitle}>
                {n.courseCode || 'General'} · {n.subject || 'N/A'}
              </small>
            </div>
            
            <div style={cardActions}>
              <Link to={`/note/${n.id}`} style={viewButton}> 
                <FiEye size={14} /> View
              </Link>
              
              {n.isPublic === 'true' ? (
                <button onClick={() => handleUnshare(n)} style={unShareButton}>
                  <FiXCircle size={14} /> Unshare
                </button>
              ) : (
                <button onClick={() => handleShare(n)} style={shareButton}>
                  <FiShare2 size={14} /> Share
                </button>
              )}
              
              <button onClick={() => handleDelete(n.id)} style={deleteButton}>
                <FiTrash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </main>
    </>
  );
}

// --- STYLES ---

const pageTitle = {
  color: '#6e48ff',
  borderBottom: '1px solid #333',
  paddingBottom: '1rem',
  marginBottom: '1.5rem',
  textAlign: 'left'
};

const filterContainer = {
  display: 'flex',
  gap: '1rem',
  marginBottom: '2rem'
};

const inputStyle = {
  width:'100%',
  flex: 1,
  boxSizing: 'border-box',
  background: '#2a2a2a',
  border: '1px solid #333',
  color: '#fff',
  padding: '0.75rem',
  borderRadius: '4px'
};

const gridContainer = {
  display:'grid',
  gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',
  gap:18
};

const card = { 
  background: '#2a2a2a',
  border: '1px solid #333',
  borderRadius: 8, 
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  position: 'relative'
};

// --- UPDATED STYLES FOR PUBLIC BADGE ---
const publicBadge = {
  position: 'absolute',
  top: 10,
  right: 10,
  background: '#6e48ff', // Changed from green to your theme purple
  color: '#fff',
  padding: '4px 8px', // Slightly larger padding
  borderRadius: '50px', // More rounded, pill-like shape
  fontSize: '0.75rem',
  fontWeight: 'bold',
  letterSpacing: '0.5px'
};

const cardTitle = { 
  color: '#fff', 
  marginTop: 0, 
  marginBottom: '0.25rem',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  paddingRight: '60px' // Increased spacing for the larger badge
};

const cardSubtitle = { 
  color: '#888',
  display: 'block',
  minHeight: '1.2em',
};

const cardActions = {
  marginTop: '1rem',
  display:'flex',
  gap: '0.5rem'
};

const baseButton = {
  flex: 1,
  display:'flex',
  alignItems:'center',
  justifyContent:'center',
  gap: 6,
  borderRadius: 3,
  padding: '6px 12px',
  cursor:'pointer',
  textDecoration: 'none',
  fontSize: '0.9rem',
  fontFamily: 'Arial, sans-serif',
  border: 'none',
  fontWeight: 600
};

const viewButton = {
  ...baseButton,
  background: '#6e48ff',
  color: '#fff',
};

const shareButton = {
  ...baseButton,
  background: '#059669', // Still green for "Share"
  color: '#fff',
};

// --- UPDATED STYLE FOR UNSHARE BUTTON ---
const unShareButton = {
  ...baseButton,
  background: '#e06100ff', // Changed to a warning-like yellow/orange
  color: '#fff',
};

const deleteButton = {
  ...baseButton,
  background: '#b91c1c', // Red
  color: '#fff',
};