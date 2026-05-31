import type { Chat, ChatMessage } from '@/stores/chat.store';
import { mockChats } from '@/data/mock';
import { mockPrivateChatMessages, mockGroupMessages } from '@/data/mock/messages.mock';

const SIMULATE_DELAY = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export const ChatService = {
  async getChats(): Promise<Chat[]> {
    await SIMULATE_DELAY(600);
    return [...mockChats].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });
  },

  async getMessages(chatId: string): Promise<ChatMessage[]> {
    await SIMULATE_DELAY(400);
    if (chatId === 'chat_1') return mockPrivateChatMessages;
    if (chatId === 'chat_7') return mockGroupMessages;
    return [];
  },

  async sendMessage(
    chatId: string,
    text: string,
    replyToId?: string
  ): Promise<ChatMessage> {
    await SIMULATE_DELAY(200);
    const now = new Date();
    const message: ChatMessage = {
      id: `msg_${Date.now()}`,
      chatId,
      senderId: 'me',
      senderPreview: {
        id: 'me',
        firstName: 'You',
        avatarUrl: `https://i.pravatar.cc/150?img=33`,
        status: 'online',
        isVerified: false,
      },
      type: 'text',
      text,
      status: 'sending',
      sentAt: now,
      isDeleted: false,
      isPinned: false,
      replyTo: null,
      reactions: [],
    };
    // Simulate delivery after 1s
    setTimeout(() => {
      // In a real app, WebSocket would push back the delivery status
    }, 1000);
    return message;
  },

  async sendVoice(
    chatId: string,
    uri: string,
    duration: number,
    waveform: number[]
  ): Promise<ChatMessage> {
    await SIMULATE_DELAY(300);
    return {
      id: `msg_${Date.now()}`,
      chatId,
      senderId: 'me',
      senderPreview: {
        id: 'me',
        firstName: 'You',
        avatarUrl: `https://i.pravatar.cc/150?img=33`,
        status: 'online',
        isVerified: false,
      },
      type: 'voice',
      status: 'sending',
      sentAt: new Date(),
      isDeleted: false,
      isPinned: false,
      replyTo: null,
      reactions: [],
      mediaUrl: uri,
      duration,
      waveform,
    };
  },

  async deleteMessage(chatId: string, messageId: string): Promise<void> {
    await SIMULATE_DELAY(300);
  },

  async addReaction(
    chatId: string,
    messageId: string,
    emoji: string
  ): Promise<void> {
    await SIMULATE_DELAY(100);
  },

  async pinMessage(chatId: string, messageId: string): Promise<void> {
    await SIMULATE_DELAY(200);
  },

  async markAsRead(chatId: string): Promise<void> {
    await SIMULATE_DELAY(100);
  },
};
