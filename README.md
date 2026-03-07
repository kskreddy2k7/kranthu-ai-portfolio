# 🚀 Kranthu AI Portfolio

<div align="center">

[![GitHub Stars](https://img.shields.io/github/stars/kskreddy2k7/kranthu-ai-portfolio?style=for-the-badge&logo=github&color=00d4ff)](https://github.com/kskreddy2k7/kranthu-ai-portfolio/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/kskreddy2k7/kranthu-ai-portfolio?style=for-the-badge&logo=github&color=7c3aed)](https://github.com/kskreddy2k7/kranthu-ai-portfolio/network/members)
[![GitHub License](https://img.shields.io/github/license/kskreddy2k7/kranthu-ai-portfolio?style=for-the-badge&color=10b981)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen?style=for-the-badge&logo=github)](https://kskreddy2k7.github.io/kranthu-ai-portfolio/)
[![Deploy](https://github.com/kskreddy2k7/kranthu-ai-portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/kskreddy2k7/kranthu-ai-portfolio/actions/workflows/deploy.yml)

**A Level-10 professional AI developer portfolio with futuristic glassmorphism UI, particle animations, and GitHub Pages deployment.**

[🌐 Live Demo](https://kskreddy2k7.github.io/kranthu-ai-portfolio/) · [📧 Contact](mailto:kskreddy2k7@gmail.com) · [💼 LinkedIn](https://linkedin.com/in/kranthu-reddy)

</div>

---

## 📋 Project Overview

This is the personal portfolio website of **Kranthu Reddy** — an AI Developer and Software Engineer passionate about building intelligent systems, scalable web applications, and open-source tools.

The site is built as a **100% static website** (pure HTML/CSS/JavaScript), hosted for free on **GitHub Pages**, with automatic deployment via **GitHub Actions**.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎨 **Glassmorphism UI** | Modern frosted-glass cards with neon glow effects |
| ✨ **Particle Canvas** | Interactive particle network background in the hero section |
| 🖊️ **Typed Animation** | Cycling role titles using a pure-JS typewriter effect |
| 📊 **Skill Bars** | Animated progress bars that trigger on scroll |
| 🃏 **Project Cards** | Hover-animated cards with tech stack tags and links |
| 📈 **GitHub Stats** | Live GitHub README stats, streak, and top language widgets |
| 📱 **Fully Responsive** | Mobile-first layout that works on all screen sizes |
| ♿ **Accessible** | ARIA labels, semantic HTML, and keyboard-navigable |
| 🔍 **SEO Optimized** | Meta tags, Open Graph, Twitter Card, and canonical URL |
| ⚡ **Zero Backend** | Pure static files — no server, no build step required |
| 🚀 **Auto-Deploy** | GitHub Actions workflow deploys on every push to `main` |

---

## 🌐 Live Demo

> **[https://kskreddy2k7.github.io/kranthu-ai-portfolio/](https://kskreddy2k7.github.io/kranthu-ai-portfolio/)**

---

## 📸 Screenshots

| Section | Preview |
|---------|---------|
| Hero | Particle animation background with typed text and CTA buttons |
| About | Animated avatar with spinning gradient ring and stat counters |
| Skills | Four glassmorphism category cards with animated progress bars |
| Projects | Project cards with tech tag pills and GitHub/demo links |
| GitHub Stats | Live stats, streak, and top language widgets |
| Contact | Contact info cards + mailto-enabled form |

---

## 📁 Project Structure

```
kranthu-ai-portfolio/
│
├── index.html                          # ✅ Main static site (root)
├── style.css                           # ✅ All styles (glassmorphism, neon, responsive)
├── script.js                           # ✅ Particles, typed text, AOS, form handler
│
├── assets/
│   └── favicon.svg                     # ✅ SVG favicon with gradient
│
├── static/
│   ├── css/style.css                   # Legacy Flask stylesheet
│   ├── js/script.js                    # Legacy Flask JavaScript
│   └── resume/
│       └── Kata_Sai_Kranthu_Reddy_Resume.docx
│
├── templates/                          # Legacy Flask Jinja2 templates
│   ├── base.html
│   ├── index.html
│   └── blog.html
│
├── .github/
│   └── workflows/
│       └── deploy.yml                  # ✅ GitHub Actions auto-deploy
│
├── app.py                              # Legacy Flask backend
├── requirements.txt                    # Legacy Python dependencies
└── README.md                           # ✅ This file
```

> The **root-level** `index.html`, `style.css`, `script.js`, and `assets/` are the **live static site**.  
> The `templates/`, `static/`, and `app.py` are legacy Flask files kept for reference.

---

## ⚙️ Installation & Local Development

### Option 1 — Just open in browser (zero setup)

```bash
# Clone the repo
git clone https://github.com/kskreddy2k7/kranthu-ai-portfolio.git
cd kranthu-ai-portfolio

# Open in your browser (macOS)
open index.html

# Open in your browser (Linux)
xdg-open index.html

# Open in your browser (Windows)
start index.html
```

### Option 2 — Local HTTP server (recommended to avoid CORS issues with GitHub Stats)

```bash
# Python 3
python -m http.server 8080
# Visit http://localhost:8080
```

---

## 🚀 Deployment on GitHub Pages

The site deploys automatically via **GitHub Actions** on every push to `main`.

### Manual setup (first time only):

1. Go to your repository → **Settings** → **Pages**
2. Set **Source** to **GitHub Actions**
3. Push any change to `main` — the workflow triggers automatically
4. Visit `https://<your-username>.github.io/<repo-name>/`

### Workflow file: `.github/workflows/deploy.yml`

```yaml
on:
  push:
    branches: [main, master]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: "."
      - uses: actions/deploy-pages@v4
```

---

## 🛠 Technologies Used

| Category | Technologies |
|----------|-------------|
| **Markup** | HTML5 (semantic, ARIA) |
| **Styling** | CSS3, CSS Custom Properties, Glassmorphism |
| **Scripting** | Vanilla JavaScript ES6+ |
| **Icons** | Font Awesome 6 (CDN) |
| **Fonts** | Google Fonts — Poppins |
| **Stats Widgets** | github-readme-stats, GitHub Streak Stats |
| **CI/CD** | GitHub Actions |
| **Hosting** | GitHub Pages |

---

## 🔮 Future Improvements

- [ ] Add a blog section with markdown-rendered posts
- [ ] Integrate EmailJS for serverless contact form submissions
- [ ] Add a dark/light theme toggle
- [ ] Include project demo GIFs in project cards
- [ ] Add a certifications carousel
- [ ] Implement PWA (Progressive Web App) features
- [ ] Add more GitHub contribution graph widgets
- [ ] Integrate a headless CMS (e.g., Netlify CMS) for easy content updates

---

## 📄 License

MIT © 2025 Kranthu Reddy

```
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

See the [LICENSE](LICENSE) file for full details.

---

<div align="center">

Made with ❤️ and ☕ by **Kranthu Reddy**

⭐ Star this repo if you found it helpful!

</div>
