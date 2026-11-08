import React, { useState } from 'react';
import { ChatType, Chat } from '../../types/telegram';
import { X, Users, Megaphone, UserPlus } from 'lucide-react';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChat: (newChat: Chat) => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({
  isOpen,
  onClose,
  onCreateChat,
}) => {
  if (!isOpen) return null;

  const [chatType, setChatType] = useState<ChatType>('personal');
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const id = `chat-custom-${Date.now()}`;
    const newChat: Chat = {
      id,
      title: trimmedTitle,
      type: chatType,
      verified: false,
      pinned: false,
      muted: false,
      unreadCount: 0,
      username: username.trim() || undefined,
      bio: bio.trim() || undefined,
      onlineStatus:
        chatType === 'group'
          ? '1 member'
          : chatType === 'channel'
          ? '1 subscriber'
          : 'online',
      isOnline: chatType === 'personal',
      lastMessage: {
        text:
          chatType === 'channel'
            ? 'Channel created'
            : chatType === 'group'
            ? 'Group created'
            : 'Chat initiated',
        timestamp: Date.now(),
        isOutgoing: true,
        status: 'read',
      },
    };

    onCreateChat(newChat);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#17212b] border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-14 px-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0">
          <h2 className="font-bold text-base text-slate-900 dark:text-white">
            Create New Conversation
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm">
          {/* Chat type buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setChatType('personal')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                chatType === 'personal'
                  ? 'border-[#3390ec] bg-blue-50/50 dark:bg-[#202b36] text-[#3390ec]'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <UserPlus className="w-5 h-5" />
              <span className="text-xs font-semibold">Contact</span>
            </button>

            <button
              type="button"
              onClick={() => setChatType('group')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                chatType === 'group'
                  ? 'border-[#3390ec] bg-blue-50/50 dark:bg-[#202b36] text-[#3390ec]'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="text-xs font-semibold">Group</span>
            </button>

            <button
              type="button"
              onClick={() => setChatType('channel')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                chatType === 'channel'
                  ? 'border-[#3390ec] bg-blue-50/50 dark:bg-[#202b36] text-[#3390ec]'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Megaphone className="w-5 h-5" />
              <span className="text-xs font-semibold">Channel</span>
            </button>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
              {chatType === 'group'
                ? 'Group Name'
                : chatType === 'channel'
                ? 'Channel Name'
                : 'Contact Name'}
            </label>
            <input
              type="text"
              required
              placeholder={
                chatType === 'group'
                  ? 'e.g. Design Enthusiasts'
                  : chatType === 'channel'
                  ? 'e.g. Tech Alpha News'
                  : 'e.g. Marcus Aurelius'
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-[#242f3d] text-slate-900 dark:text-slate-100 text-sm border border-transparent focus:border-[#3390ec] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
              Public Link or Username (@)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">@</span>
              <input
                type="text"
                placeholder="unique_handle"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                className="w-full pl-7 pr-3 py-2 rounded-lg bg-slate-100 dark:bg-[#242f3d] text-slate-900 dark:text-slate-100 text-sm border border-transparent focus:border-[#3390ec] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
              Description or Bio
            </label>
            <textarea
              rows={2}
              placeholder="What is this chat about?"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-[#242f3d] text-slate-900 dark:text-slate-100 text-sm border border-transparent focus:border-[#3390ec] focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#3390ec] text-white text-xs font-medium hover:bg-blue-600 transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
