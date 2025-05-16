import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ROLE_OPTIONS = [
  { label: "Standard User", value: "User" },
  { label: "Organizer", value: "Organizer" },
  { label: "Admin", value: "Admin" }
];

export default function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    profilePicture: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    setData({ ...data, role: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setData({ ...data, profilePicture: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.post("http://localhost:7000/api/v1/register", data, {
        withCredentials: true,
      });
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/UserDashboard"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <input
        name="name"
        placeholder="Name"
        value={data.name}
        onChange={handleChange}
        required
      />
      <br />
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
      <select name="role" value={data.role} onChange={handleRoleChange} required>
        <option value="">Select Role</option>
        {ROLE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <br />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
      <br />
      <button type="submit">Register</button>
    </form>
  );
}
