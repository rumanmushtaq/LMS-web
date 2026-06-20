import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface NotificationItem {
  _id: string;
  type: string;
  title: string;
  content: string;
  senderId?: string;
  createdAt: string;
  read: boolean;
  actionPayload?: any;
}

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  addNotification: (notification: Omit<NotificationItem, '_id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      fetchNotifications: async () => {
        try {
          const { default: notificationsService } = await import('@/services/notifications');
          const data = await notificationsService.getNotifications({ limit: 10, isRead: false });
          set({
            notifications: data.data || [],
            unreadCount: data.meta?.unreadCount || 0,
          });
        } catch (error) {
          console.error("Failed to fetch notifications", error);
        }
      },
      addNotification: (notification) => set((state) => {
        // Prevent duplicate recent notifications for the same event
        if (state.notifications.some(n => 
            n.content === notification.content && 
            n.senderId === notification.senderId &&
            Date.now() - new Date(n.createdAt).getTime() < 5000
        )) {
          return state;
        }

        return {
          notifications: [
            {
              ...notification,
              _id: Date.now().toString() + Math.random().toString(36).substring(7),
              createdAt: new Date().toISOString(),
              read: false,
            },
            ...state.notifications,
          ].slice(0, 50), // Keep the last 50 notifications
          unreadCount: state.unreadCount + 1,
        };
      }),
      markAsRead: async (id) => {
        try {
          // Optimistic update
          set((state) => {
            const isUnread = state.notifications.find(n => n._id === id && !n.read);
            return {
              notifications: state.notifications.map((n) =>
                n._id === id ? { ...n, read: true } : n
              ),
              unreadCount: isUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
            };
          });
          const { default: notificationsService } = await import('@/services/notifications');
          // Only make API call if it's a real backend ID (length > 20, roughly)
          if (id.length > 20) {
             await notificationsService.markAsRead(id);
          }
        } catch (error) {
          console.error("Failed to mark as read", error);
        }
      },
      markAllAsRead: async () => {
        try {
           set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
            unreadCount: 0
          }));
          const { default: notificationsService } = await import('@/services/notifications');
          await notificationsService.markAllAsRead();
        } catch (error) {
          console.error("Failed to mark all as read", error);
        }
      },
      clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
    }),
    {
      name: 'lms-notifications',
      partialize: (state) => ({ notifications: state.notifications, unreadCount: state.unreadCount }),
    }
  )
);
