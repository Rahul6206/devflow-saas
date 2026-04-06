import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      // Initial State (No direct localStorage calls here!)
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      // Set user after login/register
      setAuth: (user, accessToken, refreshToken) => set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
      }),

      // Set user data (from /me endpoint)
      setUser: (user) => set({ user }),

      // Logout — clear everything
      logout: () => set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      }),

      // Loading state
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "auth-storage", // The key used in localStorage
      // Optional: You can choose to only persist specific fields
      partialize: (state) => ({ 
        accessToken: state.accessToken, 
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);

export default useAuthStore;