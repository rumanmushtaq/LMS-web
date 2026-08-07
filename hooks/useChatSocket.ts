import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { useChatStore } from '@/store/chat';
import { useNotificationStore } from '@/store/notification';
import { useAuthStore } from '@/store/auth';

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

    const socketIo = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    socketIo.on('connect', () => {
      console.log('Socket connected:', socketIo.id);
      setIsConnected(true);
    });

    socketIo.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      if (error.message.includes('jwt expired') || error.message.includes('Unauthorized')) {
        socketIo.disconnect();
        useAuthStore.getState().logout();
      }
    });

    socketIo.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socketIo.on('newMessage', (message: any) => {
      setMessages((prev) => [...prev, message]);
    });

    socketIo.on('userTyping', (data: any) => {
      console.log('User is typing...', data);
    });

    socketIo.on('userStoppedTyping', (data: any) => {
      console.log('User stopped typing...', data);
    });

    socketIo.on('newNotification', (data: any) => {
      if (data.type === 'chat_message') {
        const { message, senderId } = data;
        
        // Don't show toast if chat is currently open with this user
        const { isOpen, activeUserId } = useChatStore.getState();
        if (isOpen && activeUserId === senderId) return;

        // Add to notification store
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
            }
          }
        });
      }
    });

    setSocket(socketIo);
    socketRef.current = socketIo;

    return () => {
      socketIo.disconnect();
    };
  }, [token]);

  const sendMessage = useCallback((conversationId: string, content: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('sendMessage', { conversationId, content });
    }
  }, []);

  const typing = useCallback((conversationId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('typing', conversationId);
    }
  }, []);

  const stopTyping = useCallback((conversationId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('stopTyping', conversationId);
    }
  }, []);

  const joinConversation = useCallback((conversationId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('joinConversation', conversationId);
    }
  }, []);

  return { socket, isConnected, messages, sendMessage, joinConversation, typing, stopTyping };
};
