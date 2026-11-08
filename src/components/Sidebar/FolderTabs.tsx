import React from 'react';
import { FolderTab } from '../../types/telegram';

interface FolderTabsProps {
  activeFolder: FolderTab;
  onSelectFolder: (folder: FolderTab) => void;
  unreadTotals: Record<FolderTab, number>;
}

export const FolderTabs: React.FC<FolderTabsProps> = ({
  activeFolder,
  onSelectFolder,
  unreadTotals,
}) => {
  const tabs: { key: FolderTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'personal', label: 'Personal' },
    { key: 'groups', label: 'Groups' },
    { key: 'channels', label: 'Channels' },
    { key: 'bots', label: 'Bots' },
  ];

  return (
    <div className="flex items-center px-2 py-1 gap-1 border-b border-slate-200/50 dark:border-slate-800/80 overflow-x-auto no-scrollbar shrink-0 select-none">
      {tabs.map((tab) => {
        const isActive = activeFolder === tab.key;
        const unread = unreadTotals[tab.key] || 0;

        return (
          <button
            key={tab.key}
            onClick={() => onSelectFolder(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
              isActive
                ? 'bg-[#3390ec] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            {unread > 0 && (
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full min-w-4 text-center ${
                  isActive
                    ? 'bg-white text-[#3390ec]'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {unread}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
