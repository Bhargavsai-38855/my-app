import React from 'react';
import { Chat } from '../../types/telegram';
import {
  ArrowLeft,
  Phone,
  Search,
  MoreVertical,
  ShieldCheck,
  Bookmark,
  Bot,
  Users,
} from 'lucide-react';

interface ChatHeaderProps {
  chat: Chat;
  onBackMobile: () => void;
  onToggleSearchInChat: () => void;
  onStartCall: () => void;
  onToggleInfoDrawer: () => void;
  isTyping?: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  chat,
  onBackMobile,
  onToggleSearchInChat,
  onStartCall,
  onToggleInfoDrawer,
  isTyping = false,
}) => {
  const isSaved = chat.id === 'chat-saved';

  return (
    <div className="h-14 px-3 sm:px-4 bg-white dark:bg-[#17212b] border-b border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between gap-3 shrink-0 z-20 shadow-xs">
      {/* Left zone: mobile back & chat avatar + titles */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <button
          onClick={onBackMobile}
          aria-label="Back to chat list"
          className="md:hidden p-2 -ml-1 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div
          onClick={onToggleInfoDrawer}
          className="flex items-center gap-3 min-w-0 cursor-pointer group"
        >
          {chat.avatar ? (
            <img
              src={chat.avatar}
              alt={chat.title}
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3390ec] to-blue-700 flex items-center justify-center text-white font-semibold text-sm shrink-0">
              {isSaved ? (
                <Bookmark className="w-5 h-5 fill-white text-white" />
              ) : chat.type === 'bot' ? (
                <Bot className="w-5 h-5 text-white" />
              ) : chat.type === 'group' ? (
                <Users className="w-5 h-5 text-white" />
              ) : (
                chat.title.slice(0, 2).toUpperCase()
              )}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h2 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                {chat.title}
              </h2>
              {chat.verified && (
                <ShieldCheck className="w-4 h-4 text-[#3390ec] shrink-0" />
              )}
            </div>

            <p className="text-xs truncate">
              {isTyping ? (
                <span className="text-[#3390ec] font-medium animate-pulse">
                  typing...
                </span>
              ) : chat.isOnline ? (
                <span className="text-[#3390ec] font-medium">online</span>
              ) : (
                <span className="text-slate-500 dark:text-slate-400">
                  {chat.onlineStatus || 'last seen recently'}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Right zone: action buttons */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        <button
          onClick={onToggleSearchInChat}
          aria-label="Search inside chat"
          title="Search in chat"
          className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>

        {chat.type === 'personal' && !isSaved && (
          <button
            onClick={onStartCall}
            aria-label="Voice or video call"
            title="Start Call"
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Phone className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={onToggleInfoDrawer}
          aria-label="View chat details"
          title="Chat Info"
          className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
