import { HTTP_CLIENT } from '../utils/axiosClient';

const BASE = '/api/v1/tutor-materials';

export interface TutorMaterial {
  _id: string;
  tutorId: any;
  title: string;
  description: string;
  price: number;
  fileUrl: string;
  coverImageUrl?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTutorMaterialPayload {
  title: string;
  description: string;
  price: number;
  fileUrl: string;
  coverImageUrl?: string;
  isActive?: boolean;
}

export interface UploadedMaterialFile {
  url: string;
  fileId: string;
  name: string;
  size: number;
  sizeInMB: string;
}

export const getMaterials = async (params?: { tutorId?: string; isActive?: boolean }) => {
  const response = await HTTP_CLIENT.get(BASE, { params });
  return response.data?.data ?? response.data;
};

export const getMaterialById = async (id: string) => {
  const response = await HTTP_CLIENT.get(`${BASE}/${id}`);
  return response.data?.data ?? response.data;
};

export const createMaterial = async (payload: CreateTutorMaterialPayload) => {
  const response = await HTTP_CLIENT.post(BASE, payload);
  return response.data?.data ?? response.data;
};

export const updateMaterial = async (id: string, payload: Partial<CreateTutorMaterialPayload>) => {
  const response = await HTTP_CLIENT.patch(`${BASE}/${id}`, payload);
  return response.data?.data ?? response.data;
};

export const deleteMaterial = async (id: string) => {
  const response = await HTTP_CLIENT.delete(`${BASE}/${id}`);
  return response.data?.data ?? response.data;
};

export const purchaseMaterial = async (id: string) => {
  const response = await HTTP_CLIENT.post(`${BASE}/${id}/purchase`);
  return response.data?.data ?? response.data;
};

export const getPurchasedMaterials = async () => {
  const response = await HTTP_CLIENT.get(`${BASE}/student/purchases`);
  return response.data?.data ?? response.data;
};

/**
 * Upload a material file (PDF, ZIP, etc.) to the backend, which stores it in ImageKit.
 * Max file size: 100MB. Calls POST /tutor-materials/upload.
 * @param file - The File object selected by the user
 * @param onProgress - Optional callback to track upload progress (0-100)
 */
export const uploadMaterialFile = async (
  file: File,
  onProgress?: (progress: number) => void,
): Promise<UploadedMaterialFile> => {
  const formData = new FormData();
  formData.append('file', file);

  // HTTP_CLIENT auto-removes Content-Type for FormData so multipart boundary is set correctly
  const response = await HTTP_CLIENT.post<any>(`${BASE}/upload`, formData, {
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });

  return response.data?.data ?? response.data;
};
