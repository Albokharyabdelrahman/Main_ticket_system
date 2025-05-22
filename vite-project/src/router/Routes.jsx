import React from "react";
import { Routes, Route } from "react-router-dom";

// Page imports
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
import MyBookings from "../pages/MyBookings";
import EventDetail from "../pages/EventDetails";   // dynamic route
import PublicEvent from "../pages/PublicEvent";    // additional public event route
import UserProfiles from "../pages/UserProfiles";
import EditUser from "../pages/EditUser";
import AdminEventsPage from "../pages/AdminEventsPage";
import CreateEventPage from "../pages/CreateEventPage";
import EditEvent from "../pages/EditEvent"; 
import MyEvents from "../pages/MyEvents"; 
import EventAnalytics from "../pages/EventAnalytics"; 
import UpdateEventById from "../pages/UpdateEventById"; 
import DeleteEventById from "../pages/DeleteEventById"; 
import SearchUserProfile from "../pages/SearchUserProfile"; 
import GetUserProfile from "../pages/GetUserProfile"; 
import ViewUserProfile from "../pages/ViewUserProfile"; 




export default function MyRoutes() {
  return (
    <Routes>
      <Route path="/update-event/events/:id/edit" element={<EditEvent />} />
      <Route path="/user-profile" element={<SearchUserProfile />} />
      <Route path="/user-getProfile" element={<GetUserProfile />} />
      <Route path="/user-getProfile/user-View-Profile" element={<ViewUserProfile />} />
      <Route path="/delete-event" element={<DeleteEventById />} />
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/user-profiles" element={<UserProfiles />} />
      <Route path="/edit-user/:userId" element={<EditUser />} />
      <Route path="/admin/events" element={<AdminEventsPage />} />
      <Route path="/UserDashboard" element={<UserDashboard />} />
      <Route path="/AdminDashboard" element={<AdminDashboard />} />
      <Route path="/OrganizerDashboard" element={<OrganizerDashboard />} />
      <Route path="/guest" element={<GuestDashboard />} />
      <Route path="/book-tickets" element={<BookTickets />} />
      <Route path="/find-booking" element={<FindBooking />} />
      <Route path="/update-profile" element={<UpdateProfile />} />
      <Route path="/my-bookings" element={<MyBookings />} />
      <Route path="/event/:id" element={<EventDetail />} />
      <Route path="/public-event" element={<PublicEvent />} />
      <Route path="/create-event" element={<CreateEventPage />} />
      <Route path="/my-events" element={<MyEvents />} />
      <Route path="/my-events/analytics" element={<EventAnalytics />} />
      <Route path="/update-event" element={<UpdateEventById />} />
      
    </Routes>
  );
}
