import { signOut } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const nav = useNavigate();
  const logout = async () => {
    await signOut();          // Cognito
    localStorage.removeItem("token");
    nav("/", { replace: true });
  };
  return (
    <button onClick={logout} style={buttonStyle}>
      Logout
    </button>
  );
}

// Style to match the purple theme button
const buttonStyle = {
  background: "#6e48ff",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  padding: "0.6em 1.2em",
  borderRadius: "4px",
  fontWeight: 500,
  marginLeft: "auto",
};