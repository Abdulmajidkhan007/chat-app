/**
 * message.types.ts
 * Domain types for Pulse Messenger messages.
 */

import type { UserId, UserPreview } from './user.types';
import type { ChatId } from './chat.types';

// ---------------------------------------------------------------------------
// Branded ID
// ---------------------------------------------------------------------------

export type MessageId = string & { readonly __brand: 'MessageId' };

// ---------------------------------------------------------------------------
// Enumerations / unions
// ---------------------------------------------------------------------------

export type MessageType =
  | 'text'
  | 'image'
  | 'video'
  | 'audio'
  | 'voice'
  | 'document'
  | 'sticker'
  | 'location'
  | 'system';

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export type ReactionEmoji = '👍' | '❤️' | '😂' | '😮' | '😢' | '🔥' | '👏' | '🎉';

// ---------------------------------------------------------------------------
// Supporting interfaces
// ---------------------------------------------------------------------------

export interface Reaction {
  readonly emoji: ReactionEmoji;
  readonly count: number;
  readonly userIds: readonly UserId[];
  /** True when the currently authenticated user has applied this reaction. */
  readonly hasCurrentUser: boolean;
}

/** Slim preview rendered inside a reply bubble. */
export interface MessageReply {
  readonly messageId: MessageId;
  readonly senderId: UserId;
  readonly senderName: string;
  /** Truncated text or a fallback label such as "Photo" / "Video". */
  readonly contentPreview: string;
  readonly type: MessageType;
}

/** Describes a file or media object attached to a message. */
export interface MediaAttachment {
  readonly url: string;
  readonly thumbnailUrl?: string;
  /** Pixel width for images and videos. */
  readonly width?: number;
  /** Pixel height for images and videos. */
  readonly height?: number;
  /** Duration in seconds for audio and video content. */
  readonly duration?: number;
  /** File size in bytes. */
  readonly size: number;
  readonly mimeType: string;
  readonly fileName?: string;
}

// ---------------------------------------------------------------------------
// Base message
// ---------------------------------------------------------------------------

export interface BaseMessage {
  readonly id: MessageId;
  readonly chatId: ChatId;
  readonly senderId: UserId;
  readonly senderPreview: UserPreview;
  readonly type: MessageType;
  readonly status: MessageStatus;
  readonly sentAt: Date;
  readonly editedAt?: Date;
  readonly isDeleted: boolean;
  readonly isPinned: boolean;
  readonly replyTo: MessageReply | null;
  readonly reactions: readonly Reaction[];
  /** Present when the message is a forward; holds the original sender's name. */
  readonly forwardedFrom?: string;
}

// ---------------------------------------------------------------------------
// Discriminated message variants
// ---------------------------------------------------------------------------

export interface TextMessage extends BaseMessage {
  readonly type: 'text';
  readonly text: string;
  /** User IDs that were @-mentioned in the message body. */
  readonly mentions: readonly UserId[];
}

export interface ImageMessage extends BaseMessage {
  readonly type: 'image';
  readonly attachment: MediaAttachment;
  readonly caption?: string;
}

export interface VideoMessage extends BaseMessage {
  readonly type: 'video';
  readonly attachment: MediaAttachment;
  readonly caption?: string;
}

export interface AudioMessage extends BaseMessage {
  readonly type: 'audio';
  readonly attachment: MediaAttachment;
}

export interface VoiceMessage extends BaseMessage {
  readonly type: 'voice';
  readonly attachment: MediaAttachment;
  /** Total recording length in seconds. */
  readonly duration: number;
  /** Amplitude samples used to render the waveform visualiser. */
  readonly waveform: readonly number[];
}

export interface DocumentMessage extends BaseMessage {
  readonly type: 'document';
  readonly attachment: MediaAttachment;
}

/** Server-generated event messages, e.g. "Alice added Bob" or "Chat created". */
export interface SystemMessage extends BaseMessage {
  readonly type: 'system';
  readonly text: string;
}

// ---------------------------------------------------------------------------
// Union export
// ---------------------------------------------------------------------------

export type Message =
  | TextMessage
  | ImageMessage
  | VideoMessage
  | AudioMessage
  | VoiceMessage
  | DocumentMessage
  | SystemMessage;
