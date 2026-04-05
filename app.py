import os
import requests
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-prod')

GITHUB_USERNAME = 'kskreddy2k7'
GITHUB_LINKEDIN = 'https://www.linkedin.com/in/kata-sai-kranthu-reddy-b02848377'


def fetch_github_stats():
    try:
        headers = {'Accept': 'application/vnd.github.v3+json'}
        token = os.environ.get('GITHUB_TOKEN')
        if token:
            headers['Authorization'] = f'token {token}'

        user_resp = requests.get(
            f'https://api.github.com/users/{GITHUB_USERNAME}',
            headers=headers, timeout=5
        )
        repos_resp = requests.get(
            f'https://api.github.com/users/{GITHUB_USERNAME}/repos?per_page=100',
            headers=headers, timeout=5
        )

        repo_count = 0
        languages = {}

        if user_resp.status_code == 200:
            repo_count = user_resp.json().get('public_repos', 0)

        if repos_resp.status_code == 200:
            repos = repos_resp.json()
            for repo in repos:
                lang = repo.get('language')
                if lang:
                    languages[lang] = languages.get(lang, 0) + 1

        top_languages = sorted(languages.items(), key=lambda x: x[1], reverse=True)[:5]
        return {'repo_count': repo_count, 'top_languages': top_languages}
    except Exception:
        return {'repo_count': 0, 'top_languages': []}


