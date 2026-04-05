import { useRef, useCallback, useEffect } from 'react';

// ── Mobile-safe Speech Synthesis ─────────────────────────────────────────────
//
// Mobile rules:
//  1. iOS Safari: speech MUST be triggered inside a user-gesture handler.
//     We "unlock" the API on first user interaction with a silent utterance.
//  2. iOS pauses synthesis after ~15s of silence → keepAlive ping needed.
//  3. Android Chrome voice list loads asynchronously → use onvoiceschanged.
//  4. en-GB voices are rare on mobile → fall back gracefully to any English.

let unlocked = false;

function unlockSpeech() {
  if (unlocked || !window.speechSynthesis) return;
  // Speak a zero-length utterance to warm up the API on mobile
  const u = new SpeechSynthesisUtterance('');
  u.volume = 0;
  window.speechSynthesis.speak(u);
  unlocked = true;
}

// Unlock on any first touch/click across the page
if (typeof window !== 'undefined') {
  const handler = () => { unlockSpeech(); };
  window.addEventListener('touchstart', handler, { once: true, passive: true });
  window.addEventListener('click',      handler, { once: true, passive: true });
}

export function useSpeech() {
  const utteranceRef = useRef(null);
  const keepAliveRef = useRef(null);

  // iOS keepAlive: resume every 10 seconds to prevent auto-pause
  const startKeepAlive = useCallback(() => {
    clearInterval(keepAliveRef.current);
    keepAliveRef.current = setInterval(() => {
      if (window.speechSynthesis?.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      } else {
        clearInterval(keepAliveRef.current);
      }
    }, 10000);
  }, []);

  const stopKeepAlive = useCallback(() => {
    clearInterval(keepAliveRef.current);
  }, []);

  useEffect(() => () => stopKeepAlive(), [stopKeepAlive]);

  // Strip HTML tags and emoji for clean TTS input
  const cleanText = (text) => {
    if (!text) return '';
    return text
      .replace(/<[^>]*>/g, '')
      .replace(/[\u{1F300}-\u{1FFFF}]/gu, '')
      .replace(/[^\x00-\x7F]/g, '')   // strip any remaining non-ASCII
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Pick best available MALE English voice, mobile-aware
  function pickVoice() {
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;

    // Names known to be female — explicitly exclude these
    const femaleNames = ['samantha','victoria','karen','moira','fiona','tessa',
      'veena','ava','allison','susan','zoe','nicky','sara','ellen','alice',
      'amelie','anna','kyoko','female','woman','girl','siri'];

    function isFemale(v) {
      const n = v.name.toLowerCase();
      return femaleNames.some(f => n.includes(f));
    }

    const enVoices    = voices.filter(v => v.lang.startsWith('en'));
    const maleVoices  = enVoices.filter(v => !isFemale(v));

    return (
      voices.find(v => v.name === 'Google UK English Male')    ||
      voices.find(v => v.name === 'Google US English Male')    ||
      voices.find(v => v.name === 'Google हिन्दी' && false)    || // skip Hindi
      voices.find(v => v.name.includes('Microsoft Mark'))      ||
      voices.find(v => v.name.includes('Microsoft David'))     ||
      voices.find(v => v.name.includes('Microsoft Guy'))       ||
      voices.find(v => v.name === 'Daniel')                    || // iOS UK Male
      voices.find(v => v.name === 'Alex')                      || // iOS US Male
      voices.find(v => v.name === 'Fred')                      || // iOS Male
      voices.find(v => v.name === 'Tom')                       ||
      maleVoices.find(v => v.lang === 'en-US')                 ||
      maleVoices.find(v => v.lang === 'en-GB')                 ||
      maleVoices.find(v => v.lang === 'en-IN')                 ||
      maleVoices[0]                                            ||
      enVoices.find(v => v.lang === 'en-US')                   ||
      enVoices[0]
    );
  }

  const speak = useCallback((text, onEnd) => {
    if (!window.speechSynthesis) return;

    // Cancel any current speech
    window.speechSynthesis.cancel();
    stopKeepAlive();

    const cleaned = cleanText(text);
    if (!cleaned) return;

    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.rate   = 1.08;   // Slightly faster, confident
    utterance.pitch  = 0.9;    // Slightly deeper
    utterance.volume = 1.0;
    utterance.lang   = 'en-GB';

    utterance.onstart = () => startKeepAlive();

    utterance.onend = () => {
      stopKeepAlive();
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      // 'interrupted' is normal when cancel() is called; ignore it
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('[Speech] Error:', e.error);
      }
      stopKeepAlive();
      if (onEnd) onEnd();
    };

    function doSpeak() {
      const v = pickVoice();
      if (v) utterance.voice = v;
      window.speechSynthesis.resume(); // un-pause if iOS paused it
      window.speechSynthesis.speak(utterance);
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      doSpeak();
    } else {
      // Voices not yet loaded (common on Android Chrome & mobile Safari)
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        doSpeak();
      };
      // Failsafe: if onvoiceschanged never fires, try after 1s
      setTimeout(() => {
        if (!utteranceRef.current || window.speechSynthesis.speaking) return;
        doSpeak();
      }, 1000);
    }

    utteranceRef.current = utterance;
  }, [startKeepAlive, stopKeepAlive]);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    stopKeepAlive();
  }, [stopKeepAlive]);

  return { speak, stop };
}
