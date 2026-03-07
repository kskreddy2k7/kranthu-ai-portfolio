/* ============================================================
   script.js — Kranthu AI Portfolio
   Particles · Typed animation · AOS · Navbar · Smooth UX
   ============================================================ */

(function () {
  "use strict";

  /* ── Wait for DOM ── */
  document.addEventListener("DOMContentLoaded", init);

  function init() {
    initParticles();
    initTyped();
    initNavbar();
    initHamburger();
    initAOS();
    initSkillBars();
    initScrollTop();
    initContactForm();
    initSmoothScroll();
    initChatbot();
    loadGitHubProjects();
  }

  /* ===========================================================
     1. PARTICLE CANVAS BACKGROUND
     =========================================================== */
  function initParticles() {
    const canvas = document.getElementById("particles-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, particles = [], mouse = { x: null, y: null, radius: 120 };

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    window.addEventListener("resize", () => { resize(); buildParticles(); });
    canvas.addEventListener("mousemove", (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    canvas.addEventListener("mouseleave", () => { mouse.x = null; mouse.y = null; });

    function buildParticles() {
      const count = Math.min(Math.floor((W * H) / 12000), 90);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          r: Math.random() * 1.8 + 0.5,
          alpha: Math.random() * 0.5 + 0.2,
        });
      }
    }

    function drawLine(a, b, dist, maxDist) {
      const alpha = (1 - dist / maxDist) * 0.25;
      ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);
      const maxDist = 130;

      particles.forEach((p, i) => {
        // Move
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        // Mouse repulsion
        if (mouse.x !== null) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < mouse.radius) {
            const force = (mouse.radius - d) / mouse.radius * 0.02;
            p.vx += (dx / d) * force;
            p.vy += (dy / d) * force;
          }
        }

        // Speed limit
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 1.2) { p.vx = (p.vx / speed) * 1.2; p.vy = (p.vy / speed) * 1.2; }

        // Draw dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,212,255,${p.alpha})`;
        ctx.fill();

        // Draw lines
        for (let j = i + 1; j < particles.length; j++) {
          const q  = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) drawLine(p, q, dist, maxDist);
        }
      });

      requestAnimationFrame(animate);
    }

    resize();
    buildParticles();
    animate();
  }

  /* ===========================================================
     2. TYPED ANIMATION (pure JS, no lib needed)
     =========================================================== */
  function initTyped() {
    const el = document.getElementById("typed-text");
    if (!el) return;

    const strings = [
      "AI Developer",
      "Software Engineer",
      "Machine Learning Enthusiast",
      "Python Developer",
      "Problem Solver",
    ];

    let strIdx = 0, charIdx = 0, deleting = false;

    function type() {
      const current = strings[strIdx];

      if (!deleting) {
        el.textContent = current.slice(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) {
          deleting = true;
          setTimeout(type, 1800);
          return;
        }
        setTimeout(type, 75);
      } else {
        el.textContent = current.slice(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          deleting = false;
          strIdx   = (strIdx + 1) % strings.length;
          setTimeout(type, 400);
          return;
        }
        setTimeout(type, 40);
      }
    }

    type();
  }

  /* ===========================================================
     3. NAVBAR: shrink on scroll + active link highlight
     =========================================================== */
  function initNavbar() {
    const navbar = document.querySelector(".navbar");
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-links a");

    function onScroll() {
      // Shrink
      navbar.classList.toggle("scrolled", window.scrollY > 50);

      // Active link
      let current = "";
      sections.forEach((s) => {
        if (window.scrollY >= s.offsetTop - 120) current = s.id;
      });
      navLinks.forEach((a) => {
        a.classList.toggle("active", a.getAttribute("href") === "#" + current);
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ===========================================================
     4. HAMBURGER MENU
     =========================================================== */
  function initHamburger() {
    const btn   = document.querySelector(".hamburger");
    const menu  = document.querySelector(".nav-links");
    if (!btn || !menu) return;

    btn.addEventListener("click", () => {
      btn.classList.toggle("open");
      menu.classList.toggle("open");
    });

    menu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        btn.classList.remove("open");
        menu.classList.remove("open");
      });
    });
  }

  /* ===========================================================
     5. AOS — simple Animate On Scroll
     =========================================================== */
  function initAOS() {
    const els = document.querySelectorAll("[data-aos]");
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const delay = parseInt(e.target.dataset.aosDelay || 0);
            setTimeout(() => e.target.classList.add("aos-animate"), delay);
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    els.forEach((el) => observer.observe(el));
  }

  /* ===========================================================
     6. SKILL BARS — animate width on reveal
     =========================================================== */
  function initSkillBars() {
    const fills = document.querySelectorAll(".skill-fill[data-width]");
    if (!fills.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.style.width = e.target.dataset.width + "%";
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    fills.forEach((f) => observer.observe(f));
  }

  /* ===========================================================
     7. SCROLL TO TOP BUTTON
     =========================================================== */
  function initScrollTop() {
    const btn = document.getElementById("scroll-top");
    if (!btn) return;

    window.addEventListener("scroll", () => {
      btn.classList.toggle("visible", window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ===========================================================
     8. CONTACT FORM (mailto fallback — static site)
     =========================================================== */
  function initContactForm() {
    const form    = document.getElementById("contact-form");
    const success = document.getElementById("form-success");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const name    = escHtml(form.querySelector("#name").value.trim());
      const email   = escHtml(form.querySelector("#email").value.trim());
      const subject = escHtml(form.querySelector("#subject").value.trim());
      const message = escHtml(form.querySelector("#message").value.trim());

      if (!name || !email || !message) return;

      // Open mailto for static-site (no backend)
      const body           = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      const encodedSubject = encodeURIComponent(subject || "Portfolio Contact");
      window.open(`mailto:kskreddy2k7@gmail.com?subject=${encodedSubject}&body=${body}`, "_blank");

      if (success) {
        success.style.display = "block";
        setTimeout(() => (success.style.display = "none"), 5000);
      }
      form.reset();
    });
  }

  /* ===========================================================
     9. SMOOTH SCROLL for anchor links
     =========================================================== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const target = document.querySelector(a.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: "smooth" });
      });
    });
  }

  /* ===========================================================
     10. AI PORTFOLIO CHATBOT
     =========================================================== */
  function initChatbot() {
    const toggle = document.getElementById("chatbot-toggle");
    const closeBtn = document.getElementById("chatbot-close");
    const chatWindow = document.getElementById("chatbot-window");
    const messagesContainer = document.getElementById("chatbot-messages");
    const inputField = document.getElementById("chatbot-input-field");
    const sendBtn = document.getElementById("chatbot-send");

    if (!toggle || !chatWindow) return;

    // Knowledge base
    const knowledge = {
      who: {
        keywords: ["who", "about", "kata", "sai", "kranthu", "reddy", "yourself", "tell me"],
        answer: "KATA SAI KRANTHU REDDY is an AI Developer and Software Engineer passionate about building intelligent systems and machine learning applications. He's currently pursuing B.Tech in Computer Science Engineering (AI & ML) and specializes in NLP, machine learning, and scalable software development."
      },
      projects: {
        keywords: ["project", "built", "work", "portfolio", "created", "developed"],
        answer: "Kata Sai Kranthu Reddy has built several impressive projects:\n\n• <strong>AI Resume Screening System</strong> - NLP-powered tool for automated candidate ranking\n• <strong>Smart AutoCorrect Keyboard</strong> - Context-aware autocorrect using Trie and n-gram models\n• <strong>Quiz AI App</strong> - AI-powered quiz generation application\n• <strong>Sri Sai Traders</strong> - Business management application\n• <strong>Portfolio Website</strong> - This interactive AI developer portfolio\n\nCheck out the Projects section to see all repositories loaded dynamically from GitHub!"
      },
      skills: {
        keywords: ["skill", "technology", "language", "know", "expertise", "proficient"],
        answer: "His technical skillset includes:\n\n<strong>AI & ML:</strong> Machine Learning, NLP, Deep Learning, TensorFlow, Data Analysis\n\n<strong>Languages:</strong> Python, Java, JavaScript, SQL\n\n<strong>Web Dev:</strong> HTML/CSS, Flask, REST APIs, Responsive Design\n\n<strong>Tools:</strong> Git, GitHub, Linux, Jupyter Notebook"
      },
      contact: {
        keywords: ["contact", "email", "reach", "connect", "linkedin", "github", "touch"],
        answer: "You can reach out to KATA SAI KRANTHU REDDY through:\n\n📧 <strong>Email:</strong> <a href='mailto:kskreddy2k7@gmail.com'>kskreddy2k7@gmail.com</a>\n\n💼 <strong>LinkedIn:</strong> <a href='https://www.linkedin.com/in/kata-sai-kranthu-reddy-b02848377' target='_blank'>linkedin.com/in/kata-sai-kranthu-reddy-b02848377</a>\n\n🔗 <strong>GitHub:</strong> <a href='https://github.com/kskreddy2k7' target='_blank'>github.com/kskreddy2k7</a>"
      },
      education: {
        keywords: ["education", "study", "university", "degree", "college", "btech"],
        answer: "He is currently pursuing B.Tech in Computer Science Engineering with specialization in <strong>Artificial Intelligence & Machine Learning</strong>. His academic focus combines theoretical knowledge with practical AI/ML project experience."
      },
      experience: {
        keywords: ["experience", "work", "internship", "job"],
        answer: "Kata Sai Kranthu Reddy has hands-on experience building multiple AI and software projects. He's currently seeking internship opportunities and exciting collaborations in AI/ML and software development."
      },
      interests: {
        keywords: ["interest", "passion", "like", "enjoy", "hobby"],
        answer: "His interests lie at the intersection of <strong>Machine Learning</strong>, <strong>Natural Language Processing</strong>, and <strong>Software Engineering</strong>. He's passionate about transforming complex problems into elegant solutions and staying updated with the latest advancements in AI technology."
      },
      default: {
        answer: "I'm here to help you learn about KATA SAI KRANTHU REDDY! You can ask me about:\n\n• Who he is\n• His projects\n• Technical skills\n• Education & experience\n• How to contact him\n\nWhat would you like to know?"
      }
    };

    // Toggle chatbot
    toggle.addEventListener("click", () => {
      chatWindow.classList.toggle("open");
      if (chatWindow.classList.contains("open")) {
        inputField.focus();
      }
    });

    closeBtn.addEventListener("click", () => {
      chatWindow.classList.remove("open");
    });

    // Quick question buttons
    messagesContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("quick-q")) {
        const q = e.target.dataset.q;
        const text = e.target.textContent;
        addUserMessage(text);
        setTimeout(() => respondToQuestion(q), 500);
      }
    });

    // Send message
    function sendMessage() {
      const text = inputField.value.trim();
      if (!text) return;
      
      addUserMessage(text);
      inputField.value = "";
      
      setTimeout(() => {
        const intent = detectIntent(text);
        respondToQuestion(intent);
      }, 500);
    }

    sendBtn.addEventListener("click", sendMessage);
    inputField.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage();
    });

    // Add user message
    function addUserMessage(text) {
      const msgDiv = document.createElement("div");
      msgDiv.className = "message user-message";
      msgDiv.innerHTML = `
        <div class="message-content">
          <p>${escHtml(text)}</p>
        </div>
      `;
      messagesContainer.appendChild(msgDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Add bot message
    function addBotMessage(text) {
      const msgDiv = document.createElement("div");
      msgDiv.className = "message bot-message";
      msgDiv.innerHTML = `
        <div class="message-avatar">
          <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
          <p>${text}</p>
        </div>
      `;
      messagesContainer.appendChild(msgDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Detect user intent from message
    function detectIntent(text) {
      const lower = text.toLowerCase();
      
      for (const [intent, data] of Object.entries(knowledge)) {
        if (intent === "default") continue;
        if (data.keywords.some(kw => lower.includes(kw))) {
          return intent;
        }
      }
      
      return "default";
    }

    // Respond to question
    function respondToQuestion(intent) {
      const response = knowledge[intent] ? knowledge[intent].answer : knowledge.default.answer;
      addBotMessage(response);
    }
  }

  /* ===========================================================
     11. LOAD GITHUB PROJECTS DYNAMICALLY
     =========================================================== */
  function loadGitHubProjects() {
    const username = "kskreddy2k7";
    const projectsGrid = document.getElementById("projects-grid");
    
    if (!projectsGrid) return;

    const featuredRepos = [
      "ai-resume-screening-system",
      "smart-autocorrect-keyboard",
      "quiz-ai-app",
      "speech-to-text-converter",
      "speech-to-text-python"
    ];

    const projectTitles = {
      "ai-resume-screening-system": "AI Resume Screening System",
      "smart-autocorrect-keyboard": "Smart AutoCorrect Keyboard",
      "quiz-ai-app": "Quiz AI App",
      "speech-to-text-converter": "Speech-to-Text Converter",
      "speech-to-text-python": "Speech-to-Text Converter",
      "sri-sai-traders": "Sri Sai Traders Website",
      "kranthu-ai-portfolio": "AI Developer Portfolio",
      "oops-banner-app": "OOPS Banner App",
      "oopsbannerapp": "OOPS Banner App"
    };

    const projectDescriptions = {
      "ai-resume-screening-system": "An AI-powered resume analysis tool that ranks and filters candidates using natural language processing and machine learning techniques.",
      "smart-autocorrect-keyboard": "A custom Android keyboard with intelligent autocorrect and predictive text using NLP algorithms.",
      "quiz-ai-app": "An AI-driven quiz generator that creates topic-based questions dynamically using machine learning models.",
      "speech-to-text-converter": "A real-time speech recognition system that converts spoken audio into text using Python speech processing libraries.",
      "speech-to-text-python": "A real-time speech recognition system that converts spoken audio into text using Python speech processing libraries.",
      "sri-sai-traders": "A responsive business website designed to showcase products and services for a local retail business.",
      "kranthu-ai-portfolio": "A modern developer portfolio showcasing AI, machine learning, and software development projects.",
      "oops-banner-app": "A Java-based application demonstrating object-oriented programming concepts through banner generation.",
      "oopsbannerapp": "A Java-based application demonstrating object-oriented programming concepts through banner generation."
    };

    const languageMeta = {
      Python: { icon: "fab fa-python", color: "blue", tags: ["Python", "ML"] },
      JavaScript: { icon: "fab fa-js", color: "purple", tags: ["JavaScript"] },
      Java: { icon: "fab fa-java", color: "orange", tags: ["Java"] },
      HTML: { icon: "fab fa-html5", color: "orange", tags: ["HTML", "CSS"] },
      CSS: { icon: "fab fa-css3-alt", color: "blue", tags: ["CSS", "UI"] },
      TypeScript: { icon: "fas fa-code", color: "purple", tags: ["TypeScript"] },
      "Jupyter Notebook": { icon: "fas fa-book", color: "green", tags: ["Python", "Notebook"] },
      default: { icon: "fas fa-cubes", color: "green", tags: ["Software"] }
    };

    const normalizeName = (name) => name.toLowerCase().replace(/[_\s]+/g, "-");

    const toTitleCase = (name) => {
      const normalized = normalizeName(name);
      if (projectTitles[normalized]) return projectTitles[normalized];
      return normalized
        .split("-")
        .filter(Boolean)
        .map((word) => {
          if (["ai", "ml", "nlp", "api", "sql", "oop", "oops"].includes(word)) return word.toUpperCase();
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
    };

    const getDescription = (repo) => {
      const normalized = normalizeName(repo.name);
      if (projectDescriptions[normalized]) return projectDescriptions[normalized];
      if (repo.description && repo.description.trim()) return repo.description.trim();
      return `A professionally developed ${toTitleCase(repo.name)} project showcasing practical software engineering and implementation skills.`;
    };

    const getSortRank = (repoName) => {
      const normalized = normalizeName(repoName);
      const idx = featuredRepos.indexOf(normalized);
      return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
    };

    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`)
      .then(response => response.json())
      .then(repos => {
        if (!Array.isArray(repos) || repos.length === 0) {
          projectsGrid.innerHTML = '<p class="no-projects">No projects found.</p>';
          return;
        }

        const filteredRepos = repos
          .filter((repo) => !repo.fork)
          .filter((repo) => (repo.size || 0) > 0)
          .sort((a, b) => {
            const rankDiff = getSortRank(a.name) - getSortRank(b.name);
            if (rankDiff !== 0) return rankDiff;
            return new Date(b.updated_at) - new Date(a.updated_at);
          });

        projectsGrid.innerHTML = "";

        filteredRepos.forEach((repo, index) => {
          const normalizedName = normalizeName(repo.name);
          const lang = repo.language || "default";
          const langInfo = languageMeta[lang] || languageMeta.default;
          const isFeatured = featuredRepos.includes(normalizedName);
          const projectTitle = toTitleCase(repo.name);
          const projectDescription = getDescription(repo);
          const homepage = repo.homepage && repo.homepage.trim() ? repo.homepage.trim() : "";
          
          const card = document.createElement("article");
          card.className = `glass-card project-card ${isFeatured ? "featured" : ""}`;
          card.setAttribute("data-aos", "fade-up");
          card.setAttribute("data-aos-delay", Math.min(index * 100, 400));
          
          card.innerHTML = `
            <div class="project-media" aria-hidden="true">
              <i class="${langInfo.icon}"></i>
            </div>
            <div class="project-top">
              <div class="project-header">
                <div class="project-title-wrap">
                  <h3>${escHtml(projectTitle)}</h3>
                  ${isFeatured ? '<span class="project-tag pink">Featured</span>' : ""}
                </div>
                <div class="project-links">
                  <a href="${repo.html_url}" class="project-link" target="_blank" rel="noopener noreferrer" aria-label="Open GitHub repository">
                    <i class="fab fa-github" aria-hidden="true"></i>
                  </a>
                  <a href="${repo.html_url}" class="project-link" target="_blank" rel="noopener noreferrer" aria-label="Open project link">
                    <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i>
                  </a>
                </div>
              </div>
              <p>${escHtml(projectDescription)}</p>
            </div>
            <div class="project-tags">
              ${langInfo.tags.map((tag) => `<span class="project-tag ${langInfo.color}">${escHtml(tag)}</span>`).join("")}
              ${repo.stargazers_count > 0 ? `<span class="project-tag orange"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>` : ""}
            </div>
            <div class="project-actions">
              <a href="${repo.html_url}" class="project-btn github" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-github"></i> GitHub
              </a>
              ${homepage ? `
                <a href="${homepage}" class="project-btn demo" target="_blank" rel="noopener noreferrer">
                  <i class="fas fa-arrow-up-right-from-square"></i> Live Demo
                </a>
              ` : ""}
            </div>
          `;
          
          projectsGrid.appendChild(card);
        });

        // Reinitialize AOS for dynamically added elements
        initAOS();
      })
      .catch(error => {
        console.error("Error fetching GitHub repos:", error);
        projectsGrid.innerHTML = '<p class="error-message">Failed to load projects. Please check your internet connection.</p>';
      });
  }

  /* ===========================================================
     UTILITY
     =========================================================== */
  function escHtml(str) {
    return str.replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }
})();
