import React, { useState } from 'react';
import { Chat, Message } from '../../types/telegram';
import {
  X,
  ShieldCheck,
  Bell,
  BellOff,
  Image as ImageIcon,
  FileText,
  Music,
  Link2,
  Bookmark,
  Bot,
  Users,
  Trash2,
} from 'lucide-react';

interface ChatInfoDrawerProps {
  chat: Chat;
  messages: Message[];
  isOpen: boolean;
  onClose: () => void;
  onToggleMute: (chatId: string) => void;
  onClearChat?: (chatId: string) => void;
  onDeleteChat?: (chatId: string) => void;
}

export const ChatInfoDrawer: React.FC<ChatInfoDrawerProps> = ({
  chat,
  messages,
  isOpen,
  onClose,
  onToggleMute,
  onClearChat,
  onDeleteChat,
}) => {
  if (!isOpen) return null;

  const [activeMediaTab, setActiveMediaTab] = useState<'media' | 'files' | 'audio' | 'links'>('media');
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Extract shared media from current chat messages
  const mediaItems = messages.filter((m) => m.mediaType === 'image' && m.mediaUrl);
  const fileItems = messages.filter((m) => m.mediaType === 'file');
  const voiceItems = messages.filter((m) => m.mediaType === 'voice');

  return (
    <div className="w-80 h-full bg-white dark:bg-[#17212b] border-l border-slate-200/60 dark:border-slate-800/80 flex flex-col z-20 shrink-0 shadow-lg">
      {/* Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/80 shrink-0">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
          {chat.type === 'group'
            ? 'Group Info'
            : chat.type === 'channel'
            ? 'Channel Info'
            : chat.type === 'bot'
            ? 'Bot Info'
            : 'User Info'}
        </h3>
        <button
          onClick={onClose}
          aria-label="Close info panel"
          className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Profile Card */}
        <div className="p-5 flex flex-col items-center text-center border-b border-slate-100 dark:border-slate-800/60">
          {chat.avatar ? (
            <img
              src={chat.avatar}
              alt={chat.title}
              className="w-24 h-24 rounded-full object-cover shadow-md mb-3"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#3390ec] to-blue-700 flex items-center justify-center text-white text-2xl font-bold shadow-md mb-3">
              {chat.id === 'chat-saved' ? (
                <Bookmark className="w-10 h-10 fill-white" />
              ) : chat.type === 'bot' ? (
                <Bot className="w-10 h-10" />
              ) : chat.type === 'group' ? (
                <Users className="w-10 h-10" />
              ) : (
                chat.title.slice(0, 2).toUpperCase()
              )}
            </div>
          )}

          <div className="flex items-center gap-1.5 justify-center">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {chat.title}
            </h2>
            {chat.verified && (
              <ShieldCheck className="w-5 h-5 text-[#3390ec]" />
            )}
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 capitalize">
            {(() => {
              if (chat.type === 'channel') return 'channel';
              if (chat.type === 'group') return 'group';
              if (chat.type === 'bot') return 'bot';
              if (chat.isOnline) return 'online';
              if (
                chat.onlineStatus &&
                !chat.onlineStatus.toLowerCase().includes('subscriber') &&
                !chat.onlineStatus.toLowerCase().includes('member')
              ) {
                return chat.onlineStatus;
              }
              return 'offline';
            })()}
          </p>
        </div>

        {/* Details list */}
        <div className="p-4 space-y-3.5 border-b border-slate-100 dark:border-slate-800/60 text-xs">
          {chat.phone && (
            <div>
              <span className="text-slate-400 dark:text-slate-500">Phone</span>
              <p className="font-medium text-slate-900 dark:text-slate-100 mt-0.5">
                {chat.phone}
              </p>
            </div>
          )}

          {chat.username && (
            <div>
              <span className="text-slate-400 dark:text-slate-500">Username</span>
              <p className="font-medium text-[#3390ec] font-mono mt-0.5">
                @{chat.username}
              </p>
            </div>
          )}

          {chat.bio && (
            <div>
              <span className="text-slate-400 dark:text-slate-500">Bio / About</span>
              <p className="font-normal text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">
                {chat.bio}
              </p>
            </div>
          )}

          {/* Notifications switch */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              {chat.muted ? (
                <BellOff className="w-4 h-4 text-slate-400" />
              ) : (
                <Bell className="w-4 h-4 text-[#3390ec]" />
              )}
              <span className="font-medium text-slate-800 dark:text-slate-200">
                Notifications
              </span>
            </div>
            <button
              onClick={() => onToggleMute(chat.id)}
              className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                !chat.muted ? 'bg-[#3390ec]' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  !chat.muted ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Shared Media Tabs */}
        <div className="p-3">
          <div className="flex items-center justify-around border-b border-slate-200 dark:border-slate-700 text-xs font-semibold pb-2">
            <button
              onClick={() => setActiveMediaTab('media')}
              className={`pb-1 transition-colors ${
                activeMediaTab === 'media'
                  ? 'text-[#3390ec] border-b-2 border-[#3390ec]'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Media
            </button>
            <button
              onClick={() => setActiveMediaTab('files')}
              className={`pb-1 transition-colors ${
                activeMediaTab === 'files'
                  ? 'text-[#3390ec] border-b-2 border-[#3390ec]'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Files
            </button>
            <button
              onClick={() => setActiveMediaTab('audio')}
              className={`pb-1 transition-colors ${
                activeMediaTab === 'audio'
                  ? 'text-[#3390ec] border-b-2 border-[#3390ec]'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Voice
            </button>
          </div>

          <div className="py-3">
            {activeMediaTab === 'media' && (
              mediaItems.length > 0 ? (
                <div className="grid grid-cols-3 gap-1.5">
                  {mediaItems.map((m) => (
                    <img
                      key={m.id}
                      src={m.mediaUrl}
                      alt="Media thumbnail"
                      className="w-full aspect-square object-cover rounded-md cursor-pointer hover:opacity-90"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-xs text-slate-400 py-6">No media shared yet</p>
              )
            )}

            {activeMediaTab === 'files' && (
              fileItems.length > 0 ? (
                <div className="space-y-2">
                  {fileItems.map((f) => (
                    <div
                      key={f.id}
                      className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs"
                    >
                      <FileText className="w-4 h-4 text-[#3390ec] shrink-0" />
                      <span className="truncate flex-1">{f.fileName || 'Document'}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-xs text-slate-400 py-6">No files shared yet</p>
              )
            )}

            {activeMediaTab === 'audio' && (
              voiceItems.length > 0 ? (
                <div className="space-y-2">
                  {voiceItems.map((v) => (
                    <div
                      key={v.id}
                      className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs"
                    >
                      <Music className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Voice message ({v.audioDuration || 14}s)</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-xs text-slate-400 py-6">No voice notes shared yet</p>
              )
            )}
          </div>
        </div>

        {/* Clear & Delete Chat Action Buttons */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/60 space-y-2">
          {onClearChat && (
            <div>
              {showConfirmClear ? (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-center space-y-2">
                  <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                    Clear all messages in this chat?
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        onClearChat(chat.id);
                        setShowConfirmClear(false);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors"
                    >
                      Yes, Clear
                    </button>
                    <button
                      onClick={() => setShowConfirmClear(false)}
                      className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowConfirmClear(true)}
                  className="w-full py-2 px-3 rounded-xl border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-amber-500" />
                  <span>Clear Chat History</span>
                </button>
              )}
            </div>
          )}

          {onDeleteChat && chat.id !== 'chat-saved' && (
            <div>
              {showConfirmDelete ? (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-center space-y-2">
                  <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                    Delete this conversation completely?
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        onDeleteChat(chat.id);
                        setShowConfirmDelete(false);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors"
                    >
                      Yes, Delete
                    </button>
                    <button
                      onClick={() => setShowConfirmDelete(false)}
                      className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowConfirmDelete(true)}
                  className="w-full py-2 px-3 rounded-xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
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
