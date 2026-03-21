const apiEndpoints = {
  Auth: {
    LOGIN: "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/signup",
    VERIFY_EMAIL: "/api/v1/auth/verify-email",
    RESEND_VERIFICATION_EMAIL: "/api/v1/auth/resend-verification",
    RESET_PASSWORD: "/api/v1/auth/reset-password",
    FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
    // Fixed: was pointing to /auth/otp which doesn't exist on the backend
    OTP_VERIFICATION: "/api/v1/auth/verify-email",
    CHANGE_PASSWORD: "/api/v1/auth/change-password",
    LOGOUT: "/api/v1/auth/logout",
    REFRESH_TOKEN: "/api/v1/auth/refresh",
    ME: "/api/v1/auth/me",
    TWO_FACTOR_AUTH: "/api/v1/auth/2fa",
    TWO_FACTOR_AUTH_VERIFY: "/api/v1/auth/2fa/verify",
  },
};

export default apiEndpoints;
