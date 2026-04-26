import { HTTP_CLIENT } from "@/utils/axiosClient";
import apiEndpoints from "@/utils/apiConfig";

export interface Certificate {
  _id: string;
  studentId: string;
  courseName: string;
  date: string;
  marks: number;
  outOf: number;
  downloadUrl: string;
}

class CertificatesService {
  /**
   * GET /api/v1/certificates/my
   * Returns current student's certificates
   */
  async getMyCertificates(): Promise<Certificate[]> {
    const { data } = await HTTP_CLIENT.get(apiEndpoints.Certificates.MY);
    return data?.data ?? data;
  }
}

export default new CertificatesService();
