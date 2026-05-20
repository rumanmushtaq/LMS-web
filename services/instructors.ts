import { HTTP_CLIENT } from "@/utils/axiosClient";
import apiEndpoints from "@/utils/apiConfig";

export interface InstructorProfile {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  avatar: string | null;
  photoUrl?: string | null;
  title: string | null;
  bio: string | null;
  specialties: string[];
  categories: string[];
  level: string | null;
  rating: number;
  reviewCount: number;
  lessonCount: number;
  totalDurationMinutes: number;
  studentCount: number;
  hourlyRate: number | null;
  createdAt: string;
}

export interface InstructorsListResponse {
  data: InstructorProfile[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface FilterOption {
  name: string;
  count: number;
}

export interface InstructorFilterOption {
  _id: string;
  fullName: string;
  count: number;
  photoUrl?: string;
}

export interface FilterOptionsResponse {
  categories: FilterOption[];
  levels: FilterOption[];
  instructors: InstructorFilterOption[];
  priceRange: { min: number; max: number };
}

export interface GetInstructorsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  level?: string;
  instructorIds?: string[];
  priceMin?: number;
  priceMax?: number;
  sortBy?: string;
}

export interface MyStudent {
  _id: string;
  fullName: string;
  avatar: string | null;
  location: string | null;
  joinDate: string;
  courseCount: number;
}

export interface MyStudentsResponse {
  data: MyStudent[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

class InstructorsService {
  async getInstructors(
    params: GetInstructorsParams = {},
  ): Promise<InstructorsListResponse> {
    const { instructorIds, ...rest } = params;
    const queryParams: Record<string, string | number | string[]> = {
      ...rest,
    };
    if (instructorIds && instructorIds.length > 0) {
      queryParams["instructorIds"] = instructorIds;
    }
    const { data } = await HTTP_CLIENT.get(apiEndpoints.Instructors.LIST, {
      params: queryParams,
    });
    // The backend wraps everything in { success: true, data: ... }
    // data?.data extracts the actual payload (InstructorListResponse)
    return data?.data ?? data;
  }

  async getFilterOptions(): Promise<FilterOptionsResponse> {
    const { data } = await HTTP_CLIENT.get(
      apiEndpoints.Instructors.FILTER_OPTIONS,
    );
    return data?.data ?? data;
  }

  async getMyStudents(
    params: {
      page?: number;
      limit?: number;
      search?: string;
    } = {},
  ): Promise<MyStudentsResponse> {
    const { data } = await HTTP_CLIENT.get(
      apiEndpoints.Instructors.MY_STUDENTS,
      {
        params,
      },
    );
    return data?.data ?? data;
  }
}

export default new InstructorsService();
