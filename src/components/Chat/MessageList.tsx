import React, { useRef, useEffect, useState } from 'react';
import { Message, Chat } from '../../types/telegram';
import { formatMessageTime } from '../../utils/telegramLogic';
import { VoiceNotePlayer } from './VoiceNotePlayer';
import {
  Check,
  CheckCheck,
  CornerUpLeft,
  Pin,
  Trash2,
  Copy,
  Smile,
  FileText,
  Download,
  Image as ImageIcon,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface MessageListProps {
  chat: Chat;
  messages: Message[];
  onReplyTo: (message: Message) => void;
  onReact: (messageId: string, emoji: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onPinMessage: (messageId: string) => void;
  onSendStarter?: (text: string) => void;
  searchFilter?: string;
}

export const MessageList: React.FC<MessageListProps> = ({
  chat,
  messages,
  onReplyTo,
  onReact,
  onDeleteMessage,
  onPinMessage,
  onSendStarter,
  searchFilter = '',
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [activeMenuMsgId, setActiveMenuMsgId] = useState<string | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // Quick reaction emojis
  const quickReactions = ['👍', '❤️', '🔥', '🎉', '👏', '🚀', '💎', '💩'];

  const filteredMessages = searchFilter
    ? messages.filter((m) =>
        m.text.toLowerCase().includes(searchFilter.toLowerCase())
      )
    : messages;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setActiveMenuMsgId(null);
  };

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-3 relative flex flex-col">
      {/* Search match banner */}
      {searchFilter && (
        <div className="sticky top-2 z-10 mx-auto max-w-xs text-center py-1 px-3 rounded-full bg-slate-800/80 text-white text-xs backdrop-blur-md shadow-md">
          {filteredMessages.length} message{filteredMessages.length === 1 ? '' : 's'} matching "{searchFilter}"
        </div>
      )}

      {/* Empty Chat State */}
      {filteredMessages.length === 0 && (
        <div className="my-auto py-8 flex flex-col items-center justify-center text-center animate-pop-in">
          <div className="w-20 h-20 rounded-3xl bg-white/90 dark:bg-slate-800/90 p-3 shadow-xl mb-4 border border-slate-200/50 dark:border-slate-700/60 flex items-center justify-center">
            <img
              src="/assets/aistudio/pigeon-192_861273e6.png"
              alt="Pigeon"
              className="w-full h-full object-contain"
            />
          </div>

          <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">
            No messages here yet...
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed mb-5">
            {chat.type === 'bot'
              ? 'Send /help or /crypto to interact with the Pigeon Bot.'
              : `Send a message to start the conversation with ${chat.title}.`}
          </p>

          {/* Quick Conversation Starter Chips */}
          {onSendStarter && (
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-sm">
              {chat.type === 'bot' ? (
                <>
                  <button
                    onClick={() => onSendStarter('/help')}
                    className="px-3 py-1.5 rounded-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#3390ec] text-slate-700 dark:text-slate-200 font-medium transition-all shadow-xs"
                  >
                    💡 /help
                  </button>
                  <button
                    onClick={() => onSendStarter('/crypto')}
                    className="px-3 py-1.5 rounded-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#3390ec] text-slate-700 dark:text-slate-200 font-medium transition-all shadow-xs"
                  >
                    💎 /crypto
                  </button>
                  <button
                    onClick={() => onSendStarter('/roll')}
                    className="px-3 py-1.5 rounded-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#3390ec] text-slate-700 dark:text-slate-200 font-medium transition-all shadow-xs"
                  >
                    🎲 /roll
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onSendStarter('👋 Hello!')}
                    className="px-3 py-1.5 rounded-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#3390ec] text-slate-700 dark:text-slate-200 font-medium transition-all shadow-xs"
                  >
                    👋 Hello!
                  </button>
                  <button
                    onClick={() => onSendStarter('🚀 How are you doing today?')}
                    className="px-3 py-1.5 rounded-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#3390ec] text-slate-700 dark:text-slate-200 font-medium transition-all shadow-xs"
                  >
                    🚀 How are you doing?
                  </button>
                  <button
                    onClick={() => onSendStarter('✨ Nice to connect with you on Pigeon!')}
                    className="px-3 py-1.5 rounded-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#3390ec] text-slate-700 dark:text-slate-200 font-medium transition-all shadow-xs"
                  >
                    ✨ Nice to connect!
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Date badge */}
      {filteredMessages.length > 0 && (
        <div className="flex justify-center my-3 sticky top-2 z-5">
          <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-500/20 dark:bg-black/30 text-slate-700 dark:text-slate-300 backdrop-blur-xs select-none">
            Today
          </span>
        </div>
      )}

      {filteredMessages.map((msg) => {
        const isOutgoing = msg.isOutgoing;
        const isGroup = chat.type === 'group';
        const hasReactions = msg.reactions && Object.keys(msg.reactions).length > 0;

        return (
          <div
            key={msg.id}
            id={`message-${msg.id}`}
            className={`flex flex-col ${
              isOutgoing ? 'items-end' : 'items-start'
            } group relative`}
          >
            {/* Sender avatar & bubble container */}
            <div className={`flex items-end gap-2 max-w-[85%] sm:max-w-[70%]`}>
              {/* Group incoming avatar */}
              {!isOutgoing && isGroup && (
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mb-1 bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  {msg.senderAvatar ? (
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    msg.senderName.slice(0, 2).toUpperCase()
                  )}
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`relative px-3.5 py-2 rounded-2xl shadow-xs transition-shadow animate-pop-in ${
                  isOutgoing
                    ? 'bg-[#effedd] dark:bg-[#2b5278] text-slate-900 dark:text-slate-100 rounded-br-xs'
                    : 'bg-white dark:bg-[#182533] text-slate-900 dark:text-slate-100 rounded-bl-xs'
                }`}
              >
                {/* Group sender name */}
                {!isOutgoing && isGroup && (
                  <p className="text-xs font-bold text-[#3390ec] dark:text-[#64b5f6] mb-1">
                    {msg.senderName}
                  </p>
                )}

                {/* Reply quote banner */}
                {msg.replyTo && (
                  <div className="mb-1.5 pl-2 border-l-2 border-[#3390ec] bg-slate-100/60 dark:bg-black/20 rounded-r py-0.5 text-xs">
                    <p className="font-semibold text-[#3390ec]">
                      {msg.replyTo.senderName}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 truncate">
                      {msg.replyTo.text}
                    </p>
                  </div>
                )}

                {/* Media Image */}
                {msg.mediaType === 'image' && msg.mediaUrl && (
                  <div className="mb-2 rounded-xl overflow-hidden cursor-pointer">
                    <img
                      src={msg.mediaUrl}
                      alt="Shared media"
                      onClick={() => setSelectedPhoto(msg.mediaUrl!)}
                      className="w-full max-h-80 object-cover hover:opacity-95 transition-opacity"
                    />
                  </div>
                )}

                {/* Media Voice Note */}
                {msg.mediaType === 'voice' && (
                  <VoiceNotePlayer
                    duration={msg.audioDuration || 14}
                    isOutgoing={isOutgoing}
                  />
                )}

                {/* Media Document/File */}
                {msg.mediaType === 'file' && (
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-100 dark:bg-black/20 mb-1.5 min-w-[200px]">
                    <div className="w-10 h-10 rounded-lg bg-[#3390ec] text-white flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold truncate">
                        {msg.fileName || 'Document.pdf'}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {msg.fileSize || '2.4 MB'}
                      </p>
                    </div>
                    <button
                      title="Download file"
                      className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Text Content */}
                {msg.text && (
                  <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                    {msg.text}
                  </p>
                )}

                {/* Meta info: edited status, time & read ticks */}
                <div className="flex items-center justify-end gap-1 mt-1 text-[11px] select-none text-slate-400 dark:text-slate-400">
                  {msg.isPinned && (
                    <Pin className="w-3 h-3 text-[#3390ec] rotate-45" />
                  )}
                  {msg.isEdited && (
                    <span className="text-[10px] italic">edited</span>
                  )}
                  <span className="tabular-nums">
                    {formatMessageTime(msg.timestamp)}
                  </span>
                  {isOutgoing && (
                    <span>
                      {msg.status === 'read' ? (
                        <CheckCheck className="w-3.5 h-3.5 text-[#3390ec] dark:text-[#64b5f6]" />
                      ) : (
                        <Check className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </span>
                  )}
                </div>

                {/* Floating message hover actions (desktop only to prevent mobile overlap) */}
                <div
                  className={`absolute -top-3 ${
                    isOutgoing ? 'right-2' : 'left-2'
                  } hidden sm:group-hover:flex items-center gap-1 bg-white dark:bg-[#242f3d] border border-slate-200 dark:border-slate-700 rounded-full px-2 py-0.5 shadow-md z-20`}
                >
                  <button
                    onClick={() => onReplyTo(msg)}
                    aria-label="Reply to message"
                    title="Reply"
                    className="p-1 rounded-full text-slate-500 hover:text-[#3390ec] hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <CornerUpLeft className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() =>
                      setActiveMenuMsgId(activeMenuMsgId === msg.id ? null : msg.id)
                    }
                    aria-label="Add reaction"
                    title="React"
                    className="p-1 rounded-full text-slate-500 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Smile className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => copyToClipboard(msg.text)}
                    aria-label="Copy text"
                    title="Copy Text"
                    className="p-1 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onPinMessage(msg.id)}
                    aria-label="Pin message"
                    title="Pin Message"
                    className="p-1 rounded-full text-slate-500 hover:text-[#3390ec] hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteMessage(msg.id)}
                    aria-label="Delete message"
                    title="Delete"
                    className="p-1 rounded-full text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Reaction Picker Popover */}
                {activeMenuMsgId === msg.id && (
                  <div
                    className={`absolute bottom-full mb-2 ${
                      isOutgoing ? 'right-0' : 'left-0'
                    } flex items-center gap-1.5 p-1.5 rounded-full bg-white dark:bg-[#242f3d] border border-slate-200 dark:border-slate-700 shadow-xl z-30 animate-pop-in`}
                  >
                    {quickReactions.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          onReact(msg.id, emoji);
                          setActiveMenuMsgId(null);
                        }}
                        className="w-8 h-8 flex items-center justify-center text-lg hover:scale-125 transition-transform"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Reactions underneath bubble */}
            {hasReactions && (
              <div
                className={`flex items-center gap-1 mt-1 flex-wrap ${
                  isOutgoing ? 'justify-end' : 'justify-start'
                }`}
              >
                {Object.entries(msg.reactions!).map(([emoji, count]) => (
                  <button
                    key={emoji}
                    onClick={() => onReact(msg.id, emoji)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-slate-200/70 dark:bg-[#202b36] border border-slate-300/40 dark:border-slate-700/60 hover:bg-[#3390ec]/20 transition-colors"
                  >
                    <span>{emoji}</span>
                    <span className="font-semibold text-[11px] tabular-nums text-slate-700 dark:text-slate-300">
                      {count}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div ref={bottomRef} />

      {/* Lightbox Modal for Photo viewing */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedPhoto}
              alt="Enlarged photo"
              className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl"
            />
            <p className="text-center text-xs text-white/70 mt-3">
              Click anywhere to close
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
