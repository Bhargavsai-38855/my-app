import React from 'react';
import { Pin, X } from 'lucide-react';
import { Message } from '../../types/telegram';

interface PinnedMessageBannerProps {
  pinnedMessage: Message;
  onJumpToMessage: (id: string) => void;
  onUnpin?: (id: string) => void;
}

export const PinnedMessageBanner: React.FC<PinnedMessageBannerProps> = ({
  pinnedMessage,
  onJumpToMessage,
  onUnpin,
}) => {
  return (
    <div className="bg-white/90 dark:bg-[#17212b]/95 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/80 px-4 py-2 flex items-center justify-between gap-3 select-none z-10 shadow-xs">
      <div
        onClick={() => onJumpToMessage(pinnedMessage.id)}
        className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer group"
      >
        <div className="w-1 self-stretch rounded-full bg-[#3390ec]" />
        <Pin className="w-4 h-4 text-[#3390ec] shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-[#3390ec] leading-none mb-0.5">
            Pinned Message
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300 truncate">
            {pinnedMessage.text || (pinnedMessage.mediaType ? `[${pinnedMessage.mediaType}]` : '')}
          </p>
        </div>
      </div>

      {onUnpin && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUnpin(pinnedMessage.id);
          }}
          aria-label="Unpin message"
          title="Unpin message"
          className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
