// src/store/authStore.ts
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import Cookies from "js-cookie";

// User type matching backend response
export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
};

// Auth store state and actions
interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;

  // Actions
  login: (user: AuthUser, accessToken: string, refreshToken: string) => void;
  logout: () => void;

  // Getters
  getUser: () => AuthUser | null;
  getToken: () => string | null;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        accessToken: null,
        refreshToken: null,

        login: (user, accessToken, refreshToken) => {

          console.log("login", user, accessToken, refreshToken);

          
          // Persist tokens in cookies so axios interceptor can read them
          Cookies.set("access_token", accessToken, { expires: 1 }); // 1 day
          Cookies.set("refresh_token", refreshToken, { expires: 7 }); // 7 days
          set({ user, accessToken, refreshToken });
        },

        logout: () => {
          Cookies.remove("access_token");
          Cookies.remove("refresh_token");
          set({ user: null, accessToken: null, refreshToken: null });
        },

        getUser: () => get().user,
        getToken: () => get().accessToken,
        isAuthenticated: () => !!get().accessToken,
      }),
      {
        name: "lms-auth-storage",
        // Only persist non-sensitive data; tokens also stay in cookies
        partialize: (state) => ({
          user: state.user,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
        }),
      },
    ),
  ),
);
