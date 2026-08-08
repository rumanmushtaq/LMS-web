/**
 * Pure message-merge rules shared by ChatPage and ChatWidget.
 *
 * Kept free of React so the ordering/de-duplication rules can be tested
 * directly — they are the part that historically dropped messages.
 */

export interface ChatMessage {
  _id: string;
  content: string;
  senderId: string;
  conversationId: string;
  createdAt: string;
  /** Set on locally-created messages that the server has not yet acknowledged. */
  pending?: boolean;
}

export interface MergeOptions {
  /** Messages for any other conversation are ignored. */
  conversationId: string | null;
  currentUserId: string | null;
}

function sortKey(m: ChatMessage): [number, string] {
  const t = new Date(m.createdAt).getTime();
  return [Number.isNaN(t) ? 0 : t, m._id];
}

/** Chronological, with _id breaking ties so the order is stable. */
export function sortMessages(messages: ChatMessage[]): ChatMessage[] {
  return [...messages].sort((a, b) => {
    const [at, aid] = sortKey(a);
    const [bt, bid] = sortKey(b);
    if (at !== bt) return at - bt;
    return aid < bid ? -1 : aid > bid ? 1 : 0;
  });
}

/**
 * Folds one server message into the current thread.
 *
 * Returns the same array reference when nothing changed, so callers can use
 * the result directly in a React state setter without forcing a re-render.
 */
export function mergeMessage(
  current: ChatMessage[],
  incoming: ChatMessage,
  { conversationId, currentUserId }: MergeOptions,
): ChatMessage[] {
  if (!incoming?._id) return current;

  // Socket delivery is per-user, not per-thread: a message for another
  // conversation must never be appended to the one on screen.
  if (conversationId && incoming.conversationId !== conversationId) {
    return current;
  }

  if (current.some((m) => m._id === incoming._id)) return current;

  // Our own message coming back: replace the optimistic placeholder rather
  // than showing the text twice. Match the oldest unconfirmed placeholder with
  // the same text so sending "ok" twice resolves to two messages, not one.
  const isOwn = !!currentUserId && incoming.senderId === currentUserId;
  if (isOwn) {
    const pendingIndex = current.findIndex(
      (m) => m.pending && m.content === incoming.content,
    );
    if (pendingIndex !== -1) {
      const next = [...current];
      next[pendingIndex] = { ...incoming, pending: false };
      return sortMessages(next);
    }
  }

  return sortMessages([...current, incoming]);
}

/**
 * Folds a batch of server messages in order.
 *
 * This exists because React batches state updates: several socket events can
 * land between two renders, so a consumer that only looks at the newest one
 * silently loses the rest.
 */
export function mergeMessages(
  current: ChatMessage[],
  incoming: ChatMessage[],
  options: MergeOptions,
): ChatMessage[] {
  return incoming.reduce((acc, msg) => mergeMessage(acc, msg, options), current);
}
