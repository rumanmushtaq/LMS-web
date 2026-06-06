import { HTTP_CLIENT } from "@/utils/axiosClient";
import apiEndpoints from "@/utils/apiConfig";

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  sizes: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsListResponse {
  data: Product[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

class ProductsService {
  async getProducts(
    params: GetProductsParams = {},
  ): Promise<ProductsListResponse> {
    const { data } = await HTTP_CLIENT.get(apiEndpoints.Shop.PRODUCTS, {
      params,
    });
    // The backend wraps everything in { success: true, data: ... }
    return data?.data ?? data;
  }

  async getProductById(id: string): Promise<Product> {
    const { data } = await HTTP_CLIENT.get(
      apiEndpoints.Shop.PRODUCT_DETAILS.replace(":id", id),
    );
    return data?.data ?? data;
  }
}

export default new ProductsService();
