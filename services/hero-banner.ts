import axiosInstance from "@/utils/axiosInstance";

export const HeroBannerService = {
  getActiveBanners: async () => {
    const { data } = await axiosInstance.get("/api/v1/admin/hero-banner/active");
    // API returns { success: true, data: [...] } — unwrap the array
    return Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
  },
};

