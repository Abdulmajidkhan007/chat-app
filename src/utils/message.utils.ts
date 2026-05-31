import type { ChatMessage } from '@/stores/chat.store';

export function getMessagePreview(message: ChatMessage, isOwn: boolean): string {
  if (message.isDeleted) return 'Message was deleted';

  const prefix = isOwn ? 'You: ' : '';

  switch (message.type) {
    case 'text':
      return `${prefix}${message.text ?? ''}`;
    case 'voice':
      return `${prefix}🎤 Voice message`;
    case 'image':
      return `${prefix}📷 Photo`;
    case 'video':
      return `${prefix}🎬 Video`;
    case 'audio':
      return `${prefix}🎵 Audio`;
    case 'document':
      return `${prefix}📎 ${message.fileName ?? 'Document'}`;
    case 'system':
      return message.text ?? '';
    default:
      return `${prefix}Message`;
  }
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return '?';
  if (parts.length === 1) return (parts[0][0] ?? '').toUpperCase();
  return ((parts[0][0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase();
}

const AVATAR_COLORS = [
  '#E57373', '#F06292', '#BA68C8', '#7986CB',
  '#4FC3F7', '#4DB6AC', '#81C784', '#FFD54F',
];

export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index] ?? AVATAR_COLORS[0] ?? '#4FC3F7';
}
