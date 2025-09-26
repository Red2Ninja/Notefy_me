import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Confirm from './pages/Confirm';
import Dashboard from './pages/Dashboard';
import UploadNotes from './pages/UploadNotes';
import TodoList from './pages/TodoList';
import Repository from './pages/Repository';
import Tasks from './pages/Tasks';
import Analytics from './pages/Analytics';
import ExamMode from './pages/ExamMode';
import { Toaster } from 'react-hot-toast';
import { getValidToken } from './utils/token';

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Toaster position="top-right" />
    </>
  );
}

const Protected = ({ children }) =>
  getValidToken() ? children : <Navigate to="/login" replace />;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="/upload" element={<Protected><UploadNotes /></Protected>} />
          <Route path="/todos" element={<Protected><TodoList /></Protected>} />
          <Route path="/repository" element={<Protected><Repository /></Protected>} />
          <Route path="/tasks" element={<Protected><Tasks /></Protected>} />
          <Route path="/analytics" element={<Protected><Analytics /></Protected>} />
          <Route path="/exam" element={<Protected><ExamMode /></Protected>} />
        </Route>
        <Route path="*" element={<h2>404 – page not found</h2>} />
      </Routes>
    </BrowserRouter>
  );
}