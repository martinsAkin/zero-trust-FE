import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function ProtectedRoute({
  children,
  staffOnly = false,
}: {
  children: ReactNode;
  staffOnly?: boolean;
}) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (staffOnly && user.role !== "staff") {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}
