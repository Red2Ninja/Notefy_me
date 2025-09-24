// frontend/src/pages/Signup.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signUp , fetchAuthSession} from 'aws-amplify/auth'

export default function Signup() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignup = async (e) => {
    e.preventDefault()
    try {
      await signUp({ username: email, password, options: { userAttributes: { email }}});
      nav('/confirm', { state: { email } });                 // go to login after successful sign-up
    } catch (err) {
      alert(err.message || 'Sign-up failed')
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input type="email" placeholder="Email"
               value={email} onChange={(e) => setEmail(e.target.value)}
               required /><br/>
        <input type="password" placeholder="Password"
               value={password} onChange={(e) => setPassword(e.target.value)}
               required /><br/>
        <button type="submit">Create Account</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
