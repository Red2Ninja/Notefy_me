// src/App.jsx
import { BrowserRouter, Routes, Route, Outlet, Navigate, Link }
from 'react-router-dom';
import { useState, useEffect } from 'react'; // Added useEffect
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Confirm from './pages/Confirm';
import NoteView from './pages/NoteView';
import Dashboard from './pages/Dashboard';
import UploadNotes from './pages/UploadNotes';
import TodoList from './pages/TodoList';
import Repository from './pages/Repository';
import Tasks from './pages/Tasks';
import Analytics from './pages/Analytics';
import ExamMode from './pages/ExamMode';
import Profile from './pages/Profile';
import Collaborate from './pages/Collaborate';
import { Toaster } from 'react-hot-toast';
import { getValidToken } from './utils/token';
// import { FiHome } from 'react-icons/fi'; // <-- REMOVED
import './App.css';

// --- 1. Dashboard Layout (Unchanged) ---
function DashboardLayout() {
  return (
    <>
      <Navbar /> 
      <div className="content-wrapper">
        <Outlet />
      </div>
      <Toaster position="top-right" />
    </>
  );
}

// --- 2. Fullscreen Layout (LOGIC FIXED) ---
function FullscreenLayout() {
  const [isNavVisible, setIsNavVisible] = useState(false);

  // This effect listens for the mouse moving near the top of the screen
  useEffect(() => {
    const handleMouseMove = (e) => {
      // If mouse is near the top (80px), show the nav
      if (e.clientY < 80) {
        setIsNavVisible(true);
      }
    };
    
    // Add the listener
    document.addEventListener('mousemove', handleMouseMove);
    
    // Clean up the listener
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []); // Only runs once

  return (
    // The main div no longer has mouse listeners
    <div style={{ minHeight: '100vh' }}>
      
      {/* The navbar now gets the setIsNavVisible function */}
      <Navbar 
        isDynamic={true} 
        isVisible={isNavVisible} 
        setIsNavVisible={setIsNavVisible} // <-- Pass the setter function
      />
      
      {/* "Back to Home" button has been REMOVED */}
      
      <div className="fullscreen-content-wrapper">
        <Outlet />
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

// AuthLayout (Unchanged)
function AuthLayout() {
  return (
    <>
      <Outlet />
      <Toaster position="top-right" />
    </>
  );
}

const Protected = ({ children }) =>
  getValidToken() ? children : <Navigate to="/login" replace />;

// Routes (Unchanged)
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes (Login, Signup) */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/confirm" element={<Confirm />} />
        </Route>

        {/* Dashboard Route (Permanent Navbar) */}
        <Route 
          path="/dashboard" 
          element={<Protected><DashboardLayout /></Protected>}
        >
          <Route index element={<Dashboard />} />
        </Route>

        {/* Fullscreen App Routes (Hiding Navbar) */}
        <Route element={<Protected><FullscreenLayout /></Protected>}>
          <Route path="/upload" element={<UploadNotes />} />
          <Route path="/note/:id" element={<NoteView />} />
          <Route path="/todos" element={<TodoList />} />
          <Route path="/repository" element={<Repository />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/exam" element={<ExamMode />} />
          <Route path="/collab" element={<Collaborate />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/analytics" element={<Analytics />} /> 
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<h2 style={{ padding: '4rem', textAlign: 'center' }}>404 – Page Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

// "Back to Home" style has been REMOVED