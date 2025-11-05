// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NoteCard from "../components/NoteCard.jsx"; // Use .jsx
import API from "../api.js";
import toast from "react-hot-toast";

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllNotes() {
      try {
        // Fetch both sets of notes in parallel
        const [myNotesRes, collabRes] = await Promise.all([
          API.get('/notes/search'), // Your private notes
          API.get('/collaborate')   // All public notes
        ]);

        // Combine the lists
        const allNotes = [...myNotesRes.data, ...collabRes.data];

        // Remove duplicates (in case your note is also public)
        const uniqueNotes = Array.from(new Map(allNotes.map(note => [note.id, note])).values());
        
        // Sort by upload date, newest first
        uniqueNotes.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
        
        setNotes(uniqueNotes);
      } catch (err) {
        console.error("Failed to fetch dashboard notes:", err);
        toast.error("Could not load dashboard notes.");
      } finally {
        setLoading(false);
      }
    }

    fetchAllNotes();
  }, []);

  return (
    <div> {/* Padding is now handled by App.css */}
      <h2 style={{color: '#6e48ff', borderBottom: '1px solid #333', paddingBottom: '1rem'}}>Dashboard</h2>
      
      <p style={{color: '#aaa'}}>A combined view of your private notes and all public notes from the community.</p>

      {loading ? (
        <p>Loading notes...</p>
      ) : (
        <div style={gridContainer}>
          {notes.length === 0 ? (
            <p style={{color: '#888'}}>No notes found. Try uploading one!</p>
          ) : (
            notes.map(note => (
              <NoteCard key={note.id} note={note} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

// Styles
const gridContainer = {
  display:'grid',
  gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',
  gap:18,
  marginTop: '2rem'
};

export default Dashboard;