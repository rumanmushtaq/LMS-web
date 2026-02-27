// src/store/authStore.ts
import { create } from "zustand"
import { persist, devtools } from "zustand/middleware"

// Define User type
type User = {
  id: string
  name: string
  email: string
}

// Define Auth store state and actions
interface AuthState {
  user: User | null
  token: string | null

  // Actions to update state
  login: (user: User, token: string) => void
  logout: () => void

  // Getters for convenience
  getUser: () => User | null
  getToken: () => string | null
}

// Create store
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        token: null,

        // Update state
        login: (user, token) => set({ user, token }),
        logout: () => set({ user: null, token: null }),

        // Get current state without modifying it
        getUser: () => get().user,
        getToken: () => get().token,
      }),
      {
        name: "auth-storage", // localStorage key
      }
    )
  )
)