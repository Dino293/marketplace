import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PublicRoute({ children }) {
  const { authUser, initializing } = useAuth();

  if (initializing) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  if (authUser) return <Navigate to="/" replace />; // ✅ redirect jika sudah login

  return children;
}
