export type Language = 'en' | 'ar';

export interface VocabWord {
  id: string;
  hanzi: string;
  pinyin: string;
  arabic: string;
  english?: string;
  exampleSentence?: {
    hanzi: string;
    pinyin: string;
    arabic: string;
    english?: string;
  };
}

export interface SentenceItem {
  id: string;
  speaker?: string;
  hanzi: string;
  pinyin: string;
  arabic: string;
  english?: string;
  notes?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  questionEnglish?: string;
  hanziPrompt?: string;
  pinyinPrompt?: string;
  options: string[];
  optionsEnglish?: string[];
  correctIndex: number;
  explanation: string;
  explanationEnglish?: string;
}

export interface Lesson {
  id: number;
  lessonNumber: number;
  unitId: number;
  titleArabic: string;
  titleEnglish?: string;
  titleHanzi: string;
  titlePinyin: string;
  description: string;
  descriptionEnglish?: string;
  keywords?: string[];
  vocabulary: VocabWord[];
  dialogue: SentenceItem[];
  culturalGrammarTip: {
    title: string;
    titleEnglish?: string;
    content: string;
    contentEnglish?: string;
  };
  quiz?: QuizQuestion[];
}

export interface Unit {
  id: number;
  unitNumber: number;
  titleArabic: string;
  titleEnglish: string;
  titleHanzi: string;
  titlePinyin: string;
  themeColor: string;
  badge?: string;
  description: string;
  descriptionEnglish?: string;
  lessons: Lesson[];
}

export interface CultureTopic {
  id: string;
  titleArabic: string;
  titleEnglish: string;
  titleHanzi: string;
  titlePinyin: string;
  category: string;
  categoryEnglish?: string;
  summary: string;
  summaryEnglish?: string;
  fullStory: string;
  fullStoryEnglish?: string;
  funFacts: string[];
  funFactsEnglish?: string[];
  chineseWisdom?: {
    hanzi: string;
    pinyin: string;
    arabic: string;
    english?: string;
  };
  iconName: string;
  imageUrl?: string;
}

export interface UserVisitorEntry {
  id: string;
  name: string;
  learnedSentence: string;
  note?: string;
  date: string;
}
