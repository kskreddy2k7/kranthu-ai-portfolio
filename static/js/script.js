/* ============================================================
   KATA SAI KRANTHU REDDY – Portfolio JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ----------------------------------------------------------
  // AOS (Animate On Scroll) Init
  // ----------------------------------------------------------
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60
    });
  }

  // ----------------------------------------------------------
  // Typed.js – Hero subtitle
  // ----------------------------------------------------------
  const typedEl = document.getElementById('typed-output');
  if (typedEl && typeof Typed !== 'undefined') {
    new Typed('#typed-output', {
      strings: [
        'Python Developer',
        'AI Builder',
        'Backend Enthusiast',
        'Problem Solver',
        'Flask Developer'
      ],
      typeSpeed: 60,
      backSpeed: 35,
      backDelay: 1800,
      loop: true,
      cursorChar: '|'
    });
  }

  // ----------------------------------------------------------
  // Progress bar – fill on scroll via IntersectionObserver
  // ----------------------------------------------------------
  const progressBars = document.querySelectorAll('.progress-bar[data-width]');
  if (progressBars.length > 0) {
    const barObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetWidth = bar.getAttribute('data-width') + '%';
          bar.style.width = targetWidth;
          barObserver.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });

    progressBars.forEach(function (bar) {
      barObserver.observe(bar);
    });
  }

  // ----------------------------------------------------------
  // Scroll-reveal: add 'revealed' class (AOS handles most)
  // ----------------------------------------------------------
  const revealEls = document.querySelectorAll('.reveal-on-scroll');
  if (revealEls.length > 0) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  // ----------------------------------------------------------
  // Navbar – active state on scroll
  // ----------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#mainNav .nav-link');

  function updateNavActive() {
    const scrollY = window.scrollY;
    let current = '';
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 100;
      if (scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(function (link) {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href.includes('#' + current)) {
        link.classList.add('active');
      }
    });
  }

  // Navbar background change on scroll
  const mainNav = document.getElementById('mainNav');
  function handleNavScroll() {
    if (window.scrollY > 50) {
      mainNav && mainNav.classList.add('scrolled');
    } else {
      mainNav && mainNav.classList.remove('scrolled');
    }
    updateNavActive();
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ----------------------------------------------------------
  // Scroll to Top button
  // ----------------------------------------------------------
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('show');
      } else {
        scrollTopBtn.classList.remove('show');
      }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ----------------------------------------------------------
  // Contact Form – AJAX submission
  // ----------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Clear previous errors
      ['nameError', 'emailError', 'messageError'].forEach(function (id) {
        const el = document.getElementById(id);
        if (el) { el.textContent = ''; el.style.display = 'none'; }
      });
      ['contactName', 'contactEmail', 'contactMessage'].forEach(function (id) {
        const el = document.getElementById(id);
        if (el) el.classList.remove('is-invalid');
      });

      const formAlert = document.getElementById('formAlert');
      if (formAlert) {
        formAlert.className = 'alert d-none mb-3';
        formAlert.textContent = '';
      }

      const submitBtn = document.getElementById('submitBtn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending…';
      }

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
      .then(function (res) { return res.json().then(function (d) { return { status: res.status, data: d }; }); })
      .then(function (result) {
        if (result.status === 200 && result.data.success) {
          if (formAlert) {
            formAlert.className = 'alert alert-success mb-3';
            formAlert.textContent = result.data.message;
          }
          contactForm.reset();
        } else {
          const errors = result.data.errors || {};
          ['name', 'email', 'message'].forEach(function (field) {
            if (errors[field]) {
              const input = document.getElementById('contact' + field.charAt(0).toUpperCase() + field.slice(1));
              const errorEl = document.getElementById(field + 'Error');
              if (input) input.classList.add('is-invalid');
              if (errorEl) {
                errorEl.textContent = errors[field];
                errorEl.style.display = 'block';
              }
            }
          });
          if (formAlert && Object.keys(errors).length === 0) {
            formAlert.className = 'alert alert-danger mb-3';
            formAlert.textContent = 'Something went wrong. Please try again.';
          }
        }
      })
      .catch(function () {
        if (formAlert) {
          formAlert.className = 'alert alert-danger mb-3';
          formAlert.textContent = 'Network error. Please try again.';
        }
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Send Message';
        }
      });
    });
  }

  // ----------------------------------------------------------
  // Chatbot
  // ----------------------------------------------------------
  const chatForm     = document.getElementById('chatForm');
  const chatInput    = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');

  function appendMessage(text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-msg ' + (type === 'user' ? 'user-msg' : 'bot-msg');
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.innerHTML = text;
    msgDiv.appendChild(bubble);
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return msgDiv;
  }

  function showTypingIndicator() {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-msg bot-msg';
    msgDiv.id = 'typingIndicator';
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.innerHTML = '<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
    msgDiv.appendChild(bubble);
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTypingIndicator() {
    const ti = document.getElementById('typingIndicator');
    if (ti) ti.remove();
  }

  function sendChatMessage(message) {
    if (!message.trim()) return;
    appendMessage(escapeHtml(message), 'user');
    if (chatInput) chatInput.value = '';
    showTypingIndicator();

    fetch('/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: message })
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      removeTypingIndicator();
      appendMessage(data.response || 'Sorry, I could not understand that.', 'bot');
    })
    .catch(function () {
      removeTypingIndicator();
      appendMessage('Sorry, something went wrong. Please try again.', 'bot');
    });
  }

  if (chatForm) {
    chatForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const msg = chatInput ? chatInput.value.trim() : '';
      if (msg) sendChatMessage(msg);
    });
  }

  // Expose sendQuick globally for quick-btn onclick
  window.sendQuick = function (msg) { sendChatMessage(msg); };

  // ----------------------------------------------------------
  // Smooth scroll for anchor links
  // ----------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile nav if open
        const navCollapse = document.getElementById('navMenu');
        if (navCollapse && navCollapse.classList.contains('show')) {
          const toggler = document.querySelector('.navbar-toggler');
          if (toggler) toggler.click();
        }
      }
    });
  });

  // ----------------------------------------------------------
  // Helper: escape HTML for user messages
  // ----------------------------------------------------------
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

});
