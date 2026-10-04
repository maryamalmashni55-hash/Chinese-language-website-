import React, { useState } from 'react';
import { Play, Pause, Music } from 'lucide-react';
import { chineseMusic } from '../utils/chineseMusic';
import { Language } from '../types';
import { UI_STRINGS } from '../translations/ui';

interface Props {
  lang: Language;
}

export const MusicPlayer: React.FC<Props> = ({ lang }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const t = UI_STRINGS[lang];

  const handleToggle = () => {
    if (isPlaying) {
      chineseMusic.stop();
      setIsPlaying(false);
    } else {
      chineseMusic.play();
      setIsPlaying(true);
    }
  };

  return (
    <div
      className={`fixed bottom-4 ${
        lang === 'ar' ? 'left-4' : 'right-4'
      } z-50 flex items-center gap-2 p-2 rounded-2xl bg-black/90 border border-amber-500/40 backdrop-blur-md shadow-2xl transition-all select-none`}
    >
      {/* Clean minimal Music Icon */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
          isPlaying
            ? 'bg-gradient-to-br from-red-600 to-amber-600 text-white shadow-lg'
            : 'bg-stone-900 text-stone-400 border border-stone-800'
        }`}
      >
        <Music className={`w-4 h-4 ${isPlaying ? 'animate-bounce text-amber-300' : ''}`} />
      </div>

      {/* Control Button: Play / Pause */}
      <button
        onClick={handleToggle}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all border ${
          isPlaying
            ? 'bg-stone-900 hover:bg-stone-800 text-amber-300 border-amber-500/40'
            : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 border-amber-400/50 shadow'
        }`}
        title={isPlaying ? t.musicPause : t.musicPlay}
      >
        {isPlaying ? (
          <>
            <Pause className="w-3.5 h-3.5 fill-current" />
            <span>{t.musicPause}</span>
          </>
        ) : (
          <>
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{t.musicPlay}</span>
          </>
        )}
      </button>
    </div>
  );
};
