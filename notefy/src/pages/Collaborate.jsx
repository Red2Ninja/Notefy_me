// src/pages/Collaborate.jsx
import { useEffect, useState } from 'react';
import API from '../api.js';
import { FiEye } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Collaborate() {
  const [list, setList] = useState([]);
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await API.get('/collaborate');
      setList(data);
    } catch (error) {
      console.error("Failed to fetch collab notes:", error);
      setList([]);
    }
  };

  return (
    <> 
      <h2 style={pageTitle}>Collaborate</h2>
      <p style={{color: '#aaa', marginTop: '-1rem', marginBottom: '2rem'}}>
        All public notes shared by users are shown here.
      </p>

      <main style={gridContainer}>
        {list.length === 0 && (
          <p style={{color: '#888'}}>No public notes have been shared yet.</p>
        )}
        
        {list.map(n=>(
          <div key={n.id} style={card}>
            <div style={{ flex: 1 }}>
              <h4 style={cardTitle}>{n.fileName}</h4>
              <small style={cardSubtitle}>
                {n.courseCode || 'General'} · {n.subject || 'N/A'}
              </small>
              
              {/* --- THIS IS THE UPDATED LINE --- */}
              <small style={authorStyle}>
                by: {n.userEmail || n.userid}
              </small>
              {/* --- END OF UPDATE --- */}

            </div>
            
            <div style={cardActions}>
              <Link to={`/note/${n.id}`} style={viewButton}> 
                <FiEye size={14} /> View
              </Link>
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
  flexDirection: 'column'
};

const cardTitle = { 
  color: '#fff', 
  marginTop: 0, 
  marginBottom: '0.25rem',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
};

const cardSubtitle = { 
  color: '#888',
  display: 'block',
  minHeight: '1.2em',
};

// New style for the author
const authorStyle = {
  ...cardSubtitle, 
  fontSize: '0.8rem', 
  marginTop: '4px',
  color: '#aaa'
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
  borderRadius: 4,
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