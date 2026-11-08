import React from 'react';
import { UserProfile, ThemeMode } from '../../types/telegram';
import {
  Bookmark,
  Moon,
  Sun,
  Settings,
  Users,
  Megaphone,
  UserCheck,
  HelpCircle,
  X,
} from 'lucide-react';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onSelectSavedMessages: () => void;
  onOpenSettings: () => void;
  onOpenNewChat: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  theme,
  onToggleTheme,
  onSelectSavedMessages,
  onOpenSettings,
  onOpenNewChat,
}) => {
  if (!isOpen) return null;

  const isDarkMode = theme === 'dark' || theme === 'night-blue';

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Dimmed backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer content */}
      <div className="relative w-72 max-w-[85vw] h-full bg-white dark:bg-[#17212b] shadow-2xl flex flex-col z-10 transition-transform">
        {/* User profile header */}
        <div className="p-4 bg-gradient-to-b from-[#3390ec]/15 to-transparent border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-[#242f3d] shadow-sm"
            />
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="p-1.5 rounded-full text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
            {currentUser.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {currentUser.phone}
          </p>
          <p className="text-xs text-[#3390ec] font-mono mt-0.5">
            @{currentUser.username}
          </p>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto py-2">
          <button
            onClick={() => {
              onSelectSavedMessages();
              onClose();
            }}
            className="w-full px-4 py-3 flex items-center gap-4 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#202b36] transition-colors text-left"
          >
            <Bookmark className="w-5 h-5 text-[#3390ec]" />
            <span className="font-medium">Saved Messages</span>
          </button>

          <button
            onClick={() => {
              onOpenNewChat();
              onClose();
            }}
            className="w-full px-4 py-3 flex items-center gap-4 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#202b36] transition-colors text-left"
          >
            <Users className="w-5 h-5 text-emerald-500" />
            <span className="font-medium">New Group</span>
          </button>

          <button
            onClick={() => {
              onOpenNewChat();
              onClose();
            }}
            className="w-full px-4 py-3 flex items-center gap-4 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#202b36] transition-colors text-left"
          >
            <Megaphone className="w-5 h-5 text-amber-500" />
            <span className="font-medium">New Channel</span>
          </button>

          <button
            onClick={() => {
              onOpenSettings();
              onClose();
            }}
            className="w-full px-4 py-3 flex items-center gap-4 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#202b36] transition-colors text-left"
          >
            <UserCheck className="w-5 h-5 text-indigo-500" />
            <span className="font-medium">Contacts</span>
          </button>

          <button
            onClick={() => {
              onOpenSettings();
              onClose();
            }}
            className="w-full px-4 py-3 flex items-center gap-4 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#202b36] transition-colors text-left"
          >
            <Settings className="w-5 h-5 text-slate-500" />
            <span className="font-medium">Settings</span>
          </button>

          <div className="my-2 border-t border-slate-100 dark:border-slate-800" />

          {/* Night mode toggle */}
          <button
            onClick={onToggleTheme}
            className="w-full px-4 py-3 flex items-center justify-between text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#202b36] transition-colors text-left"
          >
            <div className="flex items-center gap-4">
              {isDarkMode ? (
                <Moon className="w-5 h-5 text-amber-400" />
              ) : (
                <Sun className="w-5 h-5 text-amber-500" />
              )}
              <span className="font-medium">Night Mode</span>
            </div>
            <div
              className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                isDarkMode ? 'bg-[#3390ec]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  isDarkMode ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </div>
          </button>

          <button
            onClick={() => {
              window.open('https://telegram.org/faq', '_blank', 'noopener,noreferrer');
            }}
            className="w-full px-4 py-3 flex items-center gap-4 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#202b36] transition-colors text-left"
          >
            <HelpCircle className="w-5 h-5 text-slate-400" />
            <span className="font-medium">Telegram Features</span>
          </button>
        </div>

        {/* Footer version */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500">
          Telegram Web K · 10.9.0
        </div>
      </div>
    </div>
  );
};
