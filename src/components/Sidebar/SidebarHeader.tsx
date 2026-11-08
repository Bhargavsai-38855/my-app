import React from 'react';
import { Menu, Search, X, Edit } from 'lucide-react';

interface SidebarHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenDrawer: () => void;
  onOpenNewChat: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenDrawer,
  onOpenNewChat,
}) => {
  return (
    <div className="p-3 pb-2 flex items-center gap-2 shrink-0">
      <button
        onClick={onOpenDrawer}
        aria-label="Open navigation menu"
        className="w-10 h-10 flex items-center justify-center rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80 transition-colors shrink-0"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="relative flex-1">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search chats..."
          className="w-full pl-9 pr-8 py-2 text-sm rounded-full bg-slate-100 dark:bg-[#242f3d] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3390ec]/60 border border-transparent transition-all"
        />
        {searchQuery ? (
          <button
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <span className="hidden lg:inline-block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 dark:text-slate-500 font-mono">
            ⌘K
          </span>
        )}
      </div>

      <button
        onClick={onOpenNewChat}
        aria-label="New chat or channel"
        title="New Chat / Channel"
        className="w-10 h-10 flex items-center justify-center rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80 transition-colors shrink-0"
      >
        <Edit className="w-4 h-4" />
      </button>
    </div>
  );
};
