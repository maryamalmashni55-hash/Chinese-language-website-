/**
 * Bulletproof Chinese Mandarin Speech Audio Engine
 * Handles SpeechSynthesis quirks, voice detection, garbage collection prevention,
 * and reliable audio playback across all browsers and devices.
 */

let voicesLoaded = false;
let chineseVoice: SpeechSynthesisVoice | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let currentAudio: HTMLAudioElement | null = null;

function detectChineseVoice(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    voicesLoaded = true;
    // Prefer mainland Chinese Mandarin (zh-CN)
    chineseVoice =
      voices.find((v) => v.lang === 'zh-CN') ||
      voices.find((v) => v.lang === 'zh_CN') ||
      voices.find((v) => v.lang.startsWith('zh')) ||
      voices.find((v) => v.name.toLowerCase().includes('chinese') || v.name.toLowerCase().includes('mandarin')) ||
      null;
  }
}

// Initialize voices listener
if (typeof window !== 'undefined' && window.speechSynthesis) {
  detectChineseVoice();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = detectChineseVoice;
  }
}

/**
 * Play standard Chinese pronunciation with native speech synthesis
 * and automatic fallback
 */
export function playChineseAudio(
  text: string,
  rate: number = 0.85,
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined') return false;

  stopChineseAudio();

  // Clean text from symbols for audio
  const cleanText = text.replace(/[\(\)（）•\d\.\-—\/]/g, ' ').trim();
  if (!cleanText) {
    if (onEnd) onEnd();
    return false;
  }

  // 1. Try browser SpeechSynthesis
  if (window.speechSynthesis) {
    try {
      if (!voicesLoaded) {
        detectChineseVoice();
      }

      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      currentUtterance = utterance; // Keep global reference to avoid GC

      utterance.lang = 'zh-CN';
      utterance.rate = rate; // 0.85 gives crisp, clear pronunciation
      utterance.pitch = 1.0;

      if (chineseVoice) {
        utterance.voice = chineseVoice;
      }

      let started = false;

      utterance.onstart = () => {
        started = true;
        if (onStart) onStart();
      };

      utterance.onend = () => {
        currentUtterance = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error, falling back to audio stream:', e);
        currentUtterance = null;
        // Fallback to audio element
        playAudioFallback(cleanText, onStart, onEnd);
      };

      // Watchdog: If speechSynthesis didn't fire start within 350ms, fallback to audio element
      const timeoutId = window.setTimeout(() => {
        if (!started && !window.speechSynthesis.speaking) {
          playAudioFallback(cleanText, onStart, onEnd);
        }
      }, 400);

      const originalOnStart = utterance.onstart;
      utterance.onstart = (ev) => {
        window.clearTimeout(timeoutId);
        if (originalOnStart) originalOnStart.call(utterance, ev);
      };

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err) {
      console.warn('SpeechSynthesis failed, trying audio fallback:', err);
    }
  }

  // 2. Direct fallback
  return playAudioFallback(cleanText, onStart, onEnd);
}

function playAudioFallback(
  text: string,
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  try {
    const encoded = encodeURIComponent(text.slice(0, 100));
    // High-quality Google TTS audio stream endpoint
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=zh-CN&client=tw-ob&q=${encoded}`;

    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }

    const audio = new Audio(url);
    currentAudio = audio;

    audio.onplay = () => {
      if (onStart) onStart();
    };

    audio.onended = () => {
      currentAudio = null;
      if (onEnd) onEnd();
    };

    audio.onerror = () => {
      currentAudio = null;
      if (onEnd) onEnd();
    };

    audio.play().catch((err) => {
      console.warn('Audio fallback play prevented:', err);
      if (onEnd) onEnd();
    });

    return true;
  } catch (e) {
    console.error('Audio fallback failed entirely:', e);
    if (onEnd) onEnd();
    return false;
  }
}

export function stopChineseAudio(): void {
  if (typeof window !== 'undefined') {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    currentUtterance = null;
  }
}
