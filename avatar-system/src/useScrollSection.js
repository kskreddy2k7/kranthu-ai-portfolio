import { useState, useEffect } from 'react';

const SECTIONS = [
  {
    id: 'hero',
    xPercent: 82,
    speech: "Hello. I'm KSKR, your intelligent guide. This portfolio belongs to Kata Sai Kranthu Reddy — a passionate Full Stack Developer and AI Engineer. Let me walk you through his work.",
  },
  {
    id: 'about',
    xPercent: 15,
    speech: "Kranthu is a Computer Science student at SRM University, specializing in Artificial Intelligence. He builds real-world products — from AI voice systems to enterprise web platforms. A driven engineer with a clear vision.",
  },
  {
    id: 'skills',
    xPercent: 15,
    speech: "His technical stack spans Python, Flask, React, and Java — backed by hands-on experience in Machine Learning, Natural Language Processing, and mobile development with Flutter. He ships solutions, not just code.",
  },
  {
    id: 'experience',
    xPercent: 80,
    speech: "Every project and learning milestone has sharpened his edge. From academic coursework to independently deployed systems, Kranthu consistently applies theory to real engineering challenges.",
  },
  {
    id: 'projects',
    xPercent: 50,
    speech: "His projects solve real problems. An AI Resume Screener, an Offline Voice Operating System, an intelligent Auto-Correct engine, and a full enterprise web platform — each built with purpose and precision.",
  },
  {
    id: 'chatbot',
    xPercent: 15,
    speech: "This is the interactive module. You can ask questions, and I'll respond with information about Kranthu's background, skills, and projects. Go ahead — I'm listening.",
  },
  {
    id: 'contact',
    xPercent: 78,
    speech: "Ready to connect? You can reach Kranthu via GitHub, LinkedIn, or email for collaboration, internships, or technical discussions. The contact details are right here.",
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
