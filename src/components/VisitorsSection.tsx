import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Volume2, CheckCircle2, User, BookOpen } from 'lucide-react';
import { playChineseAudio } from '../utils/speech';
import { Language, UserVisitorEntry } from '../types';
import { UI_STRINGS } from '../translations/ui';

interface Props {
  lang: Language;
}

const STORAGE_KEY = 'chinese_app_clean_visitor_entries';

export const VisitorsSection: React.FC<Props> = ({ lang }) => {
  const [entries, setEntries] = useState<UserVisitorEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Empty
    }
    return [];
  });

  const [writerName, setWriterName] = useState('');
  const [learnedSentence, setLearnedSentence] = useState('');
  const [visitorNote, setVisitorNote] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const t = UI_STRINGS[lang];

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [entries]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!writerName.trim() || !learnedSentence.trim()) return;

    const newEntry: UserVisitorEntry = {
      id: `visitor-${Date.now()}`,
      name: writerName.trim(),
      learnedSentence: learnedSentence.trim(),
      note: visitorNote.trim() || undefined,
      date: new Date().toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    };

    setEntries((prev) => [newEntry, ...prev]);
    setWriterName('');
    setLearnedSentence('');
    setVisitorNote('');
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3500);
  };

  const handlePlayAudio = (id: string, text: string) => {
    setPlayingId(id);
    playChineseAudio(
      text,
      0.85,
      () => setPlayingId(id),
      () => setPlayingId(null)
    );
  };

  const QUICK_SUGGESTIONS = [
    { text: '这是我们的教室。', meaningAr: 'هذا هو فصلنا', meaningEn: 'This is our classroom' },
    { text: '中国茶很好喝。', meaningAr: 'الشاي الصيني لذيذ', meaningEn: 'Chinese tea is very good' },
    { text: '跟我一起去踢足球吧！', meaningAr: 'تعالوا نلعب كرة القدم', meaningEn: 'Let us play soccer together' },
    { text: '认识你很高兴。', meaningAr: 'سررت بمعرفتك', meaningEn: 'Nice to meet you' },
    { text: '祝你梦想成真！', meaningAr: 'أتمنى أن تتحقق أحلامك', meaningEn: 'May your dreams come true' },
  ];

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10" id="visitors-corner">
      {/* Clean Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/70 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{t.visitorsBadge}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white font-['Cairo',sans-serif]">
          {t.visitorsTitle}
        </h2>
        <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-lg mx-auto">
          {t.visitorsDesc}
        </p>
      </div>

      {/* Clean Form Card */}
      <div className="bg-[#140608] rounded-2xl border border-amber-500/30 p-6 sm:p-8 shadow-xl mb-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. اسم الكاتب / Writer's Name */}
          <div>
            <label className="block text-xs font-bold text-stone-200 mb-1.5">
              {t.writerNameLabel} <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={writerName}
              onChange={(e) => setWriterName(e.target.value)}
              placeholder={t.writerNamePlaceholder}
              className="w-full bg-[#0a0203] border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
          </div>

          {/* 2. الجملة الصينية التي تعلمها / Chinese Sentence */}
          <div>
            <label className="block text-xs font-bold text-stone-200 mb-1.5">
              {t.sentenceLabel} <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={learnedSentence}
              onChange={(e) => setLearnedSentence(e.target.value)}
              placeholder={t.sentencePlaceholder}
              className="w-full bg-[#0a0203] border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-['Noto_Serif_SC',serif]"
            />

            {/* Quick helper chips */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[11px] text-stone-500">{t.quickSuggestions}</span>
              {QUICK_SUGGESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setLearnedSentence(item.text)}
                  className="text-[11px] px-2.5 py-0.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-300 border border-stone-800 hover:border-amber-700/50 transition-all font-['Noto_Serif_SC',serif]"
                >
                  {item.text} ({lang === 'ar' ? item.meaningAr : item.meaningEn})
                </button>
              ))}
            </div>
          </div>

          {/* 3. ملاحظة أو رأي / Note */}
          <div>
            <label className="block text-xs font-bold text-stone-200 mb-1.5">
              {t.noteLabel}
            </label>
            <textarea
              rows={2}
              value={visitorNote}
              onChange={(e) => setVisitorNote(e.target.value)}
              placeholder={t.notePlaceholder}
              className="w-full bg-[#0a0203] border border-stone-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-stone-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
          </div>

          {/* 4. زر إرسال / Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-700 via-red-800 to-amber-700 hover:from-red-600 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-red-950/50 border border-amber-400/30 transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>{t.submitBtn}</span>
          </button>

          {isSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t.submitSuccess}</span>
            </div>
          )}
        </form>
      </div>

      {/* Submissions List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>{t.submissionsCount} ({entries.length})</span>
          </h3>
          {entries.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm(lang === 'ar' ? 'هل تود مسح السجل؟' : 'Clear history?')) {
                  setEntries([]);
                  localStorage.removeItem(STORAGE_KEY);
                }
              }}
              className="text-[11px] text-stone-500 hover:text-red-400 transition-colors"
            >
              {t.clearLog}
            </button>
          )}
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-2xl bg-[#0e0405] border border-stone-800/80 text-stone-400">
            <User className="w-8 h-8 text-stone-600 mx-auto mb-2 opacity-60" />
            <p className="text-sm font-medium text-stone-300">{t.emptyVisitors}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-xl bg-[#120507] border border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-7 h-7 rounded-lg bg-red-950 border border-red-800/50 flex items-center justify-center text-xs font-bold text-amber-300">
                      {entry.name.slice(0, 1).toUpperCase()}
                    </span>
                    <span className="text-sm font-bold text-white">{entry.name}</span>
                    <span className="text-[11px] text-stone-500 font-mono">{entry.date}</span>
                  </div>

                  <div className="text-base font-bold text-amber-300 font-['Noto_Serif_SC',serif] mt-1">
                    {entry.learnedSentence}
                  </div>

                  {entry.note && (
                    <p className="text-xs text-stone-300 mt-1">{entry.note}</p>
                  )}
                </div>

                <button
                  onClick={() => handlePlayAudio(entry.id, entry.learnedSentence)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-amber-600 text-amber-300 hover:text-white text-xs font-semibold border border-stone-800 transition-all self-start sm:self-center shrink-0"
                  title={t.listen}
                >
                  <Volume2 className={`w-3.5 h-3.5 ${playingId === entry.id ? 'animate-bounce' : ''}`} />
                  <span>{t.listen}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
