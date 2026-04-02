import { useEffect, useState } from "react";
import useAuthStore from "../../store/authStore";
import { getMe } from "../../api/authApi";

// On app load, verify the access token is still valid by calling /auth/me.
// If the token is expired (401), the Axios interceptor will auto-refresh it.
// If refresh also fails, the interceptor clears tokens & redirects to /login.
const AuthProvider = ({ children }) => {
  const { isAuthenticated, setUser, logout } = useAuthStore();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (!isAuthenticated) {
        setIsVerifying(false);
        return;
      }

      try {
        // Call /auth/me — if 401, Axios interceptor handles refresh
        const { data } = await getMe();
        setUser(data);
      } catch (error) {
        // Both access token and refresh token are invalid
        logout();
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAuth();
  }, []);

  // Show loading screen while verifying token
  if (isVerifying) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f0f1a",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            border: "3px solid rgba(108, 99, 255, 0.2)",
            borderTop: "3px solid #6c63ff",
            borderRadius: "50%",
            animation: "spin 0.6s linear infinite",
          }}
        />
      </div>
    );
  }

  return children;
};

export default AuthProvider;
