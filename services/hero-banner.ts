import axiosInstance from "@/utils/axiosInstance";

export const HeroBannerService = {
  getActiveBanners: async () => {
    const { data } = await axiosInstance.get("/admin/hero-banner/active");
    return data;
  },
};
