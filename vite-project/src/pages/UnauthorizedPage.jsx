// src/pages/UnauthorizedPage.jsx
import React from "react";
import { Link } from "react-router-dom";

const UnauthorizedPage = () => (
  <div className="text-center mt-20">
    <h1 className="text-3xl font-bold text-red-600">403 - Unauthorized</h1>
    <p className="mt-4 text-gray-700">You do not have permission to view this page.</p>
    <Link to="/" className="mt-6 inline-block text-blue-500 underline">Return Home</Link>
  </div>
);

export default UnauthorizedPage;
