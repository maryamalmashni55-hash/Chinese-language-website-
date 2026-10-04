import React, { useState } from 'react';
import { Volume2, Sparkles } from 'lucide-react';
import { playChineseAudio } from '../utils/speech';
import { Language } from '../types';
import { UI_STRINGS } from '../translations/ui';

interface Props {
  lang: Language;
}

interface ToneItem {
  number: number;
  nameArabic: string;
  nameEnglish: string;
  nameChinese: string;
  symbol: string;
  contourArabic: string;
  contourEnglish: string;
  sampleHanzi: string;
  samplePinyin: string;
  meaningArabic: string;
  meaningEnglish: string;
}

const TONES_DATA: ToneItem[] = [
  {
    number: 1,
    nameArabic: 'النغمة الأولى (عالية ومستقيمة)',
    nameEnglish: '1st Tone: High & Flat (55)',
    nameChinese: '第一声 (阴平)',
    symbol: '— (mā)',
    contourArabic: 'نبرة صوتية مرتفعة وثابتة وممتدة مثل صوت صفارة مستمرة 55',
    contourEnglish: 'High pitch, steady and prolonged without rising or falling.',
    sampleHanzi: '妈',
    samplePinyin: 'mā',
    meaningArabic: 'أم / والدة',
    meaningEnglish: 'mother / mom',
  },
  {
    number: 2,
    nameArabic: 'النغمة الثانية (صاعدة)',
    nameEnglish: '2nd Tone: Rising (35)',
    nameChinese: '第二声 (阳平)',
    symbol: '／ (má)',
    contourArabic: 'صوت يبدأ من الوسط ويصعد للأعلى كما لو كنت تسأل بدهشة: "نعم؟" 35',
    contourEnglish: 'Starts at middle pitch and rises sharply, like asking "What?"',
    sampleHanzi: '麻',
    samplePinyin: 'má',
    meaningArabic: 'قنب / خَدَر',
    meaningEnglish: 'hemp / numbness',
  },
  {
    number: 3,
    nameArabic: 'النغمة الثالثة (هابطة ثم صاعدة)',
    nameEnglish: '3rd Tone: Low Falling-Rising (214)',
    nameChinese: '第三声 (上声)',
    symbol: '∨ (mǎ)',
    contourArabic: 'ينخفض الصوت إلى أدنى طبقة في الحلق ثم يعاود الارتفاع قليلاً 214',
    contourEnglish: 'Dips down to the lowest register and rises slightly.',
    sampleHanzi: '马',
    samplePinyin: 'mǎ',
    meaningArabic: 'حصان',
    meaningEnglish: 'horse',
  },
  {
    number: 4,
    nameArabic: 'النغمة الرابعة (هابطة وحازمة)',
    nameEnglish: '4th Tone: High Falling (51)',
    nameChinese: '第四声 (去声)',
    symbol: '＼ (mà)',
    contourArabic: 'صوت هابط وحاسم وسريع، يشبه نبرة إعطاء أمر صارم 51',
    contourEnglish: 'Sharp, decisive, dropping rapidly from high to low.',
    sampleHanzi: '骂',
    samplePinyin: 'mà',
    meaningArabic: 'يوبخ / يعاتب',
    meaningEnglish: 'to scold / reprimand',
  },
];

const INITIALS_SAMPLE = [
  { letter: 'b', pinyin: 'bō', hanzi: '波', descAr: 'باء مرققة غير منفوخة', descEn: 'Unaspirated voiceless p' },
  { letter: 'p', pinyin: 'pō', hanzi: '坡', descAr: 'باء انفجارية مع هواء', descEn: 'Aspirated strong p' },
  { letter: 'm', pinyin: 'mō', hanzi: '摸', descAr: 'ميم', descEn: 'Nasal m' },
  { letter: 'f', pinyin: 'fō', hanzi: '佛', descAr: 'فاء', descEn: 'Labiodental f' },
  { letter: 'd', pinyin: 'dē', hanzi: '得', descAr: 'دال مرققة غير منفوخة', descEn: 'Unaspirated d' },
  { letter: 't', pinyin: 'tē', hanzi: '特', descAr: 'تاء انفجارية مع هواء', descEn: 'Aspirated t' },
  { letter: 'n', pinyin: 'nè', hanzi: '讷', descAr: 'نون', descEn: 'Nasal n' },
  { letter: 'l', pinyin: 'lè', hanzi: '乐', descAr: 'لام', descEn: 'Lateral l' },
  { letter: 'g', pinyin: 'gē', hanzi: '哥', descAr: 'كاف مائلة للجيم', descEn: 'Unaspirated velar k' },
  { letter: 'k', pinyin: 'kē', hanzi: '科', descAr: 'كاف انفجارية مع هواء', descEn: 'Aspirated k' },
  { letter: 'h', pinyin: 'hē', hanzi: '喝', descAr: 'هاء / خاء رخوة', descEn: 'Glottal / Velar h' },
  { letter: 'j', pinyin: 'jī', hanzi: '鸡', descAr: 'جيم خفيفة مع ترقيق', descEn: 'Alveolo-palatal j' },
  { letter: 'q', pinyin: 'qī', hanzi: '七', descAr: 'تشين خفيفة مع نفخ', descEn: 'Aspirated alveolo-palatal q' },
  { letter: 'x', pinyin: 'xī', hanzi: '西', descAr: 'شين رقيقة ناعمة', descEn: 'Soft palatal sh/x' },
  { letter: 'zh', pinyin: 'zhī', hanzi: '知', descAr: 'جيم مفخمة مع ثني اللسان', descEn: 'Retroflex zh' },
  { letter: 'ch', pinyin: 'chī', hanzi: '吃', descAr: 'تشين مفخمة مع هواء', descEn: 'Aspirated retroflex ch' },
  { letter: 'sh', pinyin: 'shī', hanzi: '狮', descAr: 'شين مفخمة مع ثني اللسان', descEn: 'Retroflex sh' },
  { letter: 'r', pinyin: 'rì', hanzi: '日', descAr: 'راء مائلة للياء والضاد', descEn: 'Retroflex voiced r' },
];

