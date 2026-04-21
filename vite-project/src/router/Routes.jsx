import React from "react";
import { Routes, Route } from "react-router-dom";

// Page imports
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import RegisterUser from "../pages/RegisterUser";
import RegisterOrganizer from "../pages/RegisterOrganizer";
import RegisterSelection from "../pages/RegisterSelection";
import ForgotPassword from "../pages/ForgotPassword";
import UserDashboard from "../pages/UserDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import OrganizerDashboard from "../pages/OrganizerDashboard";
import BookTickets from "../pages/BookTickets";
import FindBooking from "../pages/FindBooking";
import UpdateProfile from "../pages/UpdateProfile";
import MyBookings from "../pages/MyBookings";
import MyTickets from "../pages/MyTickets";
import EventDetailsPage from "../pages/EventDetailsPage";
import PublicEvent from "../pages/PublicEvent";
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
import UnauthorizedPage from "../pages/UnauthorizedPage";
import ProtectedRoute from "../components/ProtectedRoute";
import ContactPage from "../pages/ContactPage";
import PrivacyPage from "../pages/PrivacyPage";
import AboutPage from "../pages/AboutPage";
import CategoryEvents from "../pages/CategoryEvents";
import FAQs from '../pages/FAQs';
import PublicEventDetails from '../pages/PublicEventDetails';
import Policies from "../pages/Policies";
import Profile from '../pages/Profile.jsx';
import VerifyEmail from '../pages/VerifyEmail';
import AnimatedLogoDemo from '../pages/AnimatedLogoDemo';

// Inside your Routes component

export default function MyRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterSelection />} />
      <Route path="/register-user" element={<RegisterUser />} />
      <Route path="/register-organizer" element={<RegisterOrganizer />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/public-event" element={<PublicEvent />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/policies" element={<Policies />} />
      <Route path="/events/category/:categoryName" element={<CategoryEvents />} />
      <Route path="/faqs" element={<FAQs />} />
      <Route path="/public-event-details/:id" element={<PublicEventDetails />} />
      <Route path="/animated-logo-demo" element={<AnimatedLogoDemo />} />

      {/* Admin Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/admin/events" element={<AdminEventsPage />} />
        <Route path="/user-profiles" element={<UserProfiles />} />
         <Route path="/user-getProfile/:userId" element={<ViewUserProfile />} />
        <Route path="/edit-user/:userId" element={<EditUser />} />

      </Route>

      {/* Organizer Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={["Organizer"]} />}>
        <Route path="/OrganizerDashboard" element={<OrganizerDashboard />} />
        <Route path="/create-event" element={<CreateEventPage />} />
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/my-events/analytics" element={<EventAnalytics />} />
        
      </Route>

    <Route element={<ProtectedRoute allowedRoles={["Organizer","Admin"]} />}>
        <Route path="/delete-event" element={<DeleteEventById />} />
        <Route path="/events/:id/edit" element={<EditEvent />} />
        <Route path="/update-event/:id" element={<EditEvent />} />
        <Route path="/update-event" element={<UpdateEventById />} />

      </Route>


      {/* User Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={["User"]} />}>
        <Route path="/UserDashboard" element={<UserDashboard />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/mytickets/:bookingId" element={<MyTickets />} />
        <Route path="/find-booking" element={<FindBooking />} />
        <Route path="/book-tickets" element={<BookTickets />} />
        <Route path="/event/:id" element={<EventDetailsPage />} />


      </Route>

      {/* All Auth Roles (Admin, Organizer, User) */}
      <Route element={<ProtectedRoute allowedRoles={["Admin", "Organizer", "User"]} />}>
        <Route path="/user-profile" element={<SearchUserProfile />} />
        <Route path="/user-getProfile" element={<GetUserProfile />} />
        <Route path="/update-profile" element={<UpdateProfile />} />

      </Route>
      
      <Route path="/profile" element={<Profile />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
    </Routes>
  );
}
