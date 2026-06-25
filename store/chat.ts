import { create } from 'zustand';

interface ChatState {
  isOpen: boolean;
  activeUserId: string | null;
  activeUserName: string | null;
  openChat: (userId: string, userName: string) => void;
  closeChat: () => void;
  toggleChat: () => void;
  clearActiveChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  isOpen: false,
  activeUserId: null,
  activeUserName: null,
  openChat: (userId, userName) => set({ isOpen: true, activeUserId: userId, activeUserName: userName }),
  closeChat: () => set({ isOpen: false, activeUserId: null, activeUserName: null }),
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  clearActiveChat: () => set({ activeUserId: null, activeUserName: null }),
}));
