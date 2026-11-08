import React, { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface VoiceNotePlayerProps {
  duration?: number; // total duration in seconds
  isOutgoing?: boolean;
}

export const VoiceNotePlayer: React.FC<VoiceNotePlayerProps> = ({
  duration = 14,
  isOutgoing = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState<1 | 1.5 | 2>(1);

  // Deterministic heights for realistic voice waveform
  const waveformHeights = [
    25, 40, 70, 95, 60, 45, 80, 100, 75, 40, 65, 85, 90, 55, 30, 45, 70, 60,
    85, 100, 50, 35, 60, 80, 40, 25, 45, 60,
  ];

  useEffect(() => {
    let interval: number | undefined;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.2 * speed;
          if (next >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, speed]);

  const togglePlay = () => {
    if (currentTime >= duration) setCurrentTime(0);
    setIsPlaying(!isPlaying);
  };

  const cycleSpeed = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (speed === 1) setSpeed(1.5);
    else if (speed === 1.5) setSpeed(2);
    else setSpeed(1);
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const progress = currentTime / duration;
  const activeBarsCount = Math.floor(progress * waveformHeights.length);

  return (
    <div className="flex items-center gap-3 py-1 select-none min-w-[210px] max-w-[270px]">
      {/* Play/Pause round button */}
      <button
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause voice note' : 'Play voice note'}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-95 shrink-0 ${
          isOutgoing
            ? 'bg-white text-[#3390ec]'
            : 'bg-[#3390ec] text-white shadow-xs'
        }`}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 fill-current" />
        ) : (
          <Play className="w-5 h-5 fill-current ml-0.5" />
        )}
      </button>

      {/* Waveform & timer */}
      <div className="flex-1 flex flex-col justify-center gap-1.5">
        <div className="flex items-end gap-[3px] h-6 cursor-pointer">
          {waveformHeights.map((h, i) => {
            const isPlayed = i <= activeBarsCount;
            return (
              <div
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  const newProgress = i / waveformHeights.length;
                  setCurrentTime(newProgress * duration);
                }}
                style={{ height: `${h}%` }}
                className={`w-[3px] rounded-full transition-all ${
                  isPlayed
                    ? isOutgoing
                      ? 'bg-white'
                      : 'bg-[#3390ec]'
                    : isOutgoing
                    ? 'bg-white/40'
                    : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono leading-none">
          <span className={isOutgoing ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'}>
            {isPlaying ? formatSeconds(currentTime) : formatSeconds(duration)}
          </span>

          <button
            onClick={cycleSpeed}
            title="Playback Speed"
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
              isOutgoing
                ? 'bg-white/20 text-white hover:bg-white/30'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
            }`}
          >
            {speed}x
          </button>
        </div>
      </div>
    </div>
  );
};
