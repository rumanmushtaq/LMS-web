import { HTTP_CLIENT } from "@/utils/axiosClient";
import apiEndpoints from "@/utils/apiConfig";

/**
 * Why a method cannot be used right now.
 *
 * The API reports every method an admin has enabled rather than hiding the
 * ones that are not ready, so the checkout can show the real line-up and
 * label what is still coming.
 */
export type PaymentMethodStatus = "available" | "coming_soon" | "unavailable";

export interface PaymentMethod {
  id: string;
  displayName: string;
  status: PaymentMethodStatus;
  /** Buyer-facing explanation for anything not `available`. */
  note?: string;
}

class PaymentsService {
  /** Methods to offer, in the order the admin configured. */
  async getMethods(): Promise<PaymentMethod[]> {
    const { data } = await HTTP_CLIENT.get(apiEndpoints.Payments.METHODS);
    const list = data?.data ?? data;
    return Array.isArray(list) ? list : [];
  }
}

export default new PaymentsService();
