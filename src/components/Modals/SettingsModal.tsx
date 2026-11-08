import React, { useState } from 'react';
import { UserProfile, ThemeMode } from '../../types/telegram';
import { X, Moon, Sun, Volume2, Type, Check, Sparkles, LogOut, Trash2 } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  theme: ThemeMode;
  onSelectTheme: (mode: ThemeMode) => void;
  enableWallpaper: boolean;
  onToggleWallpaper: (enable: boolean) => void;
  fontSize: number;
  onChangeFontSize: (size: number) => void;
  soundEnabled: boolean;
  onToggleSound: (enabled: boolean) => void;
  onClearAllChats?: () => void;
  onLogout?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  theme,
  onSelectTheme,
  enableWallpaper,
  onToggleWallpaper,
  fontSize,
  onChangeFontSize,
  soundEnabled,
  onToggleSound,
  onClearAllChats,
  onLogout,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearedSuccess, setClearedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ name, username, bio });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const themes: { id: ThemeMode; name: string; bg: string; accent: string }[] = [
    { id: 'dark', name: 'Pigeon Dark', bg: 'bg-[#0e1621]', accent: 'border-[#3390ec]' },
    { id: 'night-blue', name: 'Night Blue', bg: 'bg-[#101921]', accent: 'border-[#64b5f6]' },
    { id: 'day', name: 'Classic Day', bg: 'bg-white', accent: 'border-[#3390ec]' },
    { id: 'arctic', name: 'Arctic Slate', bg: 'bg-slate-100', accent: 'border-cyan-500' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#17212b] border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="h-14 px-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0">
          <h2 className="font-bold text-base text-slate-900 dark:text-white">
            Settings
          </h2>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm">
          {/* User profile form */}
          <form onSubmit={handleSaveProfile} className="space-y-3">
            <h3 className="font-semibold text-xs text-slate-400 dark:text-slate-400 uppercase tracking-wider">
              Profile Information
            </h3>

            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-[#242f3d] text-slate-900 dark:text-slate-100 text-sm border border-transparent focus:border-[#3390ec] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">
                Username (@)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                  className="w-full pl-7 pr-3 py-2 rounded-lg bg-slate-100 dark:bg-[#242f3d] text-slate-900 dark:text-slate-100 text-sm border border-transparent focus:border-[#3390ec] focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">
                Bio / About
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-[#242f3d] text-slate-900 dark:text-slate-100 text-sm border border-transparent focus:border-[#3390ec] focus:outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-emerald-500 font-medium">
                {savedSuccess && 'Profile updated successfully!'}
              </span>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#3390ec] text-white font-medium text-xs hover:bg-blue-600 transition-colors"
              >
                Save Profile
              </button>
            </div>
          </form>

          {/* Theme mode selection */}
          <div className="space-y-3">
            <h3 className="font-semibold text-xs text-slate-400 dark:text-slate-400 uppercase tracking-wider">
              Chat Theme & Appearance
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onSelectTheme(t.id)}
                  className={`p-3 rounded-xl border-2 flex items-center justify-between transition-all text-left ${
                    theme === t.id
                      ? `${t.accent} bg-blue-50/50 dark:bg-[#202b36]`
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded-full ${t.bg} border border-slate-300 dark:border-slate-600 shadow-xs`} />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {t.name}
                    </span>
                  </div>
                  {theme === t.id && (
                    <Check className="w-4 h-4 text-[#3390ec] shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Wallpaper Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#202b36] border border-slate-200/50 dark:border-slate-700/60">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#3390ec]" />
              <div>
                <p className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                  Pigeon Doodle Wallpaper
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Aesthetic paper planes background pattern
                </p>
              </div>
            </div>
            <button
              onClick={() => onToggleWallpaper(!enableWallpaper)}
              className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                enableWallpaper ? 'bg-[#3390ec]' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  enableWallpaper ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Font Size slider */}
          <div className="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-[#202b36] border border-slate-200/50 dark:border-slate-700/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-slate-500" />
                <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                  Message Font Size
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-[#3390ec]">
                {fontSize}px
              </span>
            </div>
            <input
              type="range"
              min={12}
              max={18}
              value={fontSize}
              onChange={(e) => onChangeFontSize(Number(e.target.value))}
              className="w-full accent-[#3390ec] cursor-pointer"
            />
          </div>

          {/* Sound notifications switch */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#202b36] border border-slate-200/50 dark:border-slate-700/60">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-4 h-4 text-emerald-500" />
              <div>
                <p className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                  Sound Effects
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Play audio chime on message sent and received
                </p>
              </div>
            </div>
            <button
              onClick={() => onToggleSound(!soundEnabled)}
              className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                soundEnabled ? 'bg-[#3390ec]' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  soundEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Data & Storage / Clear Chats */}
          {onClearAllChats && (
            <div className="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-[#202b36] border border-slate-200/50 dark:border-slate-700/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                    Chat Storage &amp; Messages
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Clear all conversation messages across all chats
                  </p>
                </div>
              </div>

              {clearedSuccess ? (
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold text-center">
                  ✓ All chat messages cleared!
                </div>
              ) : showClearConfirm ? (
                <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-center space-y-2">
                  <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                    Are you sure you want to clear all chat messages?
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClearAllChats();
                        setShowClearConfirm(false);
                        setClearedSuccess(true);
                        setTimeout(() => setClearedSuccess(false), 2500);
                      }}
                      className="px-3 py-1 rounded-md bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700"
                    >
                      Yes, Clear All
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowClearConfirm(false)}
                      className="px-3 py-1 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(true)}
                  className="w-full py-2 px-3 rounded-lg border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All Chat Messages</span>
                </button>
              )}
            </div>
          )}

          {/* Log Out button */}
          {onLogout && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out of Pigeon</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
