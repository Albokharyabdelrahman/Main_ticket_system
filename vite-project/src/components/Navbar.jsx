import { Link } from "react-router-dom";
export default function Navbar() {
  return (
    <nav>
      <Link to="/">Events</Link>{" | "}
      <Link to="/login">Login</Link>{" | "}
      <Link to="/register">Register</Link>{" | "}
      <Link to="/forgot-password">Forgot Password</Link>
    </nav>
  );
}