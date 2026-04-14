import { useEffect, useState } from "react";
import useAuthStore from "../../store/authStore";
import { getMe, refreshAccessToken } from "../../api/authApi";

// On app load, verify the access token is still valid by calling /auth/me.
// If the token is expired (401), the Axios interceptor will auto-refresh it.
// If refresh also fails, the interceptor clears tokens & redirects to /login.
const AuthProvider = ({ children }) => {
  const { isAuthenticated, setUser, setAuth, logout, refreshToken } = useAuthStore();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (!isAuthenticated) {
        setIsVerifying(false);
        return;
      }

      try {
        // Try to get user info
        const { data } = await getMe();
        setUser(data);
      } catch (error) {
        // If 401, try to refresh token
        if (error?.response?.status === 401 && refreshToken) {
          try {
            const { data: refreshData } = await refreshAccessToken(refreshToken);
            setAuth(
              refreshData.accessToken,
              refreshData.refreshToken 
            );
            // Retry getMe with new token
            const { data: userData } = await getMe();
            setUser(userData);
          } catch (refreshError) {
            logout();
          }
        } else {
          logout();
        }
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
