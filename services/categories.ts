import { HTTP_CLIENT } from "@/utils/axiosClient";
import apiEndpoints from "@/utils/apiConfig";

export interface CategoryItem {
  _id: string;
  title: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

class CategoriesService {
  async getCategories(): Promise<CategoryItem[]> {
    const { data } = await HTTP_CLIENT.get(apiEndpoints.Categories.LIST);
    return data?.data ?? data;
  }
}

const categoriesService = new CategoriesService();
export default categoriesService;
