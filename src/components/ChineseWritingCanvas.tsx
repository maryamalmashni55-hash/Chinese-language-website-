import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  PenTool,
  RotateCcw,
  Trash2,
  Download,
  Eye,
  EyeOff,
  Volume2,
  Sparkles,
  Check,
  BookOpen,
} from 'lucide-react';
import { Language } from '../types';
import { UI_STRINGS } from '../translations/ui';
import { playChineseAudio } from '../utils/speech';

interface Props {
  lang: Language;
}

interface PracticeItem {
  id: string;
  type: 'character' | 'sentence';
  hanzi: string;
  pinyin: string;
  meaningEn: string;
  meaningAr: string;
  strokes?: number;
}

const PRACTICE_ITEMS: PracticeItem[] = [
  // Core Characters from Curriculum
  {
    id: 'c-ni',
    type: 'character',
    hanzi: '你',
    pinyin: 'nǐ',
    meaningEn: 'You',
    meaningAr: 'أنتَ / أنتِ',
    strokes: 7,
  },
  {
    id: 'c-hao',
    type: 'character',
    hanzi: '好',
    pinyin: 'hǎo',
    meaningEn: 'Good / Well',
    meaningAr: 'جيد / بخير',
    strokes: 6,
  },
  {
    id: 'c-wo',
    type: 'character',
    hanzi: '我',
    pinyin: 'wǒ',
    meaningEn: 'I / Me',
    meaningAr: 'أنا',
    strokes: 7,
  },
  {
    id: 'c-shi',
    type: 'character',
    hanzi: '是',
    pinyin: 'shì',
    meaningEn: 'To be / Yes',
    meaningAr: 'هو / يكون',
    strokes: 9,
  },
  {
    id: 'c-men',
    type: 'character',
    hanzi: '门',
    pinyin: 'mén',
    meaningEn: 'Door / Gate',
    meaningAr: 'باب / بوابة',
    strokes: 3,
  },
  {
    id: 'c-ke',
    type: 'character',
    hanzi: '课',
    pinyin: 'kè',
    meaningEn: 'Lesson / Class',
    meaningAr: 'درس / فصل',
    strokes: 10,
  },
  {
    id: 'c-cha',
    type: 'character',
    hanzi: '茶',
    pinyin: 'chá',
    meaningEn: 'Tea',
    meaningAr: 'شاي',
    strokes: 9,
  },
  {
    id: 'c-hua',
    type: 'character',
    hanzi: '华',
    pinyin: 'huá',
    meaningEn: 'Splendor / Chinese',
    meaningAr: 'بهاء / الصين',
    strokes: 6,
  },
  {
    id: 'c-you',
    type: 'character',
    hanzi: '友',
    pinyin: 'yǒu',
    meaningEn: 'Friend',
    meaningAr: 'صديق',
    strokes: 4,
  },
  {
    id: 'c-ai',
    type: 'character',
    hanzi: '爱',
    pinyin: 'ài',
    meaningEn: 'Love',
    meaningAr: 'حب',
    strokes: 10,
  },
  {
    id: 'c-jia',
    type: 'character',
    hanzi: '家',
    pinyin: 'jiā',
    meaningEn: 'Home / Family',
    meaningAr: 'بيت / عائلة',
    strokes: 10,
  },
  {
    id: 'c-zhong',
    type: 'character',
    hanzi: '中',
    pinyin: 'zhōng',
    meaningEn: 'Middle / China',
    meaningAr: 'وسط / الصين',
    strokes: 4,
  },
  // Full Sentences from Curriculum
  {
    id: 's-1',
    type: 'sentence',
    hanzi: '这是我们的教室。',
    pinyin: 'Zhè shì wǒmen de jiàoshì.',
    meaningEn: 'This is our classroom.',
    meaningAr: 'هذا هو فصلنا الدراسي.',
  },
  {
    id: 's-2',
    type: 'sentence',
    hanzi: '你们的教室真干净！',
    pinyin: 'Nǐmen de jiàoshì zhēn gānjìng!',
    meaningEn: 'Your classroom is really clean!',
    meaningAr: 'فصلكم الدراسي نظيف حقاً!',
  },
  {
    id: 's-3',
    type: 'sentence',
    hanzi: '认识你很高兴。',
    pinyin: 'Rènshi nǐ hěn gāoxìng.',
    meaningEn: 'Nice to meet you.',
    meaningAr: 'سعدت جداً بمعرفتك.',
  },
  {
    id: 's-4',
    type: 'sentence',
    hanzi: '中国茶很好喝。',
    pinyin: 'Zhōngguó chá hěn hǎohē.',
    meaningEn: 'Chinese tea is very delicious.',
    meaningAr: 'الشاي الصيني لذيذ جداً.',
  },
  {
    id: 's-5',
    type: 'sentence',
    hanzi: '老师好！',
    pinyin: 'Lǎoshī hǎo!',
    meaningEn: 'Hello Teacher!',
    meaningAr: 'أهلاً يا معلمتي!',
  },
  {
    id: 's-6',
    type: 'sentence',
    hanzi: '谢谢你！',
    pinyin: 'Xièxie nǐ!',
    meaningEn: 'Thank you!',
    meaningAr: 'شكراً لك!',
  },
];

