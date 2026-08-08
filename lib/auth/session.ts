import axios from "axios";
import Cookies from "js-cookie";
import { useAuthStore } from "@/store/auth";
import apiEndpoints from "@/utils/apiConfig";

/**
 * Session lifecycle in one place.
 *
 * The cookies and the Zustand store have to move together. When they drift —
 * cookies cleared but the store still holding a token — the app renders as
 * signed in while every request goes out unauthenticated, and each 401 bounces
 * the user back to /login in a loop.
 */

export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

/**
 * Both cookies live as long as the *refresh* token, not the access token.
 * The access JWT expires server-side well before this (15 minutes by default);
 * expiry is enforced by the API rejecting it, which triggers a refresh. Giving
 * the cookie a shorter life than the refresh token only removes the header and
 * produces the same 401 by a more confusing route.
 */
const SESSION_DAYS = 7;

const cookieOptions = {
  expires: SESSION_DAYS,
  sameSite: "lax" as const,
  // Plain http in local dev would drop a `secure` cookie entirely.
  secure: typeof window !== "undefined" && window.location.protocol === "https:",
};

export function getAccessToken(): string | undefined {
  return Cookies.get(ACCESS_TOKEN_COOKIE);
}

export function getRefreshToken(): string | undefined {
  return Cookies.get(REFRESH_TOKEN_COOKIE);
}

/** Writes a fresh token pair to both cookies and the store. */
export function persistTokens(accessToken: string, refreshToken: string) {
  Cookies.set(ACCESS_TOKEN_COOKIE, accessToken, cookieOptions);
  Cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, cookieOptions);
  useAuthStore.getState().setTokens(accessToken, refreshToken);
}

/**
 * Exchanges the refresh token for a new pair.
 *
 * Deliberately uses a bare axios instance: routing this through the shared
 * client would send it back into the 401 interceptor that called us.
 */
export async function refreshSession(): Promise<string | null> {
  const refreshToken = getRefreshToken() ?? useAuthStore.getState().refreshToken;
  if (!refreshToken) return null;

  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}${apiEndpoints.Auth.REFRESH_TOKEN}`,
      { refreshToken },
      { headers: { "Content-Type": "application/json" } },
    );

    const tokens = data?.data ?? data;
    if (!tokens?.accessToken || !tokens?.refreshToken) return null;

    persistTokens(tokens.accessToken, tokens.refreshToken);
    return tokens.accessToken;
  } catch {
    return null;
  }
}

/**
 * Ends the session everywhere: server, cookies, store, and finally the URL.
 *
 * `notifyServer` is opt-in because the 401 path has, by definition, no usable
 * access token — calling logout there would just 401 again.
 */
export async function endSession(options?: {
  notifyServer?: boolean;
  redirectTo?: string | null;
}): Promise<void> {
  const { notifyServer = false, redirectTo = "/login" } = options ?? {};

  if (notifyServer && getAccessToken()) {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}${apiEndpoints.Auth.LOGOUT}`,
        {},
        { headers: { Authorization: `Bearer ${getAccessToken()}` } },
      );
    } catch {
      // The local session still has to end even if the server call fails.
    }
  }

  // Clears cookies and store together.
  useAuthStore.getState().logout();

  if (redirectTo && typeof window !== "undefined") {
    window.location.href = redirectTo;
  }
}

/** Path the user should come back to after signing in again. */
export function loginUrlForCurrentPage(): string {
  if (typeof window === "undefined") return "/login";

  const path = window.location.pathname;
  if (path === "/login" || path === "/signup") return "/login";

  return `/login?redirect=${encodeURIComponent(path + window.location.search)}`;
}
