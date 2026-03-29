import { useState, useEffect } from 'react';

const SECTIONS = [
  {
    id: 'hero',
    xPercent: 82,
    speech: "Hey! 👋 I'm Kranthu's AI companion — ask me anything, I'm right here!",
  },
  {
    id: 'about',
    xPercent: 15,
    speech: "Let me tell you about Kranthu — a passionate developer and AI builder! 😄",
  },
  {
    id: 'skills',
    xPercent: 15,
    speech: "Here's what I'm really good at 💻 — Python, AI, web dev and more!",
  },
  {
    id: 'experience',
    xPercent: 80,
    speech: "This is the journey so far 🎓 — shaping my developer mindset every day!",
  },
  {
    id: 'projects',
    xPercent: 50,
    speech: "These are some powerful builds I've worked on 🚀 — click to explore!",
  },
  {
    id: 'chatbot',
    xPercent: 15,
    speech: "Try the AI terminal — or click me and let's chat directly! 🤖",
  },
  {
    id: 'contact',
    xPercent: 78,
    speech: "I'd love to connect 🤝 — reach out anytime, I'm open to opportunities!",
  },
];

export function useScrollSection() {
  const [current, setCurrent] = useState(SECTIONS[0]);

  useEffect(() => {
    function onScroll() {
      const mid = window.scrollY + window.innerHeight * 0.45;
      let active = SECTIONS[0];
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (mid >= top) active = s;
      }
      setCurrent(prev => (prev.id !== active.id ? active : prev));
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return current;
}
