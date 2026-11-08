import React from 'react';
import { Chat } from '../../types/telegram';
import { formatChatTimestamp } from '../../utils/telegramLogic';
import { Check, CheckCheck, Pin, VolumeX, Bookmark, ShieldCheck, Bot, Users, Trash2 } from 'lucide-react';

interface ChatListProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onDeleteChat?: (chatId: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  activeChatId,
  onSelectChat,
  onDeleteChat,
}) => {
  if (chats.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400 dark:text-slate-500">
        <p className="text-sm font-medium">No chats found</p>
        <p className="text-xs mt-1">Try another search or folder tab</p>
      </div>
    );
  }

  // Generate deterministic gradient background for avatars without pictures
  const getAvatarGradient = (title: string, type: string) => {
    if (type === 'bot') return 'from-amber-500 to-orange-600';
    if (title.includes('Saved')) return 'from-[#3390ec] to-blue-600';
    const gradients = [
      'from-emerald-500 to-teal-700',
      'from-purple-500 to-indigo-600',
      'from-rose-500 to-pink-600',
      'from-cyan-500 to-blue-600',
      'from-amber-500 to-yellow-600',
    ];
    let hash = 0;
    for (let i = 0; i < title.length; i++) hash += title.charCodeAt(i);
    return gradients[Math.abs(hash) % gradients.length];
  };

  const getInitials = (title: string) => {
    const words = title.trim().split(' ');
    if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
    return title.slice(0, 2).toUpperCase();
  };

  return (
    <div className="flex-1 overflow-y-auto divide-y divide-slate-100/60 dark:divide-slate-800/40">
      {chats.map((chat) => {
        const isActive = activeChatId === chat.id;
        const isSaved = chat.id === 'chat-saved';

        return (
          <div
            key={chat.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelectChat(chat.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectChat(chat.id);
              }
            }}
            className={`w-full text-left p-3 flex items-center gap-3 transition-colors relative select-none cursor-pointer group ${
              isActive
                ? 'bg-[#3390ec] text-white dark:bg-[#2b5278]'
                : 'hover:bg-slate-100/80 dark:hover:bg-[#202b36] text-slate-900 dark:text-slate-100'
            }`}
          >
            {/* Avatar container */}
            <div className="relative shrink-0">
              {chat.avatar ? (
                <img
                  src={chat.avatar}
                  alt={chat.title}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover shadow-xs"
                />
              ) : (
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarGradient(
                    chat.title,
                    chat.type
                  )} flex items-center justify-center text-white font-semibold text-sm shadow-xs`}
                >
                  {isSaved ? (
                    <Bookmark className="w-5 h-5 fill-white text-white" />
                  ) : chat.type === 'bot' ? (
                    <Bot className="w-6 h-6 text-white" />
                  ) : chat.type === 'group' ? (
                    <Users className="w-5 h-5 text-white" />
                  ) : (
                    getInitials(chat.title)
                  )}
                </div>
              )}

              {/* Online indicator */}
              {chat.isOnline && (
                <span
                  className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#17212b]"
                  title="Online"
                />
              )}
            </div>

            {/* Chat info preview */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className={`font-semibold text-sm truncate ${
                      isActive ? 'text-white' : 'text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {chat.title}
                  </span>
                  {chat.verified && (
                    <ShieldCheck
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-white' : 'text-[#3390ec]'
                      }`}
                    />
                  )}
                  {chat.muted && (
                    <VolumeX
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isActive ? 'text-white/70' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    />
                  )}
                </div>

                {chat.lastMessage && (
                  <span
                    className={`text-[11px] tabular-nums shrink-0 ${
                      isActive ? 'text-white/80' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {formatChatTimestamp(chat.lastMessage.timestamp)}
                  </span>
                )}
              </div>

              {/* Last message row */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 min-w-0">
                  {chat.lastMessage?.isOutgoing && (
                    <span className="shrink-0">
                      {chat.lastMessage.status === 'read' ? (
                        <CheckCheck
                          className={`w-3.5 h-3.5 ${
                            isActive ? 'text-white' : 'text-[#3390ec]'
                          }`}
                        />
                      ) : (
                        <Check
                          className={`w-3.5 h-3.5 ${
                            isActive ? 'text-white/80' : 'text-slate-400'
                          }`}
                        />
                      )}
                    </span>
                  )}

                  <p
                    className={`text-xs truncate ${
                      isActive
                        ? 'text-white/90'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {chat.lastMessage?.senderName &&
                      chat.type === 'group' &&
                      !chat.lastMessage.text.startsWith(chat.lastMessage.senderName) && (
                        <span className="font-medium mr-1">
                          {chat.lastMessage.senderName}:
                        </span>
                      )}
                    {chat.lastMessage?.text || 'No messages yet'}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {onDeleteChat && chat.id !== 'chat-saved' && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}
                      title="Delete chat"
                      aria-label="Delete chat"
                      className={`p-1 rounded-md opacity-0 group-hover:opacity-100 hover:scale-110 transition-all ${
                        isActive
                          ? 'text-white/80 hover:text-white hover:bg-white/20'
                          : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                      }`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {chat.pinned && (
                    <Pin
                      className={`w-3.5 h-3.5 rotate-45 ${
                        isActive ? 'text-white/80' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    />
                  )}

                  {chat.unreadCount > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold min-w-4 text-center ${
                        chat.muted
                          ? isActive
                            ? 'bg-white/30 text-white'
                            : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          : isActive
                          ? 'bg-white text-[#3390ec]'
                          : 'bg-[#3390ec] text-white'
                      }`}
                    >
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
