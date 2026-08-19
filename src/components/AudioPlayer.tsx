import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

interface AudioPlayerProps {
  onUnlockAdmin?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ onUnlockAdmin }) => {
  const [isMuted, setIsMuted] = useState(soundFx.getIsMuted());
  const [clickCount, setClickCount] = useState<number>(0);

  const handleToggle = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);

    // Triple click shortcut to toggle Admin mode for creator!
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 3) {
      setClickCount(0);
      if (onUnlockAdmin) onUnlockAdmin();
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="fixed top-5 left-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all shadow-lg shadow-pink-500/10 group cursor-pointer"
      title={isMuted ? 'Play Until I Found You' : 'Mute Music (Triple-click for Admin)'}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5 text-rose-300 group-hover:scale-110 transition-transform" />
      ) : (
        <div className="flex items-center gap-1.5">
          <Volume2 className="w-5 h-5 text-pink-400 group-hover:scale-110 transition-transform animate-pulse" />
          <div className="flex items-end gap-0.5 h-3">
            <span className="w-0.5 h-3 bg-pink-400 animate-bounce delay-75" />
            <span className="w-0.5 h-2 bg-rose-300 animate-bounce delay-150" />
            <span className="w-0.5 h-3 bg-pink-400 animate-bounce delay-300" />
          </div>
        </div>
      )}
      <span className="text-xs font-medium tracking-wide text-rose-100 hidden sm:inline">
        {isMuted ? 'Play Song 🎵' : 'Until I Found You 💖'}
      </span>
    </button>
  );
};
