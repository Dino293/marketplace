import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { authUser, initializing } = useAuth();

  if (initializing) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}