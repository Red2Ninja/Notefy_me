// src/pages/Home.jsx
import { Navigate } from 'react-router-dom';
import { getValidToken } from '../utils/token';

export default function Home() {
  // This component is now just a gatekeeper
  // If you have a token, go to the app. If not, go to login.
  return getValidToken() ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}