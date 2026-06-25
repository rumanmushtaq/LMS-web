"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useChatSocket } from '@/hooks/useChatSocket';
import { MessageCircle, X, Send, Loader2, Smile, ArrowLeft, Flag, AlertTriangle } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { toast } from 'sonner';
import { useChatStore } from '@/store/chat';
import { useAuthStore } from '@/store/auth';
import chatService from '@/services/chat';
import { usePathname } from 'next/navigation';

interface LocalMessage {
  _id: string;
  content: string;
  senderId: string;
  conversationId: string;
  createdAt: string;
  pending?: boolean; // optimistic flag
}

export default function ChatWidget() {
  const pathname = usePathname();
  const { isOpen, closeChat, toggleChat, activeUserName, activeUserId, openChat, clearActiveChat } = useChatStore();
  const { getToken, getUser } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [localMessages, setLocalMessages] = useState<LocalMessage[]>([]);
  const [isLoadingConv, setIsLoadingConv] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  // Conversations list state
  const [conversationsList, setConversationsList] = useState<any[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [flaggingMsgId, setFlaggingMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const token = getToken();
  const currentUser = getUser();
  const currentUserId = currentUser?.id || (currentUser as any)?._id;
  const { isConnected, messages: socketMessages, sendMessage, typing, socket } = useChatSocket(token || '');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll to bottom whenever messages update — scroll the container, not the whole page
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [localMessages]);

  // Merge incoming socket messages into local state (avoid duplicates by _id)
  useEffect(() => {
    if (socketMessages.length === 0) return;
    const latest = socketMessages[socketMessages.length - 1];
    setLocalMessages(prev => {
      const exactExists = prev.some(m => m._id === latest._id);
      if (exactExists) return prev;
      
      const isOurMessage = latest.senderId === currentUserId;
      if (isOurMessage) {
        // Find matching pending message by content
        const pendingIndex = prev.findIndex(m => m.pending && m.content === latest.content);
        if (pendingIndex !== -1) {
          const newMessages = [...prev];
          newMessages[pendingIndex] = { ...latest, pending: false };
          return newMessages;
        }
      }
      
      return [...prev, latest];
    });
  }, [socketMessages, currentUserId]);

  // Load conversations list when chat is open but no active user is selected
  useEffect(() => {
    if (isOpen && !activeUserId && token) {
      setIsLoadingList(true);
      chatService.getConversations()
        .then((res: any) => {
          const list = res?.data ?? res ?? [];
          setConversationsList(Array.isArray(list) ? list : []);
        })
        .catch(console.error)
        .finally(() => setIsLoadingList(false));
    }
  }, [isOpen, activeUserId, token]);

  // Init conversation when a specific chat opens
  useEffect(() => {
    if (!isOpen || !activeUserId || !token) return;

    // Reset state each time a new conversation is opened
    setConversationId(null);
    setLocalMessages([]);
    setIsLoadingConv(true);

    chatService
      .initConversation(activeUserId)
      .then((res: any) => {
        const conv = res?.data ?? res;
        if (conv?._id) {
          setConversationId(conv._id);
          // Join the socket room
          if (socket?.connected) {
            socket.emit('joinConversation', conv._id);
          }
          // Load message history
          return chatService.getMessages(conv._id);
        }
      })
      .then((res: any) => {
        if (res) {
          const history: LocalMessage[] = Array.isArray(res) ? res : (res?.data ?? []);
          setLocalMessages(history);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoadingConv(false));
  }, [isOpen, activeUserId, token, socket]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !conversationId || !currentUser) return;

    const tempId = `pending-${Date.now()}`;
    const optimisticMsg: LocalMessage = {
      _id: tempId,
      content: inputMessage.trim(),
      senderId: currentUserId,
      conversationId,
      createdAt: new Date().toISOString(),
      pending: true,
    };

    // Show message immediately (optimistic update)
    setLocalMessages(prev => [...prev, optimisticMsg]);
    setInputMessage('');

    // Emit to socket
    sendMessage(conversationId, optimisticMsg.content);
  };

  const onEmojiClick = (emojiObject: any) => {
    setInputMessage((prev) => prev + emojiObject.emoji);
  };

  const handleFlagMessage = async (msgId: string) => {
    if (!confirm('Are you sure you want to flag this message for inappropriate behavior?')) return;
    try {
      setFlaggingMsgId(msgId);
      await chatService.flagMessage(msgId, 'User flagged message via chat widget');
      toast.success('Message flagged and reported to admins.');
    } catch (error) {
      console.error(error);
      toast.error('Failed to flag message');
    } finally {
      setFlaggingMsgId(null);
    }
  };

  if (!mounted || !token || !currentUser || pathname?.startsWith('/chat')) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div
          className="absolute bottom-16 right-0 w-[400px] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ height: '580px' }}
        >
          {/* ── Header ── */}
          <div
            className="flex justify-between items-center px-5 py-4 shrink-0"
            style={{ background: 'linear-gradient(135deg, #1e2230 0%, #2d3452 100%)' }}
          >
            <div className="flex items-center gap-3">
              {activeUserId && (
                <button
                  onClick={clearActiveChat}
                  className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10 -ml-2"
                >
                  <ArrowLeft size={18} />
                </button>
              )}
              <div
                className={`w-2.5 h-2.5 rounded-full ring-2 ring-white/30 ${
                  isConnected ? 'bg-green-400' : 'bg-red-400'
                }`}
              />
              <div>
                <h3 className="text-white font-semibold text-sm leading-tight">
                  {activeUserId ? (activeUserName ? `Chat with ${activeUserName}` : 'Messages') : 'Your Conversations'}
                </h3>
                <p className="text-white/50 text-xs mt-0.5">
                  {isConnected ? 'Online' : 'Reconnecting…'}
                </p>
              </div>
            </div>
            <button
              onClick={closeChat}
              className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </div>

          {!activeUserId ? (
            /* ── Conversations List Area ── */
            <div className="flex-1 p-0 overflow-y-auto bg-white flex flex-col">
              {isLoadingList ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 size={24} className="animate-spin text-gray-400" />
                </div>
              ) : conversationsList.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-2 p-6">
                  <MessageCircle size={32} className="text-gray-300" />
                  <p className="text-center text-sm text-gray-400">
                    No conversations yet. Your chats will appear here.
                  </p>
                </div>
              ) : (
                conversationsList.map((conv) => {
                  const otherUser = conv.participants?.find((p: any) => p._id !== currentUserId) || conv.participants?.[0];
                  if (!otherUser) return null;
                  
                  return (
                    <div
                      key={conv._id}
                      onClick={() => openChat(otherUser._id, `${otherUser.firstName} ${otherUser.lastName}`.trim())}
                      className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/80 to-primary rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                        {otherUser.firstName?.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <h4 className="font-semibold text-sm text-gray-900 truncate">
                            {otherUser.firstName} {otherUser.lastName}
                          </h4>
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {conv.lastMessage?.content || 'Click to view messages'}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            /* ── Active Chat View ── */
            <>
              {/* ── Messages Area ── */}
              <div ref={messagesContainerRef} className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-2" onClick={() => setShowEmojiPicker(false)}>
                {isLoadingConv ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 size={24} className="animate-spin text-gray-400" />
                  </div>
                ) : localMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-2">
                    <MessageCircle size={32} className="text-gray-300" />
                    <p className="text-center text-sm text-gray-400">
                      No messages yet. Say hello! 👋
                    </p>
                  </div>
                ) : (
                  localMessages.map((msg) => {
                    const isOwn = msg.senderId === currentUserId;
                    return (
                      <div
                        key={msg._id}
                        className={`flex group ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isOwn && (
                          <button
                            onClick={() => handleFlagMessage(msg._id)}
                            disabled={flaggingMsgId === msg._id}
                            className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity self-center text-gray-400 hover:text-red-500"
                            title="Flag message"
                          >
                            {flaggingMsgId === msg._id ? <Loader2 size={12} className="animate-spin" /> : <Flag size={12} />}
                          </button>
                        )}
                        <div
                          className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            isOwn
                              ? 'bg-primary text-primary-foreground rounded-br-sm'
                              : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
                          } ${msg.pending ? 'opacity-60' : 'opacity-100'}`}
                          style={isOwn ? { background: 'linear-gradient(135deg, #f66962, #e04d47)' } : {}}
                        >
                          {msg.content}
                          {msg.pending && (
                            <span className="ml-1.5 text-[10px] opacity-70">sending…</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* ── Input Area ── */}
              <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2 shrink-0 relative">
                {showEmojiPicker && (
                  <div className="absolute bottom-full left-0 mb-2 z-50">
                    <EmojiPicker onEmojiClick={onEmojiClick} height={350} width={300} />
                  </div>
                )}
                <button
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                  title="Add Emoji"
                >
                  <Smile size={20} />
                </button>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => {
                    setInputMessage(e.target.value);
                    if (conversationId) typing(conversationId);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={isLoadingConv ? 'Loading chat...' : 'Type a message…'}
                  disabled={isLoadingConv || !conversationId}
                  className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400 bg-gray-50 transition-all"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || !conversationId}
                  className="w-10 h-10 flex items-center justify-center rounded-full text-white disabled:opacity-40 transition-all hover:scale-105 active:scale-95 shrink-0"
                  style={{ background: 'linear-gradient(135deg, #f66962, #e04d47)' }}
                >
                  <Send size={15} className="ml-0.5" />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Floating Toggle Button ── */}
      <button
        onClick={toggleChat}
        className="w-14 h-14 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
        style={{ background: 'linear-gradient(135deg, #1e2230, #2d3452)' }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
