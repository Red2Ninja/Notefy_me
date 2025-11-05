// src/components/NoteCard.jsx
import { Link } from 'react-router-dom';
import { FiEye } from 'react-icons/fi';

function NoteCard({ note }) { // Changed props to 'note'
  return (
    <div style={card}>
      <div style={{ flex: 1 }}>
        {/* Use data from the note object */}
        <h4 style={cardTitle}>{note.fileName}</h4>
        <small style={cardSubtitle}>
          by: {note.userEmail || note.userid}
        </small>
      </div>
      
      <div style={cardActions}>
        {/* Link to the dynamic note view page */}
        <Link to={`/note/${note.id}`} style={viewButton}> 
          <FiEye size={14} /> View
        </Link>
      </div>
    </div>
  );
}

// Styles
const card = { 
  background: '#2a2a2a',
  border: '1px solid #333',
  borderRadius: 8, 
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  position: 'relative'
};

const cardTitle = { 
  color: '#fff', 
  marginTop: 0, 
  marginBottom: '0.25rem',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const cardSubtitle = { 
  color: '#888',
  display: 'block',
  minHeight: '1.2em',
  fontSize: '0.8rem',
  fontFamily: 'monospace',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
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

export default NoteCard;