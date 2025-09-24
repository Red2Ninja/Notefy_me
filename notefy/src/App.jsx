import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import UploadNotes from "./pages/UploadNotes";
import TodoList from "./pages/TodoList";
import Confirm from './pages/Confirm';
import { Amplify } from 'aws-amplify';
import awsConfig from './aws-config';
Amplify.configure(awsConfig);


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<UploadNotes />} />
        <Route path="/todos" element={<TodoList />} />
        
      </Routes>
    </Router>
  );
}

export default App;
