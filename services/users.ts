import { HTTP_CLIENT } from "@/utils/axiosClient";
import apiEndpoints from "@/utils/apiConfig";

export interface StudentProfile {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  kycData?: {
    avatar?: string;
    phone?: string;
    gender?: string;
    dob?: string;
    bio?: string;
    [key: string]: any;
  };
  createdAt: string;
}

export interface UpdateProfileParams {
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: string;
  dob?: string;
  bio?: string;
  profilePicture?: string;
  education?: {
    degree: string;
    institution: string;
    period: string;
  }[];
  experience?: {
    role: string;
    company: string;
    period: string;
  }[];

  // Tutor profile fields. All are rendered on the profile pages; until the
  // matching DTO fields existed the API rejected every one of them.
  title?: string;
  address?: string;
  country?: string;
  timezone?: string;
  category?: string;
  /** Teaching experience level — distinct from the `experience` array. */
  level?: string;
  specialties?: string[];
  spokenLanguages?: string[];
  nativeLanguage?: string;
  certifications?: string[];
  pricePerHour?: number;
  availability?: { day: string; startTime: string; endTime: string }[];
  social?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
  };
}

class UsersService {
  /**
   * GET /api/v1/users/profile
   * Returns current user's profile
   */
  async getProfile(): Promise<StudentProfile> {
    const { data } = await HTTP_CLIENT.get(apiEndpoints.Users.PROFILE);
    return data?.data ?? data;
  }

  /**
   * PATCH /api/v1/users/profile
   * Updates current user's profile
   */
  async updateProfile(params: UpdateProfileParams): Promise<StudentProfile> {
    const { data } = await HTTP_CLIENT.patch(
      apiEndpoints.Users.PROFILE,
      params,
    );
    return data?.data ?? data;
  }
}

export default new UsersService();
