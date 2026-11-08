import React, { useState, useEffect } from 'react';
import { Chat } from '../../types/telegram';
import { PhoneOff, Mic, MicOff, Volume2, VolumeX, Video } from 'lucide-react';

interface CallModalProps {
  chat: Chat;
  onEndCall: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({ chat, onEndCall }) => {
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#3390ec]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Pulsing ring avatar */}
        <div className="relative my-6">
          <div className="absolute inset-0 rounded-full bg-[#3390ec]/30 animate-ping" />
          <div className="absolute -inset-3 rounded-full border border-[#3390ec]/40 animate-pulse" />
          {chat.avatar ? (
            <img
              src={chat.avatar}
              alt={chat.title}
              className="w-28 h-28 rounded-full object-cover relative z-10 border-4 border-slate-800 shadow-xl"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#3390ec] to-blue-700 flex items-center justify-center text-white text-3xl font-bold relative z-10 border-4 border-slate-800 shadow-xl">
              {chat.title.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold text-white mb-1">{chat.title}</h3>
        <p className="text-xs text-[#3390ec] font-semibold mb-2">
          Pigeon End-to-End Encrypted Call
        </p>
        <p className="text-sm font-mono text-slate-400 mb-8 tabular-nums">
          {formatTimer(callDuration)}
        </p>

        {/* Call actions */}
        <div className="flex items-center gap-4 mb-2">
          {/* Mute */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            className={`p-3.5 rounded-full transition-colors ${
              isMuted ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Speaker */}
          <button
            onClick={() => setIsSpeaker(!isSpeaker)}
            aria-label="Toggle speaker"
            className={`p-3.5 rounded-full transition-colors ${
              !isSpeaker ? 'bg-slate-800 text-slate-500' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
          >
            {isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Video simulation */}
          <button
            aria-label="Camera"
            className="p-3.5 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
          >
            <Video className="w-5 h-5" />
          </button>

          {/* End Call */}
          <button
            onClick={onEndCall}
            aria-label="End call"
            className="p-4 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition-transform active:scale-95 shadow-lg shadow-rose-900/40"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
