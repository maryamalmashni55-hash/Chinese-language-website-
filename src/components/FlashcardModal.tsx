import React, { useState, useMemo } from 'react';
import { X, Volume2, RotateCw, ChevronLeft, ChevronRight, Award, CheckCircle } from 'lucide-react';
import { CURRICULUM_UNITS } from '../data/curriculumData';
import { VocabWord } from '../types';
import { playChineseAudio } from '../utils/speech';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const FlashcardModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [selectedUnitId, setSelectedUnitId] = useState<number>(1);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);

  // Collect all vocab for the selected unit
  const unitVocab: VocabWord[] = useMemo(() => {
    const unit = CURRICULUM_UNITS.find((u) => u.id === selectedUnitId) || CURRICULUM_UNITS[0];
    const words: VocabWord[] = [];
    unit.lessons.forEach((l) => {
      words.push(...l.vocabulary);
    });
    return words;
  }, [selectedUnitId]);

  const currentWord: VocabWord = unitVocab[currentIndex] || unitVocab[0];

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < unitVocab.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(unitVocab.length - 1);
    }
  };

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentWord) return;
    setAudioPlaying(true);
    playChineseAudio(
      currentWord.hanzi,
      0.85,
      () => setAudioPlaying(true),
      () => setAudioPlaying(false)
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#1c080b] to-[#120406] border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>بطاقات المراجعة الذكية للكلمات</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white font-['Cairo',sans-serif]">
            اختبر حفظك لمفردات الوحدات
          </h3>
        </div>

        {/* Unit Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 scrollbar-none justify-start sm:justify-center">
          {CURRICULUM_UNITS.map((u) => (
            <button
              key={u.id}
              onClick={() => {
                setSelectedUnitId(u.id);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                selectedUnitId === u.id
                  ? 'bg-red-800 text-white border-amber-400'
                  : 'bg-[#150507] text-stone-400 border-stone-800 hover:text-stone-200'
              }`}
            >
              وحدة {u.unitNumber}
            </button>
          ))}
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between text-xs text-stone-400 mb-3 px-2">
          <span>
            بطاقة {currentIndex + 1} من {unitVocab.length}
          </span>
          <span>انقر على البطاقة لقلبها</span>
        </div>

        {/* Flip Flashcard */}
        {currentWord && (
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[260px] p-6 rounded-2xl bg-[#280a0e] border-2 border-amber-500/40 shadow-xl cursor-pointer select-none flex flex-col items-center justify-center text-center relative group hover:border-amber-400 transition-all duration-300"
          >
            {/* Pronunciation button in top-left */}
            <button
              type="button"
              onClick={handlePlayAudio}
              title="استمع للنطق الصيني"
              className="absolute top-4 left-4 p-2 rounded-xl bg-stone-900/90 hover:bg-amber-600 text-amber-300 hover:text-white transition-all shadow"
            >
              <Volume2 className={`w-4 h-4 ${audioPlaying ? 'animate-bounce text-amber-400' : ''}`} />
            </button>

            {/* Flip Indicator in top-right */}
            <div className="absolute top-4 right-4 flex items-center gap-1 text-[11px] text-stone-400 group-hover:text-amber-300 transition-colors">
              <RotateCw className="w-3.5 h-3.5" />
              <span>قلب</span>
            </div>

            {!isFlipped ? (
              /* Front of Card: Hanzi + Pinyin */
              <div className="my-auto animate-fadeIn">
                <div className="text-5xl sm:text-6xl font-black text-white font-['Noto_Serif_SC',serif] tracking-wider mb-3">
                  {currentWord.hanzi}
                </div>
                <div className="text-xl sm:text-2xl font-bold text-amber-400 font-mono">
                  {currentWord.pinyin}
                </div>
                <div className="mt-4 text-xs text-stone-400">انقر للكشف عن المعنى العربي</div>
              </div>
            ) : (
              /* Back of Card: Arabic meaning */
              <div className="my-auto animate-fadeIn space-y-3">
                <div className="text-xs uppercase text-amber-400 font-semibold">
                  المعنى باللغة العربية:
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-200">
                  {currentWord.arabic}
                </div>
                {currentWord.english && (
                  <div className="text-xs text-stone-400 font-sans">
                    English: {currentWord.english}
                  </div>
                )}
                {currentWord.exampleSentence && (
                  <div className="mt-3 p-3 rounded-xl bg-[#140406] border border-amber-900/40 text-xs text-stone-300">
                    <div className="font-['Noto_Serif_SC',serif] font-bold text-white text-sm">
                      {currentWord.exampleSentence.hanzi}
                    </div>
                    <div className="text-amber-400 font-mono mt-0.5">
                      {currentWord.exampleSentence.pinyin}
                    </div>
                    <div className="text-stone-300 mt-0.5">
                      {currentWord.exampleSentence.arabic}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={handlePrev}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-semibold border border-stone-700 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
            <span>السابق</span>
          </button>

          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/30 transition-all"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{isFlipped ? 'عرض الحرف الصيني' : 'إظهار الترجمة'}</span>
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-800 hover:bg-red-700 text-white text-xs font-bold border border-amber-400/40 shadow transition-all"
          >
            <span>التالي</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
