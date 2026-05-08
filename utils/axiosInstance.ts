import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor: Global Error Handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response ? error.response.status : null;
    const isAuthRoute =
      error.config?.url?.includes("/auth/login") ||
      error.config?.url?.includes("/auth/signup") ||
      error.config?.url?.includes("/auth/verify");

    if (status === 401 && !isAuthRoute) {
      toast.error(
        "Unauthorized: Session expired or invalid token. Please log in again.",
      );

      // Optional: Clear storage and redirect
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        if (currentPath !== "/login" && currentPath !== "/signup") {
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }
      }
    } else if (status === 403) {
      toast.error(
        "Forbidden: You do not have permission to perform this action.",
      );
    } else if (status === 500) {
      toast.error(
        "Server Error: Something went wrong on our end. Please try again later.",
      );
    } else {
      // toast.error(error.response?.data?.message || "An unexpected error occurred.");
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
