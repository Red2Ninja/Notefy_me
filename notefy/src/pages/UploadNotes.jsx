// src/pages/UploadNotes.jsx
import { useState } from "react";
import API from "../api.js";
import { Link } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";
import toast from 'react-hot-toast';

function UploadNotes() {
  const [file, setFile] = useState(null);
  const [noteContent, setNoteContent] = useState(""); // State for "Note Content"

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a file");

    const form = new FormData();
    form.append("file", file);
    
    // You can append other data here if your backend supports it
    // form.append("noteTitle", noteContent);

    try {
      const { data } = await API.post("/notes/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Upload successful: " + data.note.fileName);
      setFile(null);
      setNoteContent("");
      e.target.reset(); // Reset the form
    } catch (err) {
      console.error(err);
      toast.error("Upload failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={uploadContainer}>
      <Link to="/dashboard" style={homeLink}>
        <FiChevronLeft /> Home
      </Link>
      
      <form onSubmit={handleUpload} style={formStyle}>
        <div style={formGroup}>
          <label style={label}>Note Content</label>
          <input 
            type="text" 
            placeholder="AWS Documents"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={formGroup}>
          <label style={label}>Attachments</label>
          <div style={fileInputWrapper}>
            <input 
              type="file" 
              onChange={(e) => setFile(e.target.files[0])}
              style={fileInput}
              id="file-upload"
            />
            <label htmlFor="file-upload" style={fileInputLabel}>
              Choose File
            </label>
            <span style={fileName}>
              {file ? file.name : "No file chosen"}
            </span>
          </div>
        </div>
        
        <button type="submit" style={buttonStyle}>Upload</button>
      </form>
    </div>
  );
}

// Styles to match image_341e2f.png
const uploadContainer = {
  maxWidth: '700px',
  margin: '0 auto',
};

const homeLink = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
  color: 'rgba(255, 255, 255, 0.7)',
  textDecoration: 'none',
  marginBottom: '1.5rem'
};

const formStyle = {
  background: '#2a2a2a',
  border: '1px solid #333',
  borderRadius: '8px',
  padding: '2rem'
};

const formGroup = {
  marginBottom: '1.5rem'
};

const label = {
  display: 'block',
  color: 'rgba(255, 255, 255, 0.7)',
  marginBottom: '0.5rem',
  fontSize: '0.9rem'
};

const inputStyle = {
  width:'100%',
  boxSizing: 'border-box',
  background: '#ffffff',
  border: '1px solid #333',
  color: '#000000',
  padding: '0.75rem',
  borderRadius: '4px'
};

const fileInputWrapper = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  background: '#3a3a3a',
  padding: '0.75rem 1rem',
  borderRadius: '4px',
  border: '1px solid #333',
};

const fileInput = {
  display: 'none' // Hide the default input
};

const fileInputLabel = {
  background: '#4a4a4a',
  color: '#fff',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  cursor: 'pointer',
  whiteSpace: 'nowrap'
};

const fileName = {
  color: '#ccc',
  fontSize: '0.9rem',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
};

const buttonStyle = {
  background: '#6e48ff',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
  padding: '0.75rem 1.5rem',
  borderRadius: '4px',
  fontWeight: 600,
  fontSize: '0.9rem',
};

export default UploadNotes;