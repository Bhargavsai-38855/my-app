export type ChatType = 'personal' | 'group' | 'channel' | 'bot';

export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface Reaction {
  emoji: string;
  count: number;
  userReacted?: boolean;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: number;
  isOutgoing: boolean;
  status: MessageStatus;
  mediaUrl?: string;
  mediaType?: 'image' | 'voice' | 'file';
  fileName?: string;
  fileSize?: string;
  audioDuration?: number; // in seconds
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
  };
  reactions?: Record<string, number>;
  isPinned?: boolean;
  isEdited?: boolean;
}

export interface Chat {
  id: string;
  title: string;
  type: ChatType;
  avatar?: string;
  verified?: boolean;
  muted?: boolean;
  pinned?: boolean;
  unreadCount: number;
  lastMessage?: {
    text: string;
    timestamp: number;
    senderName?: string;
    isOutgoing?: boolean;
    status?: MessageStatus;
  };
  onlineStatus?: string; // 'online' | 'last seen recently' | 'bot' | '14,280 members'
  isOnline?: boolean;
  bio?: string;
  username?: string;
  phone?: string;
}

export type FolderTab = 'all' | 'personal' | 'groups' | 'channels' | 'bots';

export type ThemeMode = 'dark' | 'night-blue' | 'day' | 'arctic';

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  phone: string;
  bio: string;
  avatar: string;
}
