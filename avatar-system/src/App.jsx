import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';
import CuteRobot from './CuteRobot';
import { useScrollSection } from './useScrollSection';
import { useSpeech } from './useSpeech';

// ── Kranthu Q&A knowledge base ────────────────────────────────────────────
const QA = [
  { keys: ['who are you','yourself','introduce','kranthu','about you'],
    answer: `Hi! I'm Kata Sai Kranthu Reddy — an aspiring Full Stack Developer and AI enthusiast. I'm studying B.Tech CS with AI and ML at SRM University, batch 2025 to 2029. I love building real-world apps!` },
  { keys: ['skill','tech','stack','language','code','know','good at'],
    answer: `I'm skilled in Python, Flask, HTML, CSS, JavaScript, Java, SQL, Machine Learning, NLP, and Git. Both frontend and backend, with growing AI expertise!` },
  { keys: ['project','built','work','create','made','portfolio'],
    answer: `I've built: Sri Sai Traders (live business site), AI Resume Screener (NLP), AI Voice OS, Smart Auto-Correct Keyboard, Quiz AI App, and this Portfolio OS itself!` },
  { keys: ['contact','reach','hire','linkedin','github','email','internship'],
    answer: `Find me on GitHub at github.com/kskreddy2k7 and LinkedIn at kata-sai-kranthu-reddy. I'm actively looking for internship opportunities!` },
  { keys: ['university','college','study','education','degree','srm','year'],
    answer: `I'm a first year B.Tech student at SRM University, Kattankulathur, specializing in CS with Artificial Intelligence and Machine Learning. Graduating 2029.` },
  { keys: ['goal','dream','aspire','future','plan','job'],
    answer: `My goal is to fuse human creativity with machine intelligence, land a meaningful internship, and grow into a senior Full Stack Developer. Always learning!` },
  { keys: ['hello','hi','hey','greet','namaste'],
    answer: `Hey there! I'm Kranthu — your interactive portfolio guide. Ask me about my skills, projects, education, or how to reach me!` },
];

async function getAIResponse(input) {
  try {
    const res = await fetch('/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input })
    });
    const data = await res.json();
    return data.response || "My neural links are flickering. Please try again!";
  } catch (err) {
    return "Connection to mainframe lost. I'm operating on local backup logic.";
  }
}

// ── Camera rig — gently follows avatar ───────────────────────────────────
function CameraRig({ sectionXPercent }) {
  const { camera } = useThree();
  const isMobile = window.innerWidth < 768;
  useFrame((_, delta) => {
    // Narrower movement range on mobile
    const range = isMobile ? 0.4 : 0.8;
    const targetX = ((sectionXPercent - 50) / 50) * range;
    const targetY = 1.1;
    const targetZ = isMobile ? 7.2 : 5.2;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, delta * 2.5);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, delta * 2.5);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, delta * 2.5);
    camera.lookAt(camera.position.x * 0.4, 0.85, 0);
  });
  return null;
}

// ── Minimal placeholder while JS bundles ──────────────────────────────────
function AvatarPlaceholder() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = Math.sin(clock.elapsedTime * 2) * 0.1;
  });
  return (
    <mesh ref={ref} position={[1.8, 0, 0]}>
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshStandardMaterial color="#00ccff" emissive="#00ccff" emissiveIntensity={0.5} />
    </mesh>
  );
}

// ── Speech Bubble ─────────────────────────────────────────────────────────
function SpeechBubble({ text, visible, sectionXPercent }) {
  if (!visible) return null;
  
  const xPos = sectionXPercent ?? 50;
  
  return (
    <div style={{
      position: 'fixed',
      bottom: window.innerWidth < 768 ? '160px' : '280px',
      left: window.innerWidth < 768 ? '50%' : `${xPos}%`,
      transform: 'translateX(-50%)',
      width: window.innerWidth < 768 ? 'min(90vw, 320px)' : '260px',
      background: 'rgba(2, 2, 10, 0.98)',
      backdropFilter: 'blur(12px)',
      border: '2px solid rgba(0, 242, 255, 0.6)',
      borderImage: 'linear-gradient(to bottom, #00f3ff, #b53cff) 1',
      borderRadius: '12px',
      padding: '14px 18px',
      fontFamily: '"Outfit", sans-serif',
      fontSize: '14px',
      lineHeight: '1.5',
      color: '#ffffff',
      fontWeight: 500,
      textAlign: 'center',
      boxShadow: '0 0 30px rgba(0, 242, 255, 0.2), inset 0 0 15px rgba(181, 60, 255, 0.1)',
      zIndex: 999999,
      pointerEvents: 'none',
      animation: 'kavBubbleSlide 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    }}>
      <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#00f3ff', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', textShadow: '0 0 5px rgba(0, 242, 255, 0.5)' }}>
        🤖 KSKR_SYSTEMS_V2.5
      </div>
      {text}
      <div style={{
        position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)',
        width: '0', height: '0',
        borderLeft: '10px solid transparent', borderRight: '10px solid transparent',
        borderTop: '10px solid #b53cff', // matches the bottom of the gradient
      }} />
    </div>
  );
}

// Chat logic removed as per user request to restore screen interaction.

// MuteBtn and Click Hint removed to prevent blocking screen

// Click Zone removed to restore global website interaction

// ── CSS keyframes injector ────────────────────────────────────────────────
function InjectStyles() {
  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = `
      @keyframes kavBubbleSlide {
        from { opacity: 0; transform: translateX(-50%) translateY(20px) scale(0.9); }
        to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
      }
      @keyframes kavPulse {
        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,0,85,0.7); }
        70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(255,0,85,0); }
        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,0,85,0); }
      }
      @keyframes kavDotPulse {
        0%, 100% { transform: scale(1); opacity: 0.5; }
        50% { transform: scale(1.5); opacity: 1; }
      }
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
    `;
    document.head.appendChild(s);
  }, []);
  return null;
}

