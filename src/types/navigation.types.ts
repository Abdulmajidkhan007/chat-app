/**
 * navigation.types.ts
 * React Navigation v7 param lists for Pulse Messenger.
 *
 * Screens with no parameters use `undefined` (not an empty object) so that
 * the navigator does not require callers to pass an empty param bag.
 */

import type { ChatType } from './chat.types';
import type { MediaItem } from './media.types';

// ---------------------------------------------------------------------------
// Root stack
// ---------------------------------------------------------------------------

export type RootStackParamList = {
  /** Entry point — decides whether to show Auth or Main. */
  Auth: undefined;
  Main: undefined;
};

// ---------------------------------------------------------------------------
// Auth stack
// ---------------------------------------------------------------------------

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  /** OTP verification; `phone` is the E.164 number the code was sent to. */
  OTP: { readonly phone: string };
  /** First-time profile creation after a successful OTP verification. */
  ProfileSetup: { readonly phone: string };
};

// ---------------------------------------------------------------------------
// Main bottom-tab navigator
// ---------------------------------------------------------------------------

export type MainTabParamList = {
  Chats: undefined;
  Contacts: undefined;
  /** Placeholder tab — call history feature is not yet implemented. */
  Calls: undefined;
  Settings: undefined;
};

// ---------------------------------------------------------------------------
// Chat stack (nested inside the Chats tab)
// ---------------------------------------------------------------------------

export type ChatStackParamList = {
  ChatList: undefined;
  ChatDetail: {
    readonly chatId: string;
    readonly chatType: ChatType;
    readonly title: string;
    readonly avatarUrl?: string;
  };
  MediaPreview: {
    readonly mediaItems: readonly MediaItem[];
    readonly initialIndex: number;
    readonly title: string;
  };
  Profile: { readonly userId: string };
  GroupInfo: { readonly chatId: string };
  ChannelInfo: { readonly chatId: string };
  ForwardMessage: {
    readonly messageId: string;
    readonly sourceChatId: string;
  };
  SearchScreen: undefined;
  TopicDetail: {
    readonly chatId: string;
    readonly topicId: string;
    readonly topicTitle: string;
  };
};

// ---------------------------------------------------------------------------
// Settings stack (nested inside the Settings tab)
// ---------------------------------------------------------------------------

export type SettingsStackParamList = {
  SettingsMain: undefined;
  NotificationSettings: undefined;
  PrivacySettings: undefined;
  ThemeSettings: undefined;
  EditProfile: undefined;
  BlockedUsers: undefined;
};
