# Kata Sai Kranthu Reddy – AI Portfolio

![Python](https://img.shields.io/badge/Python-3.10+-blue?style=flat-square&logo=python)
![Flask](https://img.shields.io/badge/Flask-3.0+-black?style=flat-square&logo=flask)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple?style=flat-square&logo=bootstrap)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

A **premium dark-themed portfolio website** built with Python Flask for **Kata Sai Kranthu Reddy**, a Python Developer and AI & Backend Enthusiast.

## 🚀 Live Demo

> Deploy to Render or PythonAnywhere and paste your URL here.

## ✨ Features

- **Dark Neon Theme** – #0a0a0a background with cyan (#00d4ff) and purple (#7c3aed) accents
- **Animated Hero** – Typed.js cycling through roles (Python Developer, AI Builder, etc.)
- **Skills Section** – Animated progress bars + badge pills
- **Projects** – 4 project cards with hover glow effects
- **Experience Timeline** – Visual timeline with neon dots
- **GitHub Stats** – Live API integration fetching repo count and top languages
- **AI Chatbot** – FAQ bot at `/chatbot` endpoint with typing animation
- **Blog** – 3 blog post cards
- **Contact Form** – AJAX form with server-side validation via `/contact` endpoint
- **AOS Animations** – Scroll-reveal on all sections
- **Fully Responsive** – Mobile-first design

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.10+, Flask 3.0 |
| Frontend | HTML5, CSS3, Bootstrap 5, JavaScript ES6 |
| Animations | AOS (Animate On Scroll), Typed.js |
| Icons | Font Awesome 6 |
| Fonts | Google Fonts – Poppins |
| HTTP | requests (GitHub API) |
| Server | Gunicorn |

## 📁 Project Structure

```
kranthu-ai-portfolio/
├── app.py                  # Flask application
├── requirements.txt        # Python dependencies
├── templates/
│   ├── base.html           # Base layout (navbar, footer, CDN links)
│   ├── index.html          # Home page (all sections)
│   └── blog.html           # Blog page
└── static/
    ├── css/
    │   └── style.css       # Full custom CSS
    ├── js/
    │   └── script.js       # Full custom JavaScript
    └── images/             # Static images
```

## ⚙️ Installation & Local Development

```bash
# 1. Clone the repository
git clone https://github.com/kskreddy2k7/kranthu-ai-portfolio.git
cd kranthu-ai-portfolio

# 2. Create a virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. (Optional) Set GitHub token for higher API rate limits
export GITHUB_TOKEN=your_token_here

# 5. Run the development server
python app.py
```

Open http://localhost:5000 in your browser.

## 🌐 Deployment

### Render (Recommended – Free Tier)

1. Push your code to GitHub
2. Go to render.com → **New Web Service**
3. Connect your GitHub repository
4. Set:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
   - **Environment:** Python 3
5. Add environment variable `SECRET_KEY` with a random string
6. Click **Deploy**

### PythonAnywhere

1. Upload files via the **Files** tab or `git clone` in a Bash console
2. Create a new **Web App** → **Flask** → choose Python 3.10
3. Set **Source code** and **Working directory** to your project folder
4. Set **WSGI configuration file** to point to `app.py`
5. Reload the web app

## 📸 Screenshots

> Add screenshots of your deployed portfolio here.

## 📬 Contact

- **LinkedIn:** [kata-sai-kranthu-reddy](https://www.linkedin.com/in/kata-sai-kranthu-reddy-b02848377)
- **GitHub:** [kskreddy2k7](https://github.com/kskreddy2k7)

## 📄 License

MIT © 2025 Kata Sai Kranthu Reddy
