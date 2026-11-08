import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Chat,
  Message,
  FolderTab,
  ThemeMode,
  UserProfile,
} from './types/telegram';
import {
  currentUser as defaultUser,
  initialChats as defaultChats,
  initialMessages as defaultMessages,
} from './data/initialData';
import {
  filterChats,
  calculateUnreadTotals,
  processBotCommand,
  playTelegramSound,
} from './utils/telegramLogic';

import { SidebarHeader } from './components/Sidebar/SidebarHeader';
import { FolderTabs } from './components/Sidebar/FolderTabs';
import { ChatList } from './components/Sidebar/ChatList';
import { NavigationDrawer } from './components/Sidebar/NavigationDrawer';

import { ChatHeader } from './components/Chat/ChatHeader';
import { PinnedMessageBanner } from './components/Chat/PinnedMessageBanner';
import { MessageList } from './components/Chat/MessageList';
import { MessageInput } from './components/Chat/MessageInput';

import { ChatInfoDrawer } from './components/RightDrawer/ChatInfoDrawer';
import { CallModal } from './components/Modals/CallModal';
import { SettingsModal } from './components/Modals/SettingsModal';
import { NewChatModal } from './components/Modals/NewChatModal';

export default function App() {
  // Persistence state
  const [chats, setChats] = useState<Chat[]>(() => {
    const saved = localStorage.getItem('tg_chats');
    return saved ? JSON.parse(saved) : defaultChats;
  });

  const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
    const saved = localStorage.getItem('tg_messages');
    return saved ? JSON.parse(saved) : defaultMessages;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('tg_user');
    return saved ? JSON.parse(saved) : defaultUser;
  });

  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('tg_theme');
    return (saved as ThemeMode) || 'dark';
  });

  const [enableWallpaper, setEnableWallpaper] = useState<boolean>(() => {
    const saved = localStorage.getItem('tg_wallpaper');
    return saved ? JSON.parse(saved) : true;
  });

  const [fontSize, setFontSize] = useState<number>(() => {
    const saved = localStorage.getItem('tg_fontsize');
    return saved ? Number(saved) : 14;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('tg_sound');
    return saved ? JSON.parse(saved) : true;
  });

  // UI state
  const [activeChatId, setActiveChatId] = useState<string>('chat-pavel');
  const [activeFolder, setActiveFolder] = useState<FolderTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInChatQuery, setSearchInChatQuery] = useState('');
  const [isSearchInChatActive, setIsSearchInChatActive] = useState(false);

  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Modals & Drawers
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const [isInfoDrawerOpen, setIsInfoDrawerOpen] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);

  // Mobile navigation: on small screens, switch between chat list and conversation view
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('tg_chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('tg_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('tg_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('tg_theme', theme);
    // Apply .dark class on html element
    const isDark = theme === 'dark' || theme === 'night-blue';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('tg_wallpaper', JSON.stringify(enableWallpaper));
  }, [enableWallpaper]);

  useEffect(() => {
    localStorage.setItem('tg_fontsize', String(fontSize));
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('tg_sound', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder="Search chats..."]') as HTMLInputElement;
        searchInput?.focus();
      }
      if (e.key === 'Escape') {
        setIsNavDrawerOpen(false);
        setIsInfoDrawerOpen(false);
        setIsCallActive(false);
        setIsSettingsOpen(false);
        setIsNewChatOpen(false);
        setIsSearchInChatActive(false);
        setSearchInChatQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered chats list
  const filteredChats = useMemo(() => {
    return filterChats(chats, activeFolder, searchQuery);
  }, [chats, activeFolder, searchQuery]);

  const unreadTotals = useMemo(() => {
    return calculateUnreadTotals(chats);
  }, [chats]);

  // Current active chat object & messages
  const activeChat = useMemo(() => {
    return chats.find((c) => c.id === activeChatId) || chats[0];
  }, [chats, activeChatId]);

  const activeMessages = useMemo(() => {
    return messages[activeChatId] || [];
  }, [messages, activeChatId]);

  const pinnedMessage = useMemo(() => {
    return activeMessages.find((m) => m.isPinned);
  }, [activeMessages]);

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    setIsMobileChatOpen(true);
    setIsSearchInChatActive(false);
    setSearchInChatQuery('');
    setReplyToMessage(null);

    // Clear unread count for selected chat
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, unreadCount: 0 } : c))
    );
  };

  const handleSendMessage = (
    text: string,
    media?: { url?: string; type: 'image' | 'voice' | 'file'; fileName?: string; duration?: number }
  ) => {
    if (!activeChat) return;

    if (soundEnabled) {
      playTelegramSound('sent');
    }

    const newMsgId = `msg-${Date.now()}`;
    const newMsg: Message = {
      id: newMsgId,
      chatId: activeChat.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text,
      timestamp: Date.now(),
      isOutgoing: true,
      status: 'sent',
      mediaUrl: media?.url,
      mediaType: media?.type,
      fileName: media?.fileName,
      fileSize: media ? '2.4 MB' : undefined,
      audioDuration: media?.duration,
      replyTo: replyToMessage
        ? {
            id: replyToMessage.id,
            senderName: replyToMessage.senderName,
            text: replyToMessage.text,
          }
        : undefined,
    };

    // Update active chat messages
    setMessages((prev) => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMsg],
    }));

    // Update chat preview in list
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChat.id
          ? {
              ...c,
              lastMessage: {
                text,
                timestamp: Date.now(),
                isOutgoing: true,
                status: 'sent',
              },
            }
          : c
      )
    );

    setReplyToMessage(null);

    // Simulated reply handling
    if (activeChat.type === 'bot') {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const botResult = processBotCommand(text);

        const botMsg: Message = {
          id: `bot-reply-${Date.now()}`,
          chatId: activeChat.id,
          senderId: 'bot',
          senderName: 'Telegram Assistant Bot',
          text: botResult.response,
          timestamp: Date.now(),
          isOutgoing: false,
          status: 'read',
        };

        if (soundEnabled) {
          playTelegramSound('received');
        }

        setMessages((prev) => ({
          ...prev,
          [activeChat.id]: [
            ...(prev[activeChat.id] || []).map((m) =>
              m.id === newMsgId ? { ...m, status: 'read' as const } : m
            ),
            botMsg,
          ],
        }));

        setChats((prev) =>
          prev.map((c) =>
            c.id === activeChat.id
              ? {
                  ...c,
                  lastMessage: {
                    text: botResult.response.slice(0, 60),
                    timestamp: Date.now(),
                    isOutgoing: false,
                    status: 'read',
                  },
                }
              : c
          )
        );
      }, 700);
    } else if (activeChat.type === 'personal' && activeChat.id !== 'chat-saved') {
      // Simulate contact reply after a short delay
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);

        const replies = [
          'Thanks for the message! Let me check that right away.',
          'Got it! Looking forward to reviewing this.',
          'Awesome, thanks for the update Kiran! 👍',
          'That sounds great, I will follow up shortly.',
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];

        const contactMsg: Message = {
          id: `reply-${Date.now()}`,
          chatId: activeChat.id,
          senderId: activeChat.id,
          senderName: activeChat.title,
          senderAvatar: activeChat.avatar,
          text: randomReply,
          timestamp: Date.now(),
          isOutgoing: false,
          status: 'read',
        };

        if (soundEnabled) {
          playTelegramSound('received');
        }

        setMessages((prev) => ({
          ...prev,
          [activeChat.id]: [
            ...(prev[activeChat.id] || []).map((m) =>
              m.id === newMsgId ? { ...m, status: 'read' as const } : m
            ),
            contactMsg,
          ],
        }));

        setChats((prev) =>
          prev.map((c) =>
            c.id === activeChat.id
              ? {
                  ...c,
                  lastMessage: {
                    text: randomReply,
                    timestamp: Date.now(),
                    isOutgoing: false,
                    status: 'read',
                  },
                }
              : c
          )
        );
      }, 1500);
    }
  };

  const handleReact = (messageId: string, emoji: string) => {
    setMessages((prev) => {
      const chatMsgs = prev[activeChat.id] || [];
      return {
        ...prev,
        [activeChat.id]: chatMsgs.map((m) => {
          if (m.id !== messageId) return m;
          const currentReactions = m.reactions || {};
          const currentCount = currentReactions[emoji] || 0;
          return {
            ...m,
            reactions: {
              ...currentReactions,
              [emoji]: currentCount + 1,
            },
          };
        }),
      };
    });
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => ({
      ...prev,
      [activeChat.id]: (prev[activeChat.id] || []).filter((m) => m.id !== messageId),
    }));
  };

  const handlePinMessage = (messageId: string) => {
    setMessages((prev) => {
      const chatMsgs = prev[activeChat.id] || [];
      return {
        ...prev,
        [activeChat.id]: chatMsgs.map((m) => ({
          ...m,
          isPinned: m.id === messageId ? !m.isPinned : false,
        })),
      };
    });
  };

  const handleToggleMute = (chatId: string) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, muted: !c.muted } : c))
    );
  };

  const handleCreateChat = (newChat: Chat) => {
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setMessages((prev) => ({
      ...prev,
      [newChat.id]: [
        {
          id: `msg-welcome-${Date.now()}`,
          chatId: newChat.id,
          senderId: currentUser.id,
          senderName: currentUser.name,
          text: `Welcome to ${newChat.title}!`,
          timestamp: Date.now(),
          isOutgoing: true,
          status: 'read',
        },
      ],
    }));
    setIsMobileChatOpen(true);
  };

  // Color theme classes mapping
  const themeContainerBg =
    theme === 'night-blue'
      ? 'bg-[#101921]'
      : theme === 'day'
      ? 'bg-[#f0f2f5]'
      : theme === 'arctic'
      ? 'bg-[#eef2f6]'
      : 'bg-[#0e1621]';

  const themeSidebarBg =
    theme === 'night-blue'
      ? 'bg-[#18222d]'
      : theme === 'day'
      ? 'bg-white'
      : theme === 'arctic'
      ? 'bg-[#f8fafc]'
      : 'bg-[#17212b]';

  const themeChatBg =
    theme === 'night-blue'
      ? 'bg-[#0b141d]'
      : theme === 'day'
      ? 'bg-[#e4ecf2]'
      : theme === 'arctic'
      ? 'bg-[#e2e8f0]'
      : 'bg-[#0e1621]';

  return (
    <div
      style={{ fontSize: `${fontSize}px` }}
      className={`w-screen h-screen flex overflow-hidden select-none ${themeContainerBg} text-slate-900 dark:text-slate-100`}
    >
      {/* LEFT SIDEBAR */}
      <div
        className={`w-full md:w-80 lg:w-96 h-full flex flex-col border-r border-slate-200/60 dark:border-slate-800/80 shrink-0 ${themeSidebarBg} transition-all ${
          isMobileChatOpen ? 'hidden md:flex' : 'flex'
        }`}
      >
        <SidebarHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenDrawer={() => setIsNavDrawerOpen(true)}
          onOpenNewChat={() => setIsNewChatOpen(true)}
        />

        <FolderTabs
          activeFolder={activeFolder}
          onSelectFolder={setActiveFolder}
          unreadTotals={unreadTotals}
        />

        <ChatList
          chats={filteredChats}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
        />
      </div>

      {/* RIGHT MAIN CHAT AREA */}
      <div
        className={`flex-1 h-full flex flex-col relative min-w-0 ${
          !isMobileChatOpen ? 'hidden md:flex' : 'flex'
        }`}
      >
        {activeChat ? (
          <>
            <ChatHeader
              chat={activeChat}
              onBackMobile={() => setIsMobileChatOpen(false)}
              onToggleSearchInChat={() =>
                setIsSearchInChatActive(!isSearchInChatActive)
              }
              onStartCall={() => setIsCallActive(true)}
              onToggleInfoDrawer={() => setIsInfoDrawerOpen(!isInfoDrawerOpen)}
              isTyping={isTyping}
            />

            {/* In-chat search banner if active */}
            {isSearchInChatActive && (
              <div className="px-4 py-2 bg-slate-100 dark:bg-[#202b36] border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 animate-pop-in">
                <input
                  type="text"
                  autoFocus
                  placeholder="Search in this chat..."
                  value={searchInChatQuery}
                  onChange={(e) => setSearchInChatQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                />
                <button
                  onClick={() => {
                    setIsSearchInChatActive(false);
                    setSearchInChatQuery('');
                  }}
                  className="text-xs text-[#3390ec] font-semibold hover:underline"
                >
                  Cancel
                </button>
              </div>
            )}

            {pinnedMessage && (
              <PinnedMessageBanner
                pinnedMessage={pinnedMessage}
                onJumpToMessage={(id) => {
                  const el = document.getElementById(`message-${id}`);
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                onUnpin={handlePinMessage}
              />
            )}

            {/* Message List with optional wallpaper pattern */}
            <div
              className={`flex-1 flex flex-col overflow-hidden relative ${themeChatBg}`}
              style={
                enableWallpaper
                  ? {
                      backgroundImage: `url('/src/assets/images/chat_wallpaper_pattern_1794121258085.jpg')`,
                      backgroundRepeat: 'repeat',
                      backgroundSize: '400px',
                    }
                  : {}
              }
            >
              {/* Wallpaper dim overlay for high contrast legibility */}
              {enableWallpaper && (
                <div className="absolute inset-0 bg-slate-950/40 dark:bg-black/60 pointer-events-none" />
              )}

              <div className="relative z-1 flex-1 flex flex-col overflow-hidden">
                <MessageList
                  chat={activeChat}
                  messages={activeMessages}
                  onReplyTo={(msg) => setReplyToMessage(msg)}
                  onReact={handleReact}
                  onDeleteMessage={handleDeleteMessage}
                  onPinMessage={handlePinMessage}
                  searchFilter={searchInChatQuery}
                />

                <MessageInput
                  onSendMessage={handleSendMessage}
                  replyToMessage={replyToMessage}
                  onCancelReply={() => setReplyToMessage(null)}
                  isBotChat={activeChat.type === 'bot'}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6 text-slate-400 dark:text-slate-500">
            Select a chat to start messaging
          </div>
        )}
      </div>

      {/* RIGHT CHAT INFO DRAWER */}
      {activeChat && isInfoDrawerOpen && (
        <ChatInfoDrawer
          chat={activeChat}
          messages={activeMessages}
          isOpen={isInfoDrawerOpen}
          onClose={() => setIsInfoDrawerOpen(false)}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* NAVIGATION DRAWER */}
      <NavigationDrawer
        isOpen={isNavDrawerOpen}
        onClose={() => setIsNavDrawerOpen(false)}
        currentUser={currentUser}
        theme={theme}
        onToggleTheme={() =>
          setTheme((prev) => (prev === 'dark' ? 'day' : 'dark'))
        }
        onSelectSavedMessages={() => handleSelectChat('chat-saved')}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenNewChat={() => setIsNewChatOpen(true)}
      />

      {/* MODALS */}
      {isCallActive && activeChat && (
        <CallModal
          chat={activeChat}
          onEndCall={() => setIsCallActive(false)}
        />
      )}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUser={currentUser}
        onUpdateUser={(updated) =>
          setCurrentUser((prev) => ({ ...prev, ...updated }))
        }
        theme={theme}
        onSelectTheme={setTheme}
        enableWallpaper={enableWallpaper}
        onToggleWallpaper={setEnableWallpaper}
        fontSize={fontSize}
        onChangeFontSize={setFontSize}
        soundEnabled={soundEnabled}
        onToggleSound={setSoundEnabled}
      />

      <NewChatModal
        isOpen={isNewChatOpen}
        onClose={() => setIsNewChatOpen(false)}
        onCreateChat={handleCreateChat}
      />
    </div>
  );
}