CHATBOT_RESPONSES = {
    'greeting': (
        "Hello! 👋 I'm <strong>KSKR AI</strong> — Kranthu's personal intelligence system. "
        "I can tell you about his <strong>skills</strong>, <strong>projects</strong>, "
        "<strong>education</strong>, <strong>goals</strong>, or how to <strong>contact</strong> him. "
        "What would you like to know?"
    ),
    'identity': (
        "I represent <strong>Kata Sai Kranthu Reddy</strong> — a passionate Full Stack Developer and AI Engineer.<br>"
        "📍 <strong>University:</strong> SRM University, Kattankulathur — B.Tech CS (AI/ML) 2025–2029<br>"
        "🎯 <strong>Role:</strong> Full Stack Developer · AI Engineer · Mobile App Developer<br>"
        "🔥 <strong>Status:</strong> <span style='color:#00ff88'>Actively Open to Internship Opportunities</span>"
    ),
    'skills': (
        "Kranthu's full technical stack:<br>"
        "💻 <strong>Languages:</strong> Python · JavaScript · Java · Dart · Kotlin<br>"
        "⚙️ <strong>Frameworks:</strong> Flask · React · Flutter · Android Studio<br>"
        "🤖 <strong>AI/ML:</strong> Machine Learning · NLP · Neural Networks · Pandas · NumPy<br>"
        "🗄️ <strong>Databases:</strong> Firebase · SQLite · MySQL<br>"
        "🛠️ <strong>Tools:</strong> Git · GitHub · VS Code · Postman · Linux"
    ),
    'projects': (
        "Here are Kranthu's deployed systems:<br>"
        "🌐 <strong>Sri Sai Traders</strong> — Full enterprise business web platform "
        "<a href='https://kskreddy2k7.github.io/-Sri-Sai-Traders-website/' target='_blank' style='color:#00f3ff'>[Live]</a><br>"
        "🤖 <strong>AI Resume Screener</strong> — Intelligent candidate filtering system (Python/NLP) "
        "<a href='https://kskreddy2k7.github.io/ai-resume-screening-system/' target='_blank' style='color:#00f3ff'>[Demo]</a><br>"
        "🎙️ <strong>Offline AI Voice OS</strong> — Voice-controlled AI operating interface "
        "<a href='https://kskreddy2k7.github.io/KSKR-AI-Voice-Operating-System/' target='_blank' style='color:#00f3ff'>[Demo]</a><br>"
        "⌨️ <strong>Smart Auto-Correct Keyboard</strong> — NLP-powered Android keyboard "
        "<a href='https://github.com/kskreddy2k7/Smart-AutoCorrect-Keyboard' target='_blank' style='color:#00f3ff'>[Repo]</a><br>"
        "💬 <strong>Sambhasha App</strong> — Real-time messaging platform (Flutter/Firebase) "
        "<a href='https://github.com/kskreddy2k7/sambhasha_app' target='_blank' style='color:#00f3ff'>[Repo]</a><br>"
        "🧠 <strong>Quiz AI App</strong> — AI-driven adaptive quiz system "
        "<a href='https://github.com/kskreddy2k7/quiz-ai-app' target='_blank' style='color:#00f3ff'>[Repo]</a><br>"
        "🚀 <strong>Portfolio OS</strong> — This very AI-powered portfolio interface (current site)<br>"
        "📱 <strong>OOPS Banner App</strong> — OOP concepts visual app "
        "<a href='https://github.com/kskreddy2k7/-OOPSBannerApp' target='_blank' style='color:#00f3ff'>[Repo]</a>"
    ),
    'contact': (
        "You can connect with Kranthu through:<br>"
        "🔗 <strong>LinkedIn:</strong> <a href='https://www.linkedin.com/in/kata-sai-kranthu-reddy-b02848377' "
        "target='_blank' style='color:#00d4ff'>linkedin.com/in/kata-sai-kranthu-reddy</a><br>"
        "💻 <strong>GitHub:</strong> <a href='https://github.com/kskreddy2k7' "
        "target='_blank' style='color:#00d4ff'>github.com/kskreddy2k7</a><br>"
        "📧 <strong>Email:</strong> Use the Contact Form on this page for a direct message!<br>"
        "He typically responds within <strong>24 hours</strong>. 🚀"
    ),
    'education': (
        "📚 <strong>Academic Profile:</strong><br>"
        "🎓 <strong>Current:</strong> B.Tech — Computer Science & Engineering (AI/ML)<br>"
        "🏫 SRM University, Kattankulathur — Batch 2025–2029<br>"
        "📋 <strong>Intermediate (MPC):</strong> Completed 2025<br>"
        "📋 <strong>CBSE Class 10:</strong> Completed 2023"
    ),
    'experience': (
        "Kranthu is a <strong>1st-year student</strong> actively building real-world experience through:<br>"
        "✅ 8 independently built and deployed applications<br>"
        "✅ Full-stack, AI, and mobile domains covered<br>"
        "✅ Live platforms already serving real users<br>"
        "✅ Consistently learning through practical implementation<br>"
        "He learns fast and ships faster. 🚀"
    ),
    'certifications': (
        "📜 Kranthu's certifications include:<br>"
        "• <strong>Python Programming</strong> — Core & Advanced<br>"
        "• <strong>AI & Machine Learning</strong> — Fundamentals to NLP<br>"
        "• <strong>Web Development</strong> — Full Stack (HTML, CSS, JS, Flask)<br>"
        "• <strong>Android Development</strong> — Kotlin & Java<br>"
        "• <strong>Flutter Development</strong> — Cross-platform mobile apps"
    ),
    'goal': (
        "🎯 <strong>Kranthu's Mission:</strong><br>"
        "To engineer intelligent, scalable systems that bridge human creativity with advanced AI technology. "
        "He aims to build products that matter and secure meaningful opportunities in "
        "<strong>AI Research</strong> or <strong>Software Engineering</strong>."
    ),
    'resume': (
        "📄 You can download Kranthu's latest resume here:<br>"
        "<a href='/static/resume/Kata_Sai_Kranthu_Reddy_Resume.docx' target='_blank' "
        "style='color:#00d4ff;font-weight:bold;'>[⬇ DOWNLOAD RESUME]</a>"
    ),
    'internship': (
        "✅ Yes! Kranthu is <strong>actively seeking internship opportunities</strong> in:<br>"
        "• Artificial Intelligence & Machine Learning<br>"
        "• Full Stack Web Development<br>"
        "• Mobile App Development (Flutter/Android)<br>"
        "Feel free to reach out via LinkedIn or the Contact Form below! 🚀"
    ),
    'default': (
        "I'm not sure about that, but I can help with:<br>"
        "💬 <strong>skills</strong> · <strong>projects</strong> · <strong>education</strong> · "
        "<strong>contact</strong> · <strong>internship</strong> · <strong>resume</strong><br>"
        "Just ask me anything about Kranthu! 😊"
    ),
}