const INK_COLORS = [
  { name: '墨黑 (Ink Black)', color: '#1c1917' },
  { name: '朱砂红 (Cinnabar Red)', color: '#dc2626' },
  { name: '金墨 (Dynasty Gold)', color: '#d97706' },
  { name: '青墨 (Jade Green)', color: '#059669' },
  { name: '砚紫 (Imperial Plum)', color: '#7c3aed' },
];

const BRUSH_SIZES = [
  { label: 'دقيق', labelEn: 'Fine', size: 5 },
  { label: 'متوسط', labelEn: 'Medium', size: 10 },
  { label: 'عريض', labelEn: 'Bold', size: 18 },
  { label: 'فرشاة كبرى', labelEn: 'Broad Brush', size: 28 },
];

// Fixed logical coordinate canvas size for crisp rendering and perfect scaling
const CANVAS_LOGICAL_SIZE = 600;

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  color: string;
  size: number;
}

export const ChineseWritingCanvas: React.FC<Props> = ({ lang }) => {
  const t = UI_STRINGS[lang];
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Selected item
  const [selectedItem, setSelectedItem] = useState<PracticeItem>(PRACTICE_ITEMS[0]);
  const [activeTabType, setActiveTabType] = useState<'character' | 'sentence' | 'free'>('character');

  // Sub-character selection for sentences (so user can write each character in the full square)
  const [activeCharIndex, setActiveCharIndex] = useState<number>(0);
  const [showEntireSentenceInBox, setShowEntireSentenceInBox] = useState<boolean>(false);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#1c1917');
  const [brushSize, setBrushSize] = useState(10);
  const [showGuide, setShowGuide] = useState(true);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Stroke history for 100% reliable undo/clear/guide toggling
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const currentStrokeRef = useRef<Stroke | null>(null);

  // Characters of current sentence if sentence is selected
  const sentenceChars = selectedItem.type === 'sentence' ? selectedItem.hanzi.split('') : [];
  const currentDisplayChar =
    selectedItem.type === 'sentence' && !showEntireSentenceInBox
      ? sentenceChars[activeCharIndex] || selectedItem.hanzi[0]
      : selectedItem.hanzi;

  // Master Redraw Function
  const redrawCanvas = useCallback(
    (strokesToDraw: Stroke[], activeGuide: boolean) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const size = CANVAS_LOGICAL_SIZE;

      // Reset any context transformation matrix
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      // 1. Draw Xuan Paper Background (Warm ivory rice paper texture)
      ctx.fillStyle = '#fefce8';
      ctx.fillRect(0, 0, size, size);

      // 2. Draw Authentic Red Grid (米字格 Mǐzìgé)
      const pad = 24;
      const boxSize = size - pad * 2;

      // Outer Red Border
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 3;
      ctx.strokeRect(pad, pad, boxSize, boxSize);

      // Inner guidelines (dashed cinnabar red)
      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = 'rgba(220, 38, 38, 0.35)';
      ctx.lineWidth = 1.5;

      // Vertical midline
      ctx.moveTo(size / 2, pad);
      ctx.lineTo(size / 2, size - pad);

      // Horizontal midline
      ctx.moveTo(pad, size / 2);
      ctx.lineTo(size - pad, size / 2);

      // Diagonal cross lines
      ctx.moveTo(pad, pad);
      ctx.lineTo(size - pad, size - pad);

      ctx.moveTo(size - pad, pad);
      ctx.lineTo(pad, size - pad);

      ctx.stroke();
      ctx.restore();

      // Corner decorative traditional brackets
      ctx.fillStyle = '#b91c1c';
      const markLength = 16;
      const markThick = 3;
      // Top-left
      ctx.fillRect(pad, pad, markLength, markThick);
      ctx.fillRect(pad, pad, markThick, markLength);
      // Top-right
      ctx.fillRect(size - pad - markLength, pad, markLength, markThick);
      ctx.fillRect(size - pad - markThick, pad, markThick, markLength);
      // Bottom-left
      ctx.fillRect(pad, size - pad - markThick, markLength, markThick);
      ctx.fillRect(pad, size - pad - markLength, markThick, markLength);
      // Bottom-right
      ctx.fillRect(size - pad - markLength, size - pad - markThick, markLength, markThick);
      ctx.fillRect(size - pad - markThick, size - pad - markLength, markThick, markLength);

      // 3. Draw Classical Character Ghost Guide (描红)
      if (activeGuide && activeTabType !== 'free') {
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(217, 119, 6, 0.22)'; // Warm golden-umber ghost outline

        if (selectedItem.type === 'sentence' && showEntireSentenceInBox) {
          // Whole sentence layout
          const len = selectedItem.hanzi.length;
          const fontSize = Math.min(68, Math.floor((size - 60) / len * 1.5));
          ctx.font = `bold ${fontSize}px 'Noto Serif SC', 'KaiTi', 'SimSun', serif`;
          ctx.fillText(selectedItem.hanzi, size / 2, size / 2);
        } else {
          // Big single character filling the whole square perfectly!
          // 440px in a 550px box gives exact traditional Chinese proportion
          ctx.font = "bold 440px 'Noto Serif SC', 'KaiTi', 'SimSun', serif";
          // Center vertically with slight baseline adjustment
          ctx.fillText(currentDisplayChar, size / 2, size / 2 + 30);
        }
        ctx.restore();
      }

      // 4. Draw all user brush strokes on top
      for (const stroke of strokesToDraw) {
        if (stroke.points.length < 2) {
          if (stroke.points.length === 1) {
            ctx.beginPath();
            ctx.arc(stroke.points[0].x, stroke.points[0].y, stroke.size / 2, 0, Math.PI * 2);
            ctx.fillStyle = stroke.color;
            ctx.fill();
          }
          continue;
        }

        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (let i = 1; i < stroke.points.length; i++) {
          ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }
    },
    [activeTabType, selectedItem, showEntireSentenceInBox, currentDisplayChar]
  );

  // Redraw when strokes, guide, or character selection change
  useEffect(() => {
    redrawCanvas(strokes, showGuide);
  }, [redrawCanvas, strokes, showGuide]);

  // Coordinate mapping from client to 600x600 logical canvas
  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_LOGICAL_SIZE / rect.width;
    const scaleY = CANVAS_LOGICAL_SIZE / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  // Pointer Down (Mouse, Touch, Stylus)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);

    const pt = getCanvasPoint(e);
    const newStroke: Stroke = {
      points: [pt],
      color: brushColor,
      size: brushSize,
    };

    currentStrokeRef.current = newStroke;
    setIsDrawing(true);

    // Draw immediate dot
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, brushSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = brushColor;
      ctx.fill();
    }
  };

  // Pointer Move
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentStrokeRef.current) return;
    e.preventDefault();

    const pt = getCanvasPoint(e);
    const stroke = currentStrokeRef.current;
    const prevPt = stroke.points[stroke.points.length - 1];

    stroke.points.push(pt);

    // Render segment in real time
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(prevPt.x, prevPt.y);
    ctx.lineTo(pt.x, pt.y);
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  // Pointer Up
  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentStrokeRef.current) return;
    e.preventDefault();

    try {
      const canvas = canvasRef.current;
      if (canvas && canvas.hasPointerCapture(e.pointerId)) {
        canvas.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }

    const completed = currentStrokeRef.current;
    currentStrokeRef.current = null;
    setIsDrawing(false);

    setStrokes((prev) => [...prev, completed]);
  };

  // Undo last stroke
  const handleUndo = () => {
    setStrokes((prev) => {
      if (prev.length === 0) return prev;
      return prev.slice(0, prev.length - 1);
    });
  };

  // Clear canvas
  const handleClear = () => {
    setStrokes([]);
  };

  // Save / Download Calligraphy Artwork as PNG
  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Draw clean composite
    redrawCanvas(strokes, false); // without ghost guide for clean artwork
    const dataUrl = canvas.toDataURL('image/png');
    // Restore guide
    redrawCanvas(strokes, showGuide);

    const a = document.createElement('a');
    a.download = `chinese_calligraphy_${currentDisplayChar || 'art'}.png`;
    a.href = dataUrl;
    a.click();
  };

  // Play pronunciation audio
  const handlePlayAudio = (text: string, id: string) => {
    setPlayingAudioId(id);
    playChineseAudio(
      text,
      0.82,
      () => setPlayingAudioId(id),
      () => setPlayingAudioId(null)
    );
  };

  const filteredItems = PRACTICE_ITEMS.filter((item) => item.type === activeTabType);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10" id="writing-section">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-950/70 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
          <PenTool className="w-3.5 h-3.5 text-amber-300" />
          <span>{t.writingBadge}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white font-['Cairo',sans-serif]">
          {t.writingTitle}
        </h2>
        <p className="text-xs sm:text-sm text-stone-400 mt-2 max-w-2xl mx-auto leading-relaxed">
          {t.writingDesc}
        </p>
      </div>

      {/* Main Studio Grid: Left Sidebar & Right Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 Cols): Character & Sentence Selector with Working Audio */}
        <div className="lg:col-span-5 bg-[#140608] rounded-3xl border border-amber-500/25 p-5 shadow-xl space-y-4">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[#0c0304] border border-stone-800">
            <button
              onClick={() => {
                setActiveTabType('character');
                setSelectedItem(PRACTICE_ITEMS[0]);
                setStrokes([]);
                setActiveCharIndex(0);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTabType === 'character'
                  ? 'bg-red-800 text-white shadow border border-amber-400/40'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              {lang === 'ar' ? 'رموز فردية' : 'Characters'}
            </button>

            <button
              onClick={() => {
                setActiveTabType('sentence');
                const firstSentence = PRACTICE_ITEMS.find((i) => i.type === 'sentence') || PRACTICE_ITEMS[0];
                setSelectedItem(firstSentence);
                setStrokes([]);
                setActiveCharIndex(0);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTabType === 'sentence'
                  ? 'bg-red-800 text-white shadow border border-amber-400/40'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              {lang === 'ar' ? 'جمل كاملة' : 'Full Sentences'}
            </button>

            <button
              onClick={() => {
                setActiveTabType('free');
                setShowGuide(false);
                setStrokes([]);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTabType === 'free'
                  ? 'bg-red-800 text-white shadow border border-amber-400/40'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              {t.freehandMode}
            </button>
          </div>

          {/* List of items */}
          {activeTabType !== 'free' ? (
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-stone-800">
              {filteredItems.map((item) => {
                const isSelected = selectedItem.id === item.id;
                const isPlaying = playingAudioId === item.id;

                return (
                  <div
                    key={item.id}
                    className={`w-full p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-gradient-to-r from-red-950/80 to-[#1e0709] border-amber-400 shadow-md ring-1 ring-amber-400/50'
                        : 'bg-[#0e0405] hover:bg-[#19070a] border-stone-800 text-stone-300'
                    }`}
                  >
                    {/* Item Click Area */}
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setStrokes([]);
                        setActiveCharIndex(0);
                      }}
                      className="flex items-center gap-3 flex-1 text-start"
                    >
                      <span className="w-10 h-10 rounded-xl bg-black/60 border border-stone-800 flex items-center justify-center font-['Noto_Serif_SC',serif] font-bold text-xl text-amber-300 shrink-0">
                        {item.hanzi.slice(0, 1)}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="font-['Noto_Serif_SC',serif] font-bold text-base text-white truncate">
                          {item.hanzi}
                        </div>
                        <div className="text-xs text-amber-400 font-mono">
                          {item.pinyin}
                        </div>
                        <div className="text-[11px] text-stone-400 truncate">
                          {lang === 'ar' ? item.meaningAr : item.meaningEn}
                        </div>
                      </div>
                    </button>

                    {/* Audio Speaker Button for every item on the left */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayAudio(item.hanzi, item.id);
                      }}
                      className={`p-2 rounded-xl transition-all border shrink-0 ${
                        isPlaying
                          ? 'bg-amber-500 text-stone-950 border-amber-300 scale-110 shadow'
                          : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border-stone-800'
                      }`}
                      title={lang === 'ar' ? 'استمع للنطق' : 'Listen'}
                    >
                      <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-[#0c0304] border border-stone-800 text-xs text-stone-400 leading-relaxed text-center space-y-2">
              <Sparkles className="w-7 h-7 text-amber-400 mx-auto" />
              <p className="font-bold text-sm text-white">
                {lang === 'ar' ? 'اللوحة التراثية الحرة' : 'Freehand Calligraphy Grid'}
              </p>
              <p>
                {lang === 'ar'
                  ? 'ارسم واكتب أي رمز صيني أو جملة من اختيارك بحرية تامة على شبكة الأرز (米字格) مع أدوات الخطاط الصيني الكاملة.'
                  : 'Practice writing any Chinese characters freely on the traditional rice paper grid with full calligraphy tools.'}
              </p>
            </div>
          )}

          {/* Active Selection Summary Card */}
          {activeTabType !== 'free' && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/60 to-[#180507] border border-amber-500/30 flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-stone-400 block mb-0.5">
                  {lang === 'ar' ? 'المحدد حالياً للرسم:' : 'Active Target:'}
                </span>
                <div className="text-xl font-black text-amber-300 font-['Noto_Serif_SC',serif]">
                  {selectedItem.type === 'sentence'
                    ? showEntireSentenceInBox
                      ? selectedItem.hanzi
                      : `الرمز [${currentDisplayChar}] من الجملة`
                    : selectedItem.hanzi}
                </div>
                <div className="text-xs text-stone-300 font-medium">
                  {lang === 'ar' ? selectedItem.meaningAr : selectedItem.meaningEn}
                </div>
              </div>

              <button
                onClick={() => handlePlayAudio(selectedItem.hanzi, 'active-target')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 text-xs font-bold border border-amber-400/40 transition-all shadow shrink-0"
              >
                <Volume2
                  className={`w-4 h-4 ${
                    playingAudioId === 'active-target' ? 'animate-bounce text-amber-400' : ''
                  }`}
                />
                <span>{t.listen}</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Column (7 Cols): Master Writing Canvas with Perfect Square Grid */}
        <div className="lg:col-span-7 bg-[#140608] rounded-3xl border border-amber-500/25 p-5 sm:p-6 shadow-xl space-y-4">
          {/* Sentence Character Strip: Enables drawing every character in the full square */}
          {selectedItem.type === 'sentence' && (
            <div className="p-3 rounded-2xl bg-[#0c0304] border border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'اختر رمزاً من الجملة للرسم في المربع:' : 'Select character from sentence:'}</span>
                </span>
                <button
                  onClick={() => setShowEntireSentenceInBox(!showEntireSentenceInBox)}
                  className="text-[11px] underline text-stone-400 hover:text-amber-300"
                >
                  {showEntireSentenceInBox
                    ? lang === 'ar'
                      ? 'رسم رمز برمز (موصى به)'
                      : 'Char by Char (Recommended)'
                    : lang === 'ar'
                    ? 'عرض الجملة كاملة بالمربع'
                    : 'Show Full Sentence'}
                </button>
              </div>

              {!showEntireSentenceInBox && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {sentenceChars.map((ch, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveCharIndex(idx);
                        setStrokes([]);
                      }}
                      className={`w-9 h-9 rounded-xl font-['Noto_Serif_SC',serif] font-bold text-lg transition-all border ${
                        activeCharIndex === idx
                          ? 'bg-amber-500 text-stone-950 border-white scale-110 shadow-md ring-2 ring-amber-400'
                          : 'bg-[#180608] text-stone-300 border-stone-800 hover:border-amber-400/50'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Controls Ribbon (Clear, Undo, Guide Toggle, Download) */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-800">
            {/* Guide Outline Toggle */}
            {activeTabType !== 'free' && (
              <button
                onClick={() => setShowGuide(!showGuide)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  showGuide
                    ? 'bg-amber-950/80 text-amber-300 border-amber-400/50 shadow'
                    : 'bg-stone-900 text-stone-400 border-stone-800'
                }`}
              >
                {showGuide ? <Eye className="w-3.5 h-3.5 text-amber-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{t.traceGuide}</span>
              </button>
            )}

            <div className="flex items-center gap-1.5 ml-auto">
              {/* Undo */}
              <button
                onClick={handleUndo}
                disabled={strokes.length === 0}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-bold border border-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                title={t.undoStroke}
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">{t.undoStroke}</span>
              </button>

              {/* Clear */}
              <button
                onClick={handleClear}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-red-950/80 text-stone-300 hover:text-red-300 text-xs font-bold border border-stone-800 transition-all"
                title={t.clearCanvas}
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">{t.clearCanvas}</span>
              </button>

              {/* Download */}
              <button
                onClick={handleSave}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-700 hover:to-amber-600 text-white text-xs font-bold border border-amber-400/40 shadow transition-all hover:scale-105"
                title={t.saveArtwork}
              >
                <Download className="w-3.5 h-3.5 text-amber-200" />
                <span>{t.saveArtwork}</span>
              </button>
            </div>
          </div>

          {/* Authentic Calligraphy Canvas (Exact Classical 米字格 Square) */}
          <div className="relative w-full aspect-square max-w-[540px] mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-[#24080a] bg-[#fefce8] touch-none select-none">
            <canvas
              ref={canvasRef}
              width={CANVAS_LOGICAL_SIZE}
              height={CANVAS_LOGICAL_SIZE}
              className="w-full h-full cursor-crosshair touch-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            />

            {/* Corner Calligraphy Seal */}
            <div className="absolute bottom-3 right-3 pointer-events-none opacity-60">
              <div className="w-8 h-8 rounded-lg border-2 border-red-700 text-red-700 font-['Noto_Serif_SC',serif] font-black text-sm flex items-center justify-center shadow-sm">
                墨
              </div>
            </div>
          </div>

          {/* Tools Bar: Ink Color & Brush Thickness */}
          <div className="p-3.5 rounded-2xl bg-[#0c0304] border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Color Swatches */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-stone-400 font-semibold">{t.inkColor}:</span>
              <div className="flex items-center gap-1.5">
                {INK_COLORS.map((c) => (
                  <button
                    key={c.color}
                    onClick={() => setBrushColor(c.color)}
                    className={`w-6 h-6 rounded-full transition-transform border ${
                      brushColor === c.color
                        ? 'scale-125 ring-2 ring-amber-400 border-white'
                        : 'border-stone-700 hover:scale-110'
                    }`}
                    style={{ backgroundColor: c.color }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Brush Sizes */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-stone-400 font-semibold">{t.brushSize}:</span>
              <div className="flex items-center gap-1">
                {BRUSH_SIZES.map((b) => (
                  <button
                    key={b.size}
                    onClick={() => setBrushSize(b.size)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                      brushSize === b.size
                        ? 'bg-amber-500 text-stone-950 border-amber-300'
                        : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-white'
                    }`}
                  >
                    {lang === 'ar' ? b.label : b.labelEn}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
