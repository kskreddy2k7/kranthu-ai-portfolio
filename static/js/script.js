/* ============================================================
   KATA SAI KRANTHU REDDY – Advanced OS logic JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --- 0. SOUND SYSTEMS (PHASE 9) ---
  console.log("Initializing Sound Engine...");
  // Initial state for boot protection
  document.body.classList.add('booting');

  const sounds = {
    click: new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'),
    hover: new Audio('https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3'),
    boot: new Audio('https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3'),
    typing: new Audio('https://assets.mixkit.co/active_storage/sfx/2533/2533-preview.mp3'),
    notify: new Audio('https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3'),
    glitch: new Audio('https://assets.mixkit.co/active_storage/sfx/2567/2567-preview.mp3'),
    ambient: new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3')
  };

  // Setup Ambient Loop (Deep Space Drone)
  if (sounds.ambient) {
    sounds.ambient.loop = true;
    sounds.ambient.volume = 0.4;
  }

  // Force enabled for debugging if not set
  if (localStorage.getItem('kskr_sound_enabled') === null) {
      localStorage.setItem('kskr_sound_enabled', 'true');
  }
  let soundEnabled = localStorage.getItem('kskr_sound_enabled') === 'true';
  const soundToggle = document.getElementById('sound-toggle');
  const soundIcon = document.getElementById('sound-icon');
  const soundText = document.getElementById('sound-text');

  console.log("Sound Elements Found:", { soundToggle, soundIcon, soundText });

  function updateSoundUI() {
    if (soundIcon && soundText) {
      soundIcon.className = soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
      soundText.textContent = soundEnabled ? 'SOUND_ON' : 'SOUND_OFF';
    }
  }

  function playSound(key, volume = 0.3) {
    if (!soundEnabled || !sounds[key]) return;
    try {
      const s = sounds[key].cloneNode();
      s.volume = volume;
      s.play().catch(() => {});
    } catch(e) {}
  }

  if (soundToggle) {
    soundToggle.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent trigger bubbling
      soundEnabled = !soundEnabled;
      localStorage.setItem('kskr_sound_enabled', soundEnabled);
      updateSoundUI();
      
      // Control Ambient loop on toggle
      if (soundEnabled) {
        playSound('click');
        if (document.body.classList.contains('system-active')) {
          sounds.ambient.play().catch(() => {});
        }
      } else {
        sounds.ambient.pause();
      }
      
      // Notify other systems (like the React Avatar)
      console.log("🔊 Global sound changed to:", soundEnabled);
      window.dispatchEvent(new CustomEvent('kskr_sound_change', { detail: { enabled: soundEnabled } }));
    });
  }
  updateSoundUI();

  // --- 1. CUSTOM CURSOR & MAGNETIC PHYSICS ---
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorTrail = document.querySelector('.cursor-trail');
  const magneticEls = document.querySelectorAll('.magnetic-btn, a, button, input, textarea');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let trailX = mouseX;
  let trailY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Immediate dot movement
    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }
  });

  // Smooth trail animation
  function animateTrail() {
    trailX += (mouseX - trailX) * 0.15;
    trailY += (mouseY - trailY) * 0.15;
    if (cursorTrail) {
      cursorTrail.style.left = `${trailX}px`;
      cursorTrail.style.top = `${trailY}px`;
    }
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Hover states & Magnetic effect
  magneticEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
      playSound('hover', 0.15); // Subtle hover sound
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
      gsap.to(el, { x: 0, y: 0, duration: 0.3, ease: 'power2.out' });
    });
    el.addEventListener('click', () => {
      if (!el.id.includes('sound-toggle')) playSound('click');
    });
    
    // Only apply heavy magnetic effect to strictly magnetic-btn class elements
    if(el.classList.contains('magnetic-btn')) {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;
        gsap.to(el, {
          x: distanceX * 0.15,
          y: distanceY * 0.15,
          duration: 0.2,
          ease: 'power2.out'
        });
      });
    }
  });

  // --- 2. MULTI-STAGE BOOT SEQUENCE ---
  const loaderLogsEl = document.getElementById('loader-logs');
  const typingEl = document.getElementById('loader-typing');
  const loaderBar = document.getElementById('loader-bar');
  const enterBtn = document.getElementById('enter-system-btn');
  const loaderScreen = document.getElementById('loader-screen');
  const mainWrapper = document.getElementById('main-content-wrapper');
  
  const bootLogs = [
    "Initializing Kranthu AI System [v2.4.1]...",
    "Mounting neural network core...",
    "Bypassing security protocols...",
    "Establishing secure orbital uplink...",
    "System diagnostic: OK."
  ];

  let logIndex = 0;
  function simulateBootLogs() {
    if (logIndex < bootLogs.length) {
      const p = document.createElement('div');
       p.textContent = `> ${bootLogs[logIndex]}`;
      loaderLogsEl.appendChild(p);
      playSound('typing', 0.2);
      logIndex++;
      setTimeout(simulateBootLogs, Math.random() * 400 + 200);
    } else {
      setTimeout(() => {
        typeFinalAccess();
      }, 500);
    }
  }

  const finalText = "Access Granted.";
  let fIndex = 0;
  function typeFinalAccess() {
    if (fIndex < finalText.length) {
      typingEl.innerHTML += finalText.charAt(fIndex);
      playSound('typing', 0.25);
      fIndex++;
      setTimeout(typeFinalAccess, 60);
    } else {
      setTimeout(() => {
        loaderBar.style.width = '100%';
        playSound('notify', 0.4);
        setTimeout(() => {
          gsap.to(enterBtn, { display: 'inline-block', autoAlpha: 1, y: 0, duration: 0.5 });
        }, 500);
      }, 300);
    }
  }

  // Start Boot Logic with User Interaction (Fix for Mobile Audio)
  const initBtn = document.getElementById('init-system-btn');
  const initContainer = document.getElementById('boot-init-container');

  if (initBtn && initContainer) {
    console.log("🤖 [Portfolio OS] Boot button found, waiting for user click...");
    initBtn.addEventListener('click', () => {
      console.log("🤖 [Portfolio OS] INITIALIZE_SYSTEM clicked.");
      try {
        playSound('click', 0.5);
      } catch(e) { console.warn("Sound play failed", e); }
      
      gsap.to(initContainer, { 
        autoAlpha: 0, 
        height: 0, 
        marginBottom: 0, 
        duration: 0.5,
        onComplete: () => {
          initContainer.style.display = 'none';
          console.log("🤖 [Portfolio OS] Starting boot logs...");
          simulateBootLogs();
        }
      });
    });
  } else {
    console.warn("🤖 [Portfolio OS] Boot elements missing, triggering auto-boot fallback.");
    setTimeout(simulateBootLogs, 300);
  }

  // Global override for stuck users
  window.FORCE_BOOT = () => {
    if (initContainer) initContainer.style.display = 'none';
    simulateBootLogs();
  };

  enterBtn.addEventListener('click', () => {
    playSound('boot', 0.5);
    
    // Immediate state change for reliability
    document.body.style.overflow = 'visible';
    
    gsap.to(loaderScreen, {
      yPercent: -100,
      duration: 1,
      ease: "power3.inOut",
      onComplete: () => {
        document.body.classList.remove('booting');
        loaderScreen.classList.add('hidden'); // This disables pointer-events in CSS
        loaderScreen.style.display = 'none';
        loaderScreen.remove(); // Remove from DOM to be sure
        initHeroAnimations();
      }
    });

    gsap.to(mainWrapper, { 
      autoAlpha: 1, 
      duration: 0.5, 
      delay: 0.2, // Faster entry
      onComplete: () => {
        document.body.classList.add('system-active');
        if (soundEnabled) {
          sounds.ambient.play().catch(() => {});
        }
        mainWrapper.style.height = 'auto';
        mainWrapper.style.minHeight = '100vh';
        mainWrapper.style.overflow = 'visible';
        document.body.style.overflow = 'visible';
        ScrollTrigger.refresh();
      }
    });
  });

  // --- 3. SCROLL PROGRESS & NAVBAR ---
  const scrollBar = document.getElementById('scroll-progress-bar');
  const mainNav = document.getElementById('mainNav');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#mainNav .nav-link');

  window.addEventListener('scroll', () => {
    // Progress Bar
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    if (scrollBar) scrollBar.style.width = `${scrollPercent}%`;

    // Navbar config
    if (scrollTop > 50) mainNav.classList.add('scrolled');
    else mainNav.classList.remove('scrolled');

    // Active state update
    let current = '';
    sections.forEach(sec => {
      const sectionTop = sec.offsetTop - 100;
      if (scrollTop >= sectionTop) current = sec.getAttribute('id');
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href.includes('#' + current)) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // Manual Smooth Scroll Interceptor
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.includes('#')) {
        const id = href.split('#')[1];
        const target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          playSound('click', 0.2);
          const offset = 80; // Navbar offset
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = target.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // --- 4. REAL-TIME CLOCK & HERO DASHBOARD ---
  function updateClock() {
    const clockEl = document.getElementById('live-clock');
    const greetingEl = document.getElementById('dynamic-greeting');
    if (!clockEl || !greetingEl) return;
    
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${hrs}:${mins}:${secs}`;

    const hour = now.getHours();
    let greeting = 'Good Evening,';
    if (hour < 12) greeting = 'Good Morning,';
    else if (hour < 18) greeting = 'Good Afternoon,';
    greetingEl.textContent = greeting;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // --- 5. GSAP ANIMATIONS ---
  gsap.registerPlugin(ScrollTrigger);

  function initHeroAnimations() {
    const tl = gsap.timeline();
    tl.fromTo('.system-status-panel', { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' })
      .fromTo('.hero-avatar-glow', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.5)' }, "-=0.6")
      .fromTo('.hero-greeting', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.6 }, "-=0.5")
      .fromTo('.hero-name', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.4")
      .fromTo('.hero-subtitle', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
      .fromTo('.hero-floating-icons .tech-icon', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, "-=0.2")
      .fromTo('.hero .btn', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.1 }, "-=0.2")
      .fromTo('.hero-scroll-hint', { opacity: 0 }, { opacity: 1, duration: 1 });
  }

  // General Scroll Reveals
  const revealClasses = ['.gs-reveal-up', '.gs-reveal-left', '.gs-reveal-right'];
  revealClasses.forEach(c => {
    gsap.utils.toArray(c).forEach(function(elem) {
      ScrollTrigger.create({
        trigger: elem,
        start: "top 85%",
        onEnter: function() {
          gsap.to(elem, { x: 0, y: 0, opacity: 1, duration: 0.8, ease: "power2.out", overwrite: "auto" });
        }
      });
    });
  });

  // Skills Progress Bars
  gsap.utils.toArray('.js-skill-bar').forEach(function(bar) {
    ScrollTrigger.create({
      trigger: bar,
      start: "top 90%",
      onEnter: function() {
        bar.style.width = bar.getAttribute('data-width') + '%';
      }
    });
  });

  // --- 6. INTERACTIVE TERMINAL ---
  const terminalHistory = document.getElementById('terminal-history');
  const terminalInput = document.getElementById('terminal-input');
  
  if (terminalInput) {
    // Focus terminal on click anywhere in terminal
    document.getElementById('interactive-terminal').addEventListener('click', () => terminalInput.focus());

    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = terminalInput.value.trim().toLowerCase();
        if(!cmd) return;
        
        // Echo command
        appendTerminalLine(`<span class="prompt text-success">root@kskr-os:~$</span> ${escapeHtml(terminalInput.value)}`);
        playSound('typing', 0.2);
        terminalInput.value = '';

        // Process Command
        processTerminalCommand(cmd);
      }
    });
  }

  function appendTerminalLine(htmlContent) {
    if(!terminalHistory) return;
    const div = document.createElement('div');
    div.className = 'terminal-line mb-1';
    div.innerHTML = htmlContent;
    terminalHistory.appendChild(div);
    terminalHistory.scrollTop = terminalHistory.scrollHeight;
  }

  function processTerminalCommand(cmd) {
    let output = '';
    switch(cmd) {
      case 'help':
        output = `<span class="text-neon">Available commands:</span><br/>
          <span class="text-warning">whois kranthu</span>  — Developer profile &amp; identity<br/>
          <span class="text-warning">skills</span>         — Full technical skill set<br/>
          <span class="text-warning">projects</span>       — Deployed applications &amp; repositories<br/>
          <span class="text-warning">show mission</span>  — Career objective<br/>
          <span class="text-warning">contact</span>        — Contact links &amp; endpoints<br/>
          <span class="text-warning">clear</span>          — Clear terminal`;
        break;
      case 'whois kranthu':
        output = `<span class="text-primary">Name:         </span> Kata Sai Kranthu Reddy<br/>
                  <span class="text-primary">Role:         </span> Full Stack Developer &amp; AI Engineer<br/>
                  <span class="text-primary">University:   </span> SRM University, KTR — B.Tech CS (AI/ML) 2025–2029<br/>
                  <span class="text-primary">Tech Stack:   </span> Python · Flask · React · Java · Flutter · ML · NLP<br/>
                  <span class="text-primary">Projects:     </span> 8 live applications across Web, AI &amp; Mobile<br/>
                  <span class="text-primary">Status:       </span> <span class="text-success">Open to Internship Opportunities</span>`;
        break;
      case 'skills':
        output = `<span class="text-neon">TECHNICAL CAPABILITIES</span><br/>
                  <span class="text-primary">Languages:    </span> Python · JavaScript · Java · Dart · Kotlin<br/>
                  <span class="text-primary">Frameworks:   </span> Flask · React · Flutter · Android Studio<br/>
                  <span class="text-primary">AI/ML:        </span> Machine Learning · NLP · Neural Networks<br/>
                  <span class="text-primary">Databases:    </span> Firebase · SQLite · MySQL<br/>
                  <span class="text-primary">Tools:        </span> Git · GitHub · VS Code · Postman`;
        break;
      case 'show mission':
        output = `<span class="text-neon">MISSION OBJECTIVE:</span><br/>
                  To engineer intelligent, scalable systems that bridge human creativity <br/>
                  with advanced AI — and secure meaningful internship opportunities in<br/>
                  software development or AI research.`;
        break;
      case 'projects':
        output = `<span class="text-neon">DEPLOYED SYSTEMS:</span><br/>
                  1. <a href="#projects" class="neon-link">Sri Sai Traders</a>          — Enterprise Business Web Platform<br/>
                  2. <a href="#projects" class="neon-link">AI Resume Screener</a>        — Intelligent Candidate Filtering (Python/NLP)<br/>
                  3. <a href="#projects" class="neon-link">Offline AI Voice OS</a>       — Voice-Controlled Operating Interface<br/>
                  4. <a href="#projects" class="neon-link">Smart Auto-Correct Keyboard</a>— NLP-powered Keyboard (Android)<br/>
                  5. <a href="#projects" class="neon-link">Sambhasha App</a>             — Real-time Messaging Platform (Flutter)<br/>
                  6. <a href="#projects" class="neon-link">Quiz AI App</a>               — AI-driven Quiz System<br/>
                  7. <a href="#projects" class="neon-link">Portfolio OS</a>              — This AI-powered Portfolio Interface`;
        break;
      case 'contact':
        output = `<span class="text-neon">TRANSMISSION ENDPOINTS:</span><br/>
                  <span class="text-primary">GitHub:   </span> <a href="https://github.com/kskreddy2k7" target="_blank" class="text-purple">github.com/kskreddy2k7</a><br/>
                  <span class="text-primary">LinkedIn: </span> <a href="https://www.linkedin.com/in/kata-sai-kranthu-reddy-b02848377" target="_blank" class="text-neon">linkedin.com/in/kata-sai-kranthu-reddy</a><br/>
                  <span class="text-primary">Email:    </span> Available via Contact Form below`;
        break;
      case 'clear':
        terminalHistory.innerHTML = '';
        return;
      case 'kranthu.exe':
        output = `<span class="text-danger">WARNING: UNAUTHORIZED EXECUTION DETECTED.</span>`;
        appendTerminalLine(`<div class="terminal-output mt-1 mb-3 text-muted">${output}</div>`);
        playSound('notify', 0.5);
        triggerEasterEgg();
        return;
      default:
        output = `<span class="text-danger">bash: ${escapeHtml(cmd)}: command not found. Type 'help'.</span>`;
    }
    playSound('typing', 0.3);
    appendTerminalLine(`<div class="terminal-output mt-1 mb-3 text-muted">${output}</div>`);
  }

  function triggerEasterEgg() {
    const glitchEl = document.getElementById('glitch-overlay');
    if(glitchEl) {
      glitchEl.classList.remove('d-none');
      playSound('glitch', 0.6);
      // Play glitch sound if possible, else visual
      setTimeout(() => {
        glitchEl.classList.add('d-none');
        playSound('notify', 0.4);
        appendTerminalLine(`<div class="terminal-output mt-1 mb-3 text-success">SYSTEM RESTORED. Master override acknowledged.</div>`);
      }, 3500);
    }
  }

  // --- 7. PROJECT FILTERING & MODALS ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');
  const projectModal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalIframe = document.getElementById('modal-iframe');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update UI
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      playSound('click', 0.2);

      const filter = btn.getAttribute('data-filter');

      // Filter Projects
      projectItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          gsap.fromTo(item, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' });
        } else {
          item.style.display = 'none';
        }
      });
      
      // Refresh ScrollTrigger as heights change
      ScrollTrigger.refresh();
    });
  });

  document.querySelectorAll('.open-modal').forEach(card => {
    card.addEventListener('click', function() {
      playSound('click', 0.3);
      const title = this.getAttribute('data-title');
      const url = this.getAttribute('data-url');
      const repo = this.getAttribute('data-repo');
      const techStr = this.getAttribute('data-tech');
      
      document.getElementById('modal-title').textContent = title;
      document.getElementById('modal-live-btn').href = url;
      document.getElementById('modal-code-btn').href = repo;
      
      // Populate Tech Badges
      const techContainer = document.getElementById('modal-tech');
      techContainer.innerHTML = '';
      try {
        const techs = JSON.parse(techStr);
        techs.forEach(t => {
          techContainer.innerHTML += `<span class="cyber-badge cyan">${t}</span>`;
        });
      } catch(e) {}

      // Reset Iframe & Show Loader
      modalIframe.classList.remove('loaded');
      const modalLoader = document.getElementById('modal-loader');
      if (modalLoader) modalLoader.style.display = 'block';
      modalIframe.src = url;

      modalIframe.onload = () => {
        if (modalLoader) modalLoader.style.display = 'none';
        playSound('notify', 0.2);
        modalIframe.classList.add('loaded');
      };

      // Show Modal
      projectModal.classList.remove('d-none');
      void projectModal.offsetWidth;
      projectModal.classList.add('show');
      document.body.style.overflow = 'hidden';
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      playSound('click', 0.2);
      projectModal.classList.remove('show');
      setTimeout(() => {
        projectModal.classList.add('d-none');
        modalIframe.src = '';
        document.body.style.overflow = '';
      }, 400); // match css transition
    });
  }

  // --- 8. AI ASSISTANT CHAT LOGIC ---
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');

  // --- Static Chatbot (GitHub Pages fallback + primary on static hosting) ---
  const LOCAL_RESPONSES = {
    greeting: "Hello! 👋 I'm <strong>KSKR AI</strong> — Kranthu's personal intelligence system. Ask me about his <strong>skills</strong>, <strong>projects</strong>, <strong>education</strong>, <strong>internship availability</strong>, or how to <strong>contact</strong> him!",
    identity: "I represent <strong>Kata Sai Kranthu Reddy</strong> — a passionate Full Stack Developer and AI Engineer.<br>📍 <strong>University:</strong> SRM University, Kattankulathur — B.Tech CS (AI/ML) 2025–2029<br>🎯 <strong>Role:</strong> Full Stack Developer · AI Engineer · Mobile App Developer<br>🔥 <strong>Status:</strong> <span style='color:#00ff88'>Actively Open to Internship Opportunities</span>",
    skills: "Kranthu's full technical stack:<br>💻 <strong>Languages:</strong> Python · JavaScript · Java · Dart · Kotlin<br>⚙️ <strong>Frameworks:</strong> Flask · React · Flutter · Android Studio<br>🤖 <strong>AI/ML:</strong> Machine Learning · NLP · Neural Networks · Pandas · NumPy<br>🗄️ <strong>Databases:</strong> Firebase · SQLite · MySQL<br>🛠️ <strong>Tools:</strong> Git · GitHub · VS Code · Postman · Linux",
    projects: "Here are Kranthu's deployed systems:<br>🌐 <strong>Sri Sai Traders</strong> — Enterprise web platform <a href='https://kskreddy2k7.github.io/-Sri-Sai-Traders-website/' target='_blank' style='color:#00f3ff'>[Live]</a><br>🤖 <strong>AI Resume Screener</strong> — Python/NLP candidate filter <a href='https://kskreddy2k7.github.io/ai-resume-screening-system/' target='_blank' style='color:#00f3ff'>[Demo]</a><br>🎙️ <strong>Offline AI Voice OS</strong> — Voice-controlled AI interface <a href='https://kskreddy2k7.github.io/KSKR-AI-Voice-Operating-System/' target='_blank' style='color:#00f3ff'>[Demo]</a><br>⌨️ <strong>Smart Auto-Correct Keyboard</strong> — NLP Android keyboard <a href='https://github.com/kskreddy2k7/Smart-AutoCorrect-Keyboard' target='_blank' style='color:#00f3ff'>[Repo]</a><br>💬 <strong>Sambhasha App</strong> — Flutter/Firebase messaging <a href='https://github.com/kskreddy2k7/sambhasha_app' target='_blank' style='color:#00f3ff'>[Repo]</a><br>🧠 <strong>Quiz AI App</strong> — Adaptive AI quiz system <a href='https://github.com/kskreddy2k7/quiz-ai-app' target='_blank' style='color:#00f3ff'>[Repo]</a><br>📱 <strong>OOPS Banner App</strong> — OOP showcase <a href='https://github.com/kskreddy2k7/-OOPSBannerApp' target='_blank' style='color:#00f3ff'>[Repo]</a>",
    contact: "You can connect with Kranthu through:<br>🔗 <strong>LinkedIn:</strong> <a href='https://www.linkedin.com/in/kata-sai-kranthu-reddy-b02848377' target='_blank' style='color:#00d4ff'>linkedin.com/in/kata-sai-kranthu-reddy</a><br>💻 <strong>GitHub:</strong> <a href='https://github.com/kskreddy2k7' target='_blank' style='color:#00d4ff'>github.com/kskreddy2k7</a><br>📧 <strong>Email:</strong> Use the Contact Form on this page! He responds within <strong>24 hours</strong>.",
    education: "📚 <strong>Academic Profile:</strong><br>🎓 <strong>Current:</strong> B.Tech — Computer Science & Engineering (AI/ML)<br>🏫 SRM University, Kattankulathur — Batch 2025–2029<br>📋 <strong>Intermediate (MPC):</strong> Completed 2025<br>📋 <strong>CBSE Class 10:</strong> Completed 2023",
    experience: "Kranthu is a <strong>1st-year student</strong> actively building real-world experience:<br>✅ 8 independently built & deployed applications<br>✅ Full-stack, AI, and mobile domains covered<br>✅ Live platforms serving real users. He learns fast and ships faster. 🚀",
    certifications: "📜 Certifications:<br>• <strong>Python Programming</strong> — Core & Advanced<br>• <strong>AI & Machine Learning</strong> — Fundamentals to NLP<br>• <strong>Web Development</strong> — Full Stack (HTML, CSS, JS, Flask)<br>• <strong>Android Development</strong> — Kotlin & Java<br>• <strong>Flutter Development</strong> — Cross-platform mobile",
    goal: "🎯 <strong>Kranthu's Mission:</strong><br>To engineer intelligent, scalable systems that bridge human creativity with advanced AI — and secure meaningful opportunities in <strong>AI Research</strong> or <strong>Software Engineering</strong>.",
    resume: "📄 Download Kranthu's latest resume:<br><a href='static/resume/Kata_Sai_Kranthu_Reddy_Resume.docx' target='_blank' style='color:#00d4ff;font-weight:bold'>[⬇ DOWNLOAD RESUME]</a>",
    internship: "✅ Yes! Kranthu is <strong>actively seeking internship opportunities</strong> in:<br>• Artificial Intelligence & Machine Learning<br>• Full Stack Web Development<br>• Mobile App Development (Flutter/Android)<br>Reach out via LinkedIn or the Contact Form! 🚀",
    default: "I can help with: 💬 <strong>skills</strong> · <strong>projects</strong> · <strong>education</strong> · <strong>contact</strong> · <strong>internship</strong> · <strong>resume</strong><br>Just ask me anything about Kranthu! 😊"
  };

  function getLocalResponse(input) {
    // Clean punctuation for reliable matching
    const raw = input.toLowerCase().trim();
    const m = raw.replace(/[^\w\s]/g, ' ');

    // Slash commands
    const slashMap = {'/skills':'skills','/tech':'skills','/projects':'projects','/apps':'projects',
      '/contact':'contact','/resume':'resume','/cv':'resume','/goal':'goal','/mission':'goal',
      '/intern':'internship','/internship':'internship','/edu':'education','/whoami':'identity','/who':'identity'};
    if (slashMap[raw]) return LOCAL_RESPONSES[slashMap[raw]];

    // Skills — checked BEFORE greetings
    if (/skill|tech|stack|python|flask|java|react|flutter|kotlin|dart|nlp|language|capable|technology/.test(m))
      return LOCAL_RESPONSES.skills;
    // Projects
    if (/project|built|app|autocorrect|keyboard|sambhasha|quiz|traders|deployed|voice os|portfolio/.test(m))
      return LOCAL_RESPONSES.projects;
    // Resume
    if (/resume|cv|download/.test(m)) return LOCAL_RESPONSES.resume;
    // Contact
    if (/contact|reach|email|linkedin|github|connect|message/.test(m)) return LOCAL_RESPONSES.contact;
    // Education
    if (/education|study|degree|college|university|srm|school|btech|student/.test(m)) return LOCAL_RESPONSES.education;
    // Experience
    if (/experience|history|fresher/.test(m)) return LOCAL_RESPONSES.experience;
    // Certifications
    if (/certif|course|training|certificate/.test(m)) return LOCAL_RESPONSES.certifications;
    // Goals
    if (/goal|mission|dream|aspire|future|vision|plan/.test(m)) return LOCAL_RESPONSES.goal;
    // Internship
    if (/intern|hire|job|opportunity|available|looking/.test(m)) return LOCAL_RESPONSES.internship;
    // Identity
    if (/who|about|introduce|kranthu|identity/.test(m)) return LOCAL_RESPONSES.identity;
    // Greetings — LAST (to avoid 'his' matching 'hi')
    if (/\bhello\b|\bhey\b|\bgreet\b|\bnamaste\b/.test(m) || raw === 'hi')
      return LOCAL_RESPONSES.greeting;

    return LOCAL_RESPONSES.default;
  }

  function appendChat(htmlContent, isUser) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${isUser ? 'user me-0' : 'bot ms-0'} mb-3`;
    
    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.innerHTML = isUser ? '<i class="fas fa-user-astronaut"></i>' : '<i class="fas fa-robot"></i>';
    
    const contentBox = document.createElement('div');
    contentBox.className = 'msg-content glass-bubble';
    
    const label = document.createElement('span');
    label.className = `font-fira small d-block mb-1 ${isUser ? 'text-purple' : 'text-neon'}`;
    label.innerHTML = isUser ? 'GUEST_USER' : 'KSKR_AI_CORE.exe';
    
    const textMsg = document.createElement('p');
    textMsg.className = 'mb-0 font-inter text-light';
    textMsg.innerHTML = htmlContent;
    
    contentBox.appendChild(label);
    contentBox.appendChild(textMsg);
    
    msgDiv.appendChild(avatar);
    msgDiv.appendChild(contentBox);
    
    chatMessages.appendChild(msgDiv);
    
    gsap.fromTo(msgDiv, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.5)' });
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return msgDiv;
  }

  function showTypingIndicator() {
    const ti = appendChat('<span class="cursor">|</span> Calculating response...', false);
    ti.id = 'chatTypingIndicator';
  }

  function removeTypingIndicator() {
    const ti = document.getElementById('chatTypingIndicator');
    if (ti) ti.remove();
  }

  function sendChatMessage(message) {
    if (!message.trim()) return;
    
    appendChat(escapeHtml(message), true);
    playSound('typing', 0.2);
    if (chatInput) chatInput.value = '';

    setTimeout(() => {
      showTypingIndicator();
      playSound('typing', 0.1);

      // On GitHub Pages (no Flask), use local logic immediately
      const isGitHubPages = window.location.hostname.includes('github.io') ||
                            window.location.protocol === 'file:';

      if (isGitHubPages) {
        setTimeout(() => {
          removeTypingIndicator();
          playSound('notify', 0.3);
          appendChat(getLocalResponse(message), false);
        }, 900);
        return;
      }

      // Local dev: try Flask backend
      fetch('/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message })
      })
      .then(res => {
        if (!res.ok) throw new Error('not ok');
        return res.json();
      })
      .then(data => {
        setTimeout(() => {
          removeTypingIndicator();
          playSound('notify', 0.3);
          appendChat(data.response || getLocalResponse(message), false);
        }, 800);
      })
      .catch(() => {
        setTimeout(() => {
          removeTypingIndicator();
          playSound('notify', 0.3);
          appendChat(getLocalResponse(message), false);
        }, 900);
      });
    }, 400);
  }


  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = chatInput ? chatInput.value.trim() : '';
      if (msg) sendChatMessage(msg);
    });
  }

  window.sendQuick = (msg) => { sendChatMessage(msg); };

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

  // --- 9. CONTACT FORM AJAX ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      playSound('click', 0.2);
      // standard validation/ajax (left streamlined for control room UX)
      const submitBtn = document.getElementById('submitBtn');
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> TRANSMITTING...';
      
      const payload = {
        name: document.getElementById('contactName').value.trim(),
        email: document.getElementById('contactEmail').value.trim(),
        message: document.getElementById('contactMessage').value.trim()
      };

      fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(result => {
        showContactSuccess(submitBtn, contactForm, payload.name);
      })
      .catch(() => {
        // FALLBACK TO STATIC MODE
        console.log("🤖 [Contact] Falling back to static mode success message.");
        showContactSuccess(submitBtn, contactForm, payload.name);
      });
    });
  }

  function showContactSuccess(btn, form, name) {
    playSound('notify', 0.4);
    btn.innerHTML = '<i class="fas fa-check-circle me-2"></i> DATA RECEIVED';
    btn.classList.replace('btn-neon', 'btn-outline-neon');
    form.reset();
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-satellite-dish me-2"></i> TRANSMIT_DATA';
      btn.classList.replace('btn-outline-neon', 'btn-neon');
    }, 3000);
  }

});
