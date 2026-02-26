import { ForgotFormValues } from "@/schemas/forgot-password";
import { LoginFormValues } from "@/schemas/login";
import { NewPasswordFormValues } from "@/schemas/new-password";
import { OtpFormValues } from "@/schemas/otp";
import { SignupFormValues } from "@/schemas/signup";
import apiEndpoints from "@/utils/apiConfig";
import { HTTP_CLIENT } from "@/utils/axiosClient";

class AuthService {
  async loginApi(params: LoginFormValues): Promise<any> {
    const payload = {
      email: params.email,
      password: params.password,
    };
    try {
      const { data } = await HTTP_CLIENT.post(apiEndpoints.Auth.LOGIN, payload);
      return data;
    } catch (error: any) {
      return error.message;
    }
  }

  async signupApi(params: SignupFormValues): Promise<any> {
    const payload = {
      fullName: params.fullName,
      email: params.email,
      password: params.password,
      terms: params.terms,
    };
    try {
      const { data } = await HTTP_CLIENT.post(
        apiEndpoints.Auth.REGISTER,
        payload,
      );
      return data;
    } catch (error: any) {
      return error.message;
    }
  }

  async forgetPasswordApi(params: ForgotFormValues): Promise<any> {
    const payload = {
      email: params.email,
    };
    try {
      const { data } = await HTTP_CLIENT.post(
        apiEndpoints.Auth.FORGET_PASSWORD,
        payload,
      );
      return data;
    } catch (error: any) {
      return error.message;
    }
  }

  async otpVerificationApi(params: OtpFormValues): Promise<any> {
    const payload = {
      email: params.otp,
    };
    try {
      const { data } = await HTTP_CLIENT.post(
        apiEndpoints.Auth.OTP_VERIFICATION,
        payload,
      );
      return data;
    } catch (error: any) {
      return error.message;
    }
  }

  async changePassword(params: NewPasswordFormValues): Promise<any> {
    const payload = {
      currentPassword: params.currentPassword,
      newPassword: params.password,
    };

    try {
      const res = await HTTP_CLIENT.post(
        apiEndpoints.Auth.CHANGE_PASSWORD,
        payload,
      );
      return {
        success: true,
        data: res.data,
      };
    } catch (error: any) {
      return {
        success: false,
        data: error.message,
      };
    }
  }

  //   async updateProfile(params: ProfileUpdateFormValues): Promise<any> {
  //     try {
  //       const res = await HTTP_CLIENT.put(apiEndpoints.Users.PROFILE, params);
  //       return {
  //         success: true,
  //         data: res.data,
  //       };
  //     } catch (error: any) {
  //       return {
  //         success: false,
  //         data: error.message,
  //       };
  //     }
  //   }
}
export default new AuthService();
