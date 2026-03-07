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
      "Machine Learning Engineer",
      "Python Developer",
      "Software Engineer",
      "Open-Source Contributor",
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
     UTILITY
     =========================================================== */
  function escHtml(str) {
    return str.replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }
})();
