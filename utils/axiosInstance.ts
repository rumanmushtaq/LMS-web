import axios, { InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth";
import apiEndpoints from "./apiConfig";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Token
axiosInstance.interceptors.request.use(
  (config) => {
    let token = Cookies.get("access_token");
    if (!token) {
      token = useAuthStore.getState().accessToken || undefined;
    }
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
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const isAuthRoute =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/signup") ||
      originalRequest.url?.includes("/auth/verify") ||
      originalRequest.url?.includes("/auth/refresh");

    if (status === 401 && !isAuthRoute) {
      if (!originalRequest._retry) {
        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axiosInstance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = Cookies.get("refresh_token");
        if (refreshToken) {
          return axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}${apiEndpoints.Auth.REFRESH_TOKEN}`,
            { refreshToken },
            { headers: { "Content-Type": "application/json" } }
          )
          .then((response) => {
            const newAccessToken = response.data?.data?.accessToken || response.data?.accessToken;
            const newRefreshToken = response.data?.data?.refreshToken || response.data?.refreshToken;
            
            if (newAccessToken) {
              Cookies.set("access_token", newAccessToken, { expires: 1 });
              if (newRefreshToken) {
                Cookies.set("refresh_token", newRefreshToken, { expires: 7 });
              }
              
              const authStore = useAuthStore.getState();
              if (authStore.user) {
                authStore.login(authStore.user, newAccessToken, newRefreshToken || refreshToken);
              }

              processQueue(null, newAccessToken);
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return axiosInstance(originalRequest);
            }
          })
          .catch((refreshError) => {
            processQueue(refreshError, null);
            toast.error("Unauthorized: Session expired or invalid token. Please log in again.");
            Cookies.remove("access_token");
            Cookies.remove("refresh_token");
            if (typeof window !== "undefined") {
              const currentPath = window.location.pathname;
              if (currentPath !== "/login" && currentPath !== "/signup") {
                window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
              } else {
                window.location.href = "/login";
              }
            }
            return Promise.reject(refreshError);
          })
          .finally(() => {
            isRefreshing = false;
          });
        } else {
          toast.error("Unauthorized: Session expired or invalid token. Please log in again.");
          Cookies.remove("access_token");
          Cookies.remove("refresh_token");
          if (typeof window !== "undefined") {
            const currentPath = window.location.pathname;
            if (currentPath !== "/login" && currentPath !== "/signup") {
              window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
            } else {
              window.location.href = "/login";
            }
          }
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
