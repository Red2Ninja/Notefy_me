import { Link } from "react-router-dom";
import API from "../api";

function Home() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome to Notefy</h1>
      <p>Student Productivity & Notes Sharing Website</p>
      <Link to="/login">Login</Link> | <Link to="/signup">Signup</Link>
    </div>
  );
}
export default Home;
