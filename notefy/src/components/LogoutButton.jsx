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
    <button onClick={logout} style={{ marginLeft: "auto", color: "#fff" }}>
      Logout
    </button>
  );
}