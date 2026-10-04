import React, { useState } from 'react';
import { BookOpen, Volume2, ArrowLeft, ArrowRight, Sparkles, Compass, PenTool } from 'lucide-react';
import { Language } from '../types';
import { UI_STRINGS } from '../translations/ui';
import { playChineseAudio } from '../utils/speech';

interface Props {
  lang: Language;
  onStartCurriculum: () => void;
  onExploreCulture: () => void;
  onExplorePinyin: () => void;
  onExploreWriting: () => void;
}

export const HeroBanner: React.FC<Props> = ({
  lang,
  onStartCurriculum,
  onExploreCulture,
  onExplorePinyin,
  onExploreWriting,
}) => {
  const t = UI_STRINGS[lang];
  const [isPlayingGreeting, setIsPlayingGreeting] = useState(false);

  const handlePlayAudio = () => {
    setIsPlayingGreeting(true);
    playChineseAudio(
      '你好！欢迎来到中文学习之旅！',
      0.85,
      () => setIsPlayingGreeting(true),
      () => setIsPlayingGreeting(false)
    );
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#160305] via-[#0d0203] to-[#080203] border-b border-amber-500/25 py-14 sm:py-20 select-none">
      {/* Decorative luxury background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-gradient-to-b from-red-600/15 via-amber-500/10 to-transparent blur-3xl pointer-events-none" />

      {/* Subtle traditional lattice pattern */}
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Seal Badge with glowing ring */}
        <div className="inline-flex items-center justify-center mb-5">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-700 via-red-800 to-amber-900 border-2 border-amber-300/80 shadow-2xl flex items-center justify-center text-amber-200 font-['Noto_Serif_SC',serif] font-black text-2xl shadow-red-950/80">
              华
            </div>
            <div className="absolute -inset-1 rounded-2xl bg-amber-400/20 blur-sm -z-10" />
          </div>
        </div>

        {/* Master Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-['Cairo',sans-serif] tracking-tight leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-100 drop-shadow-sm">
            {lang === 'ar' ? 'وجهتك في تعلم اللغة الصينية' : 'Your Destination for Learning Chinese'}
          </span>
        </h1>

        {/* Chinese Calligraphic Accent */}
        <div className="mt-3 text-lg sm:text-2xl font-bold text-amber-400 font-['Noto_Serif_SC',serif] tracking-widest drop-shadow">
          你的中文学习之路 · 万里长城 · 桃李满天下
        </div>

        {/* Dedicated Names Box: Student Maryam Al-Meshni & Teacher Laila */}
        <div className="mt-7 inline-flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 px-7 py-4 rounded-2xl bg-[#1d0608]/90 border border-amber-400/50 backdrop-blur-md shadow-2xl">
          {/* Student */}
          <div className="flex items-center gap-2.5">
            <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold font-sans">
              Student:
            </span>
            <span className="text-base sm:text-lg font-bold text-white font-['Cinzel',serif] tracking-wide border-b border-amber-400/40">
              Maryam Al-Meshni
            </span>
          </div>

          <span className="hidden sm:inline-block text-amber-500 font-bold select-none">•</span>

          {/* Teacher */}
          <div className="flex items-center gap-2.5">
            <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold font-sans">
              Teacher:
            </span>
            <span className="text-base sm:text-lg font-bold text-amber-300 font-['Cinzel',serif] tracking-wide border-b border-amber-400/40">
              Teacher Laila
            </span>
          </div>
        </div>

        {/* Concise Description */}
        <p className="mt-6 text-sm sm:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed font-medium">
          {t.welcomeDesc}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8">
          <button
            onClick={onStartCurriculum}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-700 via-red-800 to-amber-700 hover:from-red-600 hover:to-amber-600 text-white font-bold text-sm shadow-xl shadow-red-950/60 border border-amber-400/40 transition-all hover:scale-105"
          >
            <BookOpen className="w-4 h-4 text-amber-300" />
            <span>{t.navCurriculum}</span>
            {lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>

          <button
            onClick={handlePlayAudio}
            disabled={isPlayingGreeting}
            className={`flex items-center gap-2 px-5 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-200 font-semibold text-sm border border-amber-500/30 transition-all shadow ${
              isPlayingGreeting ? 'ring-2 ring-amber-400' : ''
            }`}
          >
            <Volume2 className={`w-4 h-4 text-amber-400 ${isPlayingGreeting ? 'animate-bounce' : ''}`} />
            <span>
              {lang === 'ar' ? 'استمع للترحيب الصيني 🔊' : 'Listen to Chinese Greeting 🔊'}
            </span>
          </button>

          <button
            onClick={onExploreWriting}
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-xs sm:text-sm border border-amber-300/50 shadow transition-all hover:scale-105"
          >
            <PenTool className="w-4 h-4 text-stone-950" />
            <span>{t.navWriting}</span>
          </button>

          <button
            onClick={onExplorePinyin}
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#1e0709] hover:bg-[#2c0a0e] text-stone-200 font-medium text-xs sm:text-sm border border-red-800/40 transition-all"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>{t.navPinyin}</span>
          </button>
        </div>

        {/* Key Curriculum Highlights Pill */}
        <div className="mt-10 pt-6 border-t border-stone-800/80 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="font-semibold text-stone-200">{lang === 'ar' ? '8 وحدات دراسية' : '8 Structured Units'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-semibold text-stone-200">{lang === 'ar' ? '16 درساً شاملاً' : '16 Core Lessons'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-stone-200">{lang === 'ar' ? 'نطق صوتي + ترجمة تفاعلية' : 'Audio & Interactive Reveal'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="font-semibold text-stone-200">{lang === 'ar' ? 'الصف الثاني المتوسط' : 'Grade 2 Intermediate'}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
