import { Chat, Message, UserProfile } from '../types/telegram';

export const currentUser: UserProfile = {
  id: 'user_me',
  name: 'Kiran Dhanu',
  username: 'kirandhanu',
  phone: '+1 555 019 2831',
  bio: 'Product engineer & tech enthusiast · Building the open web 🚀',
  avatar: '/src/assets/images/avatar_tech_lead_1794121257394.jpg',
};

const now = Date.now();
const minute = 60 * 1000;
const hour = 60 * minute;

export const initialChats: Chat[] = [
  {
    id: 'chat-saved',
    title: 'Saved Messages',
    type: 'personal',
    verified: false,
    pinned: true,
    muted: false,
    unreadCount: 0,
    bio: 'Your cloud storage · Forward messages here to save them · Access from any device',
    username: 'saved_messages',
    onlineStatus: 'service notification',
  },
  {
    id: 'chat-bot',
    title: 'Pigeon Assistant Bot',
    type: 'bot',
    avatar: '/assets/aistudio/pigeon-192_861273e6.png',
    verified: true,
    pinned: false,
    muted: false,
    unreadCount: 0,
    bio: 'Interactive Pigeon bot for crypto quotes, math calculations, rolling dice, quotes, and quick utilities. Type /help to begin.',
    username: 'PigeonBot',
    onlineStatus: 'bot',
  },
];

export const initialMessages: Record<string, Message[]> = {};
