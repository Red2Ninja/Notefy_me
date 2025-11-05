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
import Analytics from './pages/Analytics'; // We will import this for the profile page
import ExamMode from './pages/ExamMode';
import Profile from './pages/Profile'; // <-- NEW PAGE
import Collaborate from './pages/Collaborate'; // <-- Added missing import
import { Toaster } from 'react-hot-toast';
import { getValidToken } from './utils/token';
import './App.css'; // Make sure this is imported

// --- 1. NEW: Layout for Dashboard (Navbar ALWAYS visible) ---
function DashboardLayout() {
  return (
    <>
      <Navbar /> {/* The navbar is permanent here */}
      <div className="content-wrapper">
        <Outlet />
      </div>
      <Toaster position="top-right" />
    </>
  );
}

// --- 2. NEW: Layout for Fullscreen Pages (Navbar Hides) ---
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
    <div style={{ minHeight: '100vh' }}>
      
      {/* The navbar now gets the setIsNavVisible function */}
      <Navbar 
        isDynamic={true} 
        isVisible={isNavVisible} 
        setIsNavVisible={setIsNavVisible} // <-- Pass the setter function
      />
      
      {/* "Back to Home" button has been REMOVED as requested */}
      
      <div className="fullscreen-content-wrapper">
        <Outlet />
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

// --- 3. Simple layout for login/signup (No Navbar) ---
function AuthLayout() {
  return (
    <>
      <Outlet />
      <Toaster position="top-right" />
    </>
  );
}

// --- 4. This is your "Gatekeeper" ---
const Protected = ({ children }) =>
  getValidToken() ? children : <Navigate to="/login" replace />;

// --- 5. The Final Routes ---
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes (Public) */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/confirm" element={<Confirm />} />
        </Route>

        {/* Dashboard Route (Protected, Permanent Navbar) */}
        <Route 
          path="/dashboard" 
          element={<Protected><DashboardLayout /></Protected>}
        >
          {/* This makes Dashboard the default page for this layout */}
          <Route index element={<Dashboard />} /> 
        </Route>

        {/* Fullscreen App Routes (Protected, Dynamic Navbar) */}
        <Route element={<Protected><FullscreenLayout /></Protected>}>
          <Route path="/upload" element={<UploadNotes />} />
          <Route path="/note/:id" element={<NoteView />} />
          <Route path="/todos" element={<TodoList />} />
          <Route path="/repository" element={<Repository />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/exam" element={<ExamMode />} />
          <Route path="/collab" element={<Collaborate />} />
          <Route path="/profile" element={<Profile />} />
          {/* This route is so the Profile page can render the Analytics component */}
          <Route path="/analytics" element={<Analytics />} /> 
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<h2 style={{ padding: '4rem', textAlign: 'center' }}>404 – Page Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  );
}