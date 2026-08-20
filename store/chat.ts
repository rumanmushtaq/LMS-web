import { create } from 'zustand';

interface ChatState {
  isOpen: boolean;
  activeUserId: string | null;
  activeUserName: string | null;
  /**
   * The exact conversation to open, when known (e.g. from a notification).
   * Preferred over re-deriving one from activeUserId — deriving by user only
   * finds a 2-person DM, so a message from a group/class Q&A room would open
   * (or create) the wrong conversation.
   */
  activeConversationId: string | null;
  openChat: (
    userId: string,
    userName: string,
    conversationId?: string | null,
  ) => void;
  closeChat: () => void;
  toggleChat: () => void;
  clearActiveChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  isOpen: false,
  activeUserId: null,
  activeUserName: null,
  activeConversationId: null,
  openChat: (userId, userName, conversationId = null) =>
    set({
      isOpen: true,
      activeUserId: userId,
      activeUserName: userName,
      activeConversationId: conversationId,
    }),
  closeChat: () =>
    set({
      isOpen: false,
      activeUserId: null,
      activeUserName: null,
      activeConversationId: null,
    }),
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  clearActiveChat: () =>
    set({ activeUserId: null, activeUserName: null, activeConversationId: null }),
}));
