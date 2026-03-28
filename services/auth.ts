import { ForgotFormValues } from "@/schemas/forgot-password";
import { LoginFormValues } from "@/schemas/login";
import { NewPasswordFormValues } from "@/schemas/new-password";
import { SignupFormValues } from "@/schemas/signup";
import apiEndpoints from "@/utils/apiConfig";
import { HTTP_CLIENT } from "@/utils/axiosClient";

class AuthService {
  /**
   * POST /api/v1/auth/login
   * Returns { user, accessToken, refreshToken }
   */
  async loginApi(params: LoginFormValues): Promise<any> {
    const payload = {
      email: params.email,
      password: params.password,
    };
    const { data } = await HTTP_CLIENT.post(apiEndpoints.Auth.LOGIN, payload);
    return data;
  }

  /**
   * POST /api/v1/auth/signup
   * Returns { message } – user then gets a verification email
   */
  async signupApi(
    params: Omit<SignupFormValues, "terms" | "confirmPassword">,
  ): Promise<any> {
    const payload = {
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email,
      password: params.password,
      role: params.role,
    };
    const { data } = await HTTP_CLIENT.post(
      apiEndpoints.Auth.REGISTER,
      payload,
    );
    return data;
  }

  /**
   * POST /api/v1/auth/forgot-password
   * Returns { message } – sends reset email
   */
  async forgetPasswordApi(params: ForgotFormValues): Promise<any> {
    const payload = { email: params.email };
    const { data } = await HTTP_CLIENT.post(
      apiEndpoints.Auth.FORGOT_PASSWORD,
      payload,
    );
    return data;
  }

  /**
   * POST /api/v1/auth/verify-email
   * Verifies the token received in email
   * { token: string }
   */
  async otpVerificationApi(token: string): Promise<any> {
    const { data } = await HTTP_CLIENT.post(
      apiEndpoints.Auth.OTP_VERIFICATION,
      { token },
    );
    return data;
  }

  /**
   * POST /api/v1/auth/resend-verification
   * Resends the verification email
   */
  async resendVerificationEmail(email: string): Promise<any> {
    const { data } = await HTTP_CLIENT.post(
      apiEndpoints.Auth.RESEND_VERIFICATION_EMAIL,
      { email },
    );
    return data;
  }

  /**
   * POST /api/v1/auth/reset-password
   * Resets the password using a token from the reset email
   */
  async resetPasswordApi(params: {
    token: string;
    newPassword: string;
  }): Promise<any> {
    const { data } = await HTTP_CLIENT.post(apiEndpoints.Auth.RESET_PASSWORD, {
      token: params.token,
      newPassword: params.newPassword,
    });
    return data;
  }

  /**
   * POST /api/v1/auth/change-password
   * For logged-in users to change their own password
   */
  async changePassword(params: NewPasswordFormValues): Promise<any> {
    const payload = {
      currentPassword: params.currentPassword,
      newPassword: params.password,
    };
    const res = await HTTP_CLIENT.post(
      apiEndpoints.Auth.CHANGE_PASSWORD,
      payload,
    );
    return { success: true, data: res.data };
  }

  /**
   * GET /api/v1/auth/me
   * Returns current logged-in user's profile
   */
  async getMeApi(): Promise<any> {
    const { data } = await HTTP_CLIENT.get(apiEndpoints.Auth.ME);
    return data;
  }

  /**
   * POST /api/v1/auth/logout
   */
  async logoutApi(): Promise<any> {
    const { data } = await HTTP_CLIENT.post(apiEndpoints.Auth.LOGOUT);
    return data;
  }
}

export default new AuthService();
