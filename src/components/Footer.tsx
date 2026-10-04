import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { UI_STRINGS } from '../translations/ui';

interface Props {
  lang: Language;
  onSelectTab: (tab: string) => void;
  onSelectLesson: (id: number) => void;
}

export const Footer: React.FC<Props> = ({ lang, onSelectTab, onSelectLesson }) => {
  const t = UI_STRINGS[lang];

  return (
    <footer className="w-full bg-[#080203] border-t border-amber-900/40 text-stone-300 relative overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-red-800 via-amber-400 to-red-800" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Dedication */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-700 to-red-900 border border-amber-400/50 flex items-center justify-center text-amber-200 text-lg font-bold font-['Noto_Serif_SC',serif]">
                华
              </div>
              <h3 className="text-lg font-black text-white font-['Cairo',sans-serif]">
                {lang === 'ar' ? 'وجهتك في تعلم اللغة الصينية' : 'Your Destination for Learning Chinese'}
              </h3>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-md mb-4">
              {t.welcomeDesc}
            </p>

            {/* Names Card: Student Maryam Al-Meshni & Teacher Laila */}
            <div className="p-3.5 rounded-xl bg-[#140406] border border-amber-500/30 max-w-md">
              <div className="text-xs text-stone-200 space-y-1">
                <div>
                  <span className="text-stone-400">Student: </span>
                  <strong className="text-white font-['Cinzel',serif]">Maryam Al-Meshni</strong>
                </div>
                <div>
                  <span className="text-stone-400">Teacher: </span>
                  <strong className="text-amber-300 font-['Cinzel',serif]">Teacher Laila</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'ar' ? 'أقسام الموقع' : 'Navigation'}</span>
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onSelectTab('curriculum')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {t.navCurriculum}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('pinyin')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {t.navPinyin}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('writing')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {t.navWriting}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('culture')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {t.navCulture}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('visitors')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {t.navVisitors}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Fast Jump to Units */}
          <div>
            <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'ar' ? 'الوحدات الدراسية' : 'Units'}</span>
            </h4>
            <div className="grid grid-cols-2 gap-1 text-[11px] text-stone-400">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((u) => (
                <button
                  key={u}
                  onClick={() => {
                    onSelectTab('curriculum');
                    onSelectLesson((u - 1) * 2 + 1);
                  }}
                  className="text-start hover:text-amber-300 truncate"
                >
                  {lang === 'ar' ? `الوحدة ${u}` : `Unit ${u}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} {t.siteTitle} • {t.allRightsReserved}
          </div>
          <div className="font-['Noto_Serif_SC',serif] text-amber-400 font-bold tracking-widest text-xs">
            万里长城 · 学无止境
          </div>
        </div>
      </div>
    </footer>
  );
};
