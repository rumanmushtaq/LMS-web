export interface ChatAttachment {
  url: string;
  name: string;
  mimeType: string;
  size: number;
}

/** Must stay in step with ALLOWED_ATTACHMENT_TYPES on the backend. */
export const ACCEPTED_ATTACHMENT_EXTENSIONS =
  ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg,.webp";

export const MAX_ATTACHMENT_BYTES = 25 * 1024 * 1024;

export function isImageAttachment(attachment: ChatAttachment): boolean {
  return attachment.mimeType.startsWith("image/");
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
