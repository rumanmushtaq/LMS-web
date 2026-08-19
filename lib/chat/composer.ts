/**
 * Shared behaviour for the chat message box.
 *
 * Both the emoji picker and the Enter key are involved in the same two bugs:
 * an emoji inserted from the OS panel is composed text, and Enter arrives
 * while that composition is still open.
 */

/**
 * True when this Enter press should send the message.
 *
 * The composition check is the important part. Inserting an emoji with the OS
 * picker (Win+. or Ctrl+Cmd+Space) — and any IME — opens a composition, and
 * the Enter that confirms it also reaches `keydown`. Acting on that Enter
 * either sends before the emoji has been committed to the input's value, or
 * sends nothing at all because the value is still empty. Browsers flag it with
 * `isComposing`; older ones only report keyCode 229.
 *
 * Shift+Enter is excluded so the box can grow a newline later without this
 * changing again.
 */
export function shouldSendOnKeyDown(
  event: Pick<React.KeyboardEvent, "key" | "shiftKey"> & {
    nativeEvent?: { isComposing?: boolean; keyCode?: number };
  },
): boolean {
  if (event.key !== "Enter") return false;
  if (event.shiftKey) return false;

  const native = event.nativeEvent;
  if (native?.isComposing) return false;
  if (native?.keyCode === 229) return false;

  return true;
}

/**
 * Inserts `insertion` at the caret rather than always appending.
 *
 * Returns the new value and where the caret should land, so the caller can
 * restore it — otherwise the caret jumps to the end after every emoji.
 */
export function insertAtCaret(
  value: string,
  insertion: string,
  selectionStart: number | null,
  selectionEnd: number | null,
): { value: string; caret: number } {
  const start = selectionStart ?? value.length;
  const end = selectionEnd ?? start;

  const next = value.slice(0, start) + insertion + value.slice(end);
  return { value: next, caret: start + insertion.length };
}
