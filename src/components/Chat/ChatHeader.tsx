import React, { useState, useRef, useEffect } from 'react';
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
  Trash2,
  Bell,
  BellOff,
  Info,
} from 'lucide-react';

interface ChatHeaderProps {
  chat: Chat;
  onBackMobile: () => void;
  onToggleSearchInChat: () => void;
  onStartCall: () => void;
  onToggleInfoDrawer: () => void;
  onClearChat?: () => void;
  onDeleteChat?: () => void;
  onToggleMute?: () => void;
  isTyping?: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  chat,
  onBackMobile,
  onToggleSearchInChat,
  onStartCall,
  onToggleInfoDrawer,
  onClearChat,
  onDeleteChat,
  onToggleMute,
  isTyping = false,
}) => {
  const isSaved = chat.id === 'chat-saved';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="h-14 px-3 sm:px-4 bg-white dark:bg-[#17212b] border-b border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between gap-3 shrink-0 z-20 shadow-xs relative">
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
                <span className="text-slate-500 dark:text-slate-400 capitalize">
                  {(() => {
                    if (chat.type === 'channel') return 'channel';
                    if (chat.type === 'group') return 'group';
                    if (chat.type === 'bot') return 'bot';
                    if (
                      chat.onlineStatus &&
                      !chat.onlineStatus.toLowerCase().includes('subscriber') &&
                      !chat.onlineStatus.toLowerCase().includes('member')
                    ) {
                      return chat.onlineStatus;
                    }
                    return 'last seen recently';
                  })()}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Right zone: action buttons */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0" ref={menuRef}>
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

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Chat options"
            title="More Options"
            className={`p-2 rounded-full transition-colors ${
              isMenuOpen
                ? 'bg-slate-100 dark:bg-slate-800 text-[#3390ec]'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* More options dropdown menu */}
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl bg-white dark:bg-[#202b36] border border-slate-200 dark:border-slate-700/80 shadow-2xl py-1.5 z-50 animate-pop-in">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onToggleInfoDrawer();
                }}
                className="w-full px-3.5 py-2.5 text-left text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2.5 transition-colors"
              >
                <Info className="w-4 h-4 text-[#3390ec]" />
                <span className="font-medium">View Chat Info</span>
              </button>

              {onToggleMute && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onToggleMute();
                  }}
                  className="w-full px-3.5 py-2.5 text-left text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2.5 transition-colors"
                >
                  {chat.muted ? (
                    <>
                      <Bell className="w-4 h-4 text-emerald-500" />
                      <span className="font-medium">Unmute Notifications</span>
                    </>
                  ) : (
                    <>
                      <BellOff className="w-4 h-4 text-slate-400" />
                      <span className="font-medium">Mute Notifications</span>
                    </>
                  )}
                </button>
              )}

              {onClearChat && (
                <>
                  <div className="my-1 border-t border-slate-100 dark:border-slate-700/50" />
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onClearChat();
                    }}
                    className="w-full px-3.5 py-2.5 text-left text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center gap-2.5 transition-colors font-medium"
                  >
                    <Trash2 className="w-4 h-4 text-amber-500" />
                    <span>Clear Chat History</span>
                  </button>
                </>
              )}

              {onDeleteChat && chat.id !== 'chat-saved' && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onDeleteChat();
                  }}
                  className="w-full px-3.5 py-2.5 text-left text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2.5 transition-colors font-medium"
                >
                  <Trash2 className="w-4 h-4 text-rose-500" />
                  <span>Delete Chat</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