// ── Main App ──────────────────────────────────────────────────────────────
export default function App() {
  const section         = useScrollSection();
  const { speak, stop } = useSpeech();
  
  // Unified sound control from Navbar
  const [muted, setMuted] = useState(() => {
    return localStorage.getItem('kskr_sound_enabled') !== 'true';
  });
  const [speaking, setSpeaking]     = useState(false);
  const [bubbleText, setBubbleText] = useState('');
  const [bubbleVis, setBubbleVis]   = useState(false);
  const [booted, setBooted]         = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const bubbleTimer = useRef(null);
  const speakTimer  = useRef(null);
  
  // Listen for global sound toggle
  useEffect(() => {
    const handleSoundChange = (e) => {
      const enabled = e.detail?.enabled;
      setMuted(!enabled);
      if (!enabled) {
        stop();
        setSpeaking(false);
        setBubbleVis(false);
      }
    };
    window.addEventListener('kskr_sound_change', handleSoundChange);
    return () => window.removeEventListener('kskr_sound_change', handleSoundChange);
  }, [stop]);

  // Handle scroll opacity for better "readability"
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (y > 300) {
        setScrollOpacity(Math.max(0.3, 1 - (y - 300) / 400));
      } else {
        setScrollOpacity(1);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Wait for Boot Sequence Full Dismissal ──
  useEffect(() => {
    const loader = document.getElementById('loader-screen');
    
    // Fallback: If loader detection fails, boot anyway after 5s
    const fallbackTimer = setTimeout(() => setBooted(true), 5000);

    if (!loader || (getComputedStyle(loader).display === 'none')) {
      setBooted(true);
      clearTimeout(fallbackTimer);
      return;
    }

    const ob = new MutationObserver(() => {
      if (loader.style.display === 'none' || getComputedStyle(loader).display === 'none') {
        setBooted(true);
        clearTimeout(fallbackTimer);
        ob.disconnect();
      }
    });

    ob.observe(loader, { attributes: true, attributeFilter: ['style', 'class'] });
    
    // Welcome speech
    const welcomeMsg = "Welcome to the AI Control Room. I am your system assistant. I am currently monitoring Kranthu's neural portfolio projects. Use the navigation bar above or scroll down to explore the mainframe.";
    
    if (localStorage.getItem('kskr_sound_enabled') === 'true') {
      setTimeout(() => {
        setBubbleText(welcomeMsg);
        setBubbleVis(true);
        speak(welcomeMsg, () => {
          setSpeaking(false);
          setTimeout(() => setBubbleVis(false), 5000);
        });
        setSpeaking(true);
      }, 3500); // after boot chime
    }

    return () => {
      ob.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Hint logic removed
  useEffect(() => {
    if (!booted) return;
  }, [booted]);

  // Section change → speak + bubble
  useEffect(() => {
    if (!section) return;
    const text = section.speech;
    setBubbleText(text);
    setBubbleVis(true);
    clearTimeout(bubbleTimer.current);
    bubbleTimer.current = setTimeout(() => setBubbleVis(false), 6000);

    if (!muted) {
      setSpeaking(true);
      speak(text, () => {
        setSpeaking(false);
        setBubbleVis(false);
      });
    } else {
      // If muted, still show bubble for 6s
      clearTimeout(bubbleTimer.current);
      bubbleTimer.current = setTimeout(() => setBubbleVis(false), 6000);
    }
  }, [section?.id]);

  // Interaction functions removed to prevent screen blockage

  const xPct = section?.xPercent ?? 82;

  if (!booted) return null;

  return (
    <>
      <InjectStyles />

      <div style={{ 
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, // Base layer for Canvas
        opacity: scrollOpacity, transition: 'opacity 0.4s ease'
      }}>
        <Canvas
          camera={{ position: [0, 1.1, 5.2], fov: window.innerWidth < 768 ? 45 : 38 }}
          gl={{ alpha: true, antialias: true }}
          style={{ background: 'transparent', width: '100%', height: '100%', pointerEvents: 'none' }}
          dpr={[1, 1.5]}
        >
          <ambientLight intensity={0.75} />
          <directionalLight position={[4, 6, 5]} intensity={1.3} color="#ffffff" />
          <pointLight position={[-4, 3, 3]} intensity={1.0} color="#00f3ff" />
          <pointLight position={[3, -1, 2]}  intensity={0.5} color="#b53cff" />

          <CameraRig sectionXPercent={xPct} />

          <Suspense fallback={<AvatarPlaceholder />}>
            <CuteRobot
              sectionId={section?.id}
              speaking={speaking}
              scale={window.innerWidth < 768 ? 0.75 : 1}
            />
            <Environment preset="city" />
          </Suspense>

          <AdaptiveDpr pixelated />
        </Canvas>
      </div>

      <SpeechBubble text={bubbleText} visible={bubbleVis} sectionXPercent={xPct} />
    </>
  );
}
