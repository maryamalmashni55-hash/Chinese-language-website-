/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CurriculumView } from './components/CurriculumView';
import { PinyinGuide } from './components/PinyinGuide';
import { ChineseWritingCanvas } from './components/ChineseWritingCanvas';
import { CultureSection } from './components/CultureSection';
import { VisitorsSection } from './components/VisitorsSection';
import { MusicPlayer } from './components/MusicPlayer';
import { Footer } from './components/Footer';
import { Language } from './types';

export default function App() {
  // Default primary language is English
  const [lang, setLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<string>('curriculum');
  const [selectedLessonId, setSelectedLessonId] = useState<number>(1);

  // Sync document direction and language attribute
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const handleSelectLesson = (lessonId: number) => {
    setSelectedLessonId(lessonId);
    setActiveTab('curriculum');
    const elem = document.getElementById('curriculum-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartCurriculum = () => {
    setActiveTab('curriculum');
    const elem = document.getElementById('curriculum-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreCulture = () => {
    setActiveTab('culture');
    const elem = document.getElementById('culture-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExplorePinyin = () => {
    setActiveTab('pinyin');
    const elem = document.getElementById('pinyin-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreWriting = () => {
    setActiveTab('writing');
    const elem = document.getElementById('writing-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`min-h-screen bg-[#080203] text-stone-100 flex flex-col ${
        lang === 'ar' ? "font-['Cairo',sans-serif]" : "font-['Plus_Jakarta_Sans',sans-serif]"
      }`}
    >
      {/* Top Header with 1-Click Language Switcher (Translate Button) */}
      <Header
        lang={lang}
        onToggleLang={toggleLanguage}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Professional Master Hero Section with Title & Student/Teacher Names */}
      <HeroBanner
        lang={lang}
        onStartCurriculum={handleStartCurriculum}
        onExploreCulture={handleExploreCulture}
        onExplorePinyin={handleExplorePinyin}
        onExploreWriting={handleExploreWriting}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'curriculum' && (
          <CurriculumView
            lang={lang}
            selectedLessonId={selectedLessonId}
            onSelectLesson={handleSelectLesson}
          />
        )}

        {activeTab === 'pinyin' && <PinyinGuide lang={lang} />}

        {activeTab === 'writing' && <ChineseWritingCanvas lang={lang} />}

        {activeTab === 'culture' && <CultureSection lang={lang} />}

        {activeTab === 'visitors' && <VisitorsSection lang={lang} />}
      </main>

      {/* Controllable Minimal Music Player (Starts paused, user-controlled) */}
      <MusicPlayer lang={lang} />

      {/* Footer */}
      <Footer
        lang={lang}
        onSelectTab={setActiveTab}
        onSelectLesson={handleSelectLesson}
      />
    </div>
  );
}
