import React, { useState } from 'react';
import { Sparkles, Volume2 } from 'lucide-react';
import { CHINESE_CULTURE_TOPICS } from '../data/cultureData';
import { CultureTopic, Language } from '../types';
import { UI_STRINGS } from '../translations/ui';
import { playChineseAudio } from '../utils/speech';

interface Props {
  lang: Language;
}

export const CultureSection: React.FC<Props> = ({ lang }) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const t = UI_STRINGS[lang];

  const handlePlayAudio = (id: string, text: string) => {
    setPlayingId(id);
    playChineseAudio(
      text,
      0.85,
      () => setPlayingId(id),
      () => setPlayingId(null)
    );
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10" id="culture-section">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-950/70 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.cultureBadge}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white font-['Cairo',sans-serif]">
          {t.cultureTitle}
        </h2>
        <p className="text-xs sm:text-sm text-stone-400 mt-2 max-w-2xl mx-auto leading-relaxed">
          {t.cultureDesc}
        </p>
      </div>

      {/* Grid of Culture Cards with Real Imagery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CHINESE_CULTURE_TOPICS.map((topic: CultureTopic) => {
          const isPlaying = playingId === topic.id;
          const title = lang === 'ar' ? topic.titleArabic : topic.titleEnglish;
          const summary = lang === 'ar' ? topic.summary : (topic.summaryEnglish || topic.summary);
          const story = lang === 'ar' ? topic.fullStory : (topic.fullStoryEnglish || topic.fullStory);
          const wisdomTranslation = lang === 'ar' ? topic.chineseWisdom?.arabic : topic.chineseWisdom?.english;

          return (
            <div
              key={topic.id}
              className="rounded-3xl bg-[#140608] border border-amber-500/25 shadow-xl overflow-hidden flex flex-col justify-between group hover:border-amber-400/50 transition-all duration-300"
            >
              {/* Real Imagery Header */}
              {topic.imageUrl && (
                <div className="relative h-52 sm:h-60 w-full overflow-hidden bg-stone-900">
                  <img
                    src={topic.imageUrl}
                    alt={title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#140608] via-[#140608]/40 to-transparent" />

                  {/* Chinese Calligraphy Overlay Badge */}
                  <div className={`absolute top-4 ${lang === 'ar' ? 'right-4' : 'left-4'}`}>
                    <span className="px-3 py-1 rounded-full bg-black/75 border border-amber-400/40 text-amber-300 text-xs font-bold font-['Noto_Serif_SC',serif] backdrop-blur-md">
                      {topic.titleHanzi}
                    </span>
                  </div>
                </div>
              )}

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                        {title}
                      </h3>
                      <div className="text-xs text-amber-400/90 font-mono mt-0.5">
                        {topic.titlePinyin}
                      </div>
                    </div>

                    <button
                      onClick={() => handlePlayAudio(topic.id, topic.titleHanzi)}
                      className="p-2 rounded-xl bg-stone-900 hover:bg-amber-600 text-amber-300 hover:text-white transition-all shadow shrink-0"
                      title={t.listen}
                    >
                      <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce text-amber-400' : ''}`} />
                    </button>
                  </div>

                  <div className="text-xs font-semibold text-amber-200/80 bg-red-950/40 border-r-2 rtl:border-r-2 ltr:border-l-2 border-amber-400 p-2.5 rounded-lg my-3 leading-relaxed">
                    {summary}
                  </div>

                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    {story}
                  </p>
                </div>

                {/* Cultural Wisdom Proverb */}
                {topic.chineseWisdom && (
                  <div className="mt-5 pt-3 border-t border-stone-800/80 text-xs text-amber-300/90 font-medium">
                    <div className="text-[11px] text-stone-400 mb-0.5">
                      {lang === 'ar' ? 'حكمة صينية مأثورة:' : 'Chinese Wisdom:'}
                    </div>
                    <div className="font-['Noto_Serif_SC',serif] font-bold text-white text-sm">
                      {topic.chineseWisdom.hanzi}
                    </div>
                    <div className="text-stone-300 text-[11px] mt-0.5">
                      {wisdomTranslation}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
