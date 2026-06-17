import apiEndpoints from "@/utils/apiConfig";
import { HTTP_CLIENT } from "@/utils/axiosClient";

class NotificationsService {
  /**
   * GET /api/v1/notifications
   */
  async getNotifications(params?: {
    page?: number;
    limit?: number;
    sortOrder?: 'asc' | 'desc';
    isRead?: boolean;
  }): Promise<any> {
    const { data } = await HTTP_CLIENT.get(apiEndpoints.Notifications.ALL, {
      params,
    });
    return data;
  }

  /**
   * PATCH /api/v1/notifications/read-all
   */
  async markAllAsRead(): Promise<any> {
    const { data } = await HTTP_CLIENT.patch(
      apiEndpoints.Notifications.READ_ALL,
    );
    return data;
  }

  /**
   * PATCH /api/v1/notifications/:id/read
   */
  async markAsRead(id: string): Promise<any> {
    const { data } = await HTTP_CLIENT.patch(
      apiEndpoints.Notifications.READ_SINGLE(id),
    );
    return data;
  }
}

export default new NotificationsService();
