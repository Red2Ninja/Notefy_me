import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import NoteCard from "../components/NoteCard";
import API from "../api";

function Dashboard() {
  const notes = [
    { id: 1, title: "Math Notes", description: "Integration & Differentiation" },
    { id: 2, title: "Physics Notes", description: "Quantum Mechanics Summary" },
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Dashboard</h2>
      <Link to="/upload">Upload Notes</Link>
      <div style={{ marginTop: "1rem" }}>
        {notes.map(n => (
          <NoteCard key={n.id} title={n.title} description={n.description} />
        ))}
      </div>
    </div>
  );
}
export default Dashboard;
