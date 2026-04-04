import API from "./axios";

// Register a new user
export const registerUser = (userData) => {
  return API.post("/auth/signup", userData);
};

// Login user
export const loginUser = (credentials) => {
  return API.post("/auth/login", credentials);
};

// Google Login
export const googleAuth = (credential) => {
  return API.post("/auth/google", { credential });
};

export const sendOtp = (userData) => {
  return API.post("/auth/send-otp", userData);
};

// Logout user (backend expects { token } = refreshToken)
export const logoutUser = (refreshToken) => {
  return API.delete("/auth/logout", { data: { token: refreshToken } });
};

// Get current user profile
export const getMe = () => {
  return API.get("/auth/me");
};

// Refresh access token (backend expects { token } = refreshToken)
export const refreshAccessToken = (refreshToken) => {
  return API.post("/auth/refresh", { token: refreshToken });
};

// Update user profile
export const updateProfile = (data) => {
  return API.patch("/auth/profile", data);
};
