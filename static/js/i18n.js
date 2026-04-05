/* ============================================================
   KATA SAI KRANTHU REDDY – Internationalization (i18n) Engine
   ============================================================ */

class I18nEngine {
  constructor() {
    this.languages = ['en', 'hi', 'te', 'ta', 'kn'];
    this.currentLang = localStorage.getItem('kskr_pref_lang') || this.detectLanguage();
    this.translations = {};
    this.init();
  }

  async init() {
    await this.loadLanguage(this.currentLang);
    this.applyTranslations();
    this.setupSwitcher();
    console.log(`🌐 i18n Engine Initialized: ${this.currentLang.toUpperCase()}`);
  }

  detectLanguage() {
    const browserLang = navigator.language.split('-')[0];
    return this.languages.includes(browserLang) ? browserLang : 'en';
  }

  async loadLanguage(lang) {
    if (this.translations[lang]) return;
    try {
      const response = await fetch(`/static/lang/${lang}.json`);
      if (!response.ok) throw new Error(`Could not load ${lang} translation`);
      this.translations[lang] = await response.json();
    } catch (err) {
      console.error('❌ i18n Load Error:', err);
      if (lang !== 'en') await this.loadLanguage('en');
    }
  }

  async setLanguage(lang) {
    if (!this.languages.includes(lang)) return;
    this.currentLang = lang;
    localStorage.setItem('kskr_pref_lang', lang);
    
    // Smooth transition
    document.body.classList.add('switching-lang');
    
    await this.loadLanguage(lang);
    this.applyTranslations();
    this.updateActiveUI(lang);

    // Update dropdown trigger text
    const trigger = document.getElementById('lang-current');
    if (trigger) {
        const langMap = {
            'en': 'English (EN)', 'hi': 'हिन्दी (HI)', 'te': 'తెలుగు (TE)',
            'ta': 'தமிழ் (TA)', 'kn': 'ಕನ್ನಡ (KN)'
        };
        const span = trigger.querySelector('span');
        if (span) span.innerText = langMap[lang] || lang.toUpperCase();
    }

    // Update global state for typing animation if exists
    if (window.updateHeroTyping) {
        window.updateHeroTyping(this.translations[lang].hero.typed);
    }
    
    // Update chatbot welcome if exists
    if (window.updateChatbotUI) {
        window.updateChatbotUI();
    }

    setTimeout(() => {
      document.body.classList.remove('switching-lang');
    }, 400);
  }

  applyTranslations() {
    const data = this.translations[this.currentLang];
    if (!data) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const keyPath = el.getAttribute('data-i18n');
      const translation = this.getNestedValue(data, keyPath);
      
      if (translation) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = translation;
        } else {
          el.innerHTML = translation;
        }
      }
    });

    // Update page title
    document.title = `${data.hero.name || 'Kranthu Reddy'} | ${data.lang_name} OS Portfolio`;
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  setupSwitcher() {
    document.querySelectorAll('.lang-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const lang = item.getAttribute('data-lang');
        this.setLanguage(lang);
      });
    });
    this.updateActiveUI(this.currentLang);
  }

  updateActiveUI(lang) {
    document.querySelectorAll('.lang-item').forEach(item => {
      if (item.getAttribute('data-lang') === lang) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
    document.documentElement.lang = lang;
  }
}

// Export singleton
window.i18n = new I18nEngine();
