import { useRef, useCallback } from 'react';

export function useSpeech() {
  const utteranceRef = useRef(null);
  const lastTextRef  = useRef('');

  // Helper to strip HTML and Emojis for clean speech
  const cleanText = (text) => {
    if (!text) return '';
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu, '') // Remove Emojis
      .replace(/\s+/g, ' ') // Collapse whitespace
      .trim();
  };

  const speak = useCallback((text, onEnd) => {
    if (!window.speechSynthesis) return;
    
    // Resume to bypass Chrome/Safari auto-pause bug
    window.speechSynthesis.resume();
    window.speechSynthesis.cancel();

    const utterance   = new SpeechSynthesisUtterance(cleanText(text));
    utterance.rate    = 0.95;   // Slightly faster than before but still robotic
    utterance.pitch   = 1.9;    // Peppy robotic pitch
    utterance.volume  = 1.0;
    utterance.lang    = 'en-US';

    if (onEnd) {
      utterance.onend = onEnd;
    }

    function pickVoice() {
      const voices = window.speechSynthesis.getVoices();
      return (
        voices.find(v => v.name.includes('Google US English Male')) ||
        voices.find(v => v.name.includes('Microsoft David')) ||
        voices.find(v => v.name.includes('Daniel')) ||
        voices.find(v => v.name.includes('Male') && v.lang.startsWith('en')) ||
        voices.find(v => v.name.includes('Google')) ||
        voices.find(v => v.lang.startsWith('en'))
      );
    }

    const triggerSpeak = () => {
      const v = pickVoice();
      if (v) utterance.voice = v;
      window.speechSynthesis.speak(utterance);
      window.speechSynthesis.resume();
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      triggerSpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        triggerSpeak();
        window.speechSynthesis.onvoiceschanged = null;
      };
    }

    utteranceRef.current = utterance;
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    lastTextRef.current = '';
  }, []);

  return { speak, stop };
}
