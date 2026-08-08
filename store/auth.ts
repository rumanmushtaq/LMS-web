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
  /** Replaces the token pair without touching the user — used after a refresh. */
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;

  // Getters
  getUser: () => AuthUser | null;
  getToken: () => string | null;
  isAuthenticated: () => boolean;
}

/**
 * Cookie lifetime tracks the *refresh* token (7 days). The access JWT expires
 * server-side long before that; a 401 drives the refresh. See lib/auth/session.
 */
const COOKIE_DAYS = 7;

const cookieOptions = {
  expires: COOKIE_DAYS,
  sameSite: "lax" as const,
  secure: typeof window !== "undefined" && window.location.protocol === "https:",
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        accessToken: null,
        refreshToken: null,

        login: (user, accessToken, refreshToken) => {
          // Persist tokens in cookies so the axios interceptor can read them
          Cookies.set("access_token", accessToken, cookieOptions);
          Cookies.set("refresh_token", refreshToken, cookieOptions);
          set({ user, accessToken, refreshToken });
        },

        setTokens: (accessToken, refreshToken) => {
          Cookies.set("access_token", accessToken, cookieOptions);
          Cookies.set("refresh_token", refreshToken, cookieOptions);
          set({ accessToken, refreshToken });
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
