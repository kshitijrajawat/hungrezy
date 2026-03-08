import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function PrivateRoute({ children }) {
  const { auth } = useAuth();
  return auth?.token ? children : <Navigate to="/login" replace />;
}

export function AdminRoute({ children }) {
  const { auth } = useAuth();
  if (!auth?.token) return <Navigate to="/login" replace />;
  if (auth.user?.role !== 1) return <Navigate to="/" replace />;
  return children;
}
