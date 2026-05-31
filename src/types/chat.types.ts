/**
 * chat.types.ts
 * Domain types for Pulse Messenger chats (private, group, channel, topic group).
 */

import type { UserId, UserPreview } from './user.types';
import type { Message } from './message.types';

// ---------------------------------------------------------------------------
// Branded ID
// ---------------------------------------------------------------------------

export type ChatId = string & { readonly __brand: 'ChatId' };

// ---------------------------------------------------------------------------
// Enumerations / unions
// ---------------------------------------------------------------------------

export type ChatType = 'private' | 'group' | 'channel' | 'topic_group';

export type ChatMemberRole = 'owner' | 'admin' | 'member';

// ---------------------------------------------------------------------------
// Supporting interfaces
// ---------------------------------------------------------------------------

/** Granular permission flags; used at chat level and as optional per-member overrides. */
export interface ChatPermissions {
  readonly canSendMessages: boolean;
  readonly canSendMedia: boolean;
  readonly canAddMembers: boolean;
  readonly canPinMessages: boolean;
  readonly canChangeInfo: boolean;
}

export interface ChatMember {
  readonly userId: UserId;
  readonly userPreview: UserPreview;
  readonly role: ChatMemberRole;
  readonly joinedAt: Date;
  /** When present, overrides the chat-level permissions for this member. */
  readonly permissions?: ChatPermissions;
}

/** A topic thread within a TopicGroup chat (similar to Telegram forum topics). */
export interface TopicThread {
  readonly id: string;
  readonly title: string;
  /** Single emoji that acts as a visual icon for the topic. */
  readonly iconEmoji: string;
  readonly isPinned: boolean;
  readonly messageCount: number;
  readonly lastMessage: Message | null;
  readonly createdAt: Date;
}

// ---------------------------------------------------------------------------
// Base chat
// ---------------------------------------------------------------------------

export interface BaseChat {
  readonly id: ChatId;
  readonly type: ChatType;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly lastMessage: Message | null;
  /** Number of messages the current user has not yet read. */
  readonly unreadCount: number;
  readonly isPinned: boolean;
  readonly isMuted: boolean;
  readonly isArchived: boolean;
}

// ---------------------------------------------------------------------------
// Discriminated chat variants
// ---------------------------------------------------------------------------

export interface PrivateChat extends BaseChat {
  readonly type: 'private';
  readonly otherUser: UserPreview;
  readonly isBlocked: boolean;
}

export interface GroupChat extends BaseChat {
  readonly type: 'group';
  readonly name: string;
  readonly avatarUrl?: string;
  readonly description?: string;
  readonly members: readonly ChatMember[];
  readonly adminIds: readonly UserId[];
  readonly permissions: ChatPermissions;
  readonly memberCount: number;
}

export interface Channel extends BaseChat {
  readonly type: 'channel';
  readonly name: string;
  /** Public username that can appear in a share link, e.g. "@pulse_news". */
  readonly username?: string;
  readonly avatarUrl?: string;
  readonly description?: string;
  readonly subscriberCount: number;
  readonly isPublic: boolean;
  readonly isVerified: boolean;
}

export interface TopicGroup extends BaseChat {
  readonly type: 'topic_group';
  readonly name: string;
  readonly avatarUrl?: string;
  readonly description?: string;
  readonly members: readonly ChatMember[];
  readonly topics: readonly TopicThread[];
  readonly memberCount: number;
}

// ---------------------------------------------------------------------------
// Union and derived types
// ---------------------------------------------------------------------------

export type Chat = PrivateChat | GroupChat | Channel | TopicGroup;

/**
 * Slim representation used in chat list rows.
 * Carries only the fields required to render without loading the full chat.
 */
export type ChatPreview = Pick<
  BaseChat,
  'id' | 'type' | 'updatedAt' | 'lastMessage' | 'unreadCount' | 'isPinned' | 'isMuted' | 'isArchived'
> & {
  /** Display name derived from the specific chat variant. */
  readonly name: string;
  readonly avatarUrl?: string;
};

/** Transient state broadcast over WebSocket while a user is composing. */
export interface TypingIndicator {
  readonly chatId: ChatId;
  readonly userId: UserId;
  readonly userName: string;
  readonly startedAt: Date;
}
