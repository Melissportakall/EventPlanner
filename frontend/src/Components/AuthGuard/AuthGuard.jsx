import React from "react";
import { Navigate } from "react-router-dom";

const AuthGuard = ({ children }) => {
  const userCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("user_data="));

  if (!userCookie) {
    return <Navigate to="/login-required" replace />;
  }

  return children;
};

export default AuthGuard;
