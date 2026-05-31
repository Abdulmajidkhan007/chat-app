/**
 * index.ts
 * Barrel re-export for all Pulse Messenger domain types.
 * Import from '@/types' rather than from individual domain files.
 */

export type {
  UserId,
  UserStatus,
  UserRole,
  User,
  UserPreview,
  CurrentUser,
} from './user.types';

export type {
  MessageId,
  MessageType,
  MessageStatus,
  ReactionEmoji,
  Reaction,
  MessageReply,
  MediaAttachment,
  BaseMessage,
  TextMessage,
  ImageMessage,
  VideoMessage,
  AudioMessage,
  VoiceMessage,
  DocumentMessage,
  SystemMessage,
  Message,
} from './message.types';

export type {
  ChatId,
  ChatType,
  ChatMemberRole,
  ChatPermissions,
  ChatMember,
  TopicThread,
  BaseChat,
  PrivateChat,
  GroupChat,
  Channel,
  TopicGroup,
  Chat,
  ChatPreview,
  TypingIndicator,
} from './chat.types';

export type {
  MediaType,
  UploadStatus,
  MediaItem,
  VoiceRecordingState,
  AttachmentPickerItem,
} from './media.types';

export type {
  RootStackParamList,
  AuthStackParamList,
  MainTabParamList,
  ChatStackParamList,
  SettingsStackParamList,
} from './navigation.types';

export type {
  RequestStatus,
  ApiResponse,
  PaginatedResponse,
  ApiError,
  StoreSliceStatus,
  WebSocketEvent,
} from './api.types';
