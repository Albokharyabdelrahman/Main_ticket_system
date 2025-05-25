// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function getCurrentUserRole() {
  const cookie = document.cookie
    .split("; ")
    .find(row => row.startsWith("token="));
  if (!cookie) return null;

  const token = cookie.split("=")[1];
  if (!token || !token.includes(".")) return null;

  try {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    return decodedPayload.role;
  } catch {
    return null;
  }
}

const ProtectedRoute = ({ allowedRoles }) => {
  const role = getCurrentUserRole();
  if (!role) return <Navigate to="/unauthorized" />;

  return allowedRoles.includes(role)
    ? <Outlet />
    : <Navigate to="/unauthorized" />;
};

export default ProtectedRoute;
