import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';
import CuteRobot from './CuteRobot';
import { useScrollSection } from './useScrollSection';
import { useSpeech } from './useSpeech';

// ── Native JS Synthetic UI Blip ───────────────────────────────────────────
function playSciFiBlip() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch(e) { } // Ignore if browser blocks autoplay
}

// ── Kranthu Q&A knowledge base ────────────────────────────────────────────
const QA = [
  { keys: ['who are you','yourself','introduce','kranthu','about you'],
    answer: `I represent Kata Sai Kranthu Reddy — a Computer Science student at SRM University, Batch 2025 to 2029, specializing in AI and Machine Learning. He is a Full Stack Developer who builds intelligent, real-world systems with a focus on impact.` },
  { keys: ['skill','tech','stack','language','code','know','good at'],
    answer: `Kranthu's technical skills include Python, Flask, JavaScript, React, and Java. He applies these in building Machine Learning models, NLP systems, and mobile applications using Flutter and Android Studio.` },
  { keys: ['project','built','work','create','made','portfolio'],
    answer: `His notable projects include: Sri Sai Traders, a complete enterprise web system. An AI Resume Screener for smart candidate filtering. An Offline AI Voice Operating System. And a Smart Auto-Correct Keyboard driven by Natural Language Processing.` },
  { keys: ['contact','reach','hire','linkedin','github','email','internship'],
    answer: `You can connect with Kranthu on GitHub at github dot com slash kskreddy2k7, or on LinkedIn as kata-sai-kranthu-reddy. He is actively open to internships and collaborative opportunities in AI and software development.` },
  { keys: ['university','college','study','education','degree','srm','year'],
    answer: `Kranthu is a first-year Computer Science student at SRM University, Kattankulathur, pursuing a specialization in Artificial Intelligence and Machine Learning. His expected graduation year is 2029.` },
  { keys: ['goal','dream','aspire','future','plan','job'],
    answer: `Kranthu's goal is to engineer intelligent systems that bridge the gap between human creativity and advanced technology. He aims to work on products that scale and matter.` },
  { keys: ['hello','hi','hey','greet','namaste'],
    answer: `Hello! I'm KSKR, Kranthu's AI guide. Ask me anything about his skills, projects, education, or how to get in touch.` },
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
function SpeechBubble({ text, visible, sectionXPercent, speaking }) {
  if (!visible) return null;
  
  const xPos = sectionXPercent ?? 50;
  
  return (
    <div style={{
      position: 'fixed',
      top: window.innerWidth < 768 ? '10%' : '25%',
      right: window.innerWidth < 768 ? '5%' : '1%',
      transform: 'none',
      width: window.innerWidth < 768 ? 'min(90vw, 320px)' : '300px',
      background: 'rgba(10, 10, 18, 0.65)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      borderRadius: '16px',
      padding: '16px 20px',
      fontFamily: '"Inter", sans-serif',
      fontSize: '14px',
      lineHeight: '1.6',
      color: '#f8fafc',
      fontWeight: 400,
      textAlign: 'center',
      boxShadow: speaking ? '0 0 35px rgba(0, 242, 255, 0.25), 0 10px 40px rgba(0,0,0,0.5)' : '0 10px 40px rgba(0,0,0,0.4)',
      zIndex: 999999,
      pointerEvents: 'none',
      animation: 'kavBubbleSlide 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
      transition: 'box-shadow 0.3s ease',
    }}>
      <div style={{ fontSize: '11px', letterSpacing: '1px', color: '#00f3ff', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase' }}>
        {speaking ? <span style={{display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#00f3ff', marginRight: '6px', animation: 'kavPulse 1.5s infinite'}}></span> : null}
        AI Assistant
      </div>
      {text}
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
        from { opacity: 0; transform: translateX(-15px) scale(0.95); }
        to   { opacity: 1; transform: translateX(0) scale(1); }
      }
      @keyframes kavPulse {
        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0,243,255,0.7); }
        70% { transform: scale(1.1); box-shadow: 0 0 0 8px rgba(0,243,255,0); }
        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0,243,255,0); }
      }
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

    return () => {
      ob.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, []);

  // ── Welcome Speech fires AFTER home page loads ──
  useEffect(() => {
    if (!booted) return;
    if (localStorage.getItem('kskr_sound_enabled') !== 'true') return;

    const welcomeMsg = "Welcome. I am KSKR, an AI assistant built into this portfolio. I'll guide you as you explore Kranthu's work, projects, and capabilities. Let's get started.";

    const t = setTimeout(() => {
      setBubbleText(welcomeMsg);
      setBubbleVis(true);
      if (!muted) playSciFiBlip();
      speak(welcomeMsg, () => {
        setSpeaking(false);
        setBubbleVis(false);
      });
      setSpeaking(true);
    }, 800); // small delay after home page appears

    return () => clearTimeout(t);
  }, [booted]);

  // Hint logic removed

  // Section change → speak + bubble
  useEffect(() => {
    if (!section) return;
    const text = section.speech;
    setBubbleText(text);
    setBubbleVis(true);
    if (!muted) playSciFiBlip();
    
    clearTimeout(bubbleTimer.current);

    if (!muted) {
      setSpeaking(true);
      speak(text, () => {
        setSpeaking(false);
        bubbleTimer.current = setTimeout(() => setBubbleVis(false), 2000);
      });
    } else {
      setSpeaking(true);
      bubbleTimer.current = setTimeout(() => {
        setSpeaking(false);
        setBubbleVis(false);
      }, 4000);
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

      <SpeechBubble text={bubbleText} visible={bubbleVis} sectionXPercent={xPct} speaking={speaking} />
    </>
  );
}
