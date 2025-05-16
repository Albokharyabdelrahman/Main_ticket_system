import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.post("http://localhost:7000/api/v1/login", data, {
        withCredentials: true, // 🔐 Send cookie with request
      });

      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/UserDashboard"), 1500); // Go to homepage after login
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={data.email}
        onChange={handleChange}
        required
      />
      <br />

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={data.password}
        onChange={handleChange}
        required
      />
      <br />

      <button type="submit">Login</button>
    </form>
  );
}
