import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api.js';

export default function NoteView() {
  const { id } = useParams(); // Get note ID from URL
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Function to fetch the note data
    const fetchNote = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/notes/${id}`);
        setNote(response.data);
      } catch (err) {
        console.error('Failed to fetch note:', err);
        setError('Could not load the note. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]); // Re-run this effect if the ID in the URL changes

  // Render loading/error states
  if (loading) {
    return <div><h2>Loading note...</h2></div>; // Removed padding
  }

  if (error) {
    return <div style={{ color: 'red' }}><h2>Error: {error}</h2></div>; // Removed padding
  }

  if (!note) {
    return <div><h2>Note not found.</h2></div>; // Removed padding
  }

  // Render the note viewer
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}> {/* Adjusted height */}
      <h2 style={{ padding: '1rem 0', borderBottom: '1px solid #333' }}> {/* Dark border */}
        Viewing: {note.fileName}
      </h2>
      <iframe
        src={note.viewUrl}
        title={note.fileName}
        style={{ flex: 1, border: 'none', background: '#fff' }} // Added white background for non-transparent docs
      />
    </div>
  );
}