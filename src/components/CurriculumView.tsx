import React, { useState, useMemo } from 'react';
import {
  Volume2,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { CURRICULUM_UNITS } from '../data/curriculumData';
import { Lesson, Unit, VocabWord, SentenceItem, Language } from '../types';
import { UI_STRINGS } from '../translations/ui';
import { playChineseAudio } from '../utils/speech';

interface Props {
  lang: Language;
  selectedLessonId: number;
  onSelectLesson: (id: number) => void;
}

export const CurriculumView: React.FC<Props> = ({
  lang,
  selectedLessonId,
  onSelectLesson,
}) => {
  const [activeUnitId, setActiveUnitId] = useState<number>(1);
  const [revealedVocab, setRevealedVocab] = useState<Record<string, boolean>>({});
  const [revealedSentences, setRevealedSentences] = useState<Record<string, boolean>>({});
  const [revealedAll, setRevealedAll] = useState<boolean>(false);
  const [audioPlayingId, setAudioPlayingId] = useState<string | null>(null);

  const t = UI_STRINGS[lang];

  // Active Lesson
  const currentLesson: Lesson = useMemo(() => {
    for (const unit of CURRICULUM_UNITS) {
      const found = unit.lessons.find((l) => l.id === selectedLessonId);
      if (found) return found;
    }
    return CURRICULUM_UNITS[0].lessons[0];
  }, [selectedLessonId]);

  const currentUnit: Unit = useMemo(() => {
    return (
      CURRICULUM_UNITS.find((u) => u.id === currentLesson.unitId) || CURRICULUM_UNITS[0]
    );
  }, [currentLesson]);

  React.useEffect(() => {
    setActiveUnitId(currentLesson.unitId);
  }, [currentLesson.unitId, currentLesson.id]);

  const toggleVocabReveal = (id: string) => {
    setRevealedVocab((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSentenceReveal = (id: string) => {
    setRevealedSentences((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleRevealAll = () => {
    const next = !revealedAll;
    setRevealedAll(next);

    const vMap: Record<string, boolean> = {};
    currentLesson.vocabulary.forEach((v) => {
      vMap[v.id] = next;
    });
    setRevealedVocab(vMap);

    const sMap: Record<string, boolean> = {};
    currentLesson.dialogue.forEach((d) => {
      sMap[d.id] = next;
    });
    setRevealedSentences(sMap);
  };

  const handlePlayAudio = (id: string, text: string) => {
    setAudioPlayingId(id);
    playChineseAudio(
      text,
      0.85,
      () => setAudioPlayingId(id),
      () => setAudioPlayingId(null)
    );
  };

  // Units list with bilingual definitions
  const UNIT_ITEMS = [
    {
      id: 1,
      titleEn: 'Unit 1: Our Class',
      titleAr: 'الوحدة الأولى: فصلنا',
      lessonsEn: 'Lessons 1 & 2',
      lessonsAr: 'الدرس 1 و 2',
    },
    {
      id: 2,
      titleEn: 'Unit 2: Beautiful Campus',
      titleAr: 'الوحدة الثانية: الحرم المدرسي',
      lessonsEn: 'Lessons 3 & 4',
      lessonsAr: 'الدرس 3 و 4',
    },
    {
      id: 3,
      titleEn: 'Unit 3: Hobbies & Sports',
      titleAr: 'الوحدة الثالثة: الهوايات والرياضة',
      lessonsEn: 'Lessons 5 & 6',
      lessonsAr: 'الدرس 5 و 6',
    },
    {
      id: 4,
      titleEn: 'Unit 4: Between Friends',
      titleAr: 'الوحدة الرابعة: بين الأصدقاء',
      lessonsEn: 'Lessons 7 & 8',
      lessonsAr: 'الدرس 7 و 8',
    },
    {
      id: 5,
      titleEn: 'Unit 5: Dietary Habits',
      titleAr: 'الوحدة الخامسة: العادات الغذائية',
      lessonsEn: 'Lessons 9 & 10',
      lessonsAr: 'الدرس 9 و 10',
    },
    {
      id: 6,
      titleEn: 'Unit 6: Disease & Health',
      titleAr: 'الوحدة السادسة: المرض والصحة',
      lessonsEn: 'Lessons 11 & 12',
      lessonsAr: 'الدرس 11 و 12',
    },
    {
      id: 7,
      titleEn: 'Unit 7: Past & Present',
      titleAr: 'الوحدة السابعة: الماضي والحاضر',
      lessonsEn: 'Lessons 13 & 14',
      lessonsAr: 'الدرس 13 و 14',
    },
    {
      id: 8,
      titleEn: 'Unit 8: Plan & Intention',
      titleAr: 'الوحدة الثامنة: الخطط والنوايا',
      lessonsEn: 'Lessons 15 & 16',
      lessonsAr: 'الدرس 15 و 16',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8" id="curriculum-section">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b border-stone-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t.siteSubtitle}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-['Cairo',sans-serif]">
            {lang === 'ar' ? 'منهج الوحدات الثماني (16 درساً)' : 'Grade 2 Intermediate Curriculum (8 Units)'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            {lang === 'ar'
              ? 'كل مفردة وجملة تعرض بثلاثة عناصر: الرمز الصيني (Hanzi)، النطق (Pinyin)، والترجمة (انقر للكشف).'
              : 'Each word and sentence presents 3 elements: Hanzi, Pinyin pronunciation, and translation (Click to reveal).'}
          </p>
        </div>

        {/* Global Reveal / Hide Toggle */}
        <button
          onClick={handleToggleRevealAll}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-bold border border-stone-700 shadow transition-all self-start md:self-auto shrink-0"
        >
          {revealedAll ? (
            <>
              <EyeOff className="w-4 h-4 text-amber-400" />
              <span>{t.hideAll}</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 text-amber-400" />
              <span>{t.revealAll}</span>
            </>
          )}
        </button>
      </div>

      {/* 8 Units Clean Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-6">
        {UNIT_ITEMS.map((uItem) => {
          const isSelected = uItem.id === currentUnit.id;
          const matchingUnit = CURRICULUM_UNITS.find((u) => u.id === uItem.id);

          return (
            <button
              key={uItem.id}
              onClick={() => {
                setActiveUnitId(uItem.id);
                if (matchingUnit) {
                  onSelectLesson(matchingUnit.lessons[0].id);
                }
              }}
              className={`p-3 rounded-xl text-start transition-all border flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-red-800 to-red-900 text-white border-amber-400 shadow-md font-bold'
                  : 'bg-[#140608] hover:bg-[#1f090c] text-stone-300 border-stone-800 hover:border-amber-900/60'
              }`}
            >
              <div className="text-[10px] text-amber-300 font-semibold mb-1">
                {lang === 'ar' ? `وحدة ${uItem.id}` : `Unit ${uItem.id}`}
              </div>
              <div className="text-xs font-bold line-clamp-1">
                {lang === 'ar' ? uItem.titleAr.split(': ')[1] : uItem.titleEn.split(': ')[1]}
              </div>
              <div className="text-[10px] text-stone-400 mt-1 font-mono">
                {lang === 'ar' ? uItem.lessonsAr : uItem.lessonsEn}
              </div>
            </button>
          );
        })}
      </div>

      {/* Two Lessons Switcher for Active Unit */}
      <div className="p-3.5 rounded-2xl bg-[#160608] border border-amber-500/30 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-300 bg-red-950/80 px-2.5 py-1 rounded-lg border border-red-800/40">
            {lang === 'ar' ? `الوحدة ${currentUnit.unitNumber}` : `Unit ${currentUnit.unitNumber}`}
          </span>
          <span className="text-sm font-bold text-white">
            {lang === 'ar' ? currentUnit.titleArabic : currentUnit.titleEnglish} ({currentUnit.titleHanzi})
          </span>
        </div>

        {/* 2 Lessons of active unit */}
        <div className="flex items-center gap-2">
          {currentUnit.lessons.map((lesson) => {
            const isCurrent = lesson.id === currentLesson.id;
            return (
              <button
                key={lesson.id}
                onClick={() => onSelectLesson(lesson.id)}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 ${
                  isCurrent
                    ? 'bg-red-700 text-white border-amber-300 shadow'
                    : 'bg-[#0e0304] text-stone-300 hover:text-white border-stone-800'
                }`}
              >
                <span>{lang === 'ar' ? `الدرس ${lesson.lessonNumber}:` : `Lesson ${lesson.lessonNumber}:`}</span>
                <span className="font-['Noto_Serif_SC',serif]">{lesson.titleHanzi}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Lesson Display */}
      <div className="bg-[#120507] rounded-3xl border border-amber-500/20 p-5 sm:p-7 shadow-xl mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
          <div>
            <span className="text-[11px] font-semibold text-amber-400">
              {lang === 'ar' ? `الدرس ${currentLesson.lessonNumber} من 16` : `Lesson ${currentLesson.lessonNumber} of 16`}
            </span>
            <div className="flex flex-wrap items-baseline gap-3 mt-0.5">
              <h3 className="text-2xl sm:text-3xl font-black text-white font-['Noto_Serif_SC',serif]">
                {currentLesson.titleHanzi}
              </h3>
              <span className="text-base font-bold text-amber-400 font-mono">
                {currentLesson.titlePinyin}
              </span>
            </div>
            <div className="text-xs sm:text-sm text-stone-300 mt-1">
              {lang === 'ar' ? 'المعنى: ' : 'Meaning: '}
              <span className="text-amber-200 font-semibold">
                {lang === 'ar' ? currentLesson.titleArabic : (currentLesson.titleEnglish || currentLesson.titleArabic)}
              </span>
            </div>
          </div>

          <button
            onClick={() =>
              handlePlayAudio(
                `title-${currentLesson.id}`,
                `${currentLesson.titleHanzi}。`
              )
            }
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 text-xs font-semibold border border-stone-700 transition-all self-start sm:self-auto shrink-0"
          >
            <Volume2
              className={`w-4 h-4 ${
                audioPlayingId === `title-${currentLesson.id}` ? 'animate-bounce' : ''
              }`}
            />
            <span>{t.lessonAudio}</span>
          </button>
        </div>

        {/* 1. Vocabulary Table (Clean & Uncluttered) */}
        <div className="my-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>{t.vocabTitle}</span>
            </h4>
            <span className="text-[11px] text-stone-400">{t.revealTranslation}</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-stone-800 bg-[#0e0405]">
            <table className="w-full text-start text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#180507] text-stone-400 border-b border-stone-800 text-xs">
                  <th className="py-3 px-4 font-bold text-start">{t.hanziCol}</th>
                  <th className="py-3 px-4 font-bold text-start">{t.pinyinCol}</th>
                  <th className="py-3 px-4 font-bold text-start">{t.transCol}</th>
                  <th className="py-3 px-4 text-center font-bold">{t.audioCol}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/80">
                {currentLesson.vocabulary.map((vocab: VocabWord) => {
                  const isRevealed = revealedVocab[vocab.id] ?? false;
                  const isPlaying = audioPlayingId === vocab.id;
                  const translationText = lang === 'ar' ? vocab.arabic : (vocab.english || vocab.arabic);

                  return (
                    <tr
                      key={vocab.id}
                      onClick={() => toggleVocabReveal(vocab.id)}
                      className="hover:bg-[#1a070a]/60 cursor-pointer transition-colors"
                    >
                      {/* Hanzi */}
                      <td className="py-3.5 px-4 font-['Noto_Serif_SC',serif] font-bold text-xl sm:text-2xl text-white">
                        {vocab.hanzi}
                      </td>

                      {/* Pinyin */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-amber-400 text-xs sm:text-sm">
                        {vocab.pinyin}
                      </td>

                      {/* Click to Reveal Translation */}
                      <td className="py-3.5 px-4">
                        {isRevealed ? (
                          <span className="font-bold text-amber-200 text-xs sm:text-sm animate-fadeIn">
                            {translationText}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-900 text-stone-400 hover:text-amber-300 text-xs font-semibold border border-stone-800 transition-colors">
                            <Eye className="w-3.5 h-3.5 text-amber-400" />
                            <span>{lang === 'ar' ? 'انقر للكشف' : 'Click to reveal'}</span>
                          </span>
                        )}
                      </td>

                      {/* Audio */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayAudio(vocab.id, vocab.hanzi);
                          }}
                          className="p-2 rounded-lg bg-stone-900 hover:bg-amber-600 text-amber-300 hover:text-white transition-all shadow"
                          title={t.listen}
                        >
                          <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'animate-bounce text-amber-400' : ''}`} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Dialogue & Key Sentences */}
        <div className="my-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>{t.dialogueTitle}</span>
            </h4>
          </div>

          <div className="space-y-3">
            {currentLesson.dialogue.map((item: SentenceItem) => {
              const isRevealed = revealedSentences[item.id] ?? false;
              const isPlaying = audioPlayingId === item.id;
              const translationText = lang === 'ar' ? item.arabic : (item.english || item.arabic);

              return (
                <div
                  key={item.id}
                  onClick={() => toggleSentenceReveal(item.id)}
                  className="p-4 rounded-xl bg-[#0e0405] border border-stone-800 hover:border-amber-900/60 transition-all cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      {item.speaker && (
                        <span className="text-[10px] font-bold text-amber-400 bg-red-950/80 border border-red-800/40 px-2 py-0.5 rounded-md inline-block mb-1.5">
                          {item.speaker}
                        </span>
                      )}

                      <div className="text-lg sm:text-xl font-bold text-white font-['Noto_Serif_SC',serif]">
                        {item.hanzi}
                      </div>

                      <div className="text-xs sm:text-sm text-amber-400 font-mono mt-0.5">
                        {item.pinyin}
                      </div>

                      <div className="mt-2">
                        {isRevealed ? (
                          <div className="text-xs sm:text-sm font-bold text-amber-200 animate-fadeIn bg-red-950/40 p-2 rounded-lg border border-red-900/30">
                            {lang === 'ar' ? 'الترجمة: ' : 'Translation: '}
                            {translationText}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-amber-300 font-semibold transition-colors">
                            <Eye className="w-3.5 h-3.5 text-amber-400" />
                            <span>{t.revealTranslation}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayAudio(item.id, item.hanzi);
                      }}
                      className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 text-xs font-semibold border border-stone-800 transition-all self-start sm:self-center shrink-0 flex items-center gap-1.5"
                    >
                      <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce text-amber-400' : ''}`} />
                      <span>{t.listen}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Cultural & Grammar Insight */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-[#20080b] to-[#150507] border border-amber-500/20 text-xs text-stone-300 leading-relaxed">
          <strong className="text-amber-300 font-bold block mb-1">
            {t.tipTitle}: {lang === 'ar' ? currentLesson.culturalGrammarTip.title : (currentLesson.culturalGrammarTip.titleEnglish || currentLesson.culturalGrammarTip.title)}
          </strong>
          {lang === 'ar'
            ? currentLesson.culturalGrammarTip.content
            : (currentLesson.culturalGrammarTip.contentEnglish || currentLesson.culturalGrammarTip.content)}
        </div>

        {/* Bottom Pagination */}
        <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between">
          <button
            onClick={() => onSelectLesson(Math.max(1, selectedLessonId - 1))}
            disabled={selectedLessonId <= 1}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-bold border border-stone-800 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {lang === 'ar' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            <span>{t.prevLesson}</span>
          </button>

          <span className="text-xs text-stone-400 font-medium">
            {lang === 'ar' ? `الدرس ${selectedLessonId} من 16` : `Lesson ${selectedLessonId} of 16`}
          </span>

          <button
            onClick={() => onSelectLesson(Math.min(16, selectedLessonId + 1))}
            disabled={selectedLessonId >= 16}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-800 hover:bg-red-700 text-white text-xs font-bold border border-amber-400/40 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span>{t.nextLesson}</span>
            {lang === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
