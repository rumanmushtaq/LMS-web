import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import Cookies from "js-cookie";
import apiEndpoints from "./apiConfig";
import {
  endSession,
  loginUrlForCurrentPage,
  refreshSession,
} from "@/lib/auth/session";

interface ErrorResponseData {
  message?: string; // Define the `message` property as optional
}

export const HTTP_CLIENT_INSTANCE: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

/** Marks a request that has already been retried, so a retry can't recurse. */
type RetriableRequest = InternalAxiosRequestConfig & {
  _retriedAfterRefresh?: boolean;
};

/**
 * A page typically fires several requests at once, so an expired token
 * produces a burst of 401s. They all wait on one refresh rather than each
 * rotating the token and invalidating the others — the backend rotates the
 * refresh token on every use, so concurrent refreshes would log the user out.
 */
let inFlightRefresh: Promise<string | null> | null = null;

function refreshAccessTokenOnce(): Promise<string | null> {
  if (!inFlightRefresh) {
    inFlightRefresh = refreshSession().finally(() => {
      inFlightRefresh = null;
    });
  }
  return inFlightRefresh;
}

export const setupAxios = () => {
  // Request interceptor
  HTTP_CLIENT_INSTANCE.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // const authToken = store.getState()?.user?.accessToken;
      const accessToken = Cookies.get("access_token");
      const { LOGIN } = apiEndpoints.Auth;
      const publicEndpoints = [LOGIN];

      const isPublicEndpoint = publicEndpoints.some((endpoint) =>
        config.url?.includes(endpoint),
      );
      // Only the access token matters here. Requiring the refresh cookie too
      // meant that once it lapsed the header was silently dropped, so every
      // call 401'd while the app still believed it was signed in.
      if (accessToken && !isPublicEndpoint) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      if (!(config.data instanceof FormData)) {
        config.headers["Content-Type"] = "application/json";
      } else {
        // Let Axios set the correct multipart/form-data
        delete config.headers["Content-Type"];
      }
      return config;
    },
    (error: unknown) => {
      // console.error("Request error: ", error); // Suppressed to prevent Next.js Error overlay
      //   toast.error("Failed to send the request. Please try again.");
      return Promise.reject(error);
    },
  );

  // Response interceptor
  HTTP_CLIENT_INSTANCE.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError<ErrorResponseData>) => {
      // console.error("Response error: ", error); // Suppressed to prevent Next.js Error overlay

      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || "An error occurred.";
        const isAuthRoute =
          error.config?.url?.includes("/auth/login") ||
          error.config?.url?.includes("/auth/signup") ||
          error.config?.url?.includes("/auth/verify");

        if (status === 401 && !isAuthRoute) {
          const original = error.config as RetriableRequest | undefined;

          // One refresh attempt per request. Without the flag a request that
          // 401s again after refreshing would recurse.
          if (original && !original._retriedAfterRefresh) {
            original._retriedAfterRefresh = true;

            const accessToken = await refreshAccessTokenOnce();
            if (accessToken) {
              original.headers = original.headers ?? {};
              (original.headers as Record<string, string>).Authorization =
                `Bearer ${accessToken}`;
              return HTTP_CLIENT_INSTANCE(original);
            }
          }

          // Refresh is not possible or failed — end the session properly so the
          // store and cookies agree. Leaving the store populated is what made
          // the app keep rendering as signed in and bouncing off /login.
          await endSession({ redirectTo: loginUrlForCurrentPage() });
        } else if (status >= 400 && status < 500 && status !== 401) {
          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("api-error", {
                detail: {
                  variant: "destructive",
                  title: "Error",
                  description: message,
                },
              }),
            );
          }
        } else if (status >= 500) {
          // Server-side errors
          // toast.error("Server error. Please try again later.");
          console.log("Server error. Please try again later.");
        }
      } else if (error.request) {
        // Network or no response errors
        // toast.error("Network error. Please check your connection.");
        console.log("Network error. Please check your connection.");
      } else {
        // Unknown error
        // toast.error("An unexpected error occurred.");
        console.log("An unexpected error occurred.");
      }

      return Promise.reject(error);
    },
  );

  return HTTP_CLIENT_INSTANCE;
};

export const HTTP_CLIENT = setupAxios();
