import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import UserDashboard from "../pages/UserDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import OrganizerDashboard from "../pages/OrganizerDashboard";
import GuestDashboard from "../pages/GuestDashboard";
import BookTickets from "../pages/BookTickets";
import FindBooking from "../pages/FindBooking";
import UpdateProfile from "../pages/UpdateProfile";
import MyBookings from "../pages/MyBookings";  // relative path from src/router to src/pages

export default function MyRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />                              {/* Home */}
      <Route path="/login" element={<Login />} />                        {/* Login */}
      <Route path="/register" element={<Register />} />                  {/* Register */}
      <Route path="/forgot-password" element={<ForgotPassword />} />     {/* Forgot Password */}
      <Route path="/UserDashboard" element={<UserDashboard />} />        {/* User Dashboard */}
      <Route path="/AdminDashboard" element={<AdminDashboard />} />      {/* Admin Dashboard */}
      <Route path="/OrganizerDashboard" element={<OrganizerDashboard />} /> {/* Organizer Dashboard */}
      <Route path="/guest" element={<GuestDashboard />} />
      <Route path="/book-tickets" element={<BookTickets />} />
      <Route path="/find-booking" element={<FindBooking />} />
      <Route path="/update-profile" element={<UpdateProfile />} />
      <Route path="/my-bookings" element={<MyBookings />} />


    </Routes>
  );
}