export const PinyinGuide: React.FC<Props> = ({ lang }) => {
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const t = UI_STRINGS[lang];

  const handlePlayTone = (key: string, text: string) => {
    setPlayingKey(key);
    playChineseAudio(
      text,
      0.75,
      () => setPlayingKey(key),
      () => setPlayingKey(null)
    );
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10" id="pinyin-section">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/70 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
          <Volume2 className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'الأساس الصوتي للغة • 汉语拼音' : 'Phonetics & Pronunciation • Hanyu Pinyin'}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white font-['Cairo',sans-serif]">
          {lang === 'ar' ? 'دليل النطق ونغمات البينين الأربعة' : 'Pinyin Phonetics & The 4 Mandarin Tones'}
        </h2>
        <p className="text-xs sm:text-sm text-stone-400 mt-2 max-w-xl mx-auto leading-relaxed">
          {lang === 'ar'
            ? 'البينين هو نظام التمثيل الصوتي للرموز الصينية بالحروف اللاتينية. في الصينية، تغير النغمة يغير المعنى بالكامل!'
            : 'Pinyin is the official romanization system for Chinese characters. In Mandarin, varying the tone alters the definition entirely!'}
        </p>
      </div>

      {/* 4 Tones Grid */}
      <div className="mb-10">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{lang === 'ar' ? 'نغمات الصوت الصينية الأربعة (四声 Sìshēng)' : 'The 4 Mandarin Tones (四声 Sìshēng)'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TONES_DATA.map((tone) => {
            const isPlaying = playingKey === `tone-${tone.number}`;
            const name = lang === 'ar' ? tone.nameArabic : tone.nameEnglish;
            const contour = lang === 'ar' ? tone.contourArabic : tone.contourEnglish;
            const meaning = lang === 'ar' ? tone.meaningArabic : tone.meaningEnglish;

            return (
              <div
                key={tone.number}
                className="p-5 rounded-2xl bg-[#140608] border border-amber-500/25 hover:border-amber-400/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-400 bg-red-950/70 border border-red-800/40 px-2 py-0.5 rounded">
                      {lang === 'ar' ? `النغمة ${tone.number}` : `Tone ${tone.number}`}
                    </span>
                    <span className="text-base font-bold text-white font-mono">{tone.symbol}</span>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-1">{name}</h4>
                  <div className="text-xs text-amber-300/80 font-['Noto_Serif_SC',serif] mb-2">
                    {tone.nameChinese}
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed mb-4">{contour}</p>
                </div>

                <div className="p-3 rounded-xl bg-[#0c0304] border border-stone-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-white font-['Noto_Serif_SC',serif]">
                        {tone.sampleHanzi}
                      </span>
                      <span className="text-sm font-bold text-amber-400 font-mono">
                        {tone.samplePinyin}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-400">
                      {lang === 'ar' ? 'المعنى: ' : 'Meaning: '}
                      {meaning}
                    </div>
                  </div>

                  <button
                    onClick={() => handlePlayTone(`tone-${tone.number}`, tone.sampleHanzi)}
                    className="p-2 rounded-lg bg-stone-900 hover:bg-amber-600 text-amber-300 hover:text-white transition-all shadow"
                    title={t.listen}
                  >
                    <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Initials Explorer */}
      <div className="p-6 rounded-3xl bg-[#140608] border border-amber-500/25 shadow-xl">
        <h3 className="text-base sm:text-lg font-bold text-white mb-2">
          {lang === 'ar' ? 'الأصوات الساكنة الأساسية (声母 Shēngmǔ)' : 'Mandarin Consonant Initials (声母 Shēngmǔ)'}
        </h3>
        <p className="text-xs text-stone-400 mb-4">
          {lang === 'ar'
            ? 'انقر على أي حرف للاستماع إلى النطق القياسي الصحيح'
            : 'Click any initial to hear native standard pronunciation'}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {INITIALS_SAMPLE.map((init, idx) => {
            const isPlaying = playingKey === `initial-${idx}`;
            const desc = lang === 'ar' ? init.descAr : init.descEn;

            return (
              <button
                key={idx}
                onClick={() => handlePlayTone(`initial-${idx}`, init.hanzi)}
                className={`p-3 rounded-xl border text-start transition-all group ${
                  isPlaying
                    ? 'bg-amber-950 border-amber-400 ring-1 ring-amber-400'
                    : 'bg-[#0e0304] border-stone-800 hover:border-amber-700/60 hover:bg-[#1a070a]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg font-black text-amber-400 font-mono">{init.letter}</span>
                  <Volume2
                    className={`w-3.5 h-3.5 text-stone-500 group-hover:text-amber-300 ${
                      isPlaying ? 'text-amber-300 animate-bounce' : ''
                    }`}
                  />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-white font-['Noto_Serif_SC',serif]">
                    {init.hanzi}
                  </span>
                  <span className="text-xs text-stone-400 font-mono">{init.pinyin}</span>
                </div>
                <div className="text-[10px] text-stone-500 truncate mt-1">{desc}</div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
