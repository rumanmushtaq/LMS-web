"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useChatSocket } from '@/hooks/useChatSocket';
import { MessageCircle, X, Send, Loader2, Smile } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { useChatStore } from '@/store/chat';
import { useAuthStore } from '@/store/auth';
import chatService from '@/services/chat';

interface LocalMessage {
  _id: string;
  content: string;
  senderId: string;
  conversationId: string;
  createdAt: string;
  pending?: boolean; // optimistic flag
}

export default function ChatWidget() {
  const { isOpen, closeChat, toggleChat, activeUserName, activeUserId } = useChatStore();
  const { getToken, getUser } = useAuthStore();
  const [inputMessage, setInputMessage] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [localMessages, setLocalMessages] = useState<LocalMessage[]>([]);
  const [isLoadingConv, setIsLoadingConv] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const token = getToken();
  const currentUser = getUser();
  const currentUserId = currentUser?.id || (currentUser as any)?._id;
  const { isConnected, messages: socketMessages, sendMessage, typing, socket } = useChatSocket(token || '');

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

  // Init conversation when chat opens
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

  if (!token || !currentUser) {
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
              <div
                className={`w-2.5 h-2.5 rounded-full ring-2 ring-white/30 ${
                  isConnected ? 'bg-green-400' : 'bg-red-400'
                }`}
              />
              <div>
                <h3 className="text-white font-semibold text-sm leading-tight">
                  {activeUserName ? `Chat with ${activeUserName}` : 'Messages'}
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

          {/* ── Messages Area ── */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-2" onClick={() => setShowEmojiPicker(false)}>
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
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
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
