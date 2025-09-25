import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signIn , signOut, fetchAuthSession } from 'aws-amplify/auth';
import API from "../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      //await signOut();
      await signIn({ username: email, password }); // sign-in first
      const { tokens } = await fetchAuthSession(); // ← then grab tokens
      if (!tokens) throw new Error('No tokens returned');
      const token = tokens.accessToken.toString();
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (err) {
      alert(err.message || 'Login failed');
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br/>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br/>
        <button type="submit">Login</button>
      </form>
      <p>No account? <Link to="/signup">Sign up</Link></p>
    </div>
  );
}
export default Login;