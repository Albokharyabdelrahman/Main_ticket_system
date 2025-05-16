import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";

export default function MyRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />                    {/* Home shows only at / */}
      <Route path="/login" element={<Login />} />              {/* Login shows only at /login */}
      <Route path="/register" element={<Register />} />        {/* Register shows only at /register */}
      <Route path="/forgot-password" element={<ForgotPassword />} /> {/* ... */}
    </Routes>
  );
}