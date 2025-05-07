import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ element, requiredRole }) => {
  const { user, token } = useAuth();

  if (!token) {
    console.log("User not logged in - Redirecting to login.");
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    console.log(`Unauthorized access - Redirecting. User role: ${user?.role}`);
    return <Navigate to="/" replace />;
  }

  return element;
};

export default ProtectedRoute;
