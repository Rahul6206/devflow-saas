import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

// Redirects authenticated users AWAY from login/register to dashboard
const GuestRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default GuestRoute;
