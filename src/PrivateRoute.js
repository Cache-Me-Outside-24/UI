import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

// Create a component that wraps protected routes
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>; // Show a loading message while auth state is checked
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