def get_chatbot_response(message):
    import re
    # Clean: lowercase + strip all punctuation for reliable matching
    raw = message.lower().strip()
    msg = re.sub(r'[^\w\s]', ' ', raw)  # replace ?,!,. etc with space

    def has(*keywords):
        return any(k in msg for k in keywords)

    # Resume (top priority)
    if has('resume', 'cv', 'download resume'):
        return CHATBOT_RESPONSES['resume']

    # Skills
    if has('skill', 'skills', 'tech', 'stack', 'python', 'flask',
            'java', 'react', 'flutter', 'kotlin', 'dart', 'nlp',
            'language', 'languages', 'capable', 'technology'):
        return CHATBOT_RESPONSES['skills']

    # Projects
    if has('project', 'projects', 'app', 'apps', 'built', 'autocorrect',
            'keyboard', 'sambhasha', 'quiz', 'traders', 'deployed', 'work',
            'voice os', 'resume screener', 'portfolio'):
        return CHATBOT_RESPONSES['projects']

    # Contact
    if has('contact', 'reach', 'email', 'linkedin', 'github',
            'connect', 'message', 'dm', 'link'):
        return CHATBOT_RESPONSES['contact']

    # Education
    if has('education', 'study', 'degree', 'college', 'university',
            'srm', 'school', 'batch', 'btech', 'student', 'studying'):
        return CHATBOT_RESPONSES['education']

    # Experience
    if has('experience', 'history', 'fresher', 'background'):
        return CHATBOT_RESPONSES['experience']

    # Certifications
    if has('certif', 'certification', 'course', 'training', 'certificate'):
        return CHATBOT_RESPONSES['certifications']

    # Goals / Mission
    if has('goal', 'goals', 'mission', 'dream', 'aspire', 'future', 'vision', 'plan'):
        return CHATBOT_RESPONSES['goal']

    # Internship / Hire
    if has('intern', 'internship', 'hire', 'job', 'opportunity', 'available', 'looking'):
        return CHATBOT_RESPONSES['internship']

    # Identity / About (after skills/projects to avoid false triggers)
    if has('who', 'about', 'introduce', 'kranthu', 'identity', 'tell me'):
        return CHATBOT_RESPONSES['identity']

    # Slash Commands
    slash_map = {
        '/skills': 'skills', '/tech': 'skills', '/stack': 'skills',
        '/projects': 'projects', '/apps': 'projects',
        '/contact': 'contact', '/reach': 'contact',
        '/resume': 'resume', '/cv': 'resume',
        '/goal': 'goal', '/mission': 'goal',
        '/intern': 'internship', '/internship': 'internship',
        '/edu': 'education', '/education': 'education',
        '/whoami': 'identity', '/who': 'identity',
    }
    for cmd, key in slash_map.items():
        if raw == cmd:
            return CHATBOT_RESPONSES[key]

    # Greetings — checked LAST, exact word only to avoid 'his' matching 'hi'
    cleaned_words = set(msg.split())
    if cleaned_words & {'hello', 'hey', 'greet', 'namaste', 'howdy'} or raw in ['hi', 'hello', 'hey', 'hi!']:
        return CHATBOT_RESPONSES['greeting']

    return CHATBOT_RESPONSES['default']



@app.route('/')
def index():
    github_stats = fetch_github_stats()
    return render_template('index.html', github_stats=github_stats,
                           github_username=GITHUB_USERNAME)


@app.route('/favicon.ico')
def favicon():
    return app.send_static_file('favicon.ico')


@app.route('/blog')
def blog():
    return render_template('blog.html')


@app.route('/contact', methods=['POST'])
def contact():
    data = request.get_json(silent=True) or request.form
    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip()
    message = (data.get('message') or '').strip()

    errors = {}
    if not name or len(name) < 2:
        errors['name'] = 'Name must be at least 2 characters.'
    if not email or '@' not in email or '.' not in email.split('@')[-1]:
        errors['email'] = 'Please enter a valid email address.'
    if not message or len(message) < 10:
        errors['message'] = 'Message must be at least 10 characters.'

    if errors:
        return jsonify({'success': False, 'errors': errors}), 400

    return jsonify({
        'success': True,
        'message': f"Thanks {name}! Your message has been received. I'll get back to you soon."
    })


@app.route('/chatbot', methods=['POST'])
def chatbot():
    data = request.get_json(silent=True) or request.form
    user_message = (data.get('message') or '').strip()
    if not user_message:
        return jsonify({'success': False, 'response': 'Please send a message.'}), 400
    response = get_chatbot_response(user_message)
    return jsonify({'success': True, 'response': response})


if __name__ == '__main__':
    debug_mode = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    app.run(debug=debug_mode, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
