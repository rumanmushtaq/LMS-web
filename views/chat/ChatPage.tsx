"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useAuthStore } from "@/store/auth";
import { useChatStore } from "@/store/chat";
import chatService from "@/services/chat";
import {
  MessageCircle,
  Send,
  Loader2,
  Smile,
  ArrowLeft,
  Flag,
  Search,
  MoreVertical,
  Phone,
  Video,
  CheckCheck,
  Check,
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface LocalMessage {
  _id: string;
  content: string;
  senderId: string;
  conversationId: string;
  createdAt: string;
  pending?: boolean;
}

interface Conversation {
  _id: string;
  participants: any[];
  lastMessage?: { content: string; createdAt: string };
  updatedAt: string;
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatConvDate(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return formatTime(dateStr);
  if (days === 1) return "Yesterday";
  if (days < 7) return d.toLocaleDateString([], { weekday: "short" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function groupMessagesByDate(messages: LocalMessage[]) {
  const groups: { label: string; messages: LocalMessage[] }[] = [];
  let currentLabel = "";
  messages.forEach((msg) => {
    const d = new Date(msg.createdAt);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    let label =
      days === 0
        ? "Today"
        : days === 1
        ? "Yesterday"
        : d.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });

    if (label !== currentLabel) {
      currentLabel = label;
      groups.push({ label, messages: [msg] });
    } else {
      groups[groups.length - 1].messages.push(msg);
    }
  });
  return groups;
}

export default function ChatPage() {
  const { getToken, getUser } = useAuthStore();
  const { activeUserId, activeUserName, openChat, clearActiveChat } = useChatStore();

  const [conversationsList, setConversationsList] = useState<Conversation[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [localMessages, setLocalMessages] = useState<LocalMessage[]>([]);
  const [isLoadingConv, setIsLoadingConv] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [flaggingMsgId, setFlaggingMsgId] = useState<string | null>(null);
  const [isMobileConvOpen, setIsMobileConvOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const token = getToken();
  const currentUser = getUser();
  const currentUserId = currentUser?.id || (currentUser as any)?._id;

  const { isConnected, messages: socketMessages, sendMessage, typing, socket } =
    useChatSocket(token || "");

  // Scroll to bottom on new messages — scroll the container, not the whole page
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [localMessages]);

  // Merge socket messages
  useEffect(() => {
    if (socketMessages.length === 0) return;
    const latest = socketMessages[socketMessages.length - 1];
    setLocalMessages((prev) => {
      const exactExists = prev.some((m) => m._id === latest._id);
      if (exactExists) return prev;
      const isOwn = latest.senderId === currentUserId;
      if (isOwn) {
        const pendingIndex = prev.findIndex(
          (m) => m.pending && m.content === latest.content
        );
        if (pendingIndex !== -1) {
          const next = [...prev];
          next[pendingIndex] = { ...latest, pending: false };
          return next;
        }
      }
      return [...prev, latest];
    });
    // Update last message preview in conversations list
    setConversationsList((prev) =>
      prev.map((c) =>
        c._id === latest.conversationId
          ? { ...c, lastMessage: { content: latest.content, createdAt: latest.createdAt } }
          : c
      )
    );
  }, [socketMessages, currentUserId]);

  // Load conversations
  const loadConversations = useCallback(() => {
    if (!token) return;
    setIsLoadingList(true);
    chatService
      .getConversations()
      .then((res: any) => {
        const list = res?.data ?? res ?? [];
        setConversationsList(Array.isArray(list) ? list : []);
      })
      .catch(console.error)
      .finally(() => setIsLoadingList(false));
  }, [token]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Open a conversation by clicking
  const handleOpenConversation = useCallback(
    (otherUserId: string, otherUserName: string) => {
      openChat(otherUserId, otherUserName);
      setIsMobileConvOpen(true);
      setLocalMessages([]);
      setSelectedConvId(null);
      setIsLoadingConv(true);

      chatService
        .initConversation(otherUserId)
        .then((res: any) => {
          const conv = res?.data ?? res;
          if (conv?._id) {
            setSelectedConvId(conv._id);
            if (socket?.connected) {
              socket.emit("joinConversation", conv._id);
            }
            return chatService.getMessages(conv._id);
          }
        })
        .then((res: any) => {
          if (res) {
            const history: LocalMessage[] = Array.isArray(res) ? res : res?.data ?? [];
            setLocalMessages(history);
          }
        })
        .catch(console.error)
        .finally(() => setIsLoadingConv(false));
    },
    [openChat, socket]
  );

  // If chat store has activeUserId (from header click), auto-open that conv
  useEffect(() => {
    if (activeUserId && activeUserName) {
      handleOpenConversation(activeUserId, activeUserName);
    }
  }, [activeUserId, activeUserName]); // eslint-disable-line

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !selectedConvId || !currentUser) return;

    const tempId = `pending-${Date.now()}`;
    const optimisticMsg: LocalMessage = {
      _id: tempId,
      content: inputMessage.trim(),
      senderId: currentUserId,
      conversationId: selectedConvId,
      createdAt: new Date().toISOString(),
      pending: true,
    };

    setLocalMessages((prev) => [...prev, optimisticMsg]);
    setInputMessage("");
    sendMessage(selectedConvId, optimisticMsg.content);
    inputRef.current?.focus();
  };

  const handleFlagMessage = async (msgId: string) => {
    if (!confirm("Flag this message for inappropriate behavior?")) return;
    try {
      setFlaggingMsgId(msgId);
      await chatService.flagMessage(msgId, "User flagged message via chat page");
      toast.success("Message flagged and reported to admins.");
    } catch {
      toast.error("Failed to flag message");
    } finally {
      setFlaggingMsgId(null);
    }
  };

  const handleBackToList = () => {
    clearActiveChat();
    setSelectedConvId(null);
    setLocalMessages([]);
    setIsMobileConvOpen(false);
  };

  const filteredConversations = conversationsList.filter((conv) => {
    if (!searchQuery) return true;
    const other = conv.participants?.find((p: any) => p._id !== currentUserId);
    const name = `${other?.firstName ?? ""} ${other?.lastName ?? ""}`.toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  const messageGroups = groupMessagesByDate(localMessages);

  const selectedOtherUser = conversationsList
    .flatMap((c) => c.participants)
    .find((p: any) => p._id === activeUserId);

  return (
    <div className="min-h-screen bg-background">
      {/* Page Hero */}
      <div
        className="relative overflow-hidden py-10 px-6"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.35 0.08 275) 0%, oklch(0.45 0.22 300) 50%, oklch(0.7 0.15 210) 100%)",
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10 bg-white" />
        <div className="absolute top-6 right-24 w-20 h-20 rounded-full opacity-10 bg-white" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-10 bg-white" />
        <div className="container mx-auto relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Messages</h1>
              <p className="text-white/70 text-sm mt-0.5">
                {conversationsList.length} conversation{conversationsList.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm border",
                  isConnected
                    ? "bg-green-400/20 border-green-400/30 text-green-200"
                    : "bg-red-400/20 border-red-400/30 text-red-200"
                )}
              >
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"
                  )}
                />
                {isConnected ? "Online" : "Reconnecting…"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="container mx-auto px-4 py-6">
        <div
          className="rounded-2xl border border-border/50 overflow-hidden shadow-xl"
          style={{ height: "calc(100vh - 280px)", minHeight: "500px" }}
        >
          <div className="flex h-full">
            {/* ── LEFT: Conversations Panel ── */}
            <div
              className={cn(
                "flex flex-col border-r border-border/50 bg-card shrink-0",
                "w-full md:w-[320px] lg:w-[360px]",
                // On mobile, hide when a conversation is open
                isMobileConvOpen ? "hidden md:flex" : "flex"
              )}
            >
              {/* Search */}
              <div className="p-4 border-b border-border/50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search conversations…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-border bg-muted/40 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  />
                </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto">
                {isLoadingList ? (
                  <div className="flex flex-col gap-0">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 border-b border-border/30">
                        <div className="w-11 h-11 rounded-full bg-muted animate-pulse shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-muted animate-pulse rounded-full w-3/4" />
                          <div className="h-2.5 bg-muted animate-pulse rounded-full w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 p-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center">
                      <MessageCircle className="w-7 h-7 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">No conversations yet</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Start a chat with an instructor or student
                      </p>
                    </div>
                  </div>
                ) : (
                  filteredConversations.map((conv) => {
                    const other =
                      conv.participants?.find((p: any) => p._id !== currentUserId) ||
                      conv.participants?.[0];
                    if (!other) return null;
                    const name = `${other.firstName ?? ""} ${other.lastName ?? ""}`.trim();
                    const initials =
                      (other.firstName?.charAt(0) ?? "") + (other.lastName?.charAt(0) ?? "");
                    const isSelected = activeUserId === other._id;

                    return (
                      <motion.div
                        key={conv._id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => handleOpenConversation(other._id, name)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3.5 border-b border-border/30 cursor-pointer transition-all duration-150",
                          isSelected
                            ? "bg-primary/10 border-l-2 border-l-primary"
                            : "hover:bg-muted/50 border-l-2 border-l-transparent"
                        )}
                      >
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          <div
                            className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm"
                            style={{
                              background:
                                "linear-gradient(135deg, oklch(0.7 0.15 210), oklch(0.45 0.22 300))",
                            }}
                          >
                            {initials || "U"}
                          </div>
                          {/* Online dot (static placeholder) */}
                          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 ring-2 ring-card" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-0.5">
                            <h4
                              className={cn(
                                "font-semibold text-sm truncate",
                                isSelected ? "text-primary" : "text-foreground"
                              )}
                            >
                              {name || "User"}
                            </h4>
                            <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                              {formatConvDate(conv.lastMessage?.createdAt ?? conv.updatedAt)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {conv.lastMessage?.content ?? "Start a conversation…"}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>

            {/* ── RIGHT: Messages Panel ── */}
            <div
              className={cn(
                "flex-1 flex flex-col bg-background",
                !isMobileConvOpen ? "hidden md:flex" : "flex"
              )}
            >
              {!activeUserId ? (
                /* Empty state */
                <div className="flex-1 flex flex-col items-center justify-center gap-4 p-10 text-center">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.7 0.15 210 / 0.15), oklch(0.45 0.22 300 / 0.15))",
                    }}
                  >
                    <MessageCircle className="w-10 h-10 text-primary/50" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Select a conversation
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                      Choose a conversation from the left panel to start messaging
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Chat Header */}
                  <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border/50 bg-card shrink-0">
                    {/* Mobile back button */}
                    <button
                      onClick={handleBackToList}
                      className="md:hidden p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <ArrowLeft size={18} />
                    </button>

                    {/* Avatar */}
                    <div className="relative">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(0.7 0.15 210), oklch(0.45 0.22 300))",
                        }}
                      >
                        {activeUserName?.charAt(0)?.toUpperCase() ?? "U"}
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 ring-2 ring-card" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-foreground truncate">
                        {activeUserName}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {isConnected ? "Online" : "Offline"}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        <Phone size={16} />
                      </button>
                      <button className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        <Video size={16} />
                      </button>
                      <button className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto p-4 flex flex-col gap-1"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 20% 80%, oklch(0.45 0.22 300 / 0.04) 0%, transparent 50%), radial-gradient(circle at 80% 20%, oklch(0.7 0.15 210 / 0.04) 0%, transparent 50%)",
                    }}
                    onClick={() => setShowEmojiPicker(false)}
                  >
                    {isLoadingConv ? (
                      <div className="flex-1 flex items-center justify-center">
                        <Loader2 size={28} className="animate-spin text-primary/50" />
                      </div>
                    ) : localMessages.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center gap-3 py-10">
                        <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center">
                          <MessageCircle size={28} className="text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground text-center">
                          No messages yet. Say hello! 👋
                        </p>
                      </div>
                    ) : (
                      messageGroups.map((group) => (
                        <div key={group.label}>
                          {/* Date separator */}
                          <div className="flex items-center gap-3 my-4">
                            <div className="flex-1 h-px bg-border/40" />
                            <span className="text-[10px] font-medium text-muted-foreground px-2 py-0.5 bg-muted/50 rounded-full">
                              {group.label}
                            </span>
                            <div className="flex-1 h-px bg-border/40" />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            {group.messages.map((msg) => {
                              const isOwn = msg.senderId === currentUserId;
                              return (
                                <AnimatePresence key={msg._id}>
                                  <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                    className={cn(
                                      "flex group items-end gap-2",
                                      isOwn ? "justify-end" : "justify-start"
                                    )}
                                  >
                                    {/* Flag button (others' messages) */}
                                    {!isOwn && (
                                      <button
                                        onClick={() => handleFlagMessage(msg._id)}
                                        disabled={flaggingMsgId === msg._id}
                                        className="mb-1 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                                        title="Flag message"
                                      >
                                        {flaggingMsgId === msg._id ? (
                                          <Loader2 size={11} className="animate-spin" />
                                        ) : (
                                          <Flag size={11} />
                                        )}
                                      </button>
                                    )}

                                    <div
                                      className={cn(
                                        "max-w-[72%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm",
                                        isOwn
                                          ? "rounded-br-sm text-white"
                                          : "rounded-bl-sm bg-card border border-border/60 text-foreground",
                                        msg.pending && "opacity-60"
                                      )}
                                      style={
                                        isOwn
                                          ? {
                                              background:
                                                "linear-gradient(135deg, oklch(0.45 0.22 300), oklch(0.35 0.08 275))",
                                            }
                                          : {}
                                      }
                                    >
                                      <span>{msg.content}</span>
                                      <div
                                        className={cn(
                                          "flex items-center gap-1 mt-1",
                                          isOwn ? "justify-end" : "justify-start"
                                        )}
                                      >
                                        <span
                                          className={cn(
                                            "text-[9px]",
                                            isOwn ? "text-white/60" : "text-muted-foreground"
                                          )}
                                        >
                                          {formatTime(msg.createdAt)}
                                        </span>
                                        {isOwn && !msg.pending && (
                                          <CheckCheck size={10} className="text-white/60" />
                                        )}
                                        {isOwn && msg.pending && (
                                          <Check size={10} className="text-white/40" />
                                        )}
                                      </div>
                                    </div>
                                  </motion.div>
                                </AnimatePresence>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="p-4 bg-card border-t border-border/50 shrink-0 relative">
                    {showEmojiPicker && (
                      <div className="absolute bottom-full left-4 mb-2 z-50 shadow-2xl">
                        <EmojiPicker
                          onEmojiClick={(obj) => setInputMessage((p) => p + obj.emoji)}
                          height={320}
                          width={300}
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowEmojiPicker((p) => !p)}
                        className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
                        title="Add emoji"
                      >
                        <Smile size={20} />
                      </button>
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputMessage}
                        onChange={(e) => {
                          setInputMessage(e.target.value);
                          if (selectedConvId) typing(selectedConvId);
                        }}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder={
                          isLoadingConv ? "Loading chat…" : `Message ${activeUserName}…`
                        }
                        disabled={isLoadingConv || !selectedConvId}
                        className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-border bg-muted/40 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || !selectedConvId}
                        className="w-10 h-10 flex items-center justify-center rounded-xl text-white disabled:opacity-30 transition-all hover:scale-105 active:scale-95 shrink-0 shadow-md"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(0.7 0.15 210), oklch(0.45 0.22 300))",
                        }}
                      >
                        <Send size={16} className="ml-0.5" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
