import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../../types/telegram';
import {
  Paperclip,
  Smile,
  Send,
  Mic,
  X,
  Image,
  FileText,
  BarChart2,
  MapPin,
  Square,
} from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (
    text: string,
    media?: { url?: string; type: 'image' | 'voice' | 'file'; fileName?: string; duration?: number }
  ) => void;
  replyToMessage: Message | null;
  onCancelReply: () => void;
  isBotChat?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  replyToMessage,
  onCancelReply,
  isBotChat = false,
}) => {
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [activePickerTab, setActivePickerTab] = useState<'emoji' | 'stickers'>('emoji');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Voice recording timer
  useEffect(() => {
    let interval: number | undefined;
    if (isRecordingVoice) {
      interval = window.setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingVoice]);

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setInputText('');
    setShowEmojiPicker(false);
    setShowAttachMenu(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const finishVoiceRecording = () => {
    setIsRecordingVoice(false);
    onSendMessage(`Voice note (0:${recordingSeconds < 10 ? '0' : ''}${recordingSeconds || 5})`, {
      type: 'voice',
      duration: Math.max(recordingSeconds, 4),
    });
  };

  const cancelVoiceRecording = () => {
    setIsRecordingVoice(false);
    setRecordingSeconds(0);
  };

  // Sample categorized emojis
  const emojis = [
    '👍', '👎', '❤️', '🔥', '🎉', '👏', '😂', '😍',
    '🤔', '🚀', '💎', '✨', '⚡', '💡', '💯', '🙌',
    '🥳', '😎', '👌', '🤝', '☕', '💻', '🤖', '📱',
  ];

  // Sample Telegram stickers
  const stickers = [
    { title: 'Duck Wave', emoji: '🦆' },
    { title: 'Cool Doge', emoji: '🐕' },
    { title: 'Rocket', emoji: '🚀' },
    { title: 'Cat Heart', emoji: '😻' },
    { title: 'Party Pepe', emoji: '🐸' },
    { title: 'Fox Hi', emoji: '🦊' },
    { title: 'Panda Hug', emoji: '🐼' },
    { title: 'Tech Robot', emoji: '🤖' },
  ];

  return (
    <div className="p-3 bg-white dark:bg-[#17212b] border-t border-slate-200/60 dark:border-slate-800/80 shrink-0 relative">
      {/* Reply preview bar */}
      {replyToMessage && (
        <div className="flex items-center justify-between gap-2 px-3 py-1.5 mb-2 rounded-lg bg-slate-100 dark:bg-[#202b36] border-l-3 border-[#3390ec] text-xs">
          <div className="min-w-0">
            <span className="font-semibold text-[#3390ec]">
              Replying to {replyToMessage.senderName}
            </span>
            <p className="text-slate-600 dark:text-slate-400 truncate">
              {replyToMessage.text || '[Media]'}
            </p>
          </div>
          <button
            onClick={onCancelReply}
            aria-label="Cancel reply"
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Voice Recording Active Bar */}
      {isRecordingVoice ? (
        <div className="flex items-center justify-between px-4 py-2 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-full animate-pop-in">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 tabular-nums">
              Recording 0:{recordingSeconds < 10 ? '0' : ''}{recordingSeconds}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={cancelVoiceRecording}
              className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-rose-600 dark:hover:text-rose-400"
            >
              Cancel
            </button>
            <button
              onClick={finishVoiceRecording}
              className="p-2 rounded-full bg-[#3390ec] text-white hover:bg-blue-600 shadow-sm"
              title="Send voice note"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-end gap-2">
          {/* Attachment button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowAttachMenu(!showAttachMenu);
                setShowEmojiPicker(false);
              }}
              aria-label="Attach file or photo"
              title="Attach"
              className="p-2.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Attachment Popover */}
            {showAttachMenu && (
              <div className="absolute bottom-full left-0 mb-3 w-52 p-1.5 rounded-2xl bg-white dark:bg-[#242f3d] border border-slate-200 dark:border-slate-700 shadow-xl z-30 animate-pop-in">
                <button
                  onClick={() => {
                    onSendMessage('Shared a scenic photo 🏔️', {
                      type: 'image',
                      url: '/src/assets/images/chat_nature_photo_1794121257074.jpg',
                    });
                    setShowAttachMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1d2733]"
                >
                  <Image className="w-4 h-4 text-[#3390ec]" />
                  <span>Photo or Video</span>
                </button>

                <button
                  onClick={() => {
                    onSendMessage('Project_Specification_v2.pdf', {
                      type: 'file',
                      fileName: 'Pigeon_Architecture_Doc.pdf',
                    });
                    setShowAttachMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1d2733]"
                >
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <span>Document (PDF)</span>
                </button>

                <button
                  onClick={() => {
                    onSendMessage('📊 Poll: When should we ship the new client release?\n• Today (52%)\n• Tomorrow (48%)');
                    setShowAttachMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1d2733]"
                >
                  <BarChart2 className="w-4 h-4 text-amber-500" />
                  <span>Create Poll</span>
                </button>

                <button
                  onClick={() => {
                    onSendMessage('📍 Current location: Dubai Marina, UAE');
                    setShowAttachMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1d2733]"
                >
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>Location</span>
                </button>
              </div>
            )}
          </div>

          {/* Textarea Input */}
          <div className="flex-1 bg-slate-100 dark:bg-[#242f3d] rounded-2xl flex items-center px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#3390ec]/60 border border-transparent transition-all">
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
              }}
              onKeyDown={handleKeyDown}
              placeholder={
                isBotChat
                  ? "Type a command like /crypto or message..."
                  : "Write a message..."
              }
              className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none focus:outline-none max-h-32 leading-5"
            />

            {/* Emoji button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowEmojiPicker(!showEmojiPicker);
                  setShowAttachMenu(false);
                }}
                aria-label="Open emoji and sticker picker"
                title="Emojis & Stickers"
                className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors shrink-0"
              >
                <Smile className="w-5 h-5" />
              </button>

              {/* Emoji / Sticker Picker Popover */}
              {showEmojiPicker && (
                <div className="absolute bottom-full right-0 mb-3 w-72 sm:w-80 p-3 rounded-2xl bg-white dark:bg-[#242f3d] border border-slate-200 dark:border-slate-700 shadow-2xl z-30 animate-pop-in">
                  {/* Tabs */}
                  <div className="flex items-center gap-2 mb-3 border-b border-slate-200 dark:border-slate-700 pb-2">
                    <button
                      onClick={() => setActivePickerTab('emoji')}
                      className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                        activePickerTab === 'emoji'
                          ? 'bg-[#3390ec] text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      Emoji
                    </button>
                    <button
                      onClick={() => setActivePickerTab('stickers')}
                      className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                        activePickerTab === 'stickers'
                          ? 'bg-[#3390ec] text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      Stickers
                    </button>
                  </div>

                  {/* Emoji Grid */}
                  {activePickerTab === 'emoji' ? (
                    <div className="grid grid-cols-8 gap-1.5 max-h-48 overflow-y-auto pr-1">
                      {emojis.map((em, i) => (
                        <button
                          key={i}
                          onClick={() => setInputText((prev) => prev + em)}
                          className="w-8 h-8 flex items-center justify-center text-xl hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-transform hover:scale-110"
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  ) : (
                    /* Stickers Grid */
                    <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                      {stickers.map((stk, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            onSendMessage(`[Sticker: ${stk.title}] ${stk.emoji}`);
                            setShowEmojiPicker(false);
                          }}
                          className="p-2 flex flex-col items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-[#3390ec]/15 border border-slate-200/40 dark:border-slate-700/40 transition-transform hover:scale-105"
                        >
                          <span className="text-3xl mb-1">{stk.emoji}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-full">
                            {stk.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Send or Voice Note Button */}
          {inputText.trim() ? (
            <button
              onClick={handleSend}
              aria-label="Send message"
              title="Send"
              className="p-2.5 rounded-full bg-[#3390ec] text-white hover:bg-blue-600 transition-all shadow-sm active:scale-95 shrink-0"
            >
              <Send className="w-5 h-5 ml-0.5" />
            </button>
          ) : (
            <button
              onClick={() => setIsRecordingVoice(true)}
              aria-label="Record voice message"
              title="Hold to Record Voice Message"
              className="p-2.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            >
              <Mic className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
