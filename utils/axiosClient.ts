import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import Cookies from "js-cookie";
import apiEndpoints from "./apiConfig";

interface ErrorResponseData {
  message?: string; // Define the `message` property as optional
}

export const HTTP_CLIENT_INSTANCE: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const setupAxios = () => {
  // Request interceptor
  HTTP_CLIENT_INSTANCE.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // const authToken = store.getState()?.user?.accessToken;
      const accessToken = Cookies.get("access_token");
      const refreshToken = Cookies.get("refresh_token");
      const { LOGIN } = apiEndpoints.Auth;
      const publicEndpoints = [LOGIN];

      const isPublicEndpoint = publicEndpoints.some((endpoint) =>
        config.url?.includes(endpoint),
      );
      if (accessToken && refreshToken && !isPublicEndpoint) {
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
      console.error("Request error: ", error);
      //   toast.error("Failed to send the request. Please try again.");
      return Promise.reject(error);
    },
  );

  // Response interceptor
  HTTP_CLIENT_INSTANCE.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError<ErrorResponseData>) => {
      console.error("Response error: ", error);

      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || "An error occurred.";

        if (status === 401) {
          // Unauthorized error: Redirect to login
          // toast.error("Session expired. Please log in again.");

          console.log("Session expired. Please log in again.");
          window.location.href = "/auth/login";
        } else if (status >= 400 && status < 500) {
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
