import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const { pathname } = useLocation();
  // Hide navbar on login/signup
  if (pathname === "/login" || pathname === "/signup") return null;

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.link}>Home</Link>
      <Link to="/dashboard" style={styles.link}>Dashboard</Link>
      <Link to="/upload" style={styles.link}>Upload</Link>
      <Link to="/todos" style={styles.link}>Todos</Link>
    </nav>
  );
}

const styles = {
  nav: {
    background: "#0a1628",
    padding: "1rem",
    display: "flex",
    gap: "1rem",
  },
  link: { color: "#fff", textDecoration: "none" }
};

export default Navbar;
