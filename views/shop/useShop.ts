import { useQuery } from "@tanstack/react-query";
import productsService, { Product } from "@/services/products";

const useShop = () => {
  const {
    data: products = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await productsService.getProducts();
      return response.data;
    },
  });

  return {
    products,
    loading,
    error: error instanceof Error ? error.message : (error as string | null),
  };
};

export default useShop;
