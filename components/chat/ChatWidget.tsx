"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useChatSocket } from '@/hooks/useChatSocket';
import { MessageCircle, X, Send, Loader2, Smile, ArrowLeft, Flag, AlertTriangle } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { toast } from 'sonner';
import { useChatStore } from '@/store/chat';
import { useAuthStore } from '@/store/auth';
import chatService from '@/services/chat';
import MessageContent from '@/components/chat/MessageContent';
import { previewText } from '@/components/chat/GroupClassInvite';
import { formatShortTime } from '@/lib/format';
import { usePathname } from 'next/navigation';
import { mergeMessages, type ChatMessage } from '@/lib/chat/messages';
import { insertAtCaret, shouldSendOnKeyDown } from '@/lib/chat/composer';

type LocalMessage = ChatMessage;

export default function ChatWidget() {
  const pathname = usePathname();
  const { isOpen, closeChat, toggleChat, activeUserName, activeUserId, activeConversationId, openChat, clearActiveChat } = useChatStore();
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

  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const token = getToken();
  const currentUser = getUser();
  const currentUserId = currentUser?.id || (currentUser as any)?._id;
  const { isConnected, messages: socketMessages, sendMessage, joinConversation, typing, stopTyping, socket } = useChatSocket(token || '');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Ensure we rejoin the socket room if the connection drops and reconnects
  useEffect(() => {
    if (isConnected && conversationId) {
      joinConversation(conversationId);
    }
  }, [isConnected, conversationId, joinConversation]);

  // Scroll to bottom whenever messages update — scroll the container, not the whole page.
  // Deferred a frame so the new rows are laid out first; measuring scrollHeight
  // synchronously reads the height of the *previous* render and stops short.
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const frame = requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
    return () => cancelAnimationFrame(frame);
  }, [localMessages, isLoadingConv, conversationId]);

  // Merge incoming socket messages into local state.
  //
  // The cursor matters: React batches updates, so several events can land
  // between renders and reading only the newest one drops the rest.
  const lastMergedIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (socketMessages.length === 0) return;

    const seenIndex = lastMergedIdRef.current
      ? socketMessages.findIndex(m => m._id === lastMergedIdRef.current)
      : -1;
    const fresh = socketMessages.slice(seenIndex + 1);
    if (fresh.length === 0) return;

    lastMergedIdRef.current = socketMessages[socketMessages.length - 1]._id;

    setLocalMessages(prev =>
      mergeMessages(prev, fresh, { conversationId, currentUserId })
    );
  }, [socketMessages, currentUserId, conversationId]);

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

    // When the exact conversation is known (opened from a notification), use
    // it directly. Re-deriving from the user only finds a 2-person DM, so a
    // message from a group/class room would otherwise open the wrong thread.
    const resolveConversation = activeConversationId
      ? Promise.resolve({ _id: activeConversationId })
      : chatService.initConversation(activeUserId).then((res: any) => res?.data ?? res);

    resolveConversation
      .then((conv: any) => {
        if (conv?._id) {
          setConversationId(conv._id);
          // Join the socket room
          if (socket?.connected) {
            socket.emit('joinConversation', conv._id);
          }

          // Opening the thread is what makes it read.
          chatService.markConversationRead(conv._id).catch(console.error);
          setConversationsList(prev =>
            prev.map(c => (c._id === conv._id ? { ...c, unreadCount: 0 } : c))
          );

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
  }, [isOpen, activeUserId, activeConversationId, token, socket]);

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
    stopTyping(conversationId);
  };

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (val: string) => {
    setInputMessage(val);
    if (!conversationId) return;

    typing(conversationId);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(conversationId);
    }, 2000);
  };

  /**
   * Insert at the caret, close the picker, and return focus to the input.
   *
   * Without the focus return, Enter pressed straight after picking an emoji
   * goes to the picker rather than the message box and nothing is sent.
   */
  const onEmojiClick = (emojiObject: any) => {
    const input = inputRef.current;
    const { value, caret } = insertAtCaret(
      inputMessage,
      emojiObject.emoji,
      input?.selectionStart ?? null,
      input?.selectionEnd ?? null,
    );

    handleInputChange(value);
    setShowEmojiPicker(false);

    requestAnimationFrame(() => {
      input?.focus();
      input?.setSelectionRange(caret, caret);
    });
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
          /* The conversation list hugs its content — a panel holding one chat
             should not reserve 33rem of empty space. An open conversation
             does get the fixed height, because messages need somewhere to
             land and the composer must not jump as they arrive. */
          className={`absolute bottom-16 right-0 w-[min(23rem,calc(100vw-3rem))] bg-card text-foreground border border-border/70 rounded-2xl shadow-2xl ring-1 ring-black/5 flex flex-col overflow-hidden ${
            activeUserId
              ? 'h-[min(33rem,calc(100dvh-9rem))]'
              : 'max-h-[min(33rem,calc(100dvh-9rem))]'
          }`}
        >
          {/* ── Header ── */}
          <div
            className="flex justify-between items-center px-4 py-3 shrink-0"
            style={{
              background:
                'linear-gradient(135deg, oklch(0.35 0.08 275) 0%, oklch(0.45 0.22 300) 100%)',
            }}
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
              className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {!activeUserId ? (
            /* ── Conversations List Area ── */
            <div className="flex-1 min-h-0 overflow-y-auto bg-card flex flex-col">
              {isLoadingList ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 size={22} className="animate-spin text-muted-foreground/60" />
                </div>
              ) : conversationsList.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 p-8 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                    <MessageCircle size={22} className="text-muted-foreground/70" />
                  </div>
                  <p className="text-sm font-medium">No conversations yet</p>
                  <p className="text-xs text-muted-foreground -mt-1.5">
                    Message a tutor and it will show up here.
                  </p>
                </div>
              ) : (
                conversationsList.map((conv) => {
                  const otherUser = conv.participants?.find((p: any) => p._id !== currentUserId) || conv.participants?.[0];
                  if (!otherUser) return null;

                  const unreadCount = conv.unreadCount ?? 0;
                  const hasUnread = unreadCount > 0;

                  return (
                    <div
                      key={conv._id}
                      onClick={() => openChat(otherUser._id, `${otherUser.firstName} ${otherUser.lastName}`.trim())}
                      className="px-3.5 py-3 border-b border-border/50 last:border-0 hover:bg-muted/60 cursor-pointer flex items-center gap-3 transition-colors"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm"
                        style={{
                          background:
                            'linear-gradient(135deg, oklch(0.7 0.15 210), oklch(0.45 0.22 300))',
                        }}
                      >
                        {otherUser.firstName?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline gap-2 mb-0.5">
                          <h4 className={`text-sm truncate ${hasUnread ? 'font-bold' : 'font-semibold'}`}>
                            {otherUser.firstName} {otherUser.lastName}
                          </h4>
                          <span className="text-[10px] text-muted-foreground shrink-0 tabular-nums">
                            {formatShortTime(conv.lastMessage?.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          {/* The real last message, with an invite URL reduced to
                              a label so it cannot crowd out the words around it. */}
                          <p className={`text-xs truncate ${hasUnread ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                            {conv.lastMessage
                              ? previewText(conv.lastMessage.content)
                              : 'Start a conversation…'}
                          </p>
                          {hasUnread && (
                            <span
                              aria-label={`${unreadCount} unread messages`}
                              className="shrink-0 min-w-[1.25rem] h-5 px-1.5 flex items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
                            >
                              {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                          )}
                        </div>
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
              <div ref={messagesContainerRef} className="flex-1 p-3.5 overflow-y-auto bg-muted/40 flex flex-col gap-2" onClick={() => setShowEmojiPicker(false)}>
                {isLoadingConv ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 size={22} className="animate-spin text-muted-foreground/60" />
                  </div>
                ) : localMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
                    <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center border border-border/60">
                      <MessageCircle size={22} className="text-muted-foreground/70" />
                    </div>
                    <p className="text-sm font-medium">No messages yet</p>
                    <p className="text-xs text-muted-foreground -mt-1.5">Say hello 👋</p>
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
                            className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity self-center text-muted-foreground hover:text-destructive"
                            title="Flag message"
                          >
                            {flaggingMsgId === msg._id ? <Loader2 size={12} className="animate-spin" /> : <Flag size={12} />}
                          </button>
                        )}
                        <div
                          className={`max-w-[78%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed shadow-sm ${
                            isOwn
                              ? 'text-white rounded-br-md'
                              : 'bg-card border border-border/70 text-foreground rounded-bl-md'
                          } ${msg.pending ? 'opacity-60' : 'opacity-100'}`}
                          style={
                            isOwn
                              ? {
                                  background:
                                    'linear-gradient(135deg, oklch(0.45 0.22 300), oklch(0.35 0.08 275))',
                                }
                              : {}
                          }
                        >
                          <MessageContent content={msg.content} messageId={msg._id} />
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
              <div className="p-2.5 bg-card border-t border-border/60 flex items-center gap-1.5 shrink-0 relative">
                {showEmojiPicker && (
                  <div className="absolute bottom-full left-0 mb-2 z-50">
                    <EmojiPicker onEmojiClick={onEmojiClick} height={350} width={300} />
                  </div>
                )}
                <button
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
                  title="Add Emoji"
                >
                  <Smile size={20} />
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (!shouldSendOnKeyDown(e)) return;
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  placeholder={isLoadingConv ? 'Loading chat...' : 'Type a message…'}
                  disabled={isLoadingConv || !conversationId}
                  className="flex-1 min-w-0 px-3.5 py-2.5 text-sm rounded-full bg-muted/70 border border-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 focus:bg-background transition-all"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || !conversationId}
                  className="w-9 h-9 flex items-center justify-center rounded-full text-white disabled:opacity-40 disabled:hover:scale-100 transition-all hover:scale-105 active:scale-95 shrink-0 shadow-sm"
                  style={{
                    background:
                      'linear-gradient(135deg, oklch(0.7 0.15 210), oklch(0.45 0.22 300))',
                  }}
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
        aria-label={isOpen ? 'Close messages' : 'Open messages'}
        className="w-14 h-14 text-white rounded-full flex items-center justify-center shadow-lg ring-1 ring-black/5 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
        style={{
          background:
            'linear-gradient(135deg, oklch(0.7 0.15 210), oklch(0.45 0.22 300))',
        }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
