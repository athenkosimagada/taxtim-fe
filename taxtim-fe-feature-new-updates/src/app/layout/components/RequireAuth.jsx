import { Navigate } from "react-router-dom";
import { useAuth } from "../../../features/auth/hooks/useAuth";

export default function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
}
