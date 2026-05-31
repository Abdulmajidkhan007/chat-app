import { formatDistanceToNow, isToday, isYesterday, format, differenceInDays } from 'date-fns';

export function formatChatTimestamp(date: Date): string {
  if (isToday(date)) {
    return format(date, 'HH:mm');
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  if (differenceInDays(new Date(), date) < 7) {
    return format(date, 'EEE'); // "Mon", "Tue", etc.
  }
  return format(date, 'dd/MM/yy');
}

export function formatMessageTimestamp(date: Date): string {
  return format(date, 'HH:mm');
}

export function formatLastSeen(date: Date): string {
  return `last seen ${formatDistanceToNow(date, { addSuffix: true })}`;
}

export function formatVoiceDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
