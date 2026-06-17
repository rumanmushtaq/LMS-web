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
  Users: {
    PROFILE: "/api/v1/users/profile",
  },
  Certificates: {
    MY: "/api/v1/certificates/my",
  },
  Instructors: {
    LIST: "/api/v1/instructors",
    FILTER_OPTIONS: "/api/v1/instructors/filter-options",
    MY_STUDENTS: "/api/v1/instructors/my-students",
  },
  Onboarding: {
    UPLOAD: "/api/v1/tutors/onboarding/upload",
    VALIDATE_TAX: "/api/v1/tutors/onboarding/validate-tax",
    CONTRACT: "/api/v1/tutors/onboarding/contract",
    TAX_FORM: "/api/v1/tutors/onboarding/tax-form",
    KYC: "/api/v1/tutors/onboarding/kyc",
  },
  Shop: {
    PRODUCTS: "/api/v1/shop/products",
    PRODUCT_DETAILS: "/api/v1/shop/products/:id",
    CHECKOUT: "/api/v1/shop/checkout",
    CONFIRM_PAYMENT: "/api/v1/shop/confirm-payment",
    MY_ORDERS: "/api/v1/shop/my-orders",
  },
  Categories: {
    LIST: "/api/v1/categories",
  },
  Chat: {
    CONVERSATIONS: "/api/v1/chat/conversations",
    MESSAGES: (id: string) => `/api/v1/chat/conversations/${id}/messages`,
    BLOCK: (id: string) => `/api/v1/chat/conversations/${id}/block`,
    FLAG_MESSAGE: (id: string) => `/api/v1/chat/messages/${id}/flag`,
  },
  Notifications: {
    ALL: "/api/v1/notifications",
    READ_ALL: "/api/v1/notifications/read-all",
    READ_SINGLE: (id: string) => `/api/v1/notifications/${id}/read`,
  },
};

export default apiEndpoints;
