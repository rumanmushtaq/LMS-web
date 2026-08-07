import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/auth";
import chatService from "@/services/chat";
import { LiveStatus } from "@/services/classes";

export interface LiveMessage {
  _id: string;
  conversationId: string;
  senderId: any;
  content: string;
  createdAt?: string;
  pending?: boolean;
}

interface UseLiveClassArgs {
  conversationId: string | null;
  /** Called when the tutor starts/ends the broadcast. */
  onLiveStatus?: (status: LiveStatus, embedUrl: string | null) => void;
}

/**
 * Owns a dedicated Socket.IO connection for a single live class:
 *  - joins the class Q&A conversation room
 *  - loads message history, streams new messages (deduped by _id)
 *  - relays `classLiveStatus` events (tutor went live / ended)
 *
 * Kept separate from the global chat widget socket so the full-screen live
 * room doesn't interfere with (or get interfered by) the floating widget.
 */
export function useLiveClass({ conversationId, onLiveStatus }: UseLiveClassArgs) {
  const token = useAuthStore((s) => s.accessToken);
  const currentUserId = useAuthStore((s) => s.user?.id);

  const [messages, setMessages] = useState<LiveMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const seenIds = useRef<Set<string>>(new Set());
  const onLiveStatusRef = useRef(onLiveStatus);
  onLiveStatusRef.current = onLiveStatus;

  const pushMessage = useCallback((msg: LiveMessage) => {
    if (!msg?._id) return;
    if (seenIds.current.has(msg._id)) return; // dedupe (room + personal-room echoes)
    seenIds.current.add(msg._id);
    setMessages((prev) => [...prev, msg]);
  }, []);

  // Load history whenever the conversation becomes known.
  useEffect(() => {
    if (!conversationId) return;
    let cancelled = false;
    chatService
      .getMessages(conversationId)
      .then((data: any) => {
        if (cancelled) return;
        const list: LiveMessage[] = Array.isArray(data) ? data : data?.data ?? [];
        seenIds.current = new Set(list.map((m) => m._id));
        setMessages(list);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [conversationId]);

  // Socket lifecycle.
  useEffect(() => {
    if (!token || !conversationId) return;

    const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const socket = io(SOCKET_URL, { auth: { token }, transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("joinConversation", conversationId);
    });
    socket.on("disconnect", () => setIsConnected(false));

    socket.on("newMessage", (msg: LiveMessage) => {
      if (msg?.conversationId?.toString() === conversationId) pushMessage(msg);
    });

    socket.on("classLiveStatus", (payload: { status: LiveStatus; embedUrl: string | null }) => {
      onLiveStatusRef.current?.(payload.status, payload.embedUrl ?? null);
    });

    socket.on("userTyping", (data: any) => {
      if (data?.conversationId === conversationId && data?.userId !== currentUserId) {
        setTypingUser(data.userId);
      }
    });
    socket.on("userStoppedTyping", (data: any) => {
      if (data?.conversationId === conversationId) setTypingUser(null);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [token, conversationId, pushMessage, currentUserId]);

  const sendMessage = useCallback(
    (content: string) => {
      const text = content.trim();
      if (!text || !conversationId || !socketRef.current?.connected) return;
      socketRef.current.emit("sendMessage", { conversationId, content: text });
    },
    [conversationId],
  );

  const typing = useCallback(() => {
    if (conversationId) socketRef.current?.emit("typing", conversationId);
  }, [conversationId]);

  const stopTyping = useCallback(() => {
    if (conversationId) socketRef.current?.emit("stopTyping", conversationId);
  }, [conversationId]);

  return { messages, isConnected, typingUser, sendMessage, typing, stopTyping, currentUserId };
}
