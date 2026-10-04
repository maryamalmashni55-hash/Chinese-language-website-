import React from 'react';
import { BookOpen, Sparkles, MessageSquare, Volume2, Globe, PenTool } from 'lucide-react';
import { Language } from '../types';
import { UI_STRINGS } from '../translations/ui';

interface Props {
  lang: Language;
  onToggleLang: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<Props> = ({
  lang,
  onToggleLang,
  activeTab,
  setActiveTab,
}) => {
  const t = UI_STRINGS[lang];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0c0304]/95 backdrop-blur-md border-b border-[#eab308]/20 transition-all duration-300">
      {/* Top delicate golden ribbon */}
      <div className="h-1 w-full bg-gradient-to-r from-red-800 via-amber-400 to-red-800" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Brand & Dedication Zone */}
          <div className="flex items-center gap-3">
            {/* Traditional Seal Icon */}
            <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-red-700 to-amber-900 border border-amber-300/60 shadow-lg flex items-center justify-center text-amber-200 font-['Noto_Serif_SC',serif] text-xl font-black">
              华
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white font-['Cairo',sans-serif]">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-white">
                    {lang === 'ar' ? 'وجهتك في تعلم اللغة الصينية' : 'Your Destination for Learning Chinese'}
                  </span>
                </h1>
                <span className="text-[10px] font-bold text-amber-300 bg-red-950/80 px-2 py-0.5 rounded border border-amber-500/30 font-['Noto_Serif_SC',serif]">
                  汉语之门
                </span>
              </div>

              {/* Prestigious English Dedication Subtitle */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-['Plus_Jakarta_Sans',sans-serif] tracking-wide mt-0.5">
                <span className="text-stone-300 font-medium flex items-center gap-1">
                  <span className="text-stone-400">Student:</span>
                  <span className="font-semibold text-white font-['Cinzel',serif] border-b border-amber-400/40">
                    Maryam Al-Meshni
                  </span>
                </span>
                <span className="text-amber-500 select-none">•</span>
                <span className="text-stone-300 font-medium flex items-center gap-1">
                  <span className="text-stone-400">Teacher:</span>
                  <span className="font-semibold text-amber-300 font-['Cinzel',serif] border-b border-amber-400/40">
                    Teacher Laila
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links and Language Switcher */}
          <div className="flex items-center justify-between md:justify-end gap-1.5 sm:gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <nav className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium">
              <button
                onClick={() => setActiveTab('curriculum')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  activeTab === 'curriculum'
                    ? 'bg-red-800 text-white border border-amber-400/40 font-bold shadow'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>{t.navCurriculum}</span>
              </button>

              <button
                onClick={() => setActiveTab('pinyin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  activeTab === 'pinyin'
                    ? 'bg-red-800 text-white border border-amber-400/40 font-bold shadow'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>{t.navPinyin}</span>
              </button>

              <button
                onClick={() => setActiveTab('writing')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  activeTab === 'writing'
                    ? 'bg-red-800 text-white border border-amber-400/40 font-bold shadow'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                }`}
              >
                <PenTool className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>{t.navWriting}</span>
              </button>

              <button
                onClick={() => setActiveTab('culture')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  activeTab === 'culture'
                    ? 'bg-red-800 text-white border border-amber-400/40 font-bold shadow'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>{t.navCulture}</span>
              </button>

              <button
                onClick={() => setActiveTab('visitors')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  activeTab === 'visitors'
                    ? 'bg-red-800 text-white border border-amber-400/40 font-bold shadow'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>{t.navVisitors}</span>
              </button>
            </nav>

            {/* Language Switcher Button (1-Click Toggle between English and Arabic) */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs border border-amber-300/40 whitespace-nowrap shadow transition-all hover:scale-105"
              title="تبديل لغة الموقع / Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-stone-950" />
              <span>{t.langToggle}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
