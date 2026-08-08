import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { useChatStore } from '@/store/chat';
import { useNotificationStore } from '@/store/notification';
import {
  endSession,
  loginUrlForCurrentPage,
  refreshSession,
} from '@/lib/auth/session';

/** Keeps a long-lived session from growing an unbounded message buffer. */
const MESSAGE_BUFFER_LIMIT = 200;

/**
 * One socket per token, shared by every component that calls this hook.
 *
 * ChatWidget is mounted in the root layout and ChatPage renders on /chat, so
 * without this the user holds two connections at once — the widget's early
 * return happens after its hooks have already run. Two connections means two
 * of every notification and twice the server-side fan-out.
 */
let sharedSocket: { token: string; socket: Socket; refCount: number } | null = null;

function acquireSocket(token: string, url: string): Socket {
  if (sharedSocket && sharedSocket.token === token) {
    sharedSocket.refCount += 1;
    return sharedSocket.socket;
  }

  // Token changed (re-login): drop the old connection before opening a new one.
  if (sharedSocket) {
    sharedSocket.socket.disconnect();
    sharedSocket = null;
  }

  const socket = io(url, { auth: { token }, transports: ['websocket'] });
  sharedSocket = { token, socket, refCount: 1 };
  return socket;
}

function releaseSocket(socket: Socket) {
  if (!sharedSocket || sharedSocket.socket !== socket) return;

  sharedSocket.refCount -= 1;
  if (sharedSocket.refCount <= 0) {
    sharedSocket.socket.disconnect();
    sharedSocket = null;
  }
}

interface ChatSocketHook {
  socket: Socket | null;
  isConnected: boolean;
  messages: any[];
  sendMessage: (conversationId: string, content: string) => void;
  joinConversation: (conversationId: string) => void;
  typing: (conversationId: string) => void;
  stopTyping: (conversationId: string) => void;
}

export const useChatSocket = (token?: string): ChatSocketHook => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    // Use environment variable for backend URL if available
    const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    const socketIo = acquireSocket(token, SOCKET_URL);

    // A second consumer joining an already-open socket never sees the original
    // 'connect' event, so seed from the live state.
    setIsConnected(socketIo.connected);

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    const onConnectError = async (error: Error) => {
      console.error('Socket connection error:', error.message);
      if (!error.message.includes('jwt expired') && !error.message.includes('Unauthorized')) {
        return;
      }

      // Stop the reconnect loop before doing anything slow.
      socketIo.disconnect();

      // An expired token is recoverable. Refreshing updates the store, which
      // changes `token`, which re-runs this effect with a fresh connection.
      // Previously this went straight to logout, dropping the user's session
      // every time the 15-minute access token lapsed.
      const refreshed = await refreshSession();
      if (!refreshed) {
        await endSession({ redirectTo: loginUrlForCurrentPage() });
      }
    };

    const onNewMessage = (message: any) => {
      // Buffer of everything received this session. Consumers advance their own
      // cursor over it, so several events landing in one React batch are all
      // seen — reading only the newest entry silently drops the rest.
      setMessages((prev) => {
        const next = [...prev, message];
        return next.length > MESSAGE_BUFFER_LIMIT
          ? next.slice(-MESSAGE_BUFFER_LIMIT)
          : next;
      });
    };

    const onNewNotification = (data: any) => {
      if (data.type !== 'chat_message') return;

      const { message, senderId } = data;

      // Don't show toast if chat is currently open with this user
      const { isOpen, activeUserId } = useChatStore.getState();
      if (isOpen && activeUserId === senderId) return;

      useNotificationStore.getState().addNotification({
        type: 'chat_message',
        title: 'New Message',
        content: message.content,
        senderId,
      });

      toast('New Message', {
        description: message.content,
        action: {
          label: 'View',
          onClick: () => {
            useChatStore.getState().openChat(senderId, 'New Message');
          },
        },
      });
    };

    socketIo.on('connect', onConnect);
    socketIo.on('disconnect', onDisconnect);
    socketIo.on('connect_error', onConnectError);
    socketIo.on('newMessage', onNewMessage);
    socketIo.on('newNotification', onNewNotification);

    setSocket(socketIo);
    socketRef.current = socketIo;

    return () => {
      // The socket outlives this consumer, so detach our own listeners rather
      // than leaving them attached to a connection someone else is still using.
      socketIo.off('connect', onConnect);
      socketIo.off('disconnect', onDisconnect);
      socketIo.off('connect_error', onConnectError);
      socketIo.off('newMessage', onNewMessage);
      socketIo.off('newNotification', onNewNotification);

      socketRef.current = null;
      releaseSocket(socketIo);
    };
  }, [token]);

  const emit = useCallback((event: string, payload: unknown) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, payload);
    }
  }, []);

  const sendMessage = useCallback(
    (conversationId: string, content: string) => emit('sendMessage', { conversationId, content }),
    [emit],
  );

  const typing = useCallback(
    (conversationId: string) => emit('typing', conversationId),
    [emit],
  );

  const stopTyping = useCallback(
    (conversationId: string) => emit('stopTyping', conversationId),
    [emit],
  );

  const joinConversation = useCallback(
    (conversationId: string) => emit('joinConversation', conversationId),
    [emit],
  );

  return { socket, isConnected, messages, sendMessage, joinConversation, typing, stopTyping };
};
