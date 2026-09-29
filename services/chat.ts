import apiEndpoints from "@/utils/apiConfig";
import { HTTP_CLIENT } from "@/utils/axiosClient";
import type { ChatAttachment } from "@/lib/chat/attachment";

class ChatService {
  async initConversation(targetUserId: string): Promise<any> {
    const { data } = await HTTP_CLIENT.post(apiEndpoints.Chat.CONVERSATIONS, { targetUserId });
    return data;
  }

  async getConversations(): Promise<any> {
    const { data } = await HTTP_CLIENT.get(apiEndpoints.Chat.CONVERSATIONS);
    return data;
  }

  async getMessages(conversationId: string, skip = 0, limit = 50): Promise<any> {
    const { data } = await HTTP_CLIENT.get(apiEndpoints.Chat.MESSAGES(conversationId), {
      params: { skip, limit },
    });
    return data;
  }

  /** Clears the unread badge for a conversation the user has just opened. */
  async markConversationRead(conversationId: string): Promise<any> {
    const { data } = await HTTP_CLIENT.post(apiEndpoints.Chat.MARK_READ(conversationId));
    return data;
  }

  async blockConversation(conversationId: string): Promise<any> {
    const { data } = await HTTP_CLIENT.post(apiEndpoints.Chat.BLOCK(conversationId));
    return data;
  }

  async unblockConversation(conversationId: string): Promise<any> {
    const { data } = await HTTP_CLIENT.post(apiEndpoints.Chat.UNBLOCK(conversationId));
    return data;
  }

  async deleteConversation(conversationId: string): Promise<any> {
    const { data } = await HTTP_CLIENT.delete(apiEndpoints.Chat.DELETE(conversationId));
    return data;
  }

  async flagMessage(messageId: string, reason: string): Promise<any> {
    const { data } = await HTTP_CLIENT.post(apiEndpoints.Chat.FLAG_MESSAGE(messageId), { reason });
    return data;
  }

  /**
   * Uploads a file for a conversation and returns the stored attachment.
   *
   * The axios client strips Content-Type for FormData so the multipart
   * boundary is set correctly — do not set it here.
   */
  async uploadAttachment(
    file: File,
    conversationId: string,
    onProgress?: (percent: number) => void,
  ): Promise<ChatAttachment> {
    const form = new FormData();
    form.append("file", file);
    form.append("conversationId", conversationId);

    const { data } = await HTTP_CLIENT.post(apiEndpoints.Chat.UPLOAD, form, {
      onUploadProgress: (event) => {
        if (!onProgress || !event.total) return;
        onProgress(Math.round((event.loaded * 100) / event.total));
      },
    });

    return data?.data ?? data;
  }
}

export default new ChatService();
